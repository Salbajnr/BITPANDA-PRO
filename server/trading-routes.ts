
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const executeTradeSchema = z.object({
  symbol: z.string(),
  type: z.enum(['buy', 'sell']),
  orderType: z.enum(['market', 'limit']),
  amount: z.string(),
  price: z.string(),
  total: z.string(),
});

// Execute trade
router.post('/execute', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const portfolio = await storage.getPortfolio(userId);
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const tradeData = executeTradeSchema.parse(req.body);
    
    // Validate sufficient funds for buy orders
    if (tradeData.type === 'buy') {
      const totalCost = parseFloat(tradeData.total);
      const availableCash = parseFloat(portfolio.availableCash);
      
      if (totalCost > availableCash) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
    }

    // Create transaction
    const transactionData = {
      userId: userId,
      symbol: tradeData.symbol,
      type: tradeData.type,
      amount: tradeData.amount,
      price: tradeData.price,
      total: tradeData.total,
      status: 'completed',
    };
    
    const transaction = await storage.createTransaction(transactionData);

    // Update holdings and portfolio
    if (tradeData.type === 'buy') {
      const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
      
      if (existing) {
        const newAmount = parseFloat(existing.amount) + parseFloat(tradeData.amount);
        const newAverage = (
          parseFloat(existing.averagePurchasePrice) * parseFloat(existing.amount) + 
          parseFloat(tradeData.price) * parseFloat(tradeData.amount)
        ) / newAmount;

        await storage.upsertHolding({
          portfolioId: portfolio.id,
          symbol: tradeData.symbol,
          name: tradeData.symbol,
          amount: newAmount.toString(),
          averagePurchasePrice: newAverage.toString(),
          currentPrice: tradeData.price,
        });
      } else {
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          symbol: tradeData.symbol,
          name: tradeData.symbol,
          amount: tradeData.amount,
          averagePurchasePrice: tradeData.price,
          currentPrice: tradeData.price,
        });
      }

      // Update portfolio cash
      const newCash = parseFloat(portfolio.availableCash) - parseFloat(tradeData.total);
      await storage.updatePortfolio(portfolio.id, { 
        availableCash: newCash.toString() 
      });
    } else {
      // Handle sell orders
      const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
      
      if (!holding) {
        return res.status(400).json({ message: "No holdings found for this asset" });
      }

      const currentAmount = parseFloat(holding.amount);
      const sellAmount = parseFloat(tradeData.amount);

      if (sellAmount > currentAmount) {
        return res.status(400).json({ message: "Insufficient holdings" });
      }

      const newAmount = currentAmount - sellAmount;
      
      if (newAmount <= 0) {
        await storage.deleteHolding(portfolio.id, tradeData.symbol);
      } else {
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          symbol: tradeData.symbol,
          name: holding.name,
          amount: newAmount.toString(),
          averagePurchasePrice: holding.averagePurchasePrice,
          currentPrice: tradeData.price,
        });
      }

      // Update portfolio cash
      const newCash = parseFloat(portfolio.availableCash) + parseFloat(tradeData.total);
      await storage.updatePortfolio(portfolio.id, { 
        availableCash: newCash.toString() 
      });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Execute trade error:", error);
    res.status(500).json({ message: "Failed to execute trade" });
  }
});

// Get trading history
router.get('/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const portfolio = await storage.getPortfolio(userId);
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const transactions = await storage.getUserTransactions(userId, limit);
    
    res.json(transactions);
  } catch (error) {
    console.error("Get trading history error:", error);
    res.status(500).json({ message: "Failed to fetch trading history" });
  }
});

export default router;
