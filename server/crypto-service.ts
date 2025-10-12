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

interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  used: number;
  limit: number;
}

class CryptoService {
  private baseUrl = config.coinGeckoBaseUrl;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = config.cacheTimeout;
  private rateLimitDelay = 1100; // 1.1 second between requests for free tier
  private lastRequestTime = 0;
  private apiKey = config.coinGeckoApiKey;
  private rateLimitInfo: RateLimitInfo = {
    remaining: 100,
    resetTime: Date.now() + 60000,
    used: 0,
    limit: 100
  };
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  // Enhanced symbol mapping with more cryptocurrencies
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
    'XLM': 'stellar',
    'ATOM': 'cosmos',
    'NEAR': 'near',
    'MANA': 'decentraland',
    'SAND': 'the-sandbox',
    'APE': 'apecoin',
    'CRO': 'cronos',
    'LRC': 'loopring',
    'ENJ': 'enjincoin',
    'BAT': 'basic-attention-token',
    'ZEC': 'zcash'
  };

  private isValidCacheEntry(entry: { data: any; timestamp: number }): boolean {
    return Date.now() - entry.timestamp < this.cacheTimeout;
  }

  private updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining');
    const limit = headers.get('x-ratelimit-limit');
    const reset = headers.get('x-ratelimit-reset');

    if (remaining) this.rateLimitInfo.remaining = parseInt(remaining);
    if (limit) this.rateLimitInfo.limit = parseInt(limit);
    if (reset) this.rateLimitInfo.resetTime = parseInt(reset) * 1000;

    console.log(`🔄 Rate limit: ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit} remaining`);
  }

  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      if (this.rateLimitInfo.remaining <= 1) {
        const waitTime = Math.max(0, this.rateLimitInfo.resetTime - Date.now());
        console.log(`⏳ Rate limit reached, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      const request = this.requestQueue.shift();
      if (request) {
        await request();
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
      }
    }

    this.isProcessingQueue = false;
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        try {
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;

          if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
          }

          this.lastRequestTime = Date.now();

          const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': 'BitpandaPro/1.0 (Professional Trading Platform)'
          };

          if (this.apiKey) {
            headers['x-cg-pro-api-key'] = this.apiKey;
          }

          console.log(`🌐 Fetching: ${url}`);
          const response = await fetch(url, { headers });

          this.updateRateLimitInfo(response.headers);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };

      this.requestQueue.push(executeRequest);
      this.processRequestQueue();
    });
  }

  async getMarketData(symbols?: string[], limit: number = 50): Promise<any[]> {
    const cacheKey = `market-${symbols?.join(',') || 'all'}-${limit}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && this.isValidCacheEntry(cachedData)) {
      console.log(`📋 Cache hit for ${cacheKey}`);
      return cachedData.data;
    }

    try {
      let url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;

      if (symbols && symbols.length > 0) {
        const coinIds = symbols.map(s => this.CRYPTO_IDS[s.toUpperCase()] || s.toLowerCase()).join(',');
        url += `&ids=${coinIds}`;
      }

      const response = await this.rateLimitedFetch(url);

      if (response.status === 429) {
        console.warn('⚠️ Rate limited, using cached data or fallback');
        return this.getFallbackData(limit);
      }

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from CoinGecko');
      }

      const transformedData = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        fully_diluted_valuation: coin.fully_diluted_valuation,
        total_volume: coin.total_volume || 0,
        high_24h: coin.high_24h || coin.current_price,
        low_24h: coin.low_24h || coin.current_price,
        price_change_24h: coin.price_change_24h || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
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
      console.log(`✅ Fetched ${transformedData.length} cryptocurrencies`);
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching crypto market data:', error);
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
        `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`
      );

      if (response.status === 429) {
        console.warn(`⚠️ Rate limited for ${symbol}, using fallback`);
        return this.getFallbackPrice(symbol);
      }

      if (!response.ok) {
        console.error(`❌ CoinGecko API error for ${symbol}: ${response.status}`);
        return this.getFallbackPrice(symbol);
      }

      const data: CoinGeckoResponse = await response.json();
      const priceData = data[coinId];

      if (!priceData) {
        console.warn(`⚠️ No price data found for ${symbol}`);
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
      console.error(`❌ Error fetching price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  async getPrices(symbols: string[]): Promise<CryptoPrice[]> {
    const batchSize = 10; // Process in smaller batches to avoid rate limits
    const results: CryptoPrice[] = [];

    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => this.getPrice(symbol));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean) as CryptoPrice[]);

      // Small delay between batches
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }

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

      const coinId = this.CRYPTO_IDS[symbol.toUpperCase() as keyof typeof this.CRYPTO_IDS] || symbol.toLowerCase();
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
      );

      if (response.status === 429) {
        console.warn(`⚠️ Rate limited for ${symbol} history, using fallback`);
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
      console.error('❌ Error fetching price history:', error);
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
        console.warn('⚠️ Rate limited for trending, trying alternative source');
        // Try alternative: get top gainers from market data
        const marketData = await this.getMarketData(undefined, 50);
        const topGainers = marketData
          .filter(coin => coin.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, 7)
          .map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            market_cap_rank: coin.market_cap_rank,
            small: coin.image
          }));
        
        if (topGainers.length > 0) {
          this.cache.set(cacheKey, { data: topGainers, timestamp: Date.now() });
          return topGainers;
        }
        
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
      console.error('❌ Error fetching trending data:', error);
      return this.getFallbackTrendingData();
    }
  }

  // Fallback methods and utility functions
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

  private getFallbackData(limit: number): any[] {
    const fallbackCoins = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 45000, rank: 1 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2800, rank: 2 },
      { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 350, rank: 3 },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.5, rank: 4 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 100, rank: 5 },
      { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.6, rank: 6 },
      { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7, rank: 7 },
      { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, rank: 8 },
      { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', price: 25, rank: 9 },
      { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', price: 0.9, rank: 10 }
    ];

    return fallbackCoins.slice(0, limit).map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.price * (0.95 + Math.random() * 0.1),
      market_cap: coin.price * 21000000 * coin.rank,
      market_cap_rank: coin.rank,
      total_volume: Math.random() * 1000000000,
      price_change_percentage_24h: (Math.random() - 0.5) * 10,
      image: `https://assets.coingecko.com/coins/images/${coin.rank}/large/${coin.symbol.toLowerCase()}.png`,
      last_updated: new Date().toISOString()
    }));
  }

  private getFallbackPriceHistory(symbol: string): any[] {
    const basePrice = symbol === 'bitcoin' ? 45000 : symbol === 'ethereum' ? 2800 : 420;
    const data = [];

    for (let i = 23; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.05;
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
    console.log('🗑️ Cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getRateLimitInfo(): RateLimitInfo {
    return { ...this.rateLimitInfo };
  }
}

export const cryptoService = new CryptoService();
export type { CryptoPrice };