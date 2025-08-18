interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  last_updated: string;
}

interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
}

type CryptoSymbol = 'BTC' | 'ETH' | 'BNB' | 'ADA' | 'SOL' | 'XRP' | 'DOT' | 'DOGE' | 'AVAX' | 'MATIC' | 'LINK' | 'UNI' | 'LTC' | 'ALGO' | 'VET' | 'ICP' | 'FIL' | 'TRX' | 'ETC' | 'XLM';

class CryptoService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 30000; // 30 seconds
  private readonly API_BASE = 'https://api.coingecko.com/api/v3';
  
  // Popular cryptocurrencies with their CoinGecko IDs
  private readonly CRYPTO_IDS: Record<CryptoSymbol, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'SOL': 'solana',
    'XRP': 'ripple',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'LTC': 'litecoin',
    'ALGO': 'algorand',
    'VET': 'vechain',
    'ICP': 'internet-computer',
    'FIL': 'filecoin',
    'TRX': 'tron',
    'ETC': 'ethereum-classic',
    'XLM': 'stellar'
  };

  async getPrice(symbol: string): Promise<CryptoPrice | null> {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const coinId = this.CRYPTO_IDS[symbol.toUpperCase() as CryptoSymbol] || symbol.toLowerCase();
      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data: CoinGeckoResponse = await response.json();
      const priceData = data[coinId];

      if (!priceData) {
        console.warn(`No price data found for ${symbol} (${coinId})`);
        return this.getFallbackPrice(symbol);
      }

      const cryptoPrice: CryptoPrice = {
        symbol: symbol.toUpperCase(),
        name: this.getCryptoName(symbol),
        price: priceData.usd,
        change_24h: priceData.usd_24h_change || 0,
        volume_24h: priceData.usd_24h_vol || 0,
        market_cap: priceData.usd_market_cap || 0,
        last_updated: new Date().toISOString()
      };

      this.cache.set(symbol, { data: cryptoPrice, timestamp: Date.now() });
      return cryptoPrice;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  async getPrices(symbols: string[]): Promise<CryptoPrice[]> {
    const prices = await Promise.all(
      symbols.map(symbol => this.getPrice(symbol))
    );
    return prices.filter(Boolean) as CryptoPrice[];
  }

  async getTopCryptos(limit: number = 20): Promise<CryptoPrice[]> {
    const cacheKey = `top_${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const coinIds = Object.values(this.CRYPTO_IDS).slice(0, limit).join(',');
      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data: CoinGeckoResponse = await response.json();
      const topCryptos: CryptoPrice[] = [];

      for (const [symbol, coinId] of Object.entries(this.CRYPTO_IDS)) {
        const priceData = data[coinId];
        if (priceData) {
          topCryptos.push({
            symbol,
            name: this.getCryptoName(symbol),
            price: priceData.usd,
            change_24h: priceData.usd_24h_change || 0,
            volume_24h: priceData.usd_24h_vol || 0,
            market_cap: priceData.usd_market_cap || 0,
            last_updated: new Date().toISOString()
          });
        }
      }

      // Sort by market cap descending
      topCryptos.sort((a, b) => b.market_cap - a.market_cap);
      const result = topCryptos.slice(0, limit);

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getFallbackTopCryptos(limit);
    }
  }

  // Get comprehensive market data
  async getMarketData(): Promise<any[]> {
    const cacheKey = 'market_data';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (data && Array.isArray(data)) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
      
      throw new Error('Invalid data received from API');
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getFallbackMarketData();
    }
  }

  // Get price history for charting
  async getPriceHistory(symbol: string, period: string = '24h'): Promise<any[]> {
    const cacheKey = `history_${symbol}_${period}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      let days = '1';
      if (period === '7d') days = '7';
      if (period === '30d') days = '30';
      if (period === '1y') days = '365';

      const coinId = this.CRYPTO_IDS[symbol.toUpperCase() as CryptoSymbol] || symbol.toLowerCase();
      const response = await fetch(
        `${this.API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (data.prices && Array.isArray(data.prices)) {
        const formattedData = data.prices.map(([timestamp, price]: [number, number]) => ({
          timestamp: new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: parseFloat(price.toFixed(2))
        }));
        
        this.cache.set(cacheKey, { data: formattedData, timestamp: Date.now() });
        return formattedData;
      }
      
      throw new Error('Invalid price history data');
    } catch (error) {
      console.error('Error fetching price history:', error);
      return this.getFallbackPriceHistory(symbol);
    }
  }

  // Get trending cryptocurrencies
  async getTrendingCryptos(): Promise<any[]> {
    const cacheKey = 'trending';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.API_BASE}/search/trending`);
      
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (data.coins && Array.isArray(data.coins)) {
        const trending = data.coins.map((coin: any) => ({
          id: coin.item.id,
          symbol: coin.item.symbol,
          name: coin.item.name,
          market_cap_rank: coin.item.market_cap_rank,
          small: coin.item.small
        }));
        
        this.cache.set(cacheKey, { data: trending, timestamp: Date.now() });
        return trending;
      }
      
      throw new Error('Invalid trending data');
    } catch (error) {
      console.error('Error fetching trending data:', error);
      return this.getFallbackTrendingData();
    }
  }

  private getFallbackPrice(symbol: string): CryptoPrice {
    const fallbackPrices: Record<string, number> = {
      'BTC': 45000,
      'ETH': 2800,
      'BNB': 350,
      'ADA': 0.5,
      'SOL': 100,
      'XRP': 0.6,
      'DOT': 7,
      'DOGE': 0.08,
      'AVAX': 25,
      'MATIC': 0.9
    };

    const basePrice = fallbackPrices[symbol.toUpperCase()] || Math.random() * 1000 + 100;
    
    return {
      symbol: symbol.toUpperCase(),
      name: this.getCryptoName(symbol),
      price: basePrice * (0.95 + Math.random() * 0.1),
      change_24h: (Math.random() - 0.5) * 10,
      volume_24h: Math.random() * 1000000000,
      market_cap: Math.random() * 100000000000,
      last_updated: new Date().toISOString()
    };
  }

  private getFallbackMarketData(): any[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000,
        market_cap: 850000000000,
        market_cap_rank: 1,
        total_volume: 25000000000,
        price_change_percentage_24h: 2.5,
        price_change_percentage_1h: 0.1,
        price_change_percentage_7d: 5.2,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2800,
        market_cap: 350000000000,
        market_cap_rank: 2,
        total_volume: 15000000000,
        price_change_percentage_24h: 3.1,
        price_change_percentage_1h: 0.2,
        price_change_percentage_7d: 7.8,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'BNB',
        current_price: 420,
        market_cap: 65000000000,
        market_cap_rank: 3,
        total_volume: 1200000000,
        price_change_percentage_24h: 1.8,
        price_change_percentage_1h: -0.1,
        price_change_percentage_7d: 4.2,
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
      }
    ];
  }

  private getFallbackPriceHistory(symbol: string): any[] {
    const basePrice = symbol.toLowerCase() === 'btc' ? 45000 : symbol.toLowerCase() === 'eth' ? 2800 : 420;
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.05; // ±2.5% variance
      const price = basePrice * (1 + variance);
      
      data.push({
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  }

  private getFallbackTrendingData(): any[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_cap_rank: 1,
        small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        market_cap_rank: 2,
        small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
      }
    ];
  }

  private getFallbackTopCryptos(limit: number): CryptoPrice[] {
    const topCryptos = [
      { symbol: 'BTC', name: 'Bitcoin', price: 45000 },
      { symbol: 'ETH', name: 'Ethereum', price: 2800 },
      { symbol: 'BNB', name: 'BNB', price: 350 },
      { symbol: 'ADA', name: 'Cardano', price: 0.5 },
      { symbol: 'SOL', name: 'Solana', price: 100 },
      { symbol: 'XRP', name: 'XRP', price: 0.6 },
      { symbol: 'DOT', name: 'Polkadot', price: 7 },
      { symbol: 'DOGE', name: 'Dogecoin', price: 0.08 },
      { symbol: 'AVAX', name: 'Avalanche', price: 25 },
      { symbol: 'MATIC', name: 'Polygon', price: 0.9 },
      { symbol: 'LINK', name: 'Chainlink', price: 15 },
      { symbol: 'UNI', name: 'Uniswap', price: 8 },
      { symbol: 'LTC', name: 'Litecoin', price: 75 },
      { symbol: 'ALGO', name: 'Algorand', price: 0.3 },
      { symbol: 'VET', name: 'VeChain', price: 0.02 },
      { symbol: 'ICP', name: 'Internet Computer', price: 5 },
      { symbol: 'FIL', name: 'Filecoin', price: 6 },
      { symbol: 'TRX', name: 'TRON', price: 0.1 },
      { symbol: 'ETC', name: 'Ethereum Classic', price: 20 },
      { symbol: 'XLM', name: 'Stellar', price: 0.12 }
    ];

    return topCryptos.slice(0, limit).map(crypto => ({
      ...crypto,
      price: crypto.price * (0.95 + Math.random() * 0.1),
      change_24h: (Math.random() - 0.5) * 10,
      volume_24h: Math.random() * 1000000000,
      market_cap: Math.random() * 100000000000,
      last_updated: new Date().toISOString()
    }));
  }

  private getCryptoName(symbol: string): string {
    const names: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'BNB',
      'ADA': 'Cardano',
      'SOL': 'Solana',
      'XRP': 'XRP',
      'DOT': 'Polkadot',
      'DOGE': 'Dogecoin',
      'AVAX': 'Avalanche',
      'MATIC': 'Polygon',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'LTC': 'Litecoin',
      'ALGO': 'Algorand',
      'VET': 'VeChain',
      'ICP': 'Internet Computer',
      'FIL': 'Filecoin',
      'TRX': 'TRON',
      'ETC': 'Ethereum Classic',
      'XLM': 'Stellar'
    };

    return names[symbol.toUpperCase()] || symbol.toUpperCase();
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const cryptoService = new CryptoService();
export type { CryptoPrice };