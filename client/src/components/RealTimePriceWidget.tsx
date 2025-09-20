import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface RealTimePriceWidgetProps {
  symbol?: string;
  className?: string;
}

const RealTimePriceWidget: React.FC<RealTimePriceWidgetProps> = ({ 
  symbol = 'BTC', 
  className = '' 
}) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;

    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/crypto/price/${symbol}`);
        if (response.ok && isMounted) {
          const data = await response.json();
          setPriceData(data);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();
    interval = setInterval(fetchPrice, 10000); // Update every 10 seconds

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [symbol]);

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!priceData) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Price data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = priceData.changePercent >= 0;

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {priceData.symbol.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${priceData.price.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? '+' : ''}{priceData.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <Badge variant={isPositive ? "default" : "destructive"}>
            {isPositive ? '+' : ''}${priceData.change.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceWidget;