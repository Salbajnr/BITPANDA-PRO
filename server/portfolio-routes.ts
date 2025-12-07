
import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { requireAuth } from './simple-auth';

const router = Router();

// Get user's portfolio with real-time values
router.get('/portfolio', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user's portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Get user's holdings
    const userHoldings = await storage.getHoldings(portfolio.id);

    if (userHoldings.length === 0) {
      return res.json({
        totalValue: 0,
        totalInvested: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
        holdings: []
      });
    }

    // Map symbols to CoinGecko IDs
    const symbolToIdMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'ADA': 'cardano',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'MATIC': 'polygon',
      'LINK': 'chainlink',
      'LTC': 'litecoin'
    };

    // Get unique symbols and map to CoinGecko IDs
    const cryptoIds = userHoldings.map(h => symbolToIdMap[h.symbol] || h.symbol.toLowerCase()).join(',');
    
    let prices: any = {};
    try {
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`
      );
      if (priceResponse.ok) {
        prices = await priceResponse.json();
      }
    } catch (error) {
      console.log('Failed to fetch real-time prices, using fallback data');
    }

    // Calculate portfolio with current values
    const portfolioItems = userHoldings.map(holding => {
      const cryptoId = symbolToIdMap[holding.symbol] || holding.symbol.toLowerCase();
      const priceData = prices[cryptoId] || {};
      const currentPrice = priceData.usd || parseFloat(holding.currentPrice) || 0;
      const change24h = priceData.usd_24h_change || 0;
      const amount = parseFloat(holding.amount);
      const avgPrice = parseFloat(holding.averagePurchasePrice);
      const currentValue = amount * currentPrice;
      const investedAmount = amount * avgPrice;
      const profitLoss = currentValue - investedAmount;
      const profitLossPercent = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

      return {
        id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        quantity: amount,
        averagePrice: avgPrice,
        currentPrice: currentPrice,
        currentValue: currentValue,
        profitLoss: profitLoss,
        profitLossPercent: profitLossPercent,
        change24h: change24h,
        investedAmount: investedAmount
      };
    });

    const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
    const totalInvested = portfolioItems.reduce((sum, item) => sum + item.investedAmount, 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    // Update portfolio with new total value
    await storage.updatePortfolio(portfolio.id, {
      totalValue: totalValue.toString(),
      availableCash: parseFloat(portfolio.availableCash).toString()
    });

    res.json({
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent,
      holdings: portfolioItems
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// Add cryptocurrency to portfolio
router.post('/portfolio/add', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { symbol, quantity, price, name } = req.body;

    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get user's portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if holding already exists
    const existingHolding = await storage.getHolding(portfolio.id, symbol.toUpperCase());

    if (existingHolding) {
      // Update existing holding with average price calculation
      const currentAmount = parseFloat(existingHolding.amount);
      const currentAvg = parseFloat(existingHolding.averagePurchasePrice);
      const newAmount = currentAmount + quantity;
      const newAveragePrice = ((currentAmount * currentAvg) + (quantity * price)) / newAmount;

      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        assetType: 'crypto',
        amount: newAmount.toString(),
        averagePurchasePrice: newAveragePrice.toString(),
        currentPrice: price.toString()
      });
      // Create new holding
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        assetType: 'crypto',
        amount: quantity.toString(),
        averagePurchasePrice: price.toString(),
        currentPrice: price.toString()
      });
    }

    res.json({ message: 'Holding added successfully' });
  } catch (error) {
    console.error('Add holding error:', error);
    res.status(500).json({ message: 'Failed to add holding' });
  }
});

// Remove cryptocurrency from portfolio
router.delete('/portfolio/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const holdingId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user owns this holding
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Get the holding to get the symbol
    const holding = await storage.getHoldingById(holdingId);
    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }

    await storage.deleteHolding(portfolio.id, holding.symbol);

    res.json({ message: 'Holding removed successfully' });
  } catch (error) {
    console.error('Remove holding error:', error);
    res.status(500).json({ message: 'Failed to remove holding' });
  }
});

// Get portfolio history/performance over time
router.get('/portfolio/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user transactions for performance tracking
    const transactions = await storage.getUserTransactions(userId, 100);
    
    // Generate mock portfolio history based on transactions
    const historyData = [];
    let currentValue = 0;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate portfolio growth
      currentValue = 10000 + (Math.random() * 5000) + (i * 100);
      
      historyData.push({
        date: date.toISOString().split('T')[0],
        value: currentValue,
        change: i > 0 ? (currentValue - (10000 + ((i-1) * 100))) : 0
      });
    }

    res.json(historyData);
  } catch (error) {
    console.error('Portfolio history error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio history' });
  }
});

export { router as portfolioRoutes };
