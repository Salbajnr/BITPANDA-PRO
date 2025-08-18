
import { Router } from 'express';
import { cryptoService } from './crypto-service';

const router = Router();

// Get single cryptocurrency price
router.get('/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await cryptoService.getPrice(symbol);
    
    if (!price) {
      return res.status(404).json({ 
        message: `Price not found for ${symbol}` 
      });
    }

    res.json(price);
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    res.status(500).json({ 
      message: 'Failed to fetch price data' 
    });
  }
});

// Get multiple cryptocurrency prices
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ 
        message: 'symbols array is required' 
      });
    }

    if (symbols.length > 50) {
      return res.status(400).json({ 
        message: 'Maximum 50 symbols allowed per request' 
      });
    }

    const prices = await cryptoService.getPrices(symbols);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    res.status(500).json({ 
      message: 'Failed to fetch prices data' 
    });
  }
});

// Get top cryptocurrencies by market cap
router.get('/top/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit || '20');
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ 
        message: 'Limit must be between 1 and 100' 
      });
    }

    const topCryptos = await cryptoService.getTopCryptos(limit);
    res.json(topCryptos);
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    res.status(500).json({ 
      message: 'Failed to fetch top cryptocurrencies' 
    });
  }
});

// Get market data for all cryptocurrencies
router.get('/markets', async (req, res) => {
  try {
    const marketData = await cryptoService.getMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch market data' 
    });
  }
});

// Get price history for a specific cryptocurrency
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '24h' } = req.query;
    
    const history = await cryptoService.getPriceHistory(symbol, period as string);
    res.json(history);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch price history' 
    });
  }
});

// Get trending cryptocurrencies
router.get('/trending', async (req, res) => {
  try {
    const trending = await cryptoService.getTrendingCryptos();
    res.json(trending);
  } catch (error) {
    console.error('Error fetching trending data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch trending cryptocurrencies' 
    });
  }
});

// Get market overview
router.get('/market-overview', async (req, res) => {
  try {
    const topCryptos = await cryptoService.getTopCryptos(10);
    
    // Calculate market statistics
    const totalMarketCap = topCryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0);
    const totalVolume = topCryptos.reduce((sum, crypto) => sum + crypto.volume_24h, 0);
    const avgChange = topCryptos.reduce((sum, crypto) => sum + crypto.change_24h, 0) / topCryptos.length;
    
    const gainers = topCryptos
      .filter(crypto => crypto.change_24h > 0)
      .sort((a, b) => b.change_24h - a.change_24h)
      .slice(0, 3);
    
    const losers = topCryptos
      .filter(crypto => crypto.change_24h < 0)
      .sort((a, b) => a.change_24h - b.change_24h)
      .slice(0, 3);

    res.json({
      marketStats: {
        totalMarketCap,
        totalVolume,
        averageChange: avgChange,
        activeCryptos: topCryptos.length
      },
      topGainers: gainers,
      topLosers: losers,
      topCryptos: topCryptos.slice(0, 5),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({ 
      message: 'Failed to fetch market overview' 
    });
  }
});

// Get cache statistics
router.get('/cache-stats', async (req, res) => {
  try {
    res.json({
      cacheSize: cryptoService.getCacheSize(),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch cache statistics' 
    });
  }
});

// Clear price cache (admin only)
router.post('/clear-cache', async (req, res) => {
  try {
    cryptoService.clearCache();
    res.json({ 
      message: 'Price cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ 
      message: 'Failed to clear cache' 
    });
  }
});

// Get supported cryptocurrencies
router.get('/supported', async (req, res) => {
  try {
    const supported = [
      { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
      { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
      { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
      { symbol: 'ADA', name: 'Cardano', id: 'cardano' },
      { symbol: 'SOL', name: 'Solana', id: 'solana' },
      { symbol: 'XRP', name: 'XRP', id: 'ripple' },
      { symbol: 'DOT', name: 'Polkadot', id: 'polkadot' },
      { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin' },
      { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
      { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
      { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
      { symbol: 'UNI', name: 'Uniswap', id: 'uniswap' },
      { symbol: 'LTC', name: 'Litecoin', id: 'litecoin' },
      { symbol: 'ALGO', name: 'Algorand', id: 'algorand' },
      { symbol: 'VET', name: 'VeChain', id: 'vechain' },
      { symbol: 'ICP', name: 'Internet Computer', id: 'internet-computer' },
      { symbol: 'FIL', name: 'Filecoin', id: 'filecoin' },
      { symbol: 'TRX', name: 'TRON', id: 'tron' },
      { symbol: 'ETC', name: 'Ethereum Classic', id: 'ethereum-classic' },
      { symbol: 'XLM', name: 'Stellar', id: 'stellar' }
    ];

    res.json(supported);
  } catch (error) {
    console.error('Error fetching supported cryptos:', error);
    res.status(500).json({ 
      message: 'Failed to fetch supported cryptocurrencies' 
    });
  }
});

export default router;
