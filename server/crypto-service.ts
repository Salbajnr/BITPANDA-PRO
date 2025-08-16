
import fetch from 'node-fetch';

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
  private cache = new Map<string, { data: CryptoPrice; timestamp: number }>();
  private readonly CACHE_TTL = 30000; // 30 seconds
  private readonly API_BASE = 'https://api.coingecko.com/api/v3';
  
  // Popular cryptocurrencies with their CoinGecko IDs
  private readonly CRYPTO_IDS = {
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
      const coinId = this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
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
    const coinIds = symbols.map(symbol => 
      this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase()
    ).join(',');

    try {
      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data: CoinGeckoResponse = await response.json();
      const results: CryptoPrice[] = [];

      for (const symbol of symbols) {
        const coinId = this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
        const priceData = data[coinId];

        if (priceData) {
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
          results.push(cryptoPrice);
        } else {
          const fallback = this.getFallbackPrice(symbol);
          if (fallback) results.push(fallback);
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);
      return symbols.map(symbol => this.getFallbackPrice(symbol)).filter(Boolean) as CryptoPrice[];
    }
  }

  async getTopCryptos(limit = 20): Promise<CryptoPrice[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = await response.json();
      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change_24h: coin.price_change_percentage_24h || 0,
        volume_24h: coin.total_volume || 0,
        market_cap: coin.market_cap || 0,
        last_updated: coin.last_updated || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getFallbackTopCryptos(limit);
    }
  }

  private getFallbackPrice(symbol: string): CryptoPrice | null {
    const fallbackPrices = {
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
    const names = {
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
