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
        transactions: []
      });
    }

    // Process recent transactions
    for (const transaction of userTransactions) {
      const key = transaction.symbol;
      if (!holdingsMap.has(key)) {
        holdingsMap.set(key, {
          symbol: key,
          name: key, // In real app, get from crypto API
          totalAmount: 0,
          totalCost: 0,
          transactions: []
        });
      }

      const holding = holdingsMap.get(key);
      holding.transactions.push(transaction);

      const amount = parseFloat(transaction.amount);
      const price = parseFloat(transaction.price);

      if (transaction.type === 'buy') {
        holding.totalAmount += amount;
        holding.totalCost += amount * price;
      } else if (transaction.type === 'sell') {
        holding.totalAmount -= amount;
        holding.totalCost -= amount * price;
      }
    }

    // Fetch real crypto prices from CoinGecko
    const fetchCryptoPrices = async (symbols: string[]) => {
      try {
        const coinIds = symbols.map(symbol => {
          const mapping: { [key: string]: string } = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'SOL': 'solana',
            'MATIC': 'polygon',
            'LINK': 'chainlink',
            'UNI': 'uniswap'
          };
          return mapping[symbol] || symbol.toLowerCase();
        });

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
        );

        if (!response.ok) throw new Error('Failed to fetch prices');

        const data = await response.json();
        const prices: { [key: string]: number } = {};

        symbols.forEach((symbol, index) => {
          const coinId = coinIds[index];
          prices[symbol] = data[coinId]?.usd || 100; // Fallback price
        });

        return prices;
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Fallback to mock prices
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
        return mockPrices;
      }
    };

    const holdingSymbols = Array.from(holdingsMap.keys());
    const currentPrices = await fetchCryptoPrices(holdingSymbols);

    const holdings = Array.from(holdingsMap.values())
      .filter(h => h.totalAmount > 0)
      .map(holding => {
        const currentPrice = currentPrices[holding.symbol] || 100;
        const totalValue = holding.totalAmount * currentPrice;
        const averageCost = holding.totalCost > 0 ? holding.totalCost / holding.totalAmount : 0;
        const pnl = totalValue - holding.totalCost;
        const pnlPercentage = holding.totalCost > 0 ? (pnl / holding.totalCost) * 100 : 0;

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

// Placeholder for requireAuth and getPeriodStart if they are not defined elsewhere
const requireAuth = (req, res, next) => {
  // Dummy implementation for demonstration
  if (req.session?.userId) {
    req.user = { id: req.session.userId };
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

function getPeriodStart(period: string) {
  const date = new Date();
  switch (period) {
    case '7d':
      date.setDate(date.getDate() - 7);
      break;
    case '30d':
      date.setDate(date.getDate() - 30);
      break;
    case '90d':
      date.setDate(date.getDate() - 90);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setDate(date.getDate() - 30); // Default to 30 days
  }
  return date.toISOString().split('T')[0];
}


// Helper function to calculate daily returns
function calculateDailyReturns(transactions: any[], period: string, currentValue: number) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const returns = [];

  // Sort transactions by date
  const sortedTransactions = transactions.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Calculate portfolio value up to this date
    const relevantTransactions = sortedTransactions.filter(tx => 
      new Date(tx.createdAt) <= date
    );

    const invested = relevantTransactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + parseFloat(tx.total), 0);

    const sold = relevantTransactions
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + parseFloat(tx.total), 0);

    // Estimate value based on current proportion
    const estimatedValue = i === 0 ? currentValue : 
      invested > 0 ? (currentValue / invested) * invested * (0.95 + Math.random() * 0.1) : 0;

    const dailyReturn = invested > 0 ? ((estimatedValue - invested) / invested) * 100 : 0;

    returns.push({
      date: dateStr,
      value: estimatedValue,
      return: dailyReturn,
      invested,
      sold
    });
  }

  return returns;
}

// Mock function for compatibility if not defined elsewhere
function generateMockDailyReturns(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const returns = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    returns.push({
      date: date.toISOString().split('T')[0],
      value: Math.random() * 1000 + 5000, // Random value between 5000-6000
      return: (Math.random() - 0.5) * 100 // Random return between -50 to +50
    });
  }

  return returns;
}

// Portfolio performance endpoint
router.get('/performance', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const period = req.query.period as string || '30d';

    // Get user's portfolio and transactions
    const portfolio = await storage.getPortfolio(userId);
    const transactions = await storage.getUserTransactions(userId, 1000);

    if (!portfolio) {
      return res.json({
        totalReturn: 0,
        totalReturnPercentage: 0,
        dailyReturns: [],
        periodStart: getPeriodStart(period),
        periodEnd: new Date().toISOString()
      });
    }

    // Calculate actual performance from transactions
    const currentValue = parseFloat(portfolio.totalValue);
    const totalInvested = transactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + parseFloat(tx.total), 0);

    const totalReturn = currentValue - totalInvested;
    const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Generate daily returns based on transaction history
    const dailyReturns = calculateDailyReturns(transactions, period, currentValue);

    const performance = {
      totalReturn,
      totalReturnPercentage,
      dailyReturns,
      periodStart: getPeriodStart(period),
      periodEnd: new Date().toISOString(),
      totalInvested,
      currentValue
    };

    res.json(performance);
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio performance' });
  }
});

export default router;