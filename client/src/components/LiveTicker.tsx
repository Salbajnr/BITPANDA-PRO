import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch crypto data for ticker
  const { data: cryptoData, isError: cryptoIsError, isLoading: cryptoIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/crypto/market-data'],
    queryFn: () => api.get('/api/crypto/market-data'),
    refetchInterval: 30000,
  });

  // Fetch metals data for ticker
  const { data: metalsData, isError: metalsIsError, isLoading: metalsIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/metals/market-data'],
    queryFn: () => api.get('/api/metals/market-data'),
    refetchInterval: 60000,
  });

  // Combine and prepare ticker data
  const tickerItems: TickerItem[] = [
    ...(Array.isArray(cryptoData) ? cryptoData.slice(0, 10) : []),
    ...(Array.isArray(metalsData) ? metalsData.slice(0, 3) : [])
  ];

  // Auto-scroll through ticker items
  useEffect(() => {
    if (tickerItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  if (cryptoIsLoading || metalsIsLoading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 py-2 px-4">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-green-600 mr-2"></div>
          Loading market data...
        </div>
      </div>
    );
  }

  if (cryptoIsError || metalsIsError) {
    return (
      <div className="bg-red-50 border-b border-red-200 py-2 px-4">
        <div className="flex items-center justify-center text-red-600 text-sm">
          <span>Market data temporarily unavailable</span>
        </div>
      </div>
    );
  }

  if (tickerItems.length === 0) {
    return (
      <div className="bg-secondary dark:bg-gray-900 text-foreground py-2 overflow-hidden">
        <div className="animate-pulse flex items-center justify-center">
          <span className="text-sm">No market data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary dark:bg-gray-900 text-foreground py-3 overflow-hidden border-b border-border">
      <div className="animate-scroll-left whitespace-nowrap flex items-center">
        {/* Duplicate the ticker items for seamless loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
          <span key={index} className="mx-8 inline-flex items-center space-x-2 text-sm">
            <span className="font-semibold text-gray-100">{item.symbol}</span>
            <span className="text-white font-medium">
              ${typeof item.current_price === 'number' ? item.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </span>
            <span
              className={`text-xs font-medium ${
                (item.price_change_percentage_24h || 0) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {(item.price_change_percentage_24h || 0) >= 0 ? '▲' : '▼'}
              {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}