
import { Router, Request, Response } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Get portfolio performance
router.get('/portfolio-performance', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const period = (req.query.period as string) || '30d';

    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.json({
        totalValue: 0,
        totalReturn: 0,
        percentageReturn: 0,
        bestPerformer: null,
        worstPerformer: null,
      });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const transactions = await storage.getUserTransactions(userId, 1000);

    // Calculate metrics
    const totalValue = parseFloat(portfolio.totalValue);
    const totalInvested = transactions
      .filter(t => t.type === 'buy')
      .reduce((sum, t) => sum + parseFloat(t.total), 0);

    const totalReturn = totalValue - totalInvested;
    const percentageReturn = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    res.json({
      totalValue,
      totalInvested,
      totalReturn,
      percentageReturn,
      holdings: holdings.length,
      transactions: transactions.length,
      period,
    });
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});

// Get trading statistics
router.get('/trading-stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId, 1000);

    const stats = {
      totalTrades: transactions.length,
      buyOrders: transactions.filter(t => t.type === 'buy').length,
      sellOrders: transactions.filter(t => t.type === 'sell').length,
      totalVolume: transactions.reduce((sum, t) => sum + parseFloat(t.total), 0),
      avgTradeSize: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + parseFloat(t.total), 0) / transactions.length 
        : 0,
      completedTrades: transactions.filter(t => t.status === 'completed').length,
      pendingTrades: transactions.filter(t => t.status === 'pending').length,
    };

    res.json(stats);
  } catch (error) {
    console.error('Trading stats error:', error);
    res.status(500).json({ message: 'Failed to fetch trading statistics' });
  }
});

// Get asset allocation
router.get('/asset-allocation', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const portfolio = await storage.getPortfolio(userId);
    
    if (!portfolio) {
      return res.json({ allocations: [] });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const totalValue = parseFloat(portfolio.totalValue);

    const allocations = holdings.map(holding => {
      const value = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        symbol: holding.symbol,
        name: holding.name,
        value,
        percentage,
        assetType: holding.assetType,
      };
    });

    res.json({ allocations, totalValue });
  } catch (error) {
    console.error('Asset allocation error:', error);
    res.status(500).json({ message: 'Failed to fetch asset allocation' });
  }
});

export default router;
