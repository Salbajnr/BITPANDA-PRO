import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  id?: string;
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch crypto data for ticker with better error handling
  const {
    data: cryptoData,
    isError: cryptoIsError,
    isLoading: cryptoIsLoading,
  } = useQuery<TickerItem[]>({
    queryKey: ['/api/crypto/prices'],
    queryFn: async () => {
      const response = await fetch('/api/crypto/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX', 'LINK']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }

      const data = await response.json();
      return Array.isArray(data) ? data.map((item: any) => ({
        symbol: item.symbol || 'N/A',
        name: item.name || item.symbol || 'Unknown',
        current_price: item.price || item.current_price || 0,
        price_change_percentage_24h: item.change_24h || item.price_change_percentage_24h || 0
      })) : [];
    },
    refetchInterval: 15000,
    retry: 2,
    retryDelay: 2000,
  });

  // Fetch metals data for ticker
  const {
    data: metalsData,
    isError: metalsIsError,
    isLoading: metalsIsLoading
  } = useQuery<TickerItem[]>({
    queryKey: ['/api/metals/market-data'],
    queryFn: async () => {
      const response = await fetch('/api/metals/market-data');
      if (!response.ok) throw new Error('Failed to fetch metals');
      return response.json();
    },
    refetchInterval: 30000,
    retry: 2,
  });

  // Default/fallback data
  const defaultItems: TickerItem[] = [
    { symbol: 'BTC', name: 'Bitcoin', current_price: 67234.50, price_change_percentage_24h: 1.87 },
    { symbol: 'ETH', name: 'Ethereum', current_price: 3456.78, price_change_percentage_24h: -1.29 },
    { symbol: 'BNB', name: 'BNB', current_price: 598.45, price_change_percentage_24h: 2.10 },
    { symbol: 'XRP', name: 'XRP', current_price: 0.6234, price_change_percentage_24h: 2.01 },
    { symbol: 'ADA', name: 'Cardano', current_price: 0.4567, price_change_percentage_24h: -1.91 },
    { symbol: 'SOL', name: 'Solana', current_price: 178.90, price_change_percentage_24h: 3.27 },
    { symbol: 'XAU', name: 'Gold', current_price: 2386.50, price_change_percentage_24h: 0.21 },
    { symbol: 'XAG', name: 'Silver', current_price: 28.41, price_change_percentage_24h: -0.44 },
  ];

  // Update ticker items from API data and handle errors
  useEffect(() => {
    let items: TickerItem[] = [];
    let dataAvailable = false;

    if (cryptoData && Array.isArray(cryptoData) && cryptoData.length > 0) {
      items = [...cryptoData];
      setIsConnected(true);
      dataAvailable = true;
    }

    if (metalsData && Array.isArray(metalsData) && metalsData.length > 0) {
      items = [...items, ...metalsData];
      setIsConnected(true);
      dataAvailable = true;
    }

    if (!dataAvailable) {
      items = defaultItems;
      setIsConnected(false);
    }

    setTickerItems(items);

    // Set hasError if either crypto or metals data fetch failed
    if (cryptoIsError || metalsIsError) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [cryptoData, metalsData, cryptoIsError, metalsIsError]);


  // Show loading state only initially
  if (cryptoIsLoading && metalsIsLoading && tickerItems.length === 0) {
    return (
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-blue-500 mr-2"></div>
            Loading live market data...
          </div>
        </div>
      </div>
    );
  }

  // Show error fallback UI
  if (hasError || cryptoIsError || metalsIsError) {
    return (
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <Alert className="bg-red-900/50 border-red-600/50 py-1">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300 text-xs">
              Live market data is currently unavailable. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // If no data and not loading, but also no error, means it's empty or intentionally not showing
  if (!cryptoData && !metalsData && tickerItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 overflow-hidden">
      <div className="relative h-8">
        <div
          className="flex items-center h-full space-x-8 animate-scroll"
          style={{
            animationDuration: '30s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            transform: 'translateX(100%)'
          }}
        >
          {/* First set of items */}
          {tickerItems.map((item, index) => {
            const isPositive = (item.price_change_percentage_24h || 0) >= 0;
            const price = Number(item.current_price) || 0;
            const formattedPrice = price < 1
              ? price.toFixed(4)
              : price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

            return (
              <div key={`${item.symbol}-${index}`} className="flex items-center space-x-2 px-8 py-2 flex-shrink-0">
                <span className="font-semibold text-gray-100 text-sm">{item.symbol}</span>
                <span className="text-white font-medium text-sm">
                  ${formattedPrice}
                </span>
                <span className={`text-xs font-medium flex items-center ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            );
          })}

          {/* Duplicate set for seamless loop */}
          {tickerItems.map((item, index) => {
            const isPositive = (item.price_change_percentage_24h || 0) >= 0;
            const price = Number(item.current_price) || 0;
            const formattedPrice = price < 1
              ? price.toFixed(4)
              : price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

            return (
              <div key={`${item.symbol}-duplicate-${index}`} className="flex items-center space-x-2 px-8 py-2 flex-shrink-0">
                <span className="font-semibold text-gray-100 text-sm">{item.symbol}</span>
                <span className="text-white font-medium text-sm">
                  ${formattedPrice}
                </span>
                <span className={`text-xs font-medium flex items-center ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Connection status indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className={`flex items-center space-x-1 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? 'LIVE' : 'RECONNECTING...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}