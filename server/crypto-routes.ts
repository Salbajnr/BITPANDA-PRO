
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



// Global market data endpoint
router.get('/global', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data.data);
  } catch (error) {
    console.error('Error fetching global market data:', error);
    
    // Return fallback data
    res.json({
      total_market_cap: { usd: 2800000000000 },
      total_volume: { usd: 95000000000 },
      market_cap_change_percentage_24h_usd: 1.8,
      active_cryptocurrencies: 13000,
      market_cap_percentage: {
        btc: 52.5,
        eth: 17.2
      }
    });
  }
});

// Trending cryptocurrencies endpoint
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching trending data:', error);
    
    // Return fallback trending data
    res.json({
      coins: [
        {
          item: {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            market_cap_rank: 1,
            small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
          }
        },
        {
          item: {
            id: 'ethereum',
            name: 'Ethereum', 
            symbol: 'eth',
            market_cap_rank: 2,
            small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
          }
        }
      ]
    });
  }
});



// Asset details endpoint
router.get('/asset/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const coinId = cryptoService.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
    
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const assetData = {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      current_price: data.market_data?.current_price?.usd || 0,
      price_change_24h: data.market_data?.price_change_24h || 0,
      price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
      market_cap: data.market_data?.market_cap?.usd || 0,
      total_volume: data.market_data?.total_volume?.usd || 0,
      high_24h: data.market_data?.high_24h?.usd || 0,
      low_24h: data.market_data?.low_24h?.usd || 0,
      ath: data.market_data?.ath?.usd || 0,
      ath_change_percentage: data.market_data?.ath_change_percentage?.usd || 0,
      market_cap_rank: data.market_cap_rank || 0,
      circulating_supply: data.market_data?.circulating_supply || 0,
      total_supply: data.market_data?.total_supply || 0,
      max_supply: data.market_data?.max_supply || 0,
      description: data.description?.en || '',
      image: data.image?.large || '',
    };
    
    res.json(assetData);
  } catch (error) {
    console.error('Error fetching asset details:', error);
    res.status(500).json({ error: 'Failed to fetch asset details' });
  }
});

// Price history endpoint
router.get('/price-history/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { period = '24h' } = req.query;
    
    const priceHistory = await cryptoService.getPriceHistory(symbol, period as string);
    res.json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});



// Top movers endpoint (gainers and losers)
router.get('/top-movers', async (req: Request, res: Response) => {
  try {
    const marketData = await cryptoService.getMarketData(undefined, 100);
    
    // Sort by 24h change and get top gainers and losers
    const sortedByChange = marketData.sort((a, b) => 
      Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
    );
    
    const topMovers = sortedByChange.slice(0, 10).map((crypto: any, index: number) => ({
      id: (index + 1).toString(),
      symbol: crypto.symbol,
      name: crypto.name,
      change: crypto.price_change_percentage_24h,
      price: `€${crypto.current_price.toLocaleString()}`,
      icon: crypto.symbol === 'BTC' ? '₿' : 
            crypto.symbol === 'ETH' ? 'Ξ' :
            crypto.symbol === 'SOL' ? '◎' :
            crypto.symbol === 'ADA' ? '₳' :
            crypto.symbol === 'DOT' ? '●' : '🔄'
    }));
    
    res.json(topMovers);
  } catch (error) {
    console.error('Error fetching top movers:', error);
    res.status(500).json({ error: 'Failed to fetch top movers' });
  }
});
