
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useLocation } from "wouter";
import { getCryptoLogo } from "@/components/CryptoLogos";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ArrowUp, ArrowDown, Plus, Minus, RefreshCw, TrendingUp, TrendingDown,
  Star, StarOff, Share, Info, Clock, DollarSign, Activity, BarChart3,
  ChevronRight, ChevronLeft, Globe, Shield, Award
} from "lucide-react";

interface AssetDetailsProps {
  symbol?: string;
}

export default function AssetDetails({ symbol: propSymbol }: AssetDetailsProps) {
  const [, navigate] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  // Get symbol from URL or props
  const urlParams = new URLSearchParams(location.search);
  const symbol = propSymbol || urlParams.get('symbol') || 'BTC';

  // Fetch asset data
  const { data: assetData, isLoading: assetLoading } = useQuery({
    queryKey: [`/api/crypto/details/${symbol}`],
    queryFn: () => api.get(`/crypto/details/${symbol}`),
    refetchInterval: 30000,
  });

  // Fetch price history
  const { data: priceHistory, isLoading: historyLoading } = useQuery({
    queryKey: [`/api/crypto/history/${symbol}`, selectedTimeframe],
    queryFn: () => api.get(`/crypto/history/${symbol}?timeframe=${selectedTimeframe}`),
    refetchInterval: 60000,
  });

  // Mock data for demonstration
  const mockAsset = {
    id: symbol.toLowerCase(),
    symbol: symbol,
    name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : 'Cryptocurrency',
    current_price: 102326.25,
    price_change_24h: 1152.00,
    price_change_percentage_24h: 0.89,
    market_cap: 2031234567890,
    total_volume: 28456789123,
    high_24h: 103456.78,
    low_24h: 101200.22,
    ath: 108000.00,
    ath_change_percentage: -5.25,
    market_cap_rank: 1,
    circulating_supply: 19800000,
    total_supply: 21000000,
    max_supply: 21000000,
    description: "Bitcoin is the most popular cryptocurrency, both in terms of mainstream awareness as well as buy and sell volume. It is based on an open-source technology and operates on a decentralized network using blockchain technology.",
    image: getCryptoLogo(symbol),
  };

  const asset = assetData || mockAsset;

  const timeframes = [
    { label: "1D", value: "1D" },
    { label: "7D", value: "7D" },
    { label: "30D", value: "30D" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "Max", value: "Max" },
  ];

  // Mock price history data
  const mockPriceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: asset.current_price + (Math.random() - 0.5) * 2000,
    volume: Math.random() * 1000000000,
  }));

  const chartData = priceHistory || mockPriceData;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // Add to watchlist logic here
  };

  if (assetLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-600">Loading asset details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Status Bar */}
      <div className="h-8 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-2 text-xs">
          <span>📶</span>
          <span>🔋</span>
          <span>9:41</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        {/* Header */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">{asset.name}</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleWatchlist}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isInWatchlist ? (
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share className="w-6 h-6 text-gray-400" />
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={asset.image || getCryptoLogo(symbol)} 
                  alt={asset.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getCryptoLogo(symbol);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2 text-black">
              {formatPrice(asset.current_price)}
            </div>
            <div className={`flex justify-center items-center space-x-2 ${
              asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.price_change_percentage_24h >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>
                {asset.price_change_percentage_24h >= 0 ? '+' : ''}
                {asset.price_change_percentage_24h.toFixed(2)}% 
                ({asset.price_change_24h >= 0 ? '+' : ''}
                {formatPrice(asset.price_change_24h)}) (1D)
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 mb-6">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="h-48 mb-4">
                {historyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-6 h-6 animate-spin text-green-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        fontSize={10}
                        hide
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={10}
                        hide
                        domain={['dataMin * 0.999', 'dataMax * 1.001']}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatPrice(value), 'Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#00d395" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatPrice(asset.low_24h)}</span>
                <span>{formatPrice(asset.current_price)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Selector */}
        <div className="flex justify-around border-b mb-6 px-4">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={`py-2 text-sm transition-colors ${
                selectedTimeframe === timeframe.value
                  ? "text-black border-b-2 border-green-500 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 px-4 mb-8">
          <button
            onClick={() => navigate(`/deposits?symbol=${symbol}`)}
            className="flex flex-col items-center p-4 bg-green-500 rounded-xl text-white hover:bg-green-600 transition-colors"
          >
            <Plus className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Buy</span>
          </button>
          
          <button
            onClick={() => navigate(`/trading?symbol=${symbol}`)}
            className="flex flex-col items-center p-4 bg-gray-800 rounded-xl text-white hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Swap</span>
          </button>
          
          <button
            onClick={() => navigate(`/withdrawals?symbol=${symbol}`)}
            className="flex flex-col items-center p-4 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
          >
            <Minus className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Sell</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gray-300 rounded-xl text-gray-600 hover:bg-gray-400 transition-colors">
            <span className="text-xl mb-1">⋯</span>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>

        {/* About Section */}
        <div className="px-4 mb-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black flex items-center">
                <Info className="w-5 h-5 mr-2" />
                About {asset.symbol}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {asset.description}
              </p>
              <button className="text-sm text-blue-500 flex items-center hover:text-blue-600">
                Read more <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Market Statistics */}
        <div className="px-4 mb-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Daily High</div>
                  <div className="font-medium text-black">{formatPrice(asset.high_24h)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Daily Low</div>
                  <div className="font-medium text-black">{formatPrice(asset.low_24h)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Market Cap</div>
                  <div className="font-medium text-black">{formatMarketCap(asset.market_cap)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Volume (24h)</div>
                  <div className="font-medium text-black">{formatMarketCap(asset.total_volume)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">All-Time High</div>
                  <div className="font-medium text-black">{formatPrice(asset.ath)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Market Rank</div>
                  <div className="font-medium text-black">#{asset.market_cap_rank}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Circulating Supply</div>
                  <div className="font-medium text-black">{asset.circulating_supply?.toLocaleString()} {asset.symbol}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Max Supply</div>
                  <div className="font-medium text-black">{asset.max_supply?.toLocaleString()} {asset.symbol}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Alerts */}
        <div className="px-4 mb-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get notified when {asset.name} reaches your target price.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => navigate(`/alerts?symbol=${symbol}`)}
              >
                Set Price Alert
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Risk Warning */}
        <div className="px-4 mb-8">
          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">Investment Risk</h4>
                  <p className="text-xs text-orange-800">
                    Cryptocurrency investments are subject to market risk. Past performance 
                    does not guarantee future results. Only invest what you can afford to lose.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
