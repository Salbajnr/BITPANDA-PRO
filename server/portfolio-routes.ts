
import { Router, Request, Response } from 'express';
import { db } from './db';
import { portfolios, holdings } from '../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from './auth';

const router = Router();

// Get user's portfolio with real-time values
router.get('/portfolio', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user's holdings
    const userHoldings = await db.select()
      .from(holdings)
      .where(eq(holdings.userId, userId));

    // Fetch real-time prices from CoinGecko
    const cryptoIds = userHoldings.map(h => h.symbol.toLowerCase()).join(',');
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`
    );
    const prices = await priceResponse.json();

    // Calculate portfolio with current values
    const portfolioItems = userHoldings.map(holding => {
      const priceData = prices[holding.symbol.toLowerCase()] || {};
      const currentPrice = priceData.usd || 0;
      const change24h = priceData.usd_24h_change || 0;
      const currentValue = holding.quantity * currentPrice;
      const profitLoss = currentValue - (holding.quantity * holding.averagePrice);
      const profitLossPercent = (profitLoss / (holding.quantity * holding.averagePrice)) * 100;

      return {
        id: holding.id,
        symbol: holding.symbol,
        quantity: holding.quantity,
        averagePrice: holding.averagePrice,
        currentPrice: currentPrice,
        currentValue: currentValue,
        profitLoss: profitLoss,
        profitLossPercent: profitLossPercent,
        change24h: change24h,
        investedAmount: holding.quantity * holding.averagePrice
      };
    });

    const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
    const totalInvested = portfolioItems.reduce((sum, item) => sum + item.investedAmount, 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

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
    const { symbol, quantity, price } = req.body;

    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if holding already exists
    const existingHolding = await db.select()
      .from(holdings)
      .where(and(eq(holdings.userId, userId), eq(holdings.symbol, symbol)))
      .limit(1);

    if (existingHolding.length > 0) {
      // Update existing holding with average price calculation
      const existing = existingHolding[0];
      const newQuantity = existing.quantity + quantity;
      const newAveragePrice = ((existing.quantity * existing.averagePrice) + (quantity * price)) / newQuantity;

      await db.update(holdings)
        .set({
          quantity: newQuantity,
          averagePrice: newAveragePrice,
          updatedAt: new Date()
        })
        .where(eq(holdings.id, existing.id));
    } else {
      // Create new holding
      await db.insert(holdings).values({
        userId,
        symbol: symbol.toUpperCase(),
        quantity,
        averagePrice: price,
        createdAt: new Date(),
        updatedAt: new Date()
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
    const holdingId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await db.delete(holdings)
      .where(and(eq(holdings.id, holdingId), eq(holdings.userId, userId)));

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

    // Get portfolio snapshots from the last 30 days
    const portfolioHistory = await db.select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.date))
      .limit(30);

    res.json(portfolioHistory);
  } catch (error) {
    console.error('Portfolio history error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio history' });
  }
});

export { router as portfolioRoutes };
