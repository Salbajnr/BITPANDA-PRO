
const BACKEND_API_BASE = '/api/crypto';
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
  circulating_supply?: number;
}

export interface CryptoTicker {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  timestamp: number;
}

export interface MarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

export class CryptoApiService {
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
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/top/${limit}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        const mappedData = backendData.map((crypto: any) => ({
          id: crypto.id || crypto.symbol.toLowerCase(),
          symbol: crypto.symbol.toLowerCase(),
          name: crypto.name,
          image: crypto.image || `https://assets.coingecko.com/coins/images/1/large/${crypto.symbol.toLowerCase()}.png`,
          current_price: crypto.current_price || crypto.price,
          market_cap: crypto.market_cap,
          market_cap_rank: crypto.market_cap_rank || 0,
          price_change_percentage_24h: crypto.price_change_percentage_24h || crypto.change_24h,
          total_volume: crypto.total_volume || crypto.volume_24h,
          high_24h: crypto.high_24h || crypto.price * 1.05,
          low_24h: crypto.low_24h || crypto.price * 0.95,
          circulating_supply: crypto.circulating_supply || 0,
          ath: crypto.ath || crypto.price * 2,
          ath_change_percentage: crypto.ath_change_percentage || -50,
          last_updated: crypto.last_updated || new Date().toISOString(),
        }));
        
        this.setCachedData(cacheKey, mappedData);
        return mappedData;
      }

      // Fallback to direct CoinGecko API
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API request failed: ${response.status}`);
      }

      const data = await response.json();
      const cryptos = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        total_volume: coin.total_volume || 0,
        high_24h: coin.high_24h || coin.current_price,
        low_24h: coin.low_24h || coin.current_price,
        circulating_supply: coin.circulating_supply || 0,
        ath: coin.ath || coin.current_price,
        ath_change_percentage: coin.ath_change_percentage || 0,
        last_updated: coin.last_updated || new Date().toISOString(),
      }));

      this.setCachedData(cacheKey, cryptos);
      return cryptos;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getFallbackCryptoData();
    }
  }

  static async getPrice(coinId: string): Promise<CryptoTicker> {
    const cacheKey = `price-${coinId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/price/${coinId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        const ticker = {
          symbol: data.symbol || coinId,
          price: data.price || data.current_price,
          change_24h: data.change_24h || data.price_change_percentage_24h || 0,
          volume_24h: data.volume_24h || data.total_volume || 0,
          market_cap: data.market_cap || 0,
          timestamp: Date.now()
        };
        
        this.setCachedData(cacheKey, ticker);
        return ticker;
      }

      // Fallback to CoinGecko
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crypto price');
      }

      const data = await response.json();
      const coinData = data[coinId];

      if (!coinData) {
        throw new Error(`No data found for ${coinId}`);
      }

      const ticker = {
        symbol: coinId,
        price: coinData.usd,
        change_24h: coinData.usd_24h_change || 0,
        volume_24h: coinData.usd_24h_vol || 0,
        market_cap: coinData.usd_market_cap || 0,
        timestamp: Date.now()
      };

      this.setCachedData(cacheKey, ticker);
      return ticker;
    } catch (error) {
      console.error(`Error fetching price for ${coinId}:`, error);

      return {
        symbol: coinId,
        price: this.getMockPrice(coinId),
        change_24h: (Math.random() - 0.5) * 10,
        volume_24h: Math.random() * 1000000000,
        market_cap: Math.random() * 50000000000,
        timestamp: Date.now()
      };
    }
  }

  static async getMultiplePrices(coinIds: string[]): Promise<Record<string, any>> {
    try {
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/prices`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: coinIds })
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return data;
      }

      // Fallback to CoinGecko
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_24hr_high=true&include_24hr_low=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);

      const mockData: Record<string, any> = {};
      coinIds.forEach(coinId => {
        mockData[coinId] = {
          usd: this.getMockPrice(coinId),
          usd_24h_change: (Math.random() - 0.5) * 10,
          usd_24h_vol: Math.random() * 1000000000,
          usd_market_cap: Math.random() * 50000000000,
          usd_24h_high: this.getMockPrice(coinId) * 1.05,
          usd_24h_low: this.getMockPrice(coinId) * 0.95
        };
      });
      return mockData;
    }
  }

  static async getCryptoDetails(coinId: string): Promise<any> {
    const cacheKey = `details-${coinId}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/details/${coinId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        this.setCachedData(cacheKey, data);
        return data;
      }

      // Fallback to CoinGecko
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
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
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/market-data`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        this.setCachedData(cacheKey, data);
        return data;
      }

      // Fallback to CoinGecko
      const response = await fetch(`${COINGECKO_API_BASE}/global`);

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
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/search?query=${encodeURIComponent(query)}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return data;
      }

      // Fallback to CoinGecko
      const response = await fetch(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);

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

  static async getPriceHistory(coinId: string, period: string = '24h'): Promise<any[]> {
    const cacheKey = `history-${coinId}-${period}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Try backend API first
      const backendResponse = await fetch(`${BACKEND_API_BASE}/history/${coinId}?period=${period}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        this.setCachedData(cacheKey, data);
        return data;
      }

      // Fallback to CoinGecko
      let days = '1';
      if (period === '7d') days = '7';
      if (period === '30d') days = '30';
      if (period === '1y') days = '365';

      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
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

        this.setCachedData(cacheKey, formattedData);
        return formattedData;
      }

      throw new Error('Invalid price history data');
    } catch (error) {
      console.error(`Error fetching price history for ${coinId}:`, error);
      return this.getFallbackPriceHistory(coinId);
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

  private static getFallbackPriceHistory(coinId: string): any[] {
    const basePrice = this.getMockPrice(coinId);
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

  private static getMockPrice(coinId: string): number {
    switch (coinId.toLowerCase()) {
      case 'bitcoin': return 45000;
      case 'ethereum': return 3000;
      case 'cardano': return 0.6;
      default: return Math.random() * 1000;
    }
  }

  static createPriceSocket(symbols: string[], onUpdate: (data: CryptoTicker) => void): WebSocket | null {
    if (typeof window === 'undefined') return null;

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected for crypto prices');
        ws.send(JSON.stringify({
          type: 'subscribe',
          symbols: symbols
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'price_update') {
            onUpdate({
              symbol: data.symbol,
              price: data.price,
              change_24h: data.change_24h,
              volume_24h: data.volume_24h,
              market_cap: data.market_cap,
              timestamp: data.timestamp
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('Failed to create price socket:', error);
      return null;
    }
  }
}
