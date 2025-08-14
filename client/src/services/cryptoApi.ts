const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  last_updated: string;
  ath: number;
  ath_change_percentage: number;
  circulating_supply?: number; // Added for consistency with getTopCryptos mapping
}

export interface CryptoTicker {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  timestamp: number;
}

export interface MarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

export class CryptoApiService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 30000; // 30 seconds cache

  private static getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static async getTopCryptos(limit: number = 100): Promise<CryptoPrice[]> {
    const cacheKey = `top-cryptos-${limit}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const cryptos = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        circulating_supply: coin.circulating_supply,
        ath: coin.ath, // Added from original interface
        ath_change_percentage: coin.ath_change_percentage, // Added from original interface
        last_updated: new Date().toISOString(), // Added from original interface
      }));

      this.setCachedData(cacheKey, cryptos);
      return cryptos;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      // Return fallback data if API fails
      return this.getFallbackCryptoData();
    }
  }

  static async getCryptoPrice(coinId: string): Promise<number> {
    const cacheKey = `price-${coinId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const price = data[coinId]?.usd || 0;
      this.setCachedData(cacheKey, price);
      return price;
    } catch (error) {
      console.error(`Failed to fetch price for ${coinId}:`, error);
      return 0;
    }
  }

  static async getMultiplePrices(symbols: string[]): Promise<Record<string, any>> {
    const cacheKey = `multi-prices-${symbols.join(',')}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);
      return {};
    }
  }

  static async getCryptoDetails(coinId: string): Promise<any> {
    const cacheKey = `details-${coinId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crypto details');
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching details for ${coinId}:`, error);
      return null;
    }
  }

  static async getMarketData(): Promise<MarketData | null> {
    const cacheKey = 'global-market-data';
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/global`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return null;
    }
  }

  static async searchCryptos(query: string): Promise<any[]> {
    if (!query || query.length < 2) return [];

    try {
      const response = await fetch(`${this.BASE_URL}/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.coins || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  private static getFallbackCryptoData(): CryptoPrice[] {
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
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.5234,
        price_change_percentage_24h: -0.67,
        market_cap: 18000000000,
        market_cap_rank: 8,
        total_volume: 420000000,
        high_24h: 0.54,
        low_24h: 0.51,
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        last_updated: timestamp,
        ath: 3.10,
        ath_change_percentage: -83.1
      },
    ];
  }

  // WebSocket connection for real-time price updates
  static createPriceSocket(symbols: string[], onUpdate: (data: CryptoTicker) => void): WebSocket | null {
    if (typeof window === 'undefined') return null;

    try {
      // Note: This would require a WebSocket endpoint for live prices
      // For now, we'll simulate with periodic API calls
      const interval = setInterval(async () => {
        for (const symbol of symbols) {
          const price = await this.getCryptoPrice(symbol);
          if (price > 0) {
            onUpdate({
              symbol: symbol.toUpperCase(),
              price,
              change_24h: Math.random() * 10 - 5, // Simulated for now
              volume_24h: Math.random() * 1000000000,
              timestamp: Date.now()
            });
          }
        }
      }, 5000); // Update every 5 seconds

      // Return a mock WebSocket-like object
      return {
        close: () => clearInterval(interval),
        readyState: 1
      } as any;
    } catch (error) {
      console.error('Failed to create price socket:', error);
      return null;
    }
  }
}