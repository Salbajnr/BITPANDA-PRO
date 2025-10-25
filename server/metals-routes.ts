import { Router } from 'express';
import { metalsService } from './metals-service';

const router = Router();

// Market data endpoint for LiveTicker
router.get('/market-data', async (req, res) => {
  try {
    const metals = await metalsService.getMetalsPrices();
    res.json(metals);
  } catch (error) {
    console.error('Error fetching metals market data:', error);
    res.status(500).json({ message: 'Failed to fetch metals market data' });
  }
});

// Get single metal price
router.get('/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await metalsService.getPrice(symbol);
    
    if (!price) {
      return res.status(404).json({ 
        message: `Price data not found for ${symbol}` 
      });
    }
    
    res.json(price);
  } catch (error) {
    console.error('Error fetching metal price:', error);
    res.status(500).json({ 
      message: 'Failed to fetch metal price' 
    });
  }
});

// Get multiple metal prices
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ 
        message: 'Symbols must be an array' 
      });
    }
    
    const prices = await metalsService.getPrices(symbols);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    res.status(500).json({ 
      message: 'Failed to fetch metal prices' 
    });
  }
});

// Get top metals by market importance
router.get('/top/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    
    if (limit > 50) {
      return res.status(400).json({ 
        message: 'Limit cannot exceed 50' 
      });
    }
    
    const topMetals = await metalsService.getTopMetals(limit);
    res.json(topMetals);
  } catch (error) {
    console.error('Error fetching top metals:', error);
    res.status(500).json({ 
      message: 'Failed to fetch top metals' 
    });
  }
});

// Get comprehensive market data
router.get('/market-data', async (req, res) => {
  try {
    const marketData = await metalsService.getMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching metals market data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch market data' 
    });
  }
});

// Get price history for charting
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '24h' } = req.query;
    
    const validPeriods = ['24h', '7d', '30d', '1y'];
    if (!validPeriods.includes(period as string)) {
      return res.status(400).json({ 
        message: 'Invalid period. Use: 24h, 7d, 30d, 1y' 
      });
    }
    
    const history = await metalsService.getPriceHistory(symbol, period as string);
    res.json(history);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch price history' 
    });
  }
});

// Get cache statistics
router.get('/cache-stats', async (req, res) => {
  try {
    res.json({
      cacheSize: metalsService.getCacheSize(),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch cache statistics' 
    });
  }
});

// Clear cache (admin only - add auth middleware in production)
router.delete('/cache', async (req, res) => {
  try {
    metalsService.clearCache();
    res.json({ 
      message: 'Cache cleared successfully',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ 
      message: 'Failed to clear cache' 
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test with gold price
    const testPrice = await metalsService.getPrice('XAU');
    res.json({
      status: 'healthy',
      timestamp: Date.now(),
      service: 'metals-api',
      test_data: testPrice ? 'available' : 'fallback'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: Date.now(),
      service: 'metals-api',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;