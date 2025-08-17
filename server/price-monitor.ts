
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
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🔔 Price monitor service stopped');
    }
  }

  async checkPriceAlerts() {
    try {
      // Get all active alerts
      const alerts = await storage.getAllActivePriceAlerts();
      
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
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true`
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
