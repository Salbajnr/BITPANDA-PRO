
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { cryptoService } from './crypto-service';

const router = Router();

// Enhanced order schema with validation
const executeTradeSchema = z.object({
  symbol: z.string().min(1).max(10),
  type: z.enum(['buy', 'sell']),
  orderType: z.enum(['market', 'limit', 'stop_loss', 'take_profit']),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Amount must be a positive number" }),
  price: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Price must be a positive number" }),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
  slippage: z.string().optional(),
});

// Trading configuration with dynamic fee structure
const TRADING_CONFIG = {
  MIN_ORDER_AMOUNT: 1.0,
  MAX_ORDER_AMOUNT: 1000000,
  TRADING_FEE_RATE: 0.001, // 0.1%
  MAKER_FEE_RATE: 0.0008, // 0.08% for limit orders
  TAKER_FEE_RATE: 0.001, // 0.1% for market orders
  SLIPPAGE_TOLERANCE: 0.005,
  MAX_SLIPPAGE: 0.05,
  PRICE_PRECISION: 8,
  AMOUNT_PRECISION: 8,
};

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  timestamp: Date;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  lastUpdate: Date;
}

class TradingEngine {
  private orderBooks = new Map<string, OrderBook>();
  private pendingOrders = new Map<string, any>();

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const cached = this.orderBooks.get(symbol);
    if (cached && Date.now() - cached.lastUpdate.getTime() < 30000) {
      return cached;
    }

    // Generate realistic order book based on current price
    const price = await cryptoService.getPrice(symbol);
    if (!price) {
      throw new Error(`Unable to get price for ${symbol}`);
    }

    const currentPrice = price.price;
    const orderBook: OrderBook = {
      bids: [],
      asks: [],
      spread: 0,
      lastUpdate: new Date()
    };

    // Generate bids (buy orders) below current price
    for (let i = 0; i < 10; i++) {
      const priceLevel = currentPrice * (1 - (i + 1) * 0.001);
      const amount = Math.random() * 5 + 0.1;
      orderBook.bids.push({
        price: priceLevel,
        amount: amount,
        total: priceLevel * amount,
        timestamp: new Date()
      });
    }

    // Generate asks (sell orders) above current price
    for (let i = 0; i < 10; i++) {
      const priceLevel = currentPrice * (1 + (i + 1) * 0.001);
      const amount = Math.random() * 5 + 0.1;
      orderBook.asks.push({
        price: priceLevel,
        amount: amount,
        total: priceLevel * amount,
        timestamp: new Date()
      });
    }

    orderBook.spread = orderBook.asks[0].price - orderBook.bids[0].price;
    this.orderBooks.set(symbol, orderBook);
    
    return orderBook;
  }

  calculateSlippage(symbol: string, amount: number, side: 'buy' | 'sell'): number {
    // Simplified slippage calculation based on order size
    const baseSlippage = 0.001; // 0.1%
    const impactFactor = Math.min(amount / 100, 0.02); // Max 2% impact
    return baseSlippage + impactFactor;
  }

  async executeMarketOrder(symbol: string, amount: number, side: 'buy' | 'sell'): Promise<{
    executionPrice: number;
    slippage: number;
    executedAmount: number;
  }> {
    const orderBook = await this.getOrderBook(symbol);
    const slippage = this.calculateSlippage(symbol, amount, side);
    
    let executionPrice: number;
    
    if (side === 'buy') {
      // For buy orders, use ask price + slippage
      executionPrice = orderBook.asks[0].price * (1 + slippage);
    } else {
      // For sell orders, use bid price - slippage
      executionPrice = orderBook.bids[0].price * (1 - slippage);
    }

    return {
      executionPrice,
      slippage,
      executedAmount: amount
    };
  }

  async executeLimitOrder(symbol: string, amount: number, price: number, side: 'buy' | 'sell'): Promise<{
    status: 'filled' | 'partial' | 'pending';
    executedAmount: number;
    executionPrice: number;
  }> {
    const orderBook = await this.getOrderBook(symbol);
    
    // Simple limit order execution logic
    if (side === 'buy' && price >= orderBook.asks[0].price) {
      // Immediate fill if buy price meets or exceeds best ask
      return {
        status: 'filled',
        executedAmount: amount,
        executionPrice: orderBook.asks[0].price
      };
    } else if (side === 'sell' && price <= orderBook.bids[0].price) {
      // Immediate fill if sell price meets or is below best bid
      return {
        status: 'filled',
        executedAmount: amount,
        executionPrice: orderBook.bids[0].price
      };
    }

    // Order goes to pending if not immediately fillable
    return {
      status: 'pending',
      executedAmount: 0,
      executionPrice: price
    };
  }
}

const tradingEngine = new TradingEngine();

function calculateTradingFee(amount: number, feeRate: number): number {
  return amount * feeRate;
}

function validateOrderAmount(amount: number): { valid: boolean; message?: string } {
  if (amount < TRADING_CONFIG.MIN_ORDER_AMOUNT) {
    return { valid: false, message: `Minimum order amount is $${TRADING_CONFIG.MIN_ORDER_AMOUNT}` };
  }
  
  if (amount > TRADING_CONFIG.MAX_ORDER_AMOUNT) {
    return { valid: false, message: `Maximum order amount is $${TRADING_CONFIG.MAX_ORDER_AMOUNT.toLocaleString()}` };
  }
  
  return { valid: true };
}

function validateStopLoss(currentPrice: number, stopLoss: number, orderType: string, side: string): { valid: boolean; message?: string } {
  if (side === 'buy' && stopLoss >= currentPrice) {
    return { valid: false, message: 'Stop loss must be below current price for buy orders' };
  }
  
  if (side === 'sell' && stopLoss <= currentPrice) {
    return { valid: false, message: 'Stop loss must be above current price for sell orders' };
  }
  
  return { valid: true };
}

// Execute trade with enhanced validation and order management
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
    const requestedPrice = tradeData.price ? parseFloat(tradeData.price) : null;
    
    // Validate order amount
    const amountValidation = validateOrderAmount(amount);
    if (!amountValidation.valid) {
      return res.status(400).json({ message: amountValidation.message });
    }

    // Get current market price
    const marketPrice = await cryptoService.getPrice(tradeData.symbol);
    if (!marketPrice) {
      return res.status(400).json({ message: "Unable to get current market price" });
    }

    let executionResult;
    let feeRate = TRADING_CONFIG.TRADING_FEE_RATE;

    // Execute order based on type
    if (tradeData.orderType === 'market') {
      feeRate = TRADING_CONFIG.TAKER_FEE_RATE;
      executionResult = await tradingEngine.executeMarketOrder(
        tradeData.symbol,
        amount,
        tradeData.type
      );
    } else if (tradeData.orderType === 'limit' && requestedPrice) {
      feeRate = TRADING_CONFIG.MAKER_FEE_RATE;
      executionResult = await tradingEngine.executeLimitOrder(
        tradeData.symbol,
        amount,
        requestedPrice,
        tradeData.type
      );
    } else {
      return res.status(400).json({ message: "Invalid order type or missing price" });
    }

    const executionPrice = executionResult.executionPrice;
    const executedAmount = executionResult.executedAmount || amount;

    // Calculate fees and totals
    const grossTotal = executedAmount * executionPrice;
    const tradingFee = calculateTradingFee(grossTotal, feeRate);
    const netTotal = tradeData.type === 'buy' ? grossTotal + tradingFee : grossTotal - tradingFee;

    // Validate stop loss if provided
    if (tradeData.stopLoss) {
      const stopLossValidation = validateStopLoss(
        marketPrice.price,
        parseFloat(tradeData.stopLoss),
        tradeData.orderType,
        tradeData.type
      );
      if (!stopLossValidation.valid) {
        return res.status(400).json({ message: stopLossValidation.message });
      }
    }

    // Validate sufficient funds/holdings
    if (tradeData.type === 'buy') {
      const availableCash = parseFloat(portfolio.availableCash);
      
      if (netTotal > availableCash) {
        return res.status(400).json({ 
          message: `Insufficient funds. Required: $${netTotal.toFixed(2)}, Available: $${availableCash.toFixed(2)}` 
        });
      }
    } else {
      const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
      
      if (!holding) {
        return res.status(400).json({ message: "No holdings found for this asset" });
      }

      const currentAmount = parseFloat(holding.amount);
      if (executedAmount > currentAmount) {
        return res.status(400).json({ 
          message: `Insufficient holdings. Required: ${executedAmount}, Available: ${currentAmount}` 
        });
      }
    }

    // Create transaction record
    const transactionData = {
      userId: userId,
      symbol: tradeData.symbol,
      type: tradeData.type,
      amount: executedAmount.toString(),
      price: executionPrice.toString(),
      total: netTotal.toString(),
      fee: tradingFee.toString(),
      orderType: tradeData.orderType,
      status: executionResult.status === 'pending' ? 'pending' : 'completed',
      stopLoss: tradeData.stopLoss || null,
      takeProfit: tradeData.takeProfit || null,
      slippage: executionResult.slippage?.toString() || '0',
    };
    
    const transaction = await storage.createTransaction(transactionData);

    // Execute portfolio updates for completed orders
    if (transactionData.status === 'completed') {
      if (tradeData.type === 'buy') {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        
        if (existing) {
          const newAmount = parseFloat(existing.amount) + executedAmount;
          const newAverage = (
            parseFloat(existing.averagePurchasePrice) * parseFloat(existing.amount) + 
            executionPrice * executedAmount
          ) / newAmount;

          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: marketPrice.name,
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: executionPrice.toString(),
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: marketPrice.name,
            amount: executedAmount.toString(),
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
        const newAmount = parseFloat(holding!.amount) - executedAmount;
        
        if (newAmount <= 0.00000001) { // Account for floating point precision
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
      executionPrice: executionPrice.toFixed(TRADING_CONFIG.PRICE_PRECISION),
      tradingFee: tradingFee.toFixed(8),
      netTotal: netTotal.toFixed(2),
      slippageApplied: executionResult.slippage?.toFixed(6) || '0',
      executedAmount: executedAmount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION),
      orderStatus: executionResult.status || 'completed'
    });

  } catch (error) {
    console.error("Execute trade error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid trade data", 
        errors: error.issues.map(e => e.message)
      });
    }
    
    res.status(500).json({ message: "Failed to execute trade" });
  }
});

// Get order book for a symbol
router.get('/orderbook/:symbol', requireAuth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const orderBook = await tradingEngine.getOrderBook(symbol.toUpperCase());
    
    res.json({
      symbol: symbol.toUpperCase(),
      bids: orderBook.bids.slice(0, 10).map(bid => [
        bid.price.toFixed(TRADING_CONFIG.PRICE_PRECISION),
        bid.amount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION)
      ]),
      asks: orderBook.asks.slice(0, 10).map(ask => [
        ask.price.toFixed(TRADING_CONFIG.PRICE_PRECISION),
        ask.amount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION)
      ]),
      spread: orderBook.spread.toFixed(TRADING_CONFIG.PRICE_PRECISION),
      lastUpdate: orderBook.lastUpdate
    });
  } catch (error) {
    console.error("Get order book error:", error);
    res.status(500).json({ message: "Failed to fetch order book" });
  }
});

// Enhanced trading history with filtering
router.get('/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const symbol = req.query.symbol as string;
    const type = req.query.type as string;
    const status = req.query.status as string;
    
    const transactions = await storage.getUserTransactions(userId, limit);
    
    let filteredTransactions = transactions;
    
    if (symbol) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.symbol.toUpperCase() === symbol.toUpperCase()
      );
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }
    
    res.json(filteredTransactions);
  } catch (error) {
    console.error("Get trading history error:", error);
    res.status(500).json({ message: "Failed to fetch trading history" });
  }
});

// Get trading statistics
router.get('/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId, 1000);
    
    const stats = {
      totalTrades: transactions.length,
      totalVolume: transactions.reduce((sum, t) => sum + parseFloat(t.total), 0),
      totalFees: transactions.reduce((sum, t) => sum + parseFloat(t.fee || '0'), 0),
      successRate: transactions.filter(t => t.status === 'completed').length / transactions.length * 100,
      averageTradeSize: transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + parseFloat(t.total), 0) / transactions.length : 0,
      favoriteAssets: transactions.reduce((acc: Record<string, number>, t) => {
        acc[t.symbol] = (acc[t.symbol] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json(stats);
  } catch (error) {
    console.error("Get trading stats error:", error);
    res.status(500).json({ message: "Failed to fetch trading statistics" });
  }
});

// Calculate trading fees endpoint
router.post('/calculate-fees', requireAuth, (req: Request, res: Response) => {
  try {
    const { amount, price, type, orderType } = req.body;
    const grossTotal = parseFloat(amount) * parseFloat(price);
    
    // Determine fee rate based on order type
    let feeRate = TRADING_CONFIG.TRADING_FEE_RATE;
    if (orderType === 'market') {
      feeRate = TRADING_CONFIG.TAKER_FEE_RATE;
    } else if (orderType === 'limit') {
      feeRate = TRADING_CONFIG.MAKER_FEE_RATE;
    }
    
    const tradingFee = calculateTradingFee(grossTotal, feeRate);
    const netTotal = type === 'buy' ? grossTotal + tradingFee : grossTotal - tradingFee;

    res.json({
      grossTotal: grossTotal.toFixed(2),
      tradingFee: tradingFee.toFixed(8),
      netTotal: netTotal.toFixed(2),
      feeRate: feeRate,
      feeType: orderType === 'market' ? 'taker' : 'maker'
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid calculation parameters" });
  }
});

// Get trading configuration
router.get('/config', (req: Request, res: Response) => {
  res.json({
    ...TRADING_CONFIG,
    supportedOrderTypes: ['market', 'limit', 'stop_loss', 'take_profit'],
    supportedAssets: Object.keys(tradingEngine),
  });
});

export default router;
