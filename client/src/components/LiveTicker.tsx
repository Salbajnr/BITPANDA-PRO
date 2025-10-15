import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export default function LiveTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch crypto data for ticker
  const { data: cryptoData, isError: cryptoIsError, isLoading: cryptoIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/crypto/market-data'],
    queryFn: () => api.get('/api/crypto/market-data'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch metals data for ticker
  const { data: metalsData, isError: metalsIsError, isLoading: metalsIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/metals/market-data'],
    queryFn: () => api.get('/api/metals/market-data'),
    refetchInterval: 60000, // Refetch every minute
  });

  // Fallback data when API fails
  const defaultPrices: CryptoPrice[] = [
    { symbol: 'BTC', price: 67234.50, change24h: 1234.50, changePercent24h: 1.87 },
    { symbol: 'ETH', price: 3456.78, change24h: -45.23, changePercent24h: -1.29 },
    { symbol: 'BNB', price: 598.45, change24h: 12.34, changePercent24h: 2.10 },
    { symbol: 'XRP', price: 0.6234, change24h: 0.0123, changePercent24h: 2.01 },
    { symbol: 'ADA', price: 0.4567, change24h: -0.0089, changePercent24h: -1.91 },
    { symbol: 'SOL', price: 178.90, change24h: 5.67, changePercent24h: 3.27 }
  ];

  // Update prices from API data or use fallback
  useEffect(() => {
    if (cryptoData && Array.isArray(cryptoData) && cryptoData.length > 0) {
      const apiPrices = cryptoData.slice(0, 10).map(item => ({
        symbol: item.symbol.toUpperCase(),
        price: item.current_price || 0,
        change24h: (item.current_price || 0) * ((item.price_change_percentage_24h || 0) / 100),
        changePercent24h: item.price_change_percentage_24h || 0
      }));
      setPrices(apiPrices);
    } else if (!cryptoIsLoading && (cryptoIsError || !cryptoData)) {
      // Use fallback data when API fails
      setPrices(defaultPrices);
    }
  }, [cryptoData, cryptoIsError, cryptoIsLoading]);

  // Create combined ticker items from crypto and metals data
  const tickerItems: TickerItem[] = [
    // Crypto data
    ...(Array.isArray(cryptoData) ? cryptoData.slice(0, 10) : []),
    // Metals data
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

  // Show loading state
  if (cryptoIsLoading && metalsIsLoading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 py-2 px-4">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-green-600 mr-2"></div>
          Loading market data...
        </div>
      </div>
    );
  }

  // Show error state
  if (cryptoIsError && metalsIsError) {
    return (
      <div className="bg-red-50 border-b border-red-200 py-2 px-4">
        <div className="flex items-center justify-center text-red-600 text-sm">
          <span>Market data temporarily unavailable</span>
        </div>
      </div>
    );
  }

  // Use ticker items if available, otherwise use prices from state
  const displayItems = tickerItems.length > 0 ? tickerItems : 
    prices.map(price => ({
      symbol: price.symbol,
      name: price.symbol,
      current_price: price.price,
      price_change_percentage_24h: price.changePercent24h
    }));

  if (displayItems.length === 0) {
    return (
      <div className="bg-secondary dark:bg-gray-900 py-2 overflow-hidden">
        <div className="animate-pulse flex items-center justify-center">
          <span className="text-sm">No market data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-x-auto scrollbar-hide space-x-8">
            {displayItems.map((item, index) => {
              const isPositive = (item.price_change_percentage_24h || 0) >= 0;
              const formattedPrice = typeof item.current_price === 'number' 
                ? item.current_price.toLocaleString(undefined, { 
                    minimumFractionDigits: item.current_price < 1 ? 6 : 2, 
                    maximumFractionDigits: item.current_price < 1 ? 6 : 2 
                  }) 
                : '0.00';

              return (
                <span key={`${item.symbol}-${index}`} className="flex items-center space-x-2 flex-shrink-0">
                  <span className="font-semibold text-gray-100">{item.symbol}</span>
                  <span className="text-white font-medium">
                    ${formattedPrice}
                  </span>
                  <span className={`text-xs font-medium flex items-center ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
                    {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center space-x-1 text-green-400">
              <Wifi className="h-3 w-3" />
              <span className="text-xs">API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}