
import { Router } from 'express';
import { authenticateApiKey, checkApiRateLimit, requireApiPermission } from './api-middleware';
import { cryptoService } from './crypto-service';
import { storage } from './storage';

const router = Router();

// Apply API key authentication and rate limiting to all routes
router.use(authenticateApiKey);
router.use(checkApiRateLimit);

// Public market data endpoints
router.get('/v1/market-data', async (req, res) => {
  try {
    const marketData = await cryptoService.getMarketData();
    res.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market data API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: 'Internal server error'
    });
  }
});

router.get('/v1/price/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const priceData = await cryptoService.getPrice(symbol);
    
    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: 'Symbol not found',
        message: `Price data not available for ${symbol}`
      });
    }

    res.json({
      success: true,
      data: priceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Price API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price',
      message: 'Internal server error'
    });
  }
});

// Portfolio endpoints (require 'read' permission)
router.get('/v1/portfolio', requireApiPermission('read'), async (req, res) => {
  try {
    const userId = req.apiKey!.userId;
    const portfolio = await storage.getPortfolio(userId);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
        message: 'User portfolio not found'
      });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    const transactions = await storage.getTransactions(userId);

    res.json({
      success: true,
      data: {
        portfolio,
        holdings,
        recent_transactions: transactions.slice(0, 10)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Portfolio API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio',
      message: 'Internal server error'
    });
  }
});

// Trading endpoints (require 'trade' permission)
router.post('/v1/orders', requireApiPermission('trade'), async (req, res) => {
  try {
    const userId = req.apiKey!.userId;
    const { symbol, side, type, amount, price } = req.body;

    // Validate required fields
    if (!symbol || !side || !type || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'symbol, side, type, and amount are required',
        required: ['symbol', 'side', 'type', 'amount']
      });
    }

    // Create the order
    const order = await storage.createTransaction({
      userId,
      type: side,
      symbol: symbol.toUpperCase(),
      amount: amount.toString(),
      price: price?.toString() || '0',
      total: (parseFloat(amount) * (parseFloat(price) || 0)).toString(),
      status: 'completed'
    });

    res.json({
      success: true,
      data: {
        order_id: order.id,
        status: order.status,
        symbol: order.symbol,
        side: order.type,
        amount: order.amount,
        price: order.price,
        timestamp: order.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: 'Internal server error'
    });
  }
});

// Error handler
router.use((error: any, req: any, res: any, next: any) => {
  console.error('Public API error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

export default router;
