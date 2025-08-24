
import { Router } from 'express';
import { cryptoService } from './crypto-service';
import { z } from 'zod';

const router = Router();

// Get top cryptocurrencies
router.get('/top/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit || '50');
    const data = await cryptoService.getMarketData(undefined, limit);
    res.json(data);
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    res.status(500).json({ message: 'Failed to fetch top cryptocurrencies' });
  }
});

// Get single crypto price
router.get('/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await cryptoService.getPrice(symbol);
    
    if (!price) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }
    
    res.json(price);
  } catch (error) {
    console.error(`Error fetching price for ${req.params.symbol}:`, error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrency price' });
  }
});

// Get multiple crypto prices
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Symbols must be an array' });
    }
    
    const prices = await cryptoService.getPrices(symbols);
    const pricesMap: Record<string, any> = {};
    
    prices.forEach(price => {
      if (price) {
        pricesMap[price.symbol.toLowerCase()] = {
          usd: price.price,
          usd_24h_change: price.change_24h,
          usd_24h_vol: price.volume_24h,
          usd_market_cap: price.market_cap,
          usd_24h_high: price.price * 1.05,
          usd_24h_low: price.price * 0.95
        };
      }
    });
    
    res.json(pricesMap);
  } catch (error) {
    console.error('Error fetching multiple prices:', error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrency prices' });
  }
});

// Get crypto details
router.get('/details/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    
    // For now, return basic details from price data
    const price = await cryptoService.getPrice(coinId);
    
    if (!price) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }
    
    const details = {
      id: coinId.toLowerCase(),
      symbol: price.symbol,
      name: price.name,
      market_data: {
        current_price: { usd: price.price },
        price_change_percentage_24h: price.change_24h,
        market_cap: { usd: price.market_cap },
        total_volume: { usd: price.volume_24h }
      },
      description: {
        en: `${price.name} is a cryptocurrency with symbol ${price.symbol}.`
      },
      links: {
        homepage: ['#'],
        blockchain_site: ['#']
      }
    };
    
    res.json(details);
  } catch (error) {
    console.error(`Error fetching details for ${req.params.coinId}:`, error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrency details' });
  }
});

// Get market data overview
router.get('/market-data', async (req, res) => {
  try {
    // Get top cryptos to calculate market stats
    const topCryptos = await cryptoService.getMarketData(undefined, 100);
    
    const totalMarketCap = topCryptos.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
    const totalVolume = topCryptos.reduce((sum, crypto) => sum + (crypto.total_volume || 0), 0);
    
    const marketData = {
      total_market_cap: { usd: totalMarketCap },
      total_volume: { usd: totalVolume },
      market_cap_percentage: {
        btc: topCryptos.find(c => c.symbol === 'btc')?.market_cap / totalMarketCap * 100 || 0,
        eth: topCryptos.find(c => c.symbol === 'eth')?.market_cap / totalMarketCap * 100 || 0
      },
      market_cap_change_percentage_24h_usd: 2.34 // Mock value
    };
    
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
});

// Search cryptocurrencies
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    // Get all cryptos and filter by query
    const allCryptos = await cryptoService.getMarketData(undefined, 100);
    
    const searchResults = allCryptos
      .filter(crypto => 
        crypto.name.toLowerCase().includes(query.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 20)
      .map(crypto => ({
        id: crypto.id || crypto.symbol.toLowerCase(),
        name: crypto.name,
        symbol: crypto.symbol,
        market_cap_rank: crypto.market_cap_rank,
        thumb: crypto.image || `https://assets.coingecko.com/coins/images/1/thumb/${crypto.symbol.toLowerCase()}.png`
      }));
    
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    res.status(500).json({ message: 'Failed to search cryptocurrencies' });
  }
});

// Get price history
router.get('/history/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { period = '24h' } = req.query;
    
    const history = await cryptoService.getPriceHistory(coinId, period as string);
    res.json(history);
  } catch (error) {
    console.error(`Error fetching price history for ${req.params.coinId}:`, error);
    res.status(500).json({ message: 'Failed to fetch price history' });
  }
});

// Get trending cryptocurrencies
router.get('/trending', async (req, res) => {
  try {
    const trending = await cryptoService.getTrendingCryptos();
    res.json(trending);
  } catch (error) {
    console.error('Error fetching trending cryptocurrencies:', error);
    res.status(500).json({ message: 'Failed to fetch trending cryptocurrencies' });
  }
});

export default router;
