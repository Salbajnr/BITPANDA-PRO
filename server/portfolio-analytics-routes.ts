
import { Router } from 'express';
import { db } from './db';
import { portfolios, transactions, users } from '../shared/schema';
import { eq, and, desc, gte } from 'drizzle-orm';

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
    const userPortfolio = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .limit(1);

    if (!userPortfolio.length) {
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

    const portfolio = userPortfolio[0];

    // Get user's transactions for analysis
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));

    // Calculate holdings from transactions
    const holdingsMap = new Map();
    
    for (const transaction of userTransactions) {
      const key = transaction.cryptoSymbol;
      if (!holdingsMap.has(key)) {
        holdingsMap.set(key, {
          symbol: transaction.cryptoSymbol,
          name: transaction.cryptoSymbol, // In real app, get from crypto API
          totalAmount: 0,
          totalCost: 0,
          transactions: []
        });
      }
      
      const holding = holdingsMap.get(key);
      holding.transactions.push(transaction);
      
      if (transaction.type === 'buy') {
        holding.totalAmount += transaction.amount;
        holding.totalCost += transaction.amount * transaction.price;
      } else if (transaction.type === 'sell') {
        holding.totalAmount -= transaction.amount;
        holding.totalCost -= transaction.amount * transaction.price;
      }
    }

    // Mock current prices (in production, fetch from crypto API)
    const mockPrices: { [key: string]: number } = {
      'BTC': 43500,
      'ETH': 2650,
      'ADA': 0.48,
      'DOT': 7.2,
      'SOL': 98,
      'MATIC': 0.85,
      'LINK': 15.2,
      'UNI': 6.8
    };

    const holdings = Array.from(holdingsMap.values())
      .filter(h => h.totalAmount > 0)
      .map(holding => {
        const currentPrice = mockPrices[holding.symbol] || 100;
        const totalValue = holding.totalAmount * currentPrice;
        const averageCost = holding.totalCost / holding.totalAmount;
        const pnl = totalValue - holding.totalCost;
        const pnlPercentage = (pnl / holding.totalCost) * 100;
        
        return {
          id: holding.symbol,
          symbol: holding.symbol,
          name: holding.name,
          amount: holding.totalAmount,
          currentPrice,
          averageCost,
          totalValue,
          totalCost: holding.totalCost,
          pnl,
          pnlPercentage,
          allocation: 0, // Will calculate below
          image: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/32/color/${holding.symbol.toLowerCase()}.png`
        };
      });

    // Calculate total portfolio value and allocations
    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    // Update allocations
    holdings.forEach(holding => {
      holding.allocation = totalValue > 0 ? (holding.totalValue / totalValue) * 100 : 0;
    });

    // Mock 24h change (in production, calculate from price history)
    const dayPnL = totalValue * 0.02; // Mock 2% daily change
    const dayPnLPercentage = 2.0;

    // Create allocation data
    const allocation = holdings.map(h => ({
      symbol: h.symbol,
      name: h.name,
      percentage: h.allocation,
      value: h.totalValue,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    // Mock performance data (in production, store historical portfolio values)
    const performance = [];
    const daysBack = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 365;
    
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Mock historical value with some variance
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const mockValue = totalValue * (1 + variance);
      
      performance.push({
        date: date.toISOString().split('T')[0],
        value: mockValue,
        pnl: mockValue - totalCost
      });
    }

    res.json({
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      dayPnL,
      dayPnLPercentage,
      holdings,
      performance,
      allocation
    });

  } catch (error) {
    console.error('Error fetching portfolio analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
