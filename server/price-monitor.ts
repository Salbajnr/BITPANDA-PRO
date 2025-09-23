import { storage } from './storage';

interface PriceData {
  [symbol: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

class PriceMonitorService {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds
  private lastPrices: Map<string, number> = new Map();

  // WebSocket related properties
  private ws: WebSocket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private prices: Map<string, number> = new Map();
  private isConnected = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;

  async start() {
    console.log('🔔 Starting price monitor service...');

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Initial check
    await this.checkPriceAlerts();

    // Set up periodic checks
    this.monitoringInterval = setInterval(async () => {
      await this.checkPriceAlerts();
    }, this.CHECK_INTERVAL);

    // WebSocket connection
    this.startConnectionWithDelay();
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🔔 Price monitor service stopped');
    }
    this.stopWebSocket();
  }

  private stopWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
      console.log('WebSocket connection closed.');
    }
  }

  private startConnectionWithDelay() {
    // Wait 5 seconds before attempting to connect to external services
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  private connect() {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.log('⚠️  Max connection attempts reached for price feed. Running in fallback mode.');
      return;
    }

    try {
      console.log('🔌 Connecting to price feed...');
      // Import WebSocket dynamically to avoid server-side issues
      const WebSocketLib = eval('require("ws")');
      this.ws = new WebSocketLib('wss://stream.binance.com:9443/ws/!ticker@arr');

      this.ws.on('open', () => {
        console.log('✅ Connected to price feed');
        this.isConnected = true;
        this.connectionAttempts = 0; // Reset on successful connection

        // Subscribe to price updates
        this.ws?.send(JSON.stringify({
          method: 'subscribe',
          params: ['btcusdt@ticker', 'ethusdt@ticker', 'adausdt@ticker']
        }));
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.stream && message.data) {
            const symbol = message.stream.replace('@ticker', '').toUpperCase();
            const price = parseFloat(message.data.c);
            this.prices.set(symbol, price);
          }
        } catch (error) {
          console.error('Error parsing price data:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('❌ Price feed disconnected');
        this.isConnected = false;
        if (this.connectionAttempts < this.maxConnectionAttempts) {
          this.reconnect();
        }
      });

      this.ws.on('error', (error) => {
        console.error('Price feed error:', error);
        this.isConnected = false;
        // Don't automatically reconnect on error to prevent spam
      });

    } catch (error) {
      console.error('Failed to connect to price feed:', error);
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        this.reconnect();
      }
    }
  }

  private reconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
    this.reconnectInterval = setInterval(() => {
      this.connect();
    }, 5000); // Try to reconnect every 5 seconds
  }

  async checkPriceAlerts() {
    try {
      // Get all active alerts
      const alerts = await storage.getActivePriceAlerts();

      if (alerts.length === 0) {
        return;
      }

      // Get unique symbols from alerts
      const symbols = [...new Set(alerts.map(alert => this.getCoinGeckoId(alert.symbol)))];

      // Fetch current prices
      const prices = await this.fetchCurrentPrices(symbols);

      if (!prices) {
        console.error('Failed to fetch prices for alert checking');
        return;
      }

      // Check each alert
      for (const alert of alerts) {
        const coinGeckoId = this.getCoinGeckoId(alert.symbol);
        const currentPrice = prices[coinGeckoId]?.usd;

        if (currentPrice && this.shouldTriggerAlert(alert, currentPrice)) {
          await this.triggerAlert(alert, currentPrice);
        }
      }

      console.log(`✅ Checked ${alerts.length} price alerts`);
    } catch (error) {
      console.error('Error in checkPriceAlerts:', error);
    }
  }

  private async fetchCurrentPrices(symbols: string[]): Promise<PriceData | null> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24h_change=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching prices:', error);
      return null;
    }
  }

  private getCoinGeckoId(symbol: string): string {
    // Map common symbols to CoinGecko IDs
    const symbolMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'SOL': 'solana',
      'XRP': 'ripple',
      'DOT': 'polkadot',
      'DOGE': 'dogecoin',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'LTC': 'litecoin',
      'UNI': 'uniswap',
      'LINK': 'chainlink',
      'ATOM': 'cosmos',
      'XLM': 'stellar',
      'VET': 'vechain',
      'ICP': 'internet-computer',
      'FIL': 'filecoin',
      'TRX': 'tron',
      'ETC': 'ethereum-classic',
    };

    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  private shouldTriggerAlert(alert: any, currentPrice: number): boolean {
    const targetPrice = parseFloat(alert.targetPrice);
    const lastPrice = this.lastPrices.get(alert.symbol);

    // Update last known price
    this.lastPrices.set(alert.symbol, currentPrice);

    // Don't trigger on first check if we don't have a previous price
    if (lastPrice === undefined) {
      return false;
    }

    // Check if price crossed the threshold
    if (alert.condition === 'above') {
      return lastPrice <= targetPrice && currentPrice > targetPrice;
    } else {
      return lastPrice >= targetPrice && currentPrice < targetPrice;
    }
  }

  private async triggerAlert(alert: any, currentPrice: number) {
    try {
      console.log(`🚨 Alert triggered for ${alert.symbol}: ${currentPrice} ${alert.condition} ${alert.targetPrice}`);

      // Create notification
      await storage.createNotification({
        userId: alert.userId,
        type: 'price_alert',
        title: `Price Alert: ${alert.name}`,
        message: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice}. Current price: $${currentPrice.toFixed(6)}`,
        data: {
          alertId: alert.id,
          symbol: alert.symbol,
          currentPrice: currentPrice,
          targetPrice: parseFloat(alert.targetPrice),
          condition: alert.condition,
        },
      });

      // Deactivate the alert (one-time trigger)
      await storage.updatePriceAlert(alert.id, { isActive: false });

      console.log(`✅ Alert notification created for user ${alert.userId}`);
    } catch (error) {
      console.error('Error triggering alert:', error);
    }
  }
}

export const priceMonitor = new PriceMonitorService();