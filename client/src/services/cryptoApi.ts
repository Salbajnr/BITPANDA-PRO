const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

export class CryptoApiService {
  static async getTopCryptos(limit = 10): Promise<CryptoPrice[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Return fallback data
      return this.getFallbackCryptoData();
    }
  }

  static async getCryptoPrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`
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

  private static getFallbackCryptoData(): CryptoPrice[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 43256.78,
        price_change_percentage_24h: 2.34,
        market_cap: 850000000000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2543.12,
        price_change_percentage_24h: 1.89,
        market_cap: 300000000000,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        current_price: 0.5234,
        price_change_percentage_24h: -0.67,
        market_cap: 18000000000,
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
      },
    ];
  }
}
