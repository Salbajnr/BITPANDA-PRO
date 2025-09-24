
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const executeTradeSchema = z.object({
  symbol: z.string(),
  type: z.enum(['buy', 'sell']),
  orderType: z.enum(['market', 'limit', 'stop_loss', 'take_profit']),
  amount: z.string(),
  price: z.string(),
  total: z.string().optional(),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
  slippage: z.string().optional(),
});

// Trading configuration
const TRADING_CONFIG = {
  MIN_ORDER_AMOUNT: 1.0, // Minimum $1 USD
  MAX_ORDER_AMOUNT: 1000000, // Maximum $1M USD
  TRADING_FEE_RATE: 0.001, // 0.1% trading fee
  SLIPPAGE_TOLERANCE: 0.005, // 0.5% default slippage
  MAX_SLIPPAGE: 0.05, // 5% maximum slippage
};

function calculateTradingFee(amount: number): number {
  return amount * TRADING_CONFIG.TRADING_FEE_RATE;
}

function validateOrderAmount(amount: number, orderType: string): { valid: boolean; message?: string } {
  if (amount < TRADING_CONFIG.MIN_ORDER_AMOUNT) {
    return { valid: false, message: `Minimum order amount is $${TRADING_CONFIG.MIN_ORDER_AMOUNT}` };
  }
  
  if (amount > TRADING_CONFIG.MAX_ORDER_AMOUNT) {
    return { valid: false, message: `Maximum order amount is $${TRADING_CONFIG.MAX_ORDER_AMOUNT.toLocaleString()}` };
  }
  
  return { valid: true };
}

function calculateSlippage(price: number, slippage: string = '0.5'): number {
  const slippageRate = Math.min(parseFloat(slippage) / 100, TRADING_CONFIG.MAX_SLIPPAGE);
  return price * slippageRate;
}

function validateStopLossPrice(currentPrice: number, stopLoss: number, orderType: string): { valid: boolean; message?: string } {
  if (orderType === 'buy' && stopLoss >= currentPrice) {
    return { valid: false, message: 'Stop loss price must be below current price for buy orders' };
  }
  
  if (orderType === 'sell' && stopLoss <= currentPrice) {
    return { valid: false, message: 'Stop loss price must be above current price for sell orders' };
  }
  
  return { valid: true };
}

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
    
    const amount = parseFloat(tradeData.amount);
    const price = parseFloat(tradeData.price);
    const slippage = calculateSlippage(price, tradeData.slippage);
    
    // Validate order amount
    const amountValidation = validateOrderAmount(amount * price, tradeData.orderType);
    if (!amountValidation.valid) {
      return res.status(400).json({ message: amountValidation.message });
    }

    // Calculate actual execution price with slippage for market orders
    let executionPrice = price;
    if (tradeData.orderType === 'market') {
      executionPrice = tradeData.type === 'buy' ? price + slippage : price - slippage;
    }

    // Calculate trading fee
    const grossTotal = amount * executionPrice;
    const tradingFee = calculateTradingFee(grossTotal);
    const netTotal = tradeData.type === 'buy' ? grossTotal + tradingFee : grossTotal - tradingFee;

    // Validate stop loss if provided
    if (tradeData.stopLoss) {
      const stopLossValidation = validateStopLossPrice(price, parseFloat(tradeData.stopLoss), tradeData.type);
      if (!stopLossValidation.valid) {
        return res.status(400).json({ message: stopLossValidation.message });
      }
    }

    // Validate sufficient funds for buy orders
    if (tradeData.type === 'buy') {
      const availableCash = parseFloat(portfolio.availableCash);
      
      if (netTotal > availableCash) {
        return res.status(400).json({ 
          message: `Insufficient funds. Required: $${netTotal.toFixed(2)}, Available: $${availableCash.toFixed(2)}` 
        });
      }
    } else {
      // Validate sufficient holdings for sell orders
      const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
      
      if (!holding) {
        return res.status(400).json({ message: "No holdings found for this asset" });
      }

      const currentAmount = parseFloat(holding.amount);
      if (amount > currentAmount) {
        return res.status(400).json({ 
          message: `Insufficient holdings. Required: ${amount}, Available: ${currentAmount}` 
        });
      }
    }

    // Create transaction with fees
    const transactionData = {
      userId: userId,
      symbol: tradeData.symbol,
      type: tradeData.type,
      amount: tradeData.amount,
      price: executionPrice.toString(),
      total: netTotal.toString(),
      fee: tradingFee.toString(),
      orderType: tradeData.orderType,
      status: tradeData.orderType === 'market' ? 'completed' : 'pending',
      stopLoss: tradeData.stopLoss || null,
      takeProfit: tradeData.takeProfit || null,
      slippage: tradeData.slippage || '0.5',
    };
    
    const transaction = await storage.createTransaction(transactionData);

    // Only execute immediately for market orders
    if (tradeData.orderType === 'market') {
      // Update holdings and portfolio
      if (tradeData.type === 'buy') {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        
        if (existing) {
          const newAmount = parseFloat(existing.amount) + amount;
          const newAverage = (
            parseFloat(existing.averagePurchasePrice) * parseFloat(existing.amount) + 
            executionPrice * amount
          ) / newAmount;

          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: tradeData.symbol,
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: executionPrice.toString(),
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: tradeData.symbol,
            amount: tradeData.amount,
            averagePurchasePrice: executionPrice.toString(),
            currentPrice: executionPrice.toString(),
          });
        }

        // Update portfolio cash
        const newCash = parseFloat(portfolio.availableCash) - netTotal;
        await storage.updatePortfolio(portfolio.id, { 
          availableCash: newCash.toString() 
        });
      } else {
        // Handle sell orders
        const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
        const newAmount = parseFloat(holding!.amount) - amount;
        
        if (newAmount <= 0) {
          await storage.deleteHolding(portfolio.id, tradeData.symbol);
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: holding!.name,
            amount: newAmount.toString(),
            averagePurchasePrice: holding!.averagePurchasePrice,
            currentPrice: executionPrice.toString(),
          });
        }

        // Update portfolio cash
        const newCash = parseFloat(portfolio.availableCash) + netTotal;
        await storage.updatePortfolio(portfolio.id, { 
          availableCash: newCash.toString() 
        });
      }
    }

    res.json({
      ...transaction,
      executionPrice: executionPrice.toString(),
      tradingFee: tradingFee.toString(),
      netTotal: netTotal.toString(),
      slippageApplied: slippage.toString(),
    });
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

// Get trading configuration
router.get('/config', (req: Request, res: Response) => {
  res.json({
    minOrderAmount: TRADING_CONFIG.MIN_ORDER_AMOUNT,
    maxOrderAmount: TRADING_CONFIG.MAX_ORDER_AMOUNT,
    tradingFeeRate: TRADING_CONFIG.TRADING_FEE_RATE,
    slippageTolerance: TRADING_CONFIG.SLIPPAGE_TOLERANCE,
    maxSlippage: TRADING_CONFIG.MAX_SLIPPAGE,
    supportedOrderTypes: ['market', 'limit', 'stop_loss', 'take_profit'],
  });
});

// Calculate trading fees
router.post('/calculate-fees', (req: Request, res: Response) => {
  try {
    const { amount, price, type } = req.body;
    const grossTotal = parseFloat(amount) * parseFloat(price);
    const tradingFee = calculateTradingFee(grossTotal);
    const netTotal = type === 'buy' ? grossTotal + tradingFee : grossTotal - tradingFee;

    res.json({
      grossTotal: grossTotal.toFixed(2),
      tradingFee: tradingFee.toFixed(2),
      netTotal: netTotal.toFixed(2),
      feeRate: TRADING_CONFIG.TRADING_FEE_RATE,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid calculation parameters" });
  }
});

// Advanced order types
const advancedOrderSchema = z.object({
  symbol: z.string(),
  type: z.enum(['limit', 'stop_loss', 'take_profit', 'trailing_stop']),
  side: z.enum(['buy', 'sell']),
  amount: z.number().min(0),
  triggerPrice: z.number().optional(),
  limitPrice: z.number().optional(),
  trailingAmount: z.number().optional(),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK']).default('GTC'),
  leverage: z.number().min(1).max(10).default(1)
});

// Create advanced order
router.post('/advanced-order', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orderData = advancedOrderSchema.parse(req.body);
    
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Create advanced order record
    const order = await storage.createAdvancedOrder({
      userId,
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    });

    res.json(order);
  } catch (error) {
    console.error("Create advanced order error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid order data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create advanced order" });
  }
});

// Get active advanced orders
router.get('/orders/active', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await storage.getActiveAdvancedOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Get active orders error:", error);
    res.status(500).json({ message: "Failed to fetch active orders" });
  }
});

// Cancel advanced order
router.delete('/orders/:orderId/cancel', requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;
    
    await storage.cancelAdvancedOrder(orderId, userId);
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

// Get order book
router.get('/orderbook/:symbol', requireAuth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    // Mock order book data - in production, this would come from exchange API
    const orderBook = {
      symbol: symbol.toUpperCase(),
      bids: [
        ['67500.00', '0.5'],
        ['67450.00', '1.2'],
        ['67400.00', '0.8'],
        ['67350.00', '2.1'],
        ['67300.00', '1.5']
      ],
      asks: [
        ['67550.00', '0.7'],
        ['67600.00', '1.1'],
        ['67650.00', '0.9'],
        ['67700.00', '1.8'],
        ['67750.00', '2.3']
      ]
    };
    
    res.json(orderBook);
  } catch (error) {
    console.error("Get order book error:", error);
    res.status(500).json({ message: "Failed to fetch order book" });
  }
});

// Get pending orders
router.get('/orders/pending', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId, 100);
    
    const pendingOrders = transactions.filter(t => t.status === 'pending');
    
    res.json(pendingOrders);
  } catch (error) {
    console.error("Get pending orders error:", error);
    res.status(500).json({ message: "Failed to fetch pending orders" });
  }
});

// Cancel pending order
router.delete('/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;
    
    // In a real implementation, you'd have a proper orders table
    // For now, we'll update the transaction status
    const success = await storage.updateTransactionStatus(parseInt(orderId), 'cancelled', userId);
    
    if (!success) {
      return res.status(404).json({ message: "Order not found or cannot be cancelled" });
    }
    
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

export default router;
