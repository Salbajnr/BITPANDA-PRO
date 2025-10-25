import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useRealTimePrices } from '../hooks/useRealTimePrices';
import { SafeComponent } from './SafeComponent';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  name: string;
}

interface RealTimePriceWidgetProps {
  symbols?: string[];
  className?: string;
}

const RealTimePriceWidgetContent: React.FC<RealTimePriceWidgetProps> = ({ 
  symbols = ['BTC', 'ETH', 'ADA', 'SOL'], 
  className = '' 
}) => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { prices: realTimePrices, isConnected, isConnecting } = useRealTimePrices({
    symbols,
    enabled: true,
    onPriceUpdate: (priceData) => {
      // Update local prices when real-time data arrives
      setPrices(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.symbol === priceData.symbol.toUpperCase());
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            price: priceData.price,
            change24h: priceData.change_24h
          };
        } else {
          updated.push({
            symbol: priceData.symbol.toUpperCase(),
            name: getSymbolName(priceData.symbol),
            price: priceData.price,
            change24h: priceData.change_24h
          });
        }
        return updated;
      });
    }
  });

  useEffect(() => {
    const initializePrices = async () => {
      setIsLoading(true);

      try {
        // Try to fetch real prices first
        const response = await fetch('/api/crypto/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols })
        });

        if (response.ok) {
          const data = await response.json();
          const realPrices: CryptoPrice[] = data.map((crypto: any) => ({
            symbol: crypto.symbol,
            name: crypto.name || getSymbolName(crypto.symbol),
            price: crypto.price || crypto.current_price,
            change24h: crypto.change_24h || crypto.price_change_percentage_24h || 0
          }));
          setPrices(realPrices);
        } else {
          throw new Error('Failed to fetch real prices');
        }
      } catch (error) {
        console.warn('Failed to fetch real prices, using fallback data:', error);

        // Fallback to mock data only if real data fails
        const fallbackPrices: CryptoPrice[] = symbols.map(symbol => ({
          symbol,
          name: getSymbolName(symbol),
          price: getMockPrice(symbol),
          change24h: (Math.random() - 0.5) * 10
        }));
        setPrices(fallbackPrices);
      }

      setIsLoading(false);
    };

    initializePrices();
  }, [symbols]);

  const getSymbolName = (symbol: string): string => {
    const names: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum', 
      'ADA': 'Cardano',
      'SOL': 'Solana'
    };
    return names[symbol.toUpperCase()] || symbol.toUpperCase();
  };

  const getMockPrice = (symbol: string): number => {
    const prices: Record<string, number> = {
      'BTC': 42350.50,
      'ETH': 2650.30,
      'ADA': 0.485,
      'SOL': 98.75
    };
    return prices[symbol.toUpperCase()] || Math.random() * 1000;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Real-Time Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Real-Time Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{crypto.symbol}</div>
                <div className="text-xs text-gray-500">{crypto.name}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ${crypto.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: crypto.price < 1 ? 4 : 2 
                  })}
                </div>
                <div className={`text-xs flex items-center justify-end ${
                  crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const RealTimePriceWidget: React.FC<RealTimePriceWidgetProps> = (props) => {
  return (
    <SafeComponent>
      <RealTimePriceWidgetContent {...props} />
    </SafeComponent>
  );
};

export default RealTimePriceWidget;