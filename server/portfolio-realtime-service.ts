import { EventEmitter } from 'events';
import { storage } from './storage';
import { adminWebSocketManager } from './admin-websocket';
import { sendSSEToUser, broadcastSSEToAdmins } from './sse-routes';

interface PortfolioUpdate {
  userId: string;
  portfolioId: string;
  totalValue: number;
  change24h: number;
  changePercent: number;
  holdings: any[];
  lastUpdated: Date;
}

class PortfolioRealtimeService extends EventEmitter {
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 30000; // 30 seconds
  private isRunning = false;
  private userPortfolios = new Map<string, PortfolioUpdate>();

  constructor() {
    super();
    this.setMaxListeners(1000);
  }

  start() {
    if (this.isRunning) return;

    console.log('💼 Starting Portfolio Real-time Service...');
    this.isRunning = true;
    this.startPortfolioUpdates();
  }

  stop() {
    if (!this.isRunning) return;

    console.log('💼 Stopping Portfolio Real-time Service...');
    this.isRunning = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.userPortfolios.clear();
  }

  private startPortfolioUpdates() {
    // Initial update
    setTimeout(() => this.updateAllPortfolios(), 1000);

    // Set up periodic updates
    this.updateInterval = setInterval(async () => {
      await this.updateAllPortfolios();
    }, this.UPDATE_FREQUENCY);

    console.log('💼 Portfolio real-time updates started');
  }

  private async updateAllPortfolios() {
    try {
      // Get all active users with portfolios
      const users = await this.getActiveUsers();

      for (const user of users) {
        await this.updateUserPortfolio(user.id);
      }

      // Broadcast aggregate data to admins
      await this.broadcastAggregateData();

      console.log(`💼 Updated portfolios for ${users.length} users`);
    } catch (error) {
      console.error('Error updating portfolios:', error);
    }
  }

  private async updateUserPortfolio(userId: string) {
    try {
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) return;

      const holdings = await storage.getHoldings(portfolio.id);
      const previousUpdate = this.userPortfolios.get(userId);

      // Calculate real-time values
      const updatedHoldings = await this.calculateHoldingsValues(holdings);
      const totalValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
      const previousValue = previousUpdate?.totalValue || totalValue;
      const change24h = totalValue - previousValue;
      const changePercent = previousValue > 0 ? (change24h / previousValue) * 100 : 0;

      const portfolioUpdate: PortfolioUpdate = {
        userId,
        portfolioId: portfolio.id,
        totalValue,
        change24h,
        changePercent,
        holdings: updatedHoldings,
        lastUpdated: new Date()
      };

      // Store update
      this.userPortfolios.set(userId, portfolioUpdate);

      // Send update to user via SSE
      sendSSEToUser(userId, {
        type: 'portfolio_update',
        data: portfolioUpdate,
        timestamp: Date.now()
      });

      // Emit event for other services
      this.emit('portfolioUpdate', portfolioUpdate);

      // Update database if significant change
      if (Math.abs(changePercent) > 1 || !previousUpdate) {
        await storage.updatePortfolio(portfolio.id, {
          totalValue: totalValue.toString(),
          updatedAt: new Date()
        });
      }

    } catch (error) {
      console.error(`Error updating portfolio for user ${userId}:`, error);
    }
  }

  private async calculateHoldingsValues(holdings: any[]) {
    const { cryptoService } = await import('./crypto-service');

    const updatedHoldings = [];

    for (const holding of holdings) {
      try {
        const priceData = await cryptoService.getPrice(holding.symbol);
        const amount = parseFloat(holding.amount);
        const currentPrice = priceData?.price || parseFloat(holding.currentPrice);
        const currentValue = amount * currentPrice;
        const costBasis = amount * parseFloat(holding.averagePurchasePrice);
        const profitLoss = currentValue - costBasis;
        const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

        updatedHoldings.push({
          ...holding,
          currentPrice,
          currentValue,
          profitLoss,
          profitLossPercent,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error(`Error calculating value for ${holding.symbol}:`, error);
        updatedHoldings.push(holding);
      }
    }

    return updatedHoldings;
  }

  private async getActiveUsers() {
    try {
      // Get users who have been active in the last 24 hours
      return await storage.getActiveUsers?.() || [];
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  }

  private async broadcastAggregateData() {
    const aggregateData = {
      totalPortfolios: this.userPortfolios.size,
      totalValue: Array.from(this.userPortfolios.values()).reduce((sum, p) => sum + p.totalValue, 0),
      avgChange24h: this.calculateAverageChange(),
      topPerformers: this.getTopPerformers(),
      bottomPerformers: this.getBottomPerformers(),
      lastUpdated: new Date()
    };

    // Send to admin WebSocket clients
    adminWebSocketManager.broadcastToChannel('portfolio_updates', aggregateData);

    // Send to admin SSE clients
    broadcastSSEToAdmins({
      type: 'portfolio_aggregate',
      data: aggregateData,
      timestamp: Date.now()
    });
  }

  private calculateAverageChange() {
    const portfolios = Array.from(this.userPortfolios.values());
    if (portfolios.length === 0) return 0;

    const totalChange = portfolios.reduce((sum, p) => sum + p.changePercent, 0);
    return totalChange / portfolios.length;
  }

  private getTopPerformers() {
    return Array.from(this.userPortfolios.values())
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5)
      .map(p => ({
        userId: p.userId,
        change: p.changePercent,
        value: p.totalValue
      }));
  }

  private getBottomPerformers() {
    return Array.from(this.userPortfolios.values())
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5)
      .map(p => ({
        userId: p.userId,
        change: p.changePercent,
        value: p.totalValue
      }));
  }

  // Public methods for external use
  public getUserPortfolio(userId: string): PortfolioUpdate | null {
    return this.userPortfolios.get(userId) || null;
  }

  public getAllPortfolios(): PortfolioUpdate[] {
    return Array.from(this.userPortfolios.values());
  }

  public getPortfolioStats() {
    const portfolios = Array.from(this.userPortfolios.values());
    return {
      totalUsers: portfolios.length,
      totalValue: portfolios.reduce((sum, p) => sum + p.totalValue, 0),
      avgValue: portfolios.length > 0 ? portfolios.reduce((sum, p) => sum + p.totalValue, 0) / portfolios.length : 0,
      avgChange: this.calculateAverageChange()
    };
  }

  public triggerPortfolioUpdate(userId: string) {
    // Force immediate update for specific user
    this.updateUserPortfolio(userId);
  }
}

export const portfolioRealtimeService = new PortfolioRealtimeService();