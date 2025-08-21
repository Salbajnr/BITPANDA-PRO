import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch crypto data for ticker
  const { data: cryptoData } = useQuery({
    queryKey: ['/api/crypto/market-data'],
    refetchInterval: 30000,
  });

  // Fetch metals data for ticker
  const { data: metalsData } = useQuery({
    queryKey: ['/api/metals/market-data'],
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

  if (tickerItems.length === 0) {
    return (
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="animate-pulse flex items-center justify-center">
          <span className="text-sm">Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-3 overflow-hidden border-b border-gray-800">
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