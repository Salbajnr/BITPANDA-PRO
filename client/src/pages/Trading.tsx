
import React, { useState } from 'react';
import { RealTimeCryptoTable } from '../components/RealTimeCryptoTable';
import { TradingInterface } from '../components/TradingInterface';
import { CryptoPrice } from '../services/cryptoApi';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react';

export default function Trading() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Trading Access Required</h1>
          <p className="text-gray-300 mb-8">Please log in to access the trading platform</p>
          <Button
            onClick={() => window.location.href = '/auth'}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-login"
          >
            Login to Trade
          </Button>
        </div>
      </div>
    );
  }

  const handleTradeClick = (crypto: CryptoPrice) => {
    setSelectedCrypto(crypto);
  };

  const handleCloseTrading = () => {
    setSelectedCrypto(null);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-bitpanda-text">
              Professional Trading
            </h1>
            <p className="text-xl text-gray-600">
              Real-time cryptocurrency trading with live market data
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="bg-green-600 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Market Open
            </Badge>
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Trading Balance</p>
                <p className="text-xl font-bold text-green-400">
                  ${Number(user.portfolio?.availableCash || 0).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trading Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-2xl font-bold text-white">$1.2T</p>
                <p className="text-green-400 text-sm">+5.2%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-2xl font-bold text-white">$2.8T</p>
                <p className="text-green-400 text-sm">+2.1%</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">BTC Dominance</p>
                <p className="text-2xl font-bold text-white">54.2%</p>
                <p className="text-red-400 text-sm">-0.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Trades</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-blue-400 text-sm">Live</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Crypto Table */}
          <div className="xl:col-span-2">
            <RealTimeCryptoTable 
              onTradeClick={handleTradeClick}
              limit={50}
              showWatchlist={true}
            />
          </div>
          
          {/* Trading Panel */}
          <div className="xl:col-span-1">
            {selectedCrypto ? (
              <TradingInterface 
                crypto={selectedCrypto}
                onClose={handleCloseTrading}
              />
            ) : (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-full flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Select a Cryptocurrency
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Click "Trade" on any cryptocurrency to start trading
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
