import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Search,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Award,
  BarChart3,
  Coins
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';

export default function Commodities() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch real commodities data from API
  const { data: commodities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/metals/market-data'],
    queryFn: async () => {
      const response = await fetch('/api/metals/market-data');
      if (!response.ok) throw new Error('Failed to fetch commodities');
      return response.json();
    },
    refetchInterval: 30000,
    retry: 2
  });

  const filteredCommodities = commodities.filter((commodity: any) =>
    (selectedCategory === "all" || commodity.category === selectedCategory) &&
    (commodity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     commodity.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Categorize metals
  const preciousMetals = filteredCommodities.filter((c: any) => 
    ['XAU', 'XAG', 'XPT', 'XPD'].includes(c.symbol)
  );

  const industrialMetals = filteredCommodities.filter((c: any) => 
    !['XAU', 'XAG', 'XPT', 'XPD'].includes(c.symbol)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading commodities data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-red-500">Error loading commodities data. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Precious Metals Trading
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Invest in gold, silver, platinum, and other precious metals with real-time pricing and secure custody.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Secure Storage
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Real-time Prices
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Global Markets
              </Badge>
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-amber-600 hover:text-amber-700"
              onClick={() => setLocation('/metals-trading')}
            >
              Start Trading Metals
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search metals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Prices
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Secure Custody</h3>
              <p className="text-sm text-gray-600">Your metals are stored in secure, insured vaults</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Live Pricing</h3>
              <p className="text-sm text-gray-600">Real-time market prices updated every 30 seconds</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <Coins className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Fractional Trading</h3>
              <p className="text-sm text-gray-600">Buy any amount starting from small quantities</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Portfolio Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your metals investments in real-time</p>
            </CardContent>
          </Card>
        </div>

        {/* Metals Trading Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All Metals ({filteredCommodities.length})
            </TabsTrigger>
            <TabsTrigger value="precious" onClick={() => setSelectedCategory("precious")}>
              Precious ({preciousMetals.length})
            </TabsTrigger>
            <TabsTrigger value="industrial" onClick={() => setSelectedCategory("industrial")}>
              Industrial ({industrialMetals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCommodities.map((commodity: any) => (
                <Card key={commodity.symbol} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{commodity.name}</CardTitle>
                      <Badge variant="outline">{commodity.symbol}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          ${commodity.price?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">per {commodity.unit || 'oz'}</div>
                      </div>
                      <div className={`flex items-center text-sm font-semibold ${
                        commodity.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {commodity.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {commodity.change24h >= 0 ? '+' : ''}{commodity.change24h?.toFixed(2)}%
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => setLocation(`/metals-trading?symbol=${commodity.symbol}`)}
                      >
                        Trade {commodity.symbol}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="precious" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {preciousMetals.map((commodity: any) => (
                <Card key={commodity.symbol} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{commodity.name}</CardTitle>
                      <Badge variant="outline" className="bg-amber-50">{commodity.symbol}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          ${commodity.price?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">per {commodity.unit || 'oz'}</div>
                      </div>
                      <div className={`flex items-center text-sm font-semibold ${
                        commodity.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {commodity.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {commodity.change24h >= 0 ? '+' : ''}{commodity.change24h?.toFixed(2)}%
                      </div>
                      <Button 
                        className="w-full mt-4 bg-amber-600 hover:bg-amber-700" 
                        onClick={() => setLocation(`/metals-trading?symbol=${commodity.symbol}`)}
                      >
                        Trade {commodity.symbol}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="industrial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industrialMetals.map((commodity: any) => (
                <Card key={commodity.symbol} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-400">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{commodity.name}</CardTitle>
                      <Badge variant="outline" className="bg-blue-50">{commodity.symbol}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          ${commodity.price?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">per {commodity.unit || 'lb'}</div>
                      </div>
                      <div className={`flex items-center text-sm font-semibold ${
                        commodity.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {commodity.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {commodity.change24h >= 0 ? '+' : ''}{commodity.change24h?.toFixed(2)}%
                      </div>
                      <Button 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
                        onClick={() => setLocation(`/metals-trading?symbol=${commodity.symbol}`)}
                      >
                        Trade {commodity.symbol}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Why Trade Metals Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Trade Precious Metals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Portfolio Diversification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Precious metals provide a hedge against inflation and market volatility, helping to balance your investment portfolio.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Store of Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gold and silver have maintained their value throughout history, serving as reliable stores of wealth across generations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Global Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Precious metals are universally recognized and traded globally, ensuring liquidity and worldwide acceptance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Trading Precious Metals?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of investors who trust BITPANDA PRO for secure, efficient precious metals trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-amber-600 hover:text-amber-700"
                onClick={() => setLocation('/metals-trading')}
              >
                Start Trading Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => setLocation('/markets')}
              >
                View All Markets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}