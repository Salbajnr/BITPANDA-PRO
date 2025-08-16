
import { storage } from './storage';

interface CryptoPrice {
  [key: string]: {
    usd: number;
  };
}

class PriceMonitorService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds

  async start() {
    if (this.isRunning) {
      console.log('Price monitor is already running');
      return;
    }

    this.isRunning = true;
    console.log('🔔 Starting price monitor service...');

    this.intervalId = setInterval(async () => {
      try {
        await this.checkPriceAlerts();
      } catch (error) {
        console.error('Error checking price alerts:', error);
      }
    }, this.CHECK_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🔔 Price monitor service stopped');
  }

  private async checkPriceAlerts() {
    try {
      // Get all active alerts
      const alerts = await storage.getActivePriceAlerts();
      
      if (alerts.length === 0) {
        return;
      }

      // Get unique symbols from alerts
      const symbols = [...new Set(alerts.map(alert => alert.symbol.toLowerCase()))];
      
      // Fetch current prices from CoinGecko
      const prices = await this.fetchCurrentPrices(symbols);
      
      if (!prices) {
        console.log('Failed to fetch prices, skipping alert check');
        return;
      }

      // Check each alert
      for (const alert of alerts) {
        const symbolKey = alert.symbol.toLowerCase();
        const currentPrice = prices[symbolKey]?.usd;
        
        if (!currentPrice) {
          console.log(`Price not found for ${alert.symbol}`);
          continue;
        }

        const targetPrice = parseFloat(alert.targetPrice);
        let shouldTrigger = false;

        if (alert.alertType === 'above' && currentPrice >= targetPrice) {
          shouldTrigger = true;
        } else if (alert.alertType === 'below' && currentPrice <= targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          await this.triggerAlert(alert, currentPrice);
        }
      }
    } catch (error) {
      console.error('Error in checkPriceAlerts:', error);
    }
  }

  private async fetchCurrentPrices(symbols: string[]): Promise<CryptoPrice | null> {
    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsParam}&vs_currencies=usd`
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

  private async triggerAlert(alert: any, currentPrice: number) {
    try {
      console.log(`🔔 Triggering alert for ${alert.symbol}: ${alert.alertType} $${alert.targetPrice}, current: $${currentPrice}`);

      // Create notification
      await storage.createNotification({
        userId: alert.userId,
        type: 'price_alert',
        title: 'Price Alert Triggered!',
        message: `${alert.symbol} has ${alert.alertType === 'above' ? 'exceeded' : 'fallen below'} your target price of $${alert.targetPrice}. Current price: $${currentPrice.toFixed(2)}`,
        data: JSON.stringify({
          alertId: alert.id,
          symbol: alert.symbol,
          targetPrice: alert.targetPrice,
          currentPrice: currentPrice.toFixed(2),
          alertType: alert.alertType
        }),
        isRead: false,
      });

      // Mark alert as triggered and deactivate
      await storage.updatePriceAlert(alert.id, {
        isTriggered: true,
        isActive: false,
      });

      console.log(`✅ Alert triggered and notification created for user ${alert.userId}`);
    } catch (error) {
      console.error(`Error triggering alert ${alert.id}:`, error);
    }
  }
}

export const priceMonitor = new PriceMonitorService();
