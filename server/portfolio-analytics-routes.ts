
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

export default router;
import { Router } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { cryptoService } from './crypto-service';

const router = Router();

// Get portfolio overview with analytics
router.get('/overview', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    // Get portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Get holdings with current prices
    const holdings = await storage.getHoldingsWithPrices(portfolio.id);
    
    // Calculate total portfolio value
    let totalValue = 0;
    let totalCost = 0;
    
    const holdingsWithMetrics = await Promise.all(holdings.map(async (holding) => {
      const currentPrice = await cryptoService.getPrice(holding.symbol.toLowerCase());
      const currentValue = parseFloat(holding.amount) * (currentPrice?.price || 0);
      const totalCostForHolding = parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice);
      const profitLoss = currentValue - totalCostForHolding;
      const profitLossPercentage = totalCostForHolding > 0 ? (profitLoss / totalCostForHolding) * 100 : 0;
      
      totalValue += currentValue;
      totalCost += totalCostForHolding;
      
      return {
        ...holding,
        currentPrice: currentPrice?.price || 0,
        currentValue,
        totalCost: totalCostForHolding,
        profitLoss,
        profitLossPercentage,
        allocation: 0 // Will be calculated after totalValue is known
      };
    }));

    // Calculate allocation percentages
    const holdingsWithAllocation = holdingsWithMetrics.map(holding => ({
      ...holding,
      allocation: totalValue > 0 ? (holding.currentValue / totalValue) * 100 : 0
    }));

    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    res.json({
      portfolio,
      holdings: holdingsWithAllocation,
      analytics: {
        totalValue,
        totalCost,
        totalProfitLoss,
        totalProfitLossPercentage,
        availableCash: parseFloat(portfolio.availableCash),
        totalAssets: holdingsWithAllocation.length
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio analytics:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio analytics' });
  }
});

// Get portfolio performance history
router.get('/performance', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { period = '30d' } = req.query;
    
    // Get portfolio transactions for performance calculation
    const transactions = await storage.getUserTransactions(userId);
    
    // Generate mock performance data based on transactions
    const performanceData = generatePerformanceData(transactions, period as string);
    
    res.json({
      period,
      data: performanceData,
      metrics: {
        totalReturn: calculateTotalReturn(performanceData),
        volatility: calculateVolatility(performanceData),
        sharpeRatio: calculateSharpeRatio(performanceData)
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio performance' });
  }
});

// Get asset allocation
router.get('/allocation', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holdings = await storage.getHoldingsWithPrices(portfolio.id);
    
    let totalValue = 0;
    const allocationData = await Promise.all(holdings.map(async (holding) => {
      const currentPrice = await cryptoService.getPrice(holding.symbol.toLowerCase());
      const value = parseFloat(holding.amount) * (currentPrice?.price || 0);
      totalValue += value;
      
      return {
        symbol: holding.symbol,
        name: holding.name,
        value,
        amount: parseFloat(holding.amount)
      };
    }));

    const allocationWithPercentages = allocationData.map(item => ({
      ...item,
      percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0
    }));

    res.json({
      totalValue,
      allocation: allocationWithPercentages,
      cash: {
        amount: parseFloat(portfolio.availableCash),
        percentage: totalValue > 0 ? (parseFloat(portfolio.availableCash) / (totalValue + parseFloat(portfolio.availableCash))) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching asset allocation:', error);
    res.status(500).json({ message: 'Failed to fetch asset allocation' });
  }
});

// Helper functions
function generatePerformanceData(transactions: any[], period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate portfolio value based on market trends
    const baseValue = 10000 + (Math.sin(i / 10) * 1000) + (Math.random() * 500 - 250);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(baseValue, 5000), // Minimum value
      change: Math.random() * 10 - 5 // Random daily change
    });
  }
  
  return data;
}

function calculateTotalReturn(data: any[]) {
  if (data.length < 2) return 0;
  const initial = data[0].value;
  const final = data[data.length - 1].value;
  return ((final - initial) / initial) * 100;
}

function calculateVolatility(data: any[]) {
  if (data.length < 2) return 0;
  const returns = data.slice(1).map((d, i) => (d.value - data[i].value) / data[i].value);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100;
}

function calculateSharpeRatio(data: any[]) {
  const totalReturn = calculateTotalReturn(data);
  const volatility = calculateVolatility(data);
  const riskFreeRate = 2; // Assume 2% risk-free rate
  return volatility > 0 ? (totalReturn - riskFreeRate) / volatility : 0;
}

export default router;
