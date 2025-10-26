import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  DollarSign,
  BarChart3,
  Building2,
  Globe,
  Star,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  Shield,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
  exchange: string;
}

export default function Stocks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");

  // Fetch stocks from API
  const { data: stocks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/stocks/market-data'],
    queryFn: async () => {
      try {
        return await api.get('/stocks/market-data');
      } catch (err) {
        console.error('Failed to fetch stocks:', err);
        return [];
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 3
  });

  const sectors = ["all", "Technology", "Financial", "Healthcare", "Energy", "Automotive", "Consumer"];

  const filteredStocks = stocks.filter((stock: Stock) => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Trading</h1>
              <p className="text-xl text-gray-600">
                Trade global stocks with real-time prices and zero commission
              </p>
            </div>
            <div className="text-right">
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
                className="mb-2"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <p className="text-xs text-gray-500">
                Live market data
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 mb-1">Zero Commission</h3>
              <p className="text-xs text-green-700">No trading fees on stock purchases</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 mb-1">Instant Execution</h3>
              <p className="text-xs text-blue-700">Real-time trading with instant fills</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 mb-1">Global Markets</h3>
              <p className="text-xs text-purple-700">Access US, European, and Asian stocks</p>
            </CardContent>
          </Card>

          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800 mb-1">Regulated</h3>
              <p className="text-xs text-orange-700">EU-regulated and investor protected</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stocks by name or symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector === "all" ? "All Sectors" : sector}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Stock List */}
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading real-time stock data...</p>
            </div>
          ) : error || filteredStocks.length === 0 ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8 text-center">
                <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Stock Trading Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  We're expanding our stock offerings. Soon you'll have access to thousands of global stocks with zero commission.
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check for Updates
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Notified
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredStocks.map((stock: Stock) => (
                <Card key={stock.symbol} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{stock.symbol}</h3>
                          <p className="text-sm text-gray-600">{stock.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                            <Badge variant="outline" className="text-xs">{stock.exchange}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-xl">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div className={`text-sm flex items-center justify-center font-medium ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {stock.changePercent >= 0 ? 
                            <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                          }
                          {stock.changePercent >= 0 ? '+' : ''}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-600">
                        <div>Vol: {(stock.volume / 1000000).toFixed(1)}M</div>
                        <div>Cap: {stock.marketCap}</div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          Buy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Market Information */}
        <Tabs defaultValue="market-hours" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market-hours">Market Hours</TabsTrigger>
            <TabsTrigger value="trading-info">Trading Info</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          <TabsContent value="market-hours" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Global Market Hours
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">US Markets (EST)</h4>
                    <p className="text-sm text-gray-600">NYSE & NASDAQ</p>
                    <p className="text-sm font-medium text-green-600">9:30 AM - 4:00 PM</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Open</Badge>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">European Markets (CET)</h4>
                    <p className="text-sm text-gray-600">LSE, Euronext</p>
                    <p className="text-sm font-medium text-gray-600">8:00 AM - 4:30 PM</p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">Closed</Badge>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Asian Markets (JST)</h4>
                    <p className="text-sm text-gray-600">TSE, HKEX</p>
                    <p className="text-sm font-medium text-gray-600">9:00 AM - 3:00 PM</p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">Closed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading-info" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Commission Structure</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• US Stocks: €0 commission</li>
                        <li>• European Stocks: €0 commission</li>
                        <li>• Minimum order: €1</li>
                        <li>• No account maintenance fees</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Types</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Market orders</li>
                        <li>• Limit orders</li>
                        <li>• Stop-loss orders</li>
                        <li>• Good-till-cancelled (GTC)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Settlement</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• US Stocks: T+2 settlement</li>
                        <li>• European Stocks: T+2 settlement</li>
                        <li>• Instant buying power</li>
                        <li>• Real-time portfolio updates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Coverage</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 2,000+ US stocks</li>
                        <li>• 600+ European stocks</li>
                        <li>• All major indices</li>
                        <li>• Real-time data included</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="getting-started" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">How to Start Trading Stocks</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fund Your Account</h4>
                    <p className="text-sm text-gray-600">Deposit funds using bank transfer, card, or other methods</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-bold text-blue-600">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Research & Select</h4>
                    <p className="text-sm text-gray-600">Browse stocks, analyze performance, and build your watchlist</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-bold text-blue-600">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Start Trading</h4>
                    <p className="text-sm text-gray-600">Place orders and track your portfolio performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Trading Stocks Today
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join millions of investors who trade commission-free with real-time data and instant execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              <Target className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Markets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}