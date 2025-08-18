import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { getCryptoLogo } from "@/components/CryptoLogos";
import {
  TrendingUp, TrendingDown, Search, Filter, RefreshCw,
  Bitcoin, Coins, Award, Activity, DollarSign,
  ArrowUpRight, ArrowDownLeft, Star, Eye,
  BarChart3, PieChart, Globe, Zap
} from "lucide-react";
import { useLocation } from "wouter";

interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  total_volume?: number;
  market_type: 'crypto' | 'metals';
  unit?: string;
  image?: string;
}

export default function DualMarkets() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Fetch crypto data
  const { data: cryptoData, isLoading: cryptoLoading, refetch: refetchCrypto } = useQuery({
    queryKey: ['/api/crypto/market-data'],
    queryFn: () => api.get('/crypto/market-data'),
    refetchInterval: 30000,
  });

  // Fetch metals data
  const { data: metalsData, isLoading: metalsLoading, refetch: refetchMetals } = useQuery({
    queryKey: ['/api/metals/market-data'],
    queryFn: () => api.get('/metals/market-data'),
    refetchInterval: 60000,
  });

  // Combine data
  const allMarketData: MarketItem[] = [
    ...(cryptoData?.map((item: any) => ({
      ...item,
      market_type: 'crypto' as const
    })) || []),
    ...(metalsData?.map((item: any) => ({
      ...item,
      market_type: 'metals' as const
    })) || [])
  ];

  // Filter data based on search and tab
  const filteredData = allMarketData.filter((item) => {
    const matchesSearch = 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && item.market_type === selectedTab;
  });

  const formatPrice = (price: number, marketType: string, unit?: string) => {
    if (marketType === 'metals' && unit) {
      return `$${price.toLocaleString()} per ${unit}`;
    }
    return `$${price.toLocaleString()}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const isLoading = cryptoLoading || metalsLoading;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">
                Dual Asset Markets
              </h1>
              <p className="text-xl text-gray-600">
                Live prices for cryptocurrencies and precious metals
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => {
                  refetchCrypto();
                  refetchMetals();
                }} 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => navigate('/trading')}
                className="bg-green-500 hover:bg-green-600"
              >
                Start Trading
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Tabs */}
        <Card className="border border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cryptocurrencies or metals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                  <TabsTrigger value="all" className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>All Markets</span>
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="flex items-center space-x-2">
                    <Bitcoin className="w-4 h-4" />
                    <span>Crypto</span>
                  </TabsTrigger>
                  <TabsTrigger value="metals" className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Metals</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Assets</p>
                  <p className="text-2xl font-bold text-black">
                    {allMarketData.length}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cryptocurrencies</p>
                  <p className="text-2xl font-bold text-black">
                    {allMarketData.filter(item => item.market_type === 'crypto').length}
                  </p>
                </div>
                <Bitcoin className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Precious Metals</p>
                  <p className="text-2xl font-bold text-black">
                    {allMarketData.filter(item => item.market_type === 'metals').length}
                  </p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gainers Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allMarketData.filter(item => item.price_change_percentage_24h > 0).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-gray-600">Loading market data...</p>
          </div>
        ) : (
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">
                {selectedTab === 'all' ? 'All Markets' : 
                 selectedTab === 'crypto' ? 'Cryptocurrency Markets' : 
                 'Precious Metals Markets'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Asset</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">24h Change</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Market Cap</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Volume</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((asset, index) => (
                      <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-500">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {asset.market_type === 'crypto' ? (
                              <img 
                                src={asset.image || getCryptoLogo(asset.symbol)} 
                                alt={asset.symbol}
                                className="w-8 h-8"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-black">{asset.symbol}</div>
                              <div className="text-sm text-gray-500">{asset.name}</div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={asset.market_type === 'crypto' ? 'border-orange-300 text-orange-600' : 'border-yellow-300 text-yellow-600'}
                            >
                              {asset.market_type}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-black">
                            {formatPrice(asset.current_price, asset.market_type, asset.unit)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`flex items-center space-x-1 ${
                            asset.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {asset.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                              {asset.price_change_percentage_24h >= 0 ? '+' : ''}
                              {asset.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {asset.market_cap ? formatMarketCap(asset.market_cap) : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {asset.total_volume ? formatMarketCap(asset.total_volume) : 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => navigate(`/trading?symbol=${asset.symbol}&type=${asset.market_type}`)}
                            >
                              Trade
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-gray-600 hover:text-black"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-black mb-2">No Assets Found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or check a different market category.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Market Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Top Gainers (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allMarketData
                  .filter(item => item.price_change_percentage_24h > 0)
                  .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                  .slice(0, 5)
                  .map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {asset.market_type === 'crypto' ? (
                          <img 
                            src={asset.image || getCryptoLogo(asset.symbol)} 
                            alt={asset.symbol}
                            className="w-6 h-6"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="font-medium text-black">{asset.symbol}</span>
                      </div>
                      <div className="text-green-600 font-medium">
                        +{asset.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Top Losers (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allMarketData
                  .filter(item => item.price_change_percentage_24h < 0)
                  .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                  .slice(0, 5)
                  .map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {asset.market_type === 'crypto' ? (
                          <img 
                            src={asset.image || getCryptoLogo(asset.symbol)} 
                            alt={asset.symbol}
                            className="w-6 h-6"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="font-medium text-black">{asset.symbol}</span>
                      </div>
                      <div className="text-red-600 font-medium">
                        {asset.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}