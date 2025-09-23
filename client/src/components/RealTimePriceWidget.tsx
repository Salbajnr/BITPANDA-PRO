import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

const RealTimePriceWidget: React.FC<RealTimePriceWidgetProps> = ({ 
  symbols = ['BTC', 'ETH', 'ADA', 'SOL'], 
  className = '' 
}) => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with mock data
        const mockPrices: CryptoPrice[] = [
          { symbol: 'BTC', name: 'Bitcoin', price: 42350.50, change24h: 2.45 },
          { symbol: 'ETH', name: 'Ethereum', price: 2650.30, change24h: -1.23 },
          { symbol: 'ADA', name: 'Cardano', price: 0.485, change24h: 5.67 },
          { symbol: 'SOL', name: 'Solana', price: 98.75, change24h: -2.15 }
        ];

        // Add some randomness to simulate real-time updates
        const updatedPrices = mockPrices.map(price => ({
          ...price,
          price: price.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: price.change24h + (Math.random() - 0.5) * 2
        }));

        setPrices(updatedPrices.filter(p => symbols.includes(p.symbol)));
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [symbols]);

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

export default RealTimePriceWidget;