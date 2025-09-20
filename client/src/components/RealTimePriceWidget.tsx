import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { getCryptoLogo } from './CryptoLogos';

interface CryptoPriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

interface RealTimePriceWidgetProps {
  symbols?: string[];
  maxItems?: number;
}

export function RealTimePriceWidget({
  symbols = ['bitcoin', 'ethereum', 'binancecoin'],
  maxItems = 6
}: RealTimePriceWidgetProps) {
  const [prices, setPrices] = useState<CryptoPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      const symbolsString = symbols.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsString}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();

      const priceData: CryptoPriceData[] = Object.entries(data).map(([id, info]: [string, any]) => ({
        symbol: id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        price: info.usd || 0,
        change24h: info.usd_24h_change || 0,
        volume24h: info.usd_24h_vol || 0,
        marketCap: info.usd_market_cap || 0,
      }));

      setPrices(priceData.slice(0, maxItems));
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError('Failed to load prices');
      // Set fallback data
      setPrices([
        {
          symbol: 'bitcoin',
          name: 'Bitcoin',
          price: 45000,
          change24h: 2.5,
          volume24h: 25000000000,
          marketCap: 875000000000,
        },
        {
          symbol: 'ethereum',
          name: 'Ethereum',
          price: 3200,
          change24h: -1.2,
          volume24h: 15000000000,
          marketCap: 385000000000,
        },
        {
          symbol: 'binancecoin',
          name: 'BNB',
          price: 420,
          change24h: 0.8,
          volume24h: 2000000000,
          marketCap: 62000000000,
        },
      ].slice(0, maxItems));
    } finally {
      setLoading(false);
    }
  }, [symbols, maxItems]);

  useEffect(() => {
    fetchPrices();

    // Set up interval for real-time updates
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [fetchPrices]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(1)}M`;
    } else {
      return `$${(volume / 1e3).toFixed(1)}K`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Live Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Live Prices
          {error && <Badge variant="destructive" className="ml-2">Error</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={getCryptoLogo(crypto.symbol)}
                  alt={crypto.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/logo.jpeg';
                  }}
                />
                <div>
                  <div className="font-medium">{crypto.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Vol: {formatVolume(crypto.volume24h)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatPrice(crypto.price)}</div>
                <div className="flex items-center gap-1">
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-sm ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}