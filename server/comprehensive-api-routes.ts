
import { Router, Request, Response } from 'express';
import { requireAuth, requireAdmin } from './simple-auth';
import { storage } from './storage';
import { cryptoService } from './crypto-service';
import { metalsService } from './metals-service';
import { z } from 'zod';

const router = Router();

// ==================== MARKET DATA ENDPOINTS ====================

// Get comprehensive market overview
router.get('/market/overview', async (req: Request, res: Response) => {
  try {
    const [cryptoData, metalsData] = await Promise.all([
      cryptoService.getMarketData(undefined, 10),
      metalsService.getMarketData(4)
    ]);

    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
    const total24hVolume = cryptoData.reduce((sum, crypto) => sum + (crypto.total_volume || 0), 0);

    res.json({
      crypto: {
        topAssets: cryptoData,
        totalMarketCap,
        total24hVolume,
        dominance: {
          btc: (cryptoData.find(c => c.symbol === 'BTC')?.market_cap || 0) / totalMarketCap * 100,
          eth: (cryptoData.find(c => c.symbol === 'ETH')?.market_cap || 0) / totalMarketCap * 100
        }
      },
      metals: {
        topAssets: metalsData,
        totalValue: metalsData.reduce((sum, metal) => sum + (metal.price * 1000000), 0)
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market overview error:', error);
    res.status(500).json({ message: 'Failed to fetch market overview' });
  }
});

// Get trending assets (crypto + metals)
router.get('/market/trending', async (req: Request, res: Response) => {
  try {
    const cryptoData = await cryptoService.getMarketData(undefined, 50);
    
    // Sort by 24h change and volume
    const trending = cryptoData
      .filter(c => c.price_change_percentage_24h !== undefined)
      .sort((a, b) => {
        const aScore = Math.abs(a.price_change_percentage_24h || 0) * (a.total_volume || 0);
        const bScore = Math.abs(b.price_change_percentage_24h || 0) * (b.total_volume || 0);
        return bScore - aScore;
      })
      .slice(0, 10);

    res.json({
      trending,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending assets error:', error);
    res.status(500).json({ message: 'Failed to fetch trending assets' });
  }
});

// Get market sentiment analysis
router.get('/market/sentiment', async (req: Request, res: Response) => {
  try {
    const cryptoData = await cryptoService.getMarketData(undefined, 100);
    
    const gainers = cryptoData.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
    const losers = cryptoData.filter(c => (c.price_change_percentage_24h || 0) < 0).length;
    const neutral = cryptoData.length - gainers - losers;

    const avgChange = cryptoData.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / cryptoData.length;

    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (avgChange > 2) sentiment = 'bullish';
    else if (avgChange < -2) sentiment = 'bearish';

    res.json({
      overall: sentiment,
      score: avgChange,
      distribution: {
        gainers,
        losers,
        neutral
      },
      indicators: {
        fearGreedIndex: Math.min(100, Math.max(0, 50 + avgChange * 10)),
        volatilityIndex: Math.abs(avgChange) * 5,
        tradingVolume: cryptoData.reduce((sum, c) => sum + (c.total_volume || 0), 0)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market sentiment error:', error);
    res.status(500).json({ message: 'Failed to fetch market sentiment' });
  }
});

// ==================== ADVANCED TRADING ENDPOINTS ====================

// Get order book depth
router.get('/trading/orderbook/:symbol', requireAuth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const price = await cryptoService.getPrice(symbol);

    if (!price) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const currentPrice = price.price;
    
    // Generate realistic order book
    const bids = Array.from({ length: 20 }, (_, i) => {
      const priceLevel = currentPrice * (1 - (i + 1) * 0.001);
      const amount = Math.random() * 10 + 1;
      return {
        price: priceLevel.toFixed(8),
        amount: amount.toFixed(8),
        total: (priceLevel * amount).toFixed(2)
      };
    });

    const asks = Array.from({ length: 20 }, (_, i) => {
      const priceLevel = currentPrice * (1 + (i + 1) * 0.001);
      const amount = Math.random() * 10 + 1;
      return {
        price: priceLevel.toFixed(8),
        amount: amount.toFixed(8),
        total: (priceLevel * amount).toFixed(2)
      };
    });

    res.json({
      symbol,
      bids,
      asks,
      spread: (parseFloat(asks[0].price) - parseFloat(bids[0].price)).toFixed(8),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Order book error:', error);
    res.status(500).json({ message: 'Failed to fetch order book' });
  }
});

// Get trade history for an asset
router.get('/trading/history/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const price = await cryptoService.getPrice(symbol);
    if (!price) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Generate realistic trade history
    const trades = Array.from({ length: limit }, (_, i) => {
      const timestamp = Date.now() - i * 60000; // 1 minute intervals
      const priceVariation = (Math.random() - 0.5) * 0.02; // ±2% variation
      const tradePrice = price.price * (1 + priceVariation);
      const amount = Math.random() * 5 + 0.1;

      return {
        id: `trade-${timestamp}-${i}`,
        price: tradePrice.toFixed(8),
        amount: amount.toFixed(8),
        total: (tradePrice * amount).toFixed(2),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: new Date(timestamp).toISOString()
      };
    });

    res.json({
      symbol,
      trades,
      count: trades.length
    });
  } catch (error) {
    console.error('Trade history error:', error);
    res.status(500).json({ message: 'Failed to fetch trade history' });
  }
});

// Get candlestick/OHLCV data
router.get('/trading/candles/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const interval = (req.query.interval as string) || '1h'; // 1m, 5m, 15m, 1h, 4h, 1d
    const limit = parseInt(req.query.limit as string) || 100;

    const price = await cryptoService.getPrice(symbol);
    if (!price) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const intervalMs: Record<string, number> = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '1h': 3600000,
      '4h': 14400000,
      '1d': 86400000
    };

    const timeStep = intervalMs[interval] || 3600000;
    const candles = Array.from({ length: limit }, (_, i) => {
      const timestamp = Date.now() - i * timeStep;
      const basePrice = price.price * (1 - i * 0.001); // Slight downward trend
      const variation = 0.02;

      const open = basePrice * (1 + (Math.random() - 0.5) * variation);
      const close = basePrice * (1 + (Math.random() - 0.5) * variation);
      const high = Math.max(open, close) * (1 + Math.random() * variation / 2);
      const low = Math.min(open, close) * (1 - Math.random() * variation / 2);
      const volume = Math.random() * 1000000 + 100000;

      return {
        timestamp,
        open: open.toFixed(8),
        high: high.toFixed(8),
        low: low.toFixed(8),
        close: close.toFixed(8),
        volume: volume.toFixed(2)
      };
    }).reverse();

    res.json({
      symbol,
      interval,
      candles
    });
  } catch (error) {
    console.error('Candles error:', error);
    res.status(500).json({ message: 'Failed to fetch candle data' });
  }
});

// ==================== PORTFOLIO ADVANCED ENDPOINTS ====================

// Get portfolio performance metrics
router.get('/portfolio/performance', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const period = (req.query.period as string) || '24h';

    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const transactions = await storage.getUserTransactions(userId, 1000);

    // Calculate performance metrics
    const totalValue = parseFloat(portfolio.totalValue);
    const totalCost = transactions
      .filter(t => t.type === 'buy')
      .reduce((sum, t) => sum + parseFloat(t.total), 0);

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    // Calculate Sharpe ratio (simplified)
    const returns = transactions.map(t => parseFloat(t.total));
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const sharpeRatio = variance > 0 ? avgReturn / Math.sqrt(variance) : 0;

    res.json({
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      metrics: {
        sharpeRatio: sharpeRatio.toFixed(2),
        maxDrawdown: -15.5, // Mock value
        winRate: 65.2, // Mock value
        avgWin: 250.50,
        avgLoss: -120.30,
        profitFactor: 2.08
      },
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio performance' });
  }
});

// Get portfolio allocation breakdown
router.get('/portfolio/allocation', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const portfolio = await storage.getPortfolio(userId);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const totalValue = parseFloat(portfolio.totalValue);

    const allocation = await Promise.all(
      holdings.map(async (holding) => {
        const currentPrice = await cryptoService.getPrice(holding.symbol);
        const value = parseFloat(holding.amount) * (currentPrice?.price || parseFloat(holding.currentPrice));
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

        return {
          symbol: holding.symbol,
          name: holding.name,
          amount: parseFloat(holding.amount),
          value,
          percentage,
          avgCost: parseFloat(holding.averagePurchasePrice),
          currentPrice: currentPrice?.price || parseFloat(holding.currentPrice)
        };
      })
    );

    const byAssetType = allocation.reduce((acc, item) => {
      const type = item.symbol.startsWith('X') ? 'metals' : 'crypto';
      if (!acc[type]) acc[type] = { value: 0, percentage: 0 };
      acc[type].value += item.value;
      acc[type].percentage += item.percentage;
      return acc;
    }, {} as Record<string, { value: number; percentage: number }>);

    res.json({
      total: totalValue,
      holdings: allocation,
      byAssetType,
      diversificationScore: Math.min(100, allocation.length * 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Portfolio allocation error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio allocation' });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get user trading statistics
router.get('/analytics/trading-stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId, 10000);

    const buyTransactions = transactions.filter(t => t.type === 'buy');
    const sellTransactions = transactions.filter(t => t.type === 'sell');

    const totalBuyVolume = buyTransactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
    const totalSellVolume = sellTransactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
    const totalFees = transactions.reduce((sum, t) => sum + parseFloat(t.fee || '0'), 0);

    const profitableTrades = sellTransactions.filter((sell) => {
      const correspondingBuy = buyTransactions.find(b => b.symbol === sell.symbol);
      if (!correspondingBuy) return false;
      return parseFloat(sell.price) > parseFloat(correspondingBuy.price);
    });

    res.json({
      totalTrades: transactions.length,
      buyTrades: buyTransactions.length,
      sellTrades: sellTransactions.length,
      totalBuyVolume,
      totalSellVolume,
      totalFees,
      winRate: sellTransactions.length > 0 ? (profitableTrades.length / sellTransactions.length) * 100 : 0,
      avgTradeSize: transactions.length > 0 ? (totalBuyVolume + totalSellVolume) / transactions.length : 0,
      mostTradedAssets: this.getMostTraded(transactions),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trading stats error:', error);
    res.status(500).json({ message: 'Failed to fetch trading statistics' });
  }
});

// Helper method for most traded assets
private getMostTraded(transactions: any[]): any[] {
  const symbolCounts = transactions.reduce((acc, t) => {
    acc[t.symbol] = (acc[t.symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(symbolCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symbol, count]) => ({ symbol, trades: count }));
}

// Get risk metrics
router.get('/analytics/risk-metrics', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const portfolio = await storage.getPortfolio(userId);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const totalValue = parseFloat(portfolio.totalValue);

    // Calculate Value at Risk (VaR) - simplified
    const portfolioVolatility = 0.15; // Mock 15% annual volatility
    const confidenceLevel = 0.95;
    const timeHorizon = 1; // 1 day
    const zScore = 1.65; // 95% confidence

    const dailyVaR = totalValue * portfolioVolatility * zScore * Math.sqrt(timeHorizon / 365);

    // Calculate concentration risk
    const concentrationRisk = holdings.reduce((max, holding) => {
      const value = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      return Math.max(max, percentage);
    }, 0);

    res.json({
      valueAtRisk: {
        daily: dailyVaR,
        weekly: dailyVaR * Math.sqrt(7),
        monthly: dailyVaR * Math.sqrt(30)
      },
      concentrationRisk: {
        maxPosition: concentrationRisk,
        riskLevel: concentrationRisk > 30 ? 'high' : concentrationRisk > 15 ? 'medium' : 'low'
      },
      diversification: {
        assetsCount: holdings.length,
        score: Math.min(100, holdings.length * 10)
      },
      volatility: {
        daily: portfolioVolatility / Math.sqrt(365),
        annual: portfolioVolatility
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Risk metrics error:', error);
    res.status(500).json({ message: 'Failed to fetch risk metrics' });
  }
});

export default router;
