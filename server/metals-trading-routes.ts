
import { Router } from 'express';
import { requireAuth, requireAdmin } from './simple-auth';
import { storage } from './storage';
import { metalsService } from './metals-service';
import { z } from 'zod';

const router = Router();

// Schemas for validation
const buyMetalSchema = z.object({
  symbol: z.string().min(1),
  amount: z.string().min(1),
  price: z.string().min(1),
  total: z.string().min(1),
  name: z.string().min(1),
  orderType: z.enum(['market', 'limit']).default('market')
});

const sellMetalSchema = z.object({
  symbol: z.string().min(1),
  amount: z.string().min(1),
  price: z.string().min(1),
  total: z.string().min(1)
});

// Buy metals
router.post('/buy', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const tradeData = buyMetalSchema.parse(req.body);

    // Get user portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user has sufficient funds
    const availableCash = parseFloat(portfolio.availableCash);
    const totalCost = parseFloat(tradeData.total);

    if (availableCash < totalCost) {
      return res.status(400).json({
        message: "Insufficient funds",
        available: availableCash,
        required: totalCost
      });
    }

    // Get current metal price for validation
    const currentPrice = await metalsService.getPrice(tradeData.symbol);
    if (!currentPrice) {
      return res.status(400).json({ message: "Metal price not available" });
    }

    // Create transaction record
    const transaction = await storage.createTransaction({
      userId,
      type: 'buy',
      assetType: 'metal',
      symbol: tradeData.symbol,
      amount: tradeData.amount,
      price: tradeData.price,
      total: tradeData.total,
      status: 'completed',
      fees: '0'
    });

    // Update or create holding
    const existingHolding = await storage.getHolding(portfolio.id, tradeData.symbol);

    if (existingHolding) {
      const newAmount = parseFloat(existingHolding.amount) + parseFloat(tradeData.amount);
      const newAverage = (
        parseFloat(existingHolding.averagePurchasePrice) * parseFloat(existingHolding.amount) +
        parseFloat(tradeData.amount) * parseFloat(tradeData.price)
      ) / newAmount;

      await storage.upsertHolding({
        portfolioId: portfolio.id,
        assetType: 'metal',
        symbol: tradeData.symbol,
        name: tradeData.name,
        amount: newAmount.toString(),
        averagePurchasePrice: newAverage.toString(),
        currentPrice: currentPrice.price.toString()
      });
    } else {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        assetType: 'metal',
        symbol: tradeData.symbol,
        name: tradeData.name,
        amount: tradeData.amount,
        averagePurchasePrice: tradeData.price,
        currentPrice: currentPrice.price.toString()
      });
    }

    // Update portfolio cash
    const newCash = availableCash - totalCost;
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newCash.toString(),
      totalValue: (parseFloat(portfolio.totalValue) + totalCost).toString()
    });

    // Create notification
    await storage.createNotification({
      userId,
      type: 'trade_complete',
      title: 'Metal Purchase Successful',
      message: `Successfully purchased ${tradeData.amount}oz of ${tradeData.name} at $${tradeData.price}/oz`,
      isRead: false
    });

    res.json({
      transaction,
      message: 'Metal purchase completed successfully',
      newBalance: newCash
    });

  } catch (error) {
    console.error('Error buying metal:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid input data', errors: formatted });
    }

    res.status(500).json({ message: 'Failed to complete metal purchase', error: formatted });
  }
});

// Sell metals
router.post('/sell', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const tradeData = sellMetalSchema.parse(req.body);

    // Get user portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user has the metal holding
    const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
    if (!holding) {
      return res.status(400).json({ message: "You don't own this metal" });
    }

    // Check if user has sufficient amount
    const availableAmount = parseFloat(holding.amount);
    const sellAmount = parseFloat(tradeData.amount);

    if (availableAmount < sellAmount) {
      return res.status(400).json({
        message: "Insufficient metal amount",
        available: availableAmount,
        requested: sellAmount
      });
    }

    // Get current metal price
    const currentPrice = await metalsService.getPrice(tradeData.symbol);
    if (!currentPrice) {
      return res.status(400).json({ message: "Metal price not available" });
    }

    // Create transaction record
    const transaction = await storage.createTransaction({
      userId,
      type: 'sell',
      assetType: 'metal',
      symbol: tradeData.symbol,
      amount: tradeData.amount,
      price: tradeData.price,
      total: tradeData.total,
      status: 'completed',
      fees: '0'
    });

    // Update holding
    const newAmount = availableAmount - sellAmount;

    if (newAmount > 0) {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        assetType: 'metal',
        symbol: tradeData.symbol,
        name: holding.name,
        amount: newAmount.toString(),
        averagePurchasePrice: holding.averagePurchasePrice,
        currentPrice: currentPrice.price.toString()
      });
    } else {
      // Delete holding if amount becomes 0
      await storage.deleteHolding(portfolio.id, tradeData.symbol);
    }

    // Update portfolio cash
    const newCash = parseFloat(portfolio.availableCash) + parseFloat(tradeData.total);
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newCash.toString(),
      totalValue: (parseFloat(portfolio.totalValue) - parseFloat(tradeData.total)).toString()
    });

    // Create notification
    await storage.createNotification({
      userId,
      type: 'trade_complete',
      title: 'Metal Sale Successful',
      message: `Successfully sold ${tradeData.amount}oz of ${holding.name} at $${tradeData.price}/oz`,
      isRead: false
    });

    res.json({
      transaction,
      message: 'Metal sale completed successfully',
      newBalance: newCash
    });

  } catch (error) {
    console.error('Error selling metal:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid input data', errors: formatted });
    }

    res.status(500).json({ message: 'Failed to complete metal sale', error: formatted });
  }
});

// Get user metal holdings
router.get('/holdings', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const portfolio = await storage.getPortfolio(userId);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const metalHoldings = holdings.filter(h => h.assetType === 'metal');

    // Update current prices
    const holdingsWithPrices = await Promise.all(
      metalHoldings.map(async (holding) => {
        const currentPrice = await metalsService.getPrice(holding.symbol);
        const currentValue = parseFloat(holding.amount) * (currentPrice?.price || parseFloat(holding.currentPrice));
        const purchaseValue = parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice);
        const profitLoss = currentValue - purchaseValue;
        const profitLossPercent = (profitLoss / purchaseValue) * 100;

        return {
          ...holding,
          currentPrice: currentPrice?.price || parseFloat(holding.currentPrice),
          currentValue,
          profitLoss,
          profitLossPercent
        };
      })
    );

    res.json(holdingsWithPrices);
  } catch (error) {
    console.error('Error fetching metal holdings:', error);
    res.status(500).json({ message: 'Failed to fetch metal holdings' });
  }
});

// Get metal trading history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId, 100);
    const metalTransactions = transactions.filter(t => t.assetType === 'metal');

    res.json(metalTransactions);
  } catch (error) {
    console.error('Error fetching metal trading history:', error);
    res.status(500).json({ message: 'Failed to fetch trading history' });
  }
});

// Admin routes
router.get('/admin/transactions', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const transactions = await storage.getAllTransactions({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      type: 'buy'
    });

    const metalTransactions = transactions.transactions.filter(t => t.assetType === 'metal');

    res.json({
      transactions: metalTransactions,
      total: metalTransactions.length
    });
  } catch (error) {
    console.error('Error fetching admin metal transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Admin metal price management
router.post('/admin/price-override', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { symbol, price, reason } = req.body;

    // Create audit log for price override
    await storage.createAuditLog({
      adminId: req.user!.id,
      action: 'metal_price_override',
      targetId: symbol,
      details: { symbol, price, reason },
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || ''
    });

    res.json({ message: 'Price override logged successfully' });
  } catch (error) {
    console.error('Error processing price override:', error);
    res.status(500).json({ message: 'Failed to process price override' });
  }
});

export default router;
