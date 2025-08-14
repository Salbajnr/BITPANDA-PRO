
import { getCryptoLogo } from "@/components/CryptoLogos";
import { DollarSign, TrendingUp, TrendingDown, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  icon: string;
}

const initialMarketData: MarketItem[] = [
  { symbol: "BTC", name: "Bitcoin", price: 43250, change: 2.45, volume: 2400000000, marketCap: 850000000000, icon: "BTC" },
  { symbol: "ETH", name: "Ethereum", price: 2680.5, change: -1.23, volume: 1200000000, marketCap: 320000000000, icon: "ETH" },
  { symbol: "SOL", name: "Solana", price: 98.75, change: 5.67, volume: 580000000, marketCap: 45000000000, icon: "SOL" },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: 3.21, volume: 340000000, marketCap: 15000000000, icon: "ADA" },
  { symbol: "AVAX", name: "Avalanche", price: 34.82, change: 4.12, volume: 290000000, marketCap: 12000000000, icon: "AVAX" },
  { symbol: "DOT", name: "Polkadot", price: 7.25, change: -0.89, volume: 180000000, marketCap: 8000000000, icon: "DOT" },
];

export default function MarketsPage() {
  const [marketData, setMarketData] = useState(initialMarketData);
  const [sortKey, setSortKey] = useState<keyof MarketItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: keyof MarketItem) => {
    const direction = sortKey === key && sortDirection === 'desc' ? 'asc' : 'desc';
    const sortedData = [...marketData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setMarketData(sortedData);
    setSortKey(key);
    setSortDirection(direction);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    }
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
              Live Crypto Markets
            </span>
          </h1>
          <p className="text-lg text-[#8B949E] max-w-2xl mx-auto">
            Explore real-time prices, market capitalization, and key data for a wide range of cryptocurrencies.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Total Market Cap", value: "$2.1T", icon: <BarChart3 className="w-6 h-6 text-[#FFB82F]" /> },
            { label: "24h Volume", value: "$89.2B", icon: <Clock className="w-6 h-6 text-white" /> },
            { label: "Top Gainer", value: "Solana (+5.67%)", icon: <TrendingUp className="w-6 h-6 text-[#00D4AA]" /> },
            { label: "Top Loser", value: "Ethereum (-1.23%)", icon: <TrendingDown className="w-6 h-6 text-[#F84638]" /> },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-[#161A1E] rounded-2xl p-6 border border-[#2B2F36] flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-[#2B2F36] rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-[#8B949E] text-sm">{item.label}</p>
                <h3 className="text-xl font-bold mt-1">{item.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Table */}
        <motion.div
          className="bg-[#161A1E] rounded-2xl p-6 border border-[#2B2F36]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-[#2B2F36] text-[#8B949E]">
                  <th className="py-4 px-4 font-semibold cursor-pointer" onClick={() => handleSort('name')}>
                    Asset
                  </th>
                  <th className="py-4 px-4 font-semibold cursor-pointer" onClick={() => handleSort('price')}>
                    Price
                  </th>
                  <th className="py-4 px-4 font-semibold cursor-pointer" onClick={() => handleSort('change')}>
                    24h Change
                  </th>
                  <th className="py-4 px-4 font-semibold cursor-pointer" onClick={() => handleSort('volume')}>
                    24h Volume
                  </th>
                  <th className="py-4 px-4 font-semibold cursor-pointer" onClick={() => handleSort('marketCap')}>
                    Market Cap
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((crypto, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-[#2B2F36] hover:bg-[#2B2F36] transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        {getCryptoLogo(crypto.icon, 32)}
                      </div>
                      <div>
                        <div className="font-semibold">{crypto.name}</div>
                        <div className="text-sm text-[#8B949E]">{crypto.symbol}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-4 px-4 font-semibold ${crypto.change >= 0 ? 'text-[#00D4AA]' : 'text-[#F84638]'}`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </td>
                    <td className="py-4 px-4 text-[#8B949E]">{formatVolume(crypto.volume)}</td>
                    <td className="py-4 px-4 text-[#8B949E]">{formatMarketCap(crypto.marketCap)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <Button
              className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] text-black font-semibold rounded-full px-8 py-3"
            >
              Start Trading Now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

