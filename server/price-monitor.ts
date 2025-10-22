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
    setTimeout(async () => {
      await this.connect();
    }, 5000);
  }

  private async connect() {
    console.log('📊 Price monitor using HTTP polling for price updates');
    // Using HTTP polling for reliable price updates
    this.isConnected = true;
    this.connectionAttempts = 0;
  }

  private reconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
    this.reconnectInterval = setInterval(async () => {
      await this.connect();
    }, 5000); // Try to reconnect every 5 seconds
  }

  private async checkPriceAlerts(): Promise<void> {
    try {
      // Check if storage methods exist before calling
      if (typeof storage.getActivePriceAlerts !== 'function') {
        console.log('⚠️ Price alerts storage method not available, skipping alert checks');
        return;
        return;
      }

      const activeAlerts = await storage.getActivePriceAlerts();

      for (const alert of activeAlerts) {
        const currentPrice = await this.getCurrentPrice(alert.symbol);

        if (this.shouldTriggerAlert(alert, currentPrice)) {
          await this.triggerAlert(alert, currentPrice);

          if (typeof storage.updatePriceAlert === 'function') {
            await storage.updatePriceAlert(alert.id, {
              isActive: false,
              triggeredAt: new Date()
            });
          }
        }
      }

      console.log(`✅ Checked ${activeAlerts.length} price alerts`);
    } catch (error) {
      console.error('Error checking price alerts:', error);
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

      return await response.json() as any;
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

    // For first time checking, compare current price directly with target
    if (lastPrice === undefined) {
      this.lastPrices.set(alert.symbol, currentPrice);

      // Trigger immediately if condition is already met
      if (alert.condition === 'above') {
        return currentPrice > targetPrice;
      } else {
        return currentPrice < targetPrice;
      }
    }

    // Update last known price
    this.lastPrices.set(alert.symbol, currentPrice);

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

  // Dummy implementation for getCurrentPrice, as it's used in the modified checkPriceAlerts
  private async getCurrentPrice(symbol: string): Promise<number> {
    const coinGeckoId = this.getCoinGeckoId(symbol);
    const prices = await this.fetchCurrentPrices([coinGeckoId]);
    return prices?.[coinGeckoId]?.usd || 0;
  }
}

export const priceMonitor = new PriceMonitorService();