import { Router } from 'express';
import { db } from './db';
import { portfolios, transactions, users } from '../shared/schema';
import { eq, and, desc, gte } from 'drizzle-orm';
import { storage } from './storage';

const router = Router();

// Get portfolio analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const timeframe = req.query.timeframe as string || '7d';

    // Get user's portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.json({
        totalValue: 0,
        totalCost: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        dayPnL: 0,
        dayPnLPercentage: 0,
        holdings: [],
        performance: [],
        allocation: []
      });
    }

    // Get user's transactions for analysis
    const userTransactions = await storage.getUserTransactions(userId, 100);

    // Get existing holdings from portfolio
    const existingHoldings = await storage.getHoldings(portfolio.id);

    // Calculate holdings from database + transactions
    const holdingsMap = new Map();

    // Add existing holdings first
    for (const holding of existingHoldings) {
      holdingsMap.set(holding.symbol, {
        symbol: holding.symbol,
        name: holding.name,
        totalAmount: parseFloat(holding.amount),
        totalCost: parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice),
        averagePurchasePrice: parseFloat(holding.averagePurchasePrice),
        currentPrice: parseFloat(holding.currentPrice),
        transactions: []
      });
    }

    // Process transactions to update holdings
    for (const tx of userTransactions) {
      const existing = holdingsMap.get(tx.symbol);
      if (existing) {
        existing.transactions.push(tx);
      }
    }

    // Convert map to array and calculate analytics
    const holdings = Array.from(holdingsMap.values()).map(h => ({
      ...h,
      currentValue: h.totalAmount * h.currentPrice,
      pnl: (h.totalAmount * h.currentPrice) - h.totalCost,
      pnlPercentage: h.totalCost > 0 ? (((h.totalAmount * h.currentPrice) - h.totalCost) / h.totalCost) * 100 : 0
    }));

    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    res.json({
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      dayPnL: 0, // Would need historical data
      dayPnLPercentage: 0,
      holdings,
      performance: [],
      allocation: holdings.map(h => ({
        symbol: h.symbol,
        name: h.name,
        percentage: totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0
      }))
    });
  } catch (error) {
    console.error('Portfolio analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio analytics' });
  }
});

export default router;
