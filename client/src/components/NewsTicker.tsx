import React, { useEffect, useState } from 'react';
import { Bitcoin, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon: React.ReactNode;
}

function NewsTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 62430, change: 0.84, icon: <Bitcoin className="w-4 h-4" /> },
    { symbol: 'ETH', name: 'Ethereum', price: 3124, change: -0.12, icon: <DollarSign className="w-4 h-4" /> },
    { symbol: 'XAU', name: 'Gold', price: 2386, change: 0.21, icon: <TrendingUp className="w-4 h-4" /> },
    { symbol: 'SOL', name: 'Solana', price: 146, change: 1.05, icon: <TrendingUp className="w-4 h-4" /> },
    { symbol: 'XAG', name: 'Silver', price: 28.41, change: -0.44, icon: <TrendingDown className="w-4 h-4" /> },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, change: 0.32, icon: <DollarSign className="w-4 h-4" /> },
    { symbol: 'XPT', name: 'Platinum', price: 1007, change: 0.10, icon: <TrendingUp className="w-4 h-4" /> },
    { symbol: 'DOT', name: 'Polkadot', price: 6.92, change: -0.18, icon: <TrendingDown className="w-4 h-4" /> },
  ]);

  useEffect(() => {
    const updatePrices = () => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
        change: (Math.random() - 0.5) * 2, // Random change between -1% and +1%
      })));
    };

    const interval = setInterval(updatePrices, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border-t border-b border-border overflow-hidden py-3 my-12">
      <div className="flex whitespace-nowrap animate-scroll">
        {tickerData.map((item, index) => (
          <div key={index} className="flex items-center px-8 text-sm text-muted-foreground">
            <span className="text-accent mr-2">{item.icon}</span>
            <span className="mr-2">{item.symbol}:</span>
            <span className="mr-2 font-mono">
              ${item.symbol.startsWith('X') ? item.price.toFixed(2) : item.price.toFixed(item.price < 1 ? 4 : 2)}
            </span>
            <span className={`font-medium ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsTicker;