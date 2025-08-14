import { Router } from 'express';
import { isAuthenticated, AuthenticatedRequest } from './auth';
import { z } from 'zod';
import { storage } from './storage';
// Import CryptoApiService logic directly since we can't import from client folder
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

class ServerCryptoApiService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 30000; // 30 seconds

  static async getTopCryptos(limit = 50): Promise<any[]> {
    const cacheKey = `top-cryptos-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      return this.getFallbackCryptoData();
    }
  }

  static async getCryptoPrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error(`Failed to fetch price for ${coinId}:`, error);
      return 0;
    }
  }

  private static getFallbackCryptoData(): any[] {
    const timestamp = new Date().toISOString();
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 43256.78,
        price_change_percentage_24h: 2.34,
        market_cap: 850000000000,
        market_cap_rank: 1,
        total_volume: 15000000000,
        high_24h: 44000,
        low_24h: 42000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        last_updated: timestamp,
        ath: 69000,
        ath_change_percentage: -37.3
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2543.12,
        price_change_percentage_24h: 1.89,
        market_cap: 300000000000,
        market_cap_rank: 2,
        total_volume: 8000000000,
        high_24h: 2600,
        low_24h: 2480,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        last_updated: timestamp,
        ath: 4878,
        ath_change_percentage: -47.9
      }
    ];
  }
}

const router = Router();

// Trading request schema
const tradeSchema = z.object({
  type: z.enum(['buy', 'sell']),
  symbol: z.string().min(1),
  name: z.string().min(1),
  amount: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Amount must be greater than 0"
  }),
  price: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Price must be greater than 0"
  }),
  orderType: z.enum(['market', 'limit'])
});

// Execute a trade
router.post('/execute', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const tradeData = tradeSchema.parse(req.body);
    const userId = req.user!.id;
    
    // Get user's portfolio
    let portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      // Create portfolio if it doesn't exist
      portfolio = await storage.createPortfolio(userId);
    }

    const amount = parseFloat(tradeData.amount);
    const price = parseFloat(tradeData.price);
    const total = amount * price;

    if (tradeData.type === 'buy') {
      // Check if user has sufficient balance
      if (parseFloat(portfolio.availableCash) < total) {
        return res.status(400).json({
          message: `Insufficient balance. You need $${total.toFixed(2)} but only have $${parseFloat(portfolio.availableCash).toFixed(2)}`
        });
      }

      // Update portfolio balance
      await storage.updatePortfolioBalance(userId, -total);

      // Add or update holding
      const existingHolding = await storage.getHolding(portfolio.id, tradeData.symbol);
      if (existingHolding) {
        // Update existing holding with weighted average price
        const currentValue = parseFloat(existingHolding.amount) * parseFloat(existingHolding.averagePurchasePrice);
        const newValue = amount * price;
        const totalAmount = parseFloat(existingHolding.amount) + amount;
        const newAveragePrice = (currentValue + newValue) / totalAmount;

        await storage.updateHolding(existingHolding.id, {
          amount: totalAmount.toString(),
          averagePurchasePrice: newAveragePrice.toString(),
          currentPrice: price.toString()
        });
      } else {
        // Create new holding
        await storage.createHolding({
          portfolioId: portfolio.id,
          symbol: tradeData.symbol,
          name: tradeData.name,
          amount: amount.toString(),
          averagePurchasePrice: price.toString(),
          currentPrice: price.toString()
        });
      }
    } else { // sell
      // Check if user has sufficient holdings
      const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
      if (!holding || parseFloat(holding.amount) < amount) {
        return res.status(400).json({
          message: `Insufficient ${tradeData.symbol.toUpperCase()} holdings. You need ${amount} but only have ${holding?.amount || 0}`
        });
      }

      // Update holding
      const remainingAmount = parseFloat(holding.amount) - amount;
      if (remainingAmount > 0) {
        await storage.updateHolding(holding.id, {
          amount: remainingAmount.toString(),
          currentPrice: price.toString()
        });
      } else {
        // Remove holding if amount becomes 0
        await storage.deleteHolding(holding.id);
      }

      // Update portfolio balance
      await storage.updatePortfolioBalance(userId, total);
    }

    // Record transaction
    await storage.createTransaction({
      userId,
      type: tradeData.type,
      symbol: tradeData.symbol,
      name: tradeData.name,
      amount: amount.toString(),
      price: price.toString(),
      total: total.toString(),
      status: 'completed'
    });

    // Get updated portfolio for response
    const updatedPortfolio = await storage.getPortfolio(userId);

    res.json({
      success: true,
      message: `Successfully ${tradeData.type === 'buy' ? 'bought' : 'sold'} ${amount} ${tradeData.symbol.toUpperCase()}`,
      trade: {
        type: tradeData.type,
        symbol: tradeData.symbol,
        name: tradeData.name,
        amount: amount.toString(),
        price: price.toString(),
        total: total.toString(),
        timestamp: new Date().toISOString()
      },
      portfolio: updatedPortfolio
    });

  } catch (error) {
    console.error('Trade execution error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid trade data',
        errors: error.errors
      });
    }

    res.status(500).json({
      message: 'Failed to execute trade',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get live crypto prices
router.get('/prices', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const cryptos = await ServerCryptoApiService.getTopCryptos(limit);
    
    res.json(cryptos);
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    res.status(500).json({
      message: 'Failed to fetch cryptocurrency prices',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific crypto price
router.get('/price/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const price = await ServerCryptoApiService.getCryptoPrice(coinId);
    
    res.json({ price });
  } catch (error) {
    console.error('Failed to fetch crypto price:', error);
    res.status(500).json({
      message: 'Failed to fetch cryptocurrency price',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get market data
router.get('/market-data', async (req, res) => {
  try {
    const marketData = null; // Market data endpoint temporarily disabled
    
    res.json(marketData);
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    res.status(500).json({
      message: 'Failed to fetch market data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;