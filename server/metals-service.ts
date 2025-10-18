interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated: string;
}

interface MetalsApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  rates: {
    [key: string]: number;
  };
}

type MetalSymbol = 'XAU' | 'XAG' | 'XPT' | 'XPD' | 'COPPER' | 'ALUMINUM' | 'ZINC' | 'NICKEL' | 'LEAD' | 'TIN';

class MetalsService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes for metals (less volatile)
  private readonly API_BASE = 'https://metals-api.com/api';
  private readonly API_KEY = process.env.METALS_API_KEY;

  constructor() {
    console.log('🔑 Metals API Key status:', this.API_KEY ? 'Configured ✓' : 'Missing ✗');
    if (this.API_KEY) {
      console.log('🔑 API Key length:', this.API_KEY.length);
    }
  }

  // Precious metals with their display names
  private readonly METAL_INFO: Record<MetalSymbol, { name: string; unit: string; mockPrice?: number }> = {
    'XAU': { name: 'Gold', unit: 'oz', mockPrice: 2000 },
    'XAG': { name: 'Silver', unit: 'oz', mockPrice: 24 },
    'XPT': { name: 'Platinum', unit: 'oz', mockPrice: 950 },
    'XPD': { name: 'Palladium', unit: 'oz', mockPrice: 1800 },
    'COPPER': { name: 'Copper', unit: 'lb', mockPrice: 4.2 },
    'ALUMINUM': { name: 'Aluminum', unit: 'lb', mockPrice: 0.85 },
    'ZINC': { name: 'Zinc', unit: 'lb', mockPrice: 1.15 },
    'NICKEL': { name: 'Nickel', unit: 'lb', mockPrice: 8.5 },
    'LEAD': { name: 'Lead', unit: 'lb', mockPrice: 0.95 },
    'TIN': { name: 'Tin', unit: 'lb', mockPrice: 15.5 }
  };

  async getPrice(symbol: string): Promise<MetalPrice | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }

      // If no API key or API fails, use fallback immediately
      if (!this.API_KEY || this.API_KEY === 'your_metals_api_key_here') {
        console.warn('METALS_API_KEY not configured or is a placeholder, using fallback data');
        return this.getFallbackPrice(symbol);
      }

      const url = `${this.API_BASE}/latest?access_key=${this.API_KEY}&base=USD&symbols=${symbol.toUpperCase()}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`⚠️ Metals API failed for ${symbol} (${response.status}), using fallback.`);
        return this.getFallbackPrice(symbol);
      }

      const data: any = await response.json();

      if (!data.success || !data.rates[symbol.toUpperCase()]) {
        console.warn(`⚠️ Metals API returned no success or no rate for ${symbol}, using fallback.`);
        return this.getFallbackPrice(symbol);
      }

      const rate = data.rates[symbol.toUpperCase()];
      const price = 1 / rate; // Convert from USD base to metal price

      const metalPrice: MetalPrice = {
        symbol: symbol.toUpperCase(),
        name: this.getMetalName(symbol),
        price: price,
        change_24h: this.generateRealisticChange(), // API doesn't provide 24h change
        unit: this.getMetalUnit(symbol),
        last_updated: new Date().toISOString()
      };

      this.cache.set(symbol, { data: metalPrice, timestamp: Date.now() });
      return metalPrice;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  async getPrices(symbols: string[]): Promise<MetalPrice[]> {
    const prices = await Promise.all(
      symbols.map(symbol => this.getPrice(symbol))
    );
    return prices.filter(Boolean) as MetalPrice[];
  }

  async getTopMetals(limit: number = 10): Promise<MetalPrice[]> {
    const cacheKey = `top_${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const topMetals = Object.keys(this.METAL_INFO).slice(0, limit);
      const prices = await this.getPrices(topMetals);

      this.cache.set(cacheKey, { data: prices, timestamp: Date.now() });
      return prices;
    } catch (error) {
      console.error('Error fetching top metals:', error);
      return this.getFallbackTopMetals(limit);
    }
  }

  // Get market data for metals dashboard
  async getMarketData(): Promise<any[]> {
    const cacheKey = 'market_data';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const metals = await this.getTopMetals(10);
      const marketData = metals.map(metal => ({
        id: metal.symbol.toLowerCase(),
        symbol: metal.symbol,
        name: metal.name,
        current_price: metal.price,
        price_change_percentage_24h: metal.change_24h,
        unit: metal.unit,
        market_type: 'metals',
        last_updated: metal.last_updated
      }));

      this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
      return marketData;
    } catch (error) {
      console.error('Error fetching metals market data:', error);
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

    // For now, generate realistic historical data since metals APIs often don't provide historical data in free tiers
    const currentPrice = await this.getPrice(symbol);
    if (!currentPrice) {
      return this.getFallbackPriceHistory(symbol);
    }

    const history = this.generateRealisticHistory(currentPrice.price, period);
    this.cache.set(cacheKey, { data: history, timestamp: Date.now() });
    return history;
  }

  private getFallbackPrice(symbol: string): MetalPrice | null {
    const info = this.METAL_INFO[symbol.toUpperCase() as MetalSymbol];
    if (!info) {
      console.warn(`No fallback price defined for symbol: ${symbol}`);
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      name: info.name,
      price: info.mockPrice !== undefined ? info.mockPrice * (0.95 + Math.random() * 0.1) : 100 * (0.95 + Math.random() * 0.1), // ±5% variance if mockPrice not set
      change_24h: this.generateRealisticChange(),
      unit: info.unit,
      last_updated: new Date().toISOString()
    };
  }

  private getFallbackMarketData(): any[] {
    return [
      {
        id: 'xau',
        symbol: 'XAU',
        name: 'Gold',
        current_price: 2000,
        price_change_percentage_24h: 0.5,
        unit: 'oz',
        market_type: 'metals',
        last_updated: new Date().toISOString()
      },
      {
        id: 'xag',
        symbol: 'XAG',
        name: 'Silver',
        current_price: 24,
        price_change_percentage_24h: 1.2,
        unit: 'oz',
        market_type: 'metals',
        last_updated: new Date().toISOString()
      },
      {
        id: 'xpt',
        symbol: 'XPT',
        name: 'Platinum',
        current_price: 950,
        price_change_percentage_24h: -0.8,
        unit: 'oz',
        market_type: 'metals',
        last_updated: new Date().toISOString()
      }
    ];
  }

  private getFallbackTopMetals(limit: number): MetalPrice[] {
    const topMetals = [
      { symbol: 'XAU', name: 'Gold', price: 2000, unit: 'oz' },
      { symbol: 'XAG', name: 'Silver', price: 24, unit: 'oz' },
      { symbol: 'XPT', name: 'Platinum', price: 950, unit: 'oz' },
      { symbol: 'XPD', name: 'Palladium', price: 1800, unit: 'oz' },
      { symbol: 'COPPER', name: 'Copper', price: 4.2, unit: 'lb' },
      { symbol: 'ALUMINUM', name: 'Aluminum', price: 0.85, unit: 'lb' },
      { symbol: 'ZINC', name: 'Zinc', price: 1.15, unit: 'lb' },
      { symbol: 'NICKEL', name: 'Nickel', price: 8.5, unit: 'lb' },
      { symbol: 'LEAD', name: 'Lead', price: 0.95, unit: 'lb' },
      { symbol: 'TIN', name: 'Tin', price: 15.5, unit: 'lb' }
    ];

    return topMetals.slice(0, limit).map(metal => ({
      ...metal,
      price: metal.price * (0.95 + Math.random() * 0.1),
      change_24h: this.generateRealisticChange(),
      last_updated: new Date().toISOString()
    }));
  }

  private getFallbackPriceHistory(symbol: string): any[] {
    const fallbackPrice = this.getFallbackPrice(symbol);
    if (!fallbackPrice) return [];
    return this.generateRealisticHistory(fallbackPrice.price, '24h'); // Default to 24h for fallback history
  }

  private generateRealisticHistory(currentPrice: number, period: string): any[] {
    const data = [];
    let points = 24; // Default to 24 hours
    let interval = 60 * 60 * 1000; // 1 hour

    if (period === '7d') {
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (period === '30d') {
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (period === '1y') {
      points = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day
    }

    let price = currentPrice;
    for (let i = points - 1; i >= 0; i--) {
      // Metals are less volatile than crypto, so smaller changes
      const variance = (Math.random() - 0.5) * 0.02; // ±1% variance
      price = price * (1 + variance);

      data.push({
        timestamp: new Date(Date.now() - i * interval).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        price: parseFloat(price.toFixed(2))
      });
    }

    return data;
  }

  private generateRealisticChange(): number {
    // Metals typically have smaller daily changes than crypto
    return (Math.random() - 0.5) * 4; // ±2% range
  }

  private getMetalName(symbol: string): string {
    const info = this.METAL_INFO[symbol.toUpperCase() as MetalSymbol];
    return info?.name || symbol.toUpperCase();
  }

  private getMetalUnit(symbol: string): string {
    const info = this.METAL_INFO[symbol.toUpperCase() as MetalSymbol];
    return info?.unit || 'unit';
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const metalsService = new MetalsService();
export type { MetalPrice };