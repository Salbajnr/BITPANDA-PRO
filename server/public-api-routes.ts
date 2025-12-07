
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

// Portfolio endpoints
router.get('/v1/portfolio', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const portfolio = await storage.getPortfolio(req.user.id);
    const holdings = await storage.getHoldings(portfolio?.id || '');

    res.json({
      success: true,
      data: {
        portfolio,
        holdings
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

// Trading endpoints
router.post('/v1/orders', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const { symbol, side, type, amount, price } = req.body;

    if (!symbol || !side || !type || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'symbol, side, type, and amount are required'
      });
    }

    const orderData = {
      userId: req.user.id,
      type: side as 'buy' | 'sell' | 'deposit' | 'withdrawal',
      symbol,
      assetType: 'crypto' as const,
      amount: amount.toString(),
      price: price ? price.toString() : '0',
      total: (parseFloat(amount) * (price || 0)).toString(),
      status: 'completed'
    };

    const order = await storage.createTransaction(orderData);

    res.json({
      success: true,
      data: order,
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

router.get('/v1/orders', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const orders = await storage.getUserTransactions(req.user.id);

    res.json({
      success: true,
      data: orders,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: 'Internal server error'
    });
  }
});

// Account balance endpoint
router.get('/v1/account/balance', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const portfolio = await storage.getPortfolio(req.user.id);

    res.json({
      success: true,
      data: {
        totalValue: portfolio?.totalValue || '0',
        availableCash: portfolio?.availableCash || '0',
        currency: 'USD'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Balance API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance',
      message: 'Internal server error'
    });
  }
});

// Metals endpoints
router.get('/v1/metals/price/:symbol', async (req, res) => {
  try {
    const { metalsService } = await import('./metals-service');
    const symbol = req.params.symbol.toUpperCase();
    const priceData = await metalsService.getPrice(symbol);
    
    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: 'Symbol not found',
        message: `Metal price data not available for ${symbol}`
      });
    }

    res.json({
      success: true,
      data: priceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Metal price API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metal price',
      message: 'Internal server error'
    });
  }
});

router.get('/v1/metals/top/:limit', async (req, res) => {
  try {
    const { metalsService } = await import('./metals-service');
    const limit = parseInt(req.params.limit || '10');
    const metals = await metalsService.getTopMetals(limit);

    res.json({
      success: true,
      data: metals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Top metals API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top metals',
      message: 'Internal server error'
    });
  }
});

router.get('/v1/metals/top', async (req, res) => {
  try {
    const { metalsService } = await import('./metals-service');
    const limit = 10;
    const metals = await metalsService.getTopMetals(limit);

    res.json({
      success: true,
      data: metals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Top metals API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top metals',
      message: 'Internal server error'
    });
  }
});

// News endpoints
router.get('/v1/news', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const articles = await storage.getNewsArticles(limit);

    res.json({
      success: true,
      data: articles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      message: 'Internal server error'
    });
  }
});

// Alerts endpoints
router.get('/v1/alerts', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const alerts = await storage.getUserAlerts(req.user.id);

    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Alerts API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
      message: 'Internal server error'
    });
  }
});

router.post('/v1/alerts', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide valid API credentials'
      });
    }

    const { symbol, type, value, message } = req.body;

    if (!symbol || !type || !value) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'symbol, type, and value are required'
      });
    }

    const alertData = {
      userId: req.user.id,
      symbol,
      alertType: type,
      targetPrice: value.toString(),
      isActive: true
    };

    const alert = await storage.createAlert(alertData);

    res.json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Create alert API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create alert',
      message: 'Internal server error'
    });
  }
});

// Portfolio endpoints (require 'read' permission)
router.get('/v1/portfolio/detail', requireApiPermission('read'), async (req, res) => {
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
    const transactions = await storage.getUserTransactions(userId);

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
      status: 'completed',
      assetType: 'crypto'
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
