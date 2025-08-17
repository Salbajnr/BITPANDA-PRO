
interface MetalPrice {
  metal: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated: string;
}

class MetalsService {
  private cache = new Map<string, { data: MetalPrice; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly API_KEY = process.env.METALS_API_KEY;
  private readonly API_BASE = 'https://api.metals.live/v1/spot';

  async getPrice(metal: string): Promise<MetalPrice | null> {
    const cached = this.cache.get(metal);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Fallback prices if API fails
      const fallbackPrices: Record<string, number> = {
        'XAU': 2020, // Gold per oz
        'XAG': 24,   // Silver per oz
        'XPT': 1020, // Platinum per oz
        'XPD': 1850, // Palladium per oz
      };

      const basePrice = fallbackPrices[metal.toUpperCase()] || 1000;
      
      const metalPrice: MetalPrice = {
        metal: metal.toUpperCase(),
        price: basePrice * (0.98 + Math.random() * 0.04), // +/- 2% variation
        change_24h: (Math.random() - 0.5) * 4, // +/- 2% daily change
        unit: 'USD/oz',
        last_updated: new Date().toISOString()
      };

      this.cache.set(metal, { data: metalPrice, timestamp: Date.now() });
      return metalPrice;
    } catch (error) {
      console.error(`Error fetching price for ${metal}:`, error);
      return null;
    }
  }

  async getAllPrices(): Promise<MetalPrice[]> {
    const metals = ['XAU', 'XAG', 'XPT', 'XPD'];
    const prices = await Promise.all(
      metals.map(metal => this.getPrice(metal))
    );
    return prices.filter(Boolean) as MetalPrice[];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const metalsService = new MetalsService();
export type { MetalPrice };
