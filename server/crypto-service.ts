import config from './config';

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

class CryptoService {
  private baseUrl = config.coinGeckoBaseUrl;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = config.cacheTimeout;
  private rateLimitDelay = 1100; // 1.1 second between requests for free tier
  private lastRequestTime = 0;
  private apiKey = config.coinGeckoApiKey;

  // Map symbols to CoinGecko IDs
  private CRYPTO_IDS: Record<string, string> = {
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

  private isValidCacheEntry(entry: { data: any; timestamp: number }): boolean {
    return Date.now() - entry.timestamp < this.cacheTimeout;
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'BitpandaPro/1.0'
    };
    
    // Add API key if available (Pro tier)
    if (this.apiKey) {
      headers['x-cg-pro-api-key'] = this.apiKey;
    }
    
    return fetch(url, { headers });
  }

  async getMarketData(symbols?: string[], limit: number = 50): Promise<any[]> {
    const cacheKey = `market-${symbols?.join(',') || 'all'}-${limit}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && this.isValidCacheEntry(cachedData)) {
      return cachedData.data;
    }

    try {
      let url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;

      if (symbols && symbols.length > 0) {
        const coinIds = symbols.map(s => s.toLowerCase()).join(',');
        url += `&ids=${coinIds}`;
      }

      const response = await this.rateLimitedFetch(url);

      if (response.status === 429) {
        console.warn('Rate limited by CoinGecko, using cached data or fallback');
        return this.getFallbackData(limit);
      }

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Transform data to match our expected format
      const transformedData = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        fully_diluted_valuation: coin.fully_diluted_valuation,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
        market_cap_change_24h: coin.market_cap_change_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        roi: coin.roi,
        last_updated: coin.last_updated,
        image: coin.image
      }));

      this.cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
      return transformedData;
    } catch (error) {
      console.error('Error fetching crypto market data:', error);

      // Return fallback data if API fails
      return this.getFallbackData(limit);
    }
  }

  async getPrice(symbol: string): Promise<CryptoPrice | null> {
    const cacheKey = `price_${symbol.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCacheEntry(cached)) {
      return cached.data;
    }

    try {
      const coinId = this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (response.status === 429) {
        console.warn(`Rate limited for ${symbol}, using cached data or fallback`);
        const fallback = this.getFallbackPrice(symbol);
        return fallback;
      }

      if (!response.ok) {
        console.error(`CoinGecko API error for ${symbol}: ${response.status} ${response.statusText}`);
        return this.getFallbackPrice(symbol);
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

      this.cache.set(cacheKey, { data: cryptoPrice, timestamp: Date.now() });
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
    if (cached && this.isValidCacheEntry(cached)) {
      return cached.data;
    }

    try {
      // Use the markets endpoint for better data
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (response.status === 429) {
        console.warn('Rate limited fetching top cryptos, using fallback');
        return this.getFallbackTopCryptos(limit);
      }

      if (!response.ok) {
        console.error(`CoinGecko markets API error: ${response.status} ${response.statusText}`);
        return this.getFallbackTopCryptos(limit);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format from markets API');
        return this.getFallbackTopCryptos(limit);
      }

      const topCryptos: CryptoPrice[] = data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        change_24h: coin.price_change_percentage_24h || 0,
        volume_24h: coin.total_volume || 0,
        market_cap: coin.market_cap || 0,
        last_updated: new Date().toISOString()
      }));

      this.cache.set(cacheKey, { data: topCryptos, timestamp: Date.now() });
      return topCryptos;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getFallbackTopCryptos(limit);
    }
  }

  // Get comprehensive market data
  // async getMarketData(): Promise<any[]> { // This method is now integrated above
  //   const cacheKey = 'market_data';
  //   const cached = this.cache.get(cacheKey);
  //   if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
  //     return cached.data;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
  //     );

  //     if (!response.ok) {
  //       throw new Error(`API responded with ${response.status}`);
  //     }

  //     const data = await response.json();
  //     if (data && Array.isArray(data)) {
  //       this.cache.set(cacheKey, { data, timestamp: Date.now() });
  //       return data;
  //     }

  //     throw new Error('Invalid data received from API');
  //   } catch (error) {
  //     console.error('Error fetching market data:', error);
  //     return this.getFallbackMarketData();
  //   }
  // }

  // Get price history for charting
  async getPriceHistory(symbol: string, period: string = '24h'): Promise<any[]> {
    const cacheKey = `history_${symbol}_${period}`;
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCacheEntry(cached)) {
      return cached.data;
    }

    try {
      let days = '1';
      if (period === '7d') days = '7';
      if (period === '30d') days = '30';
      if (period === '1y') days = '365';

      const coinId = this.CRYPTO_IDS[symbol.toUpperCase() as CryptoSymbol] || symbol.toLowerCase();
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
      );

      if (response.status === 429) {
        console.warn(`Rate limited for ${symbol} history, using fallback`);
        return this.getFallbackPriceHistory(symbol);
      }

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
    if (cached && this.isValidCacheEntry(cached)) {
      return cached.data;
    }

    try {
      const response = await this.rateLimitedFetch(`${this.baseUrl}/search/trending`);

      if (response.status === 429) {
        console.warn('Rate limited for trending, using fallback');
        return this.getFallbackTrendingData();
      }

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

  private getFallbackData(limit: number): any[] {
    // This fallback should mirror the structure of getMarketData
    console.log(`Using fallback data for limit: ${limit}`);
    // Return a subset of getFallbackMarketData if limit is smaller, or mock data
    const mockData = this.getFallbackMarketData();
    return mockData.slice(0, limit);
  }
}

export const cryptoService = new CryptoService();
export type { CryptoPrice };