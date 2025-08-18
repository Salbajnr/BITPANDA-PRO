
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  DollarSign,
  Shield,
  Coins,
  Award,
  BarChart3,
  RefreshCw,
  Info,
  Target,
  Zap,
  Lock,
  Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated: string;
}

export default function PreciousMetals() {
  const [metals, setMetals] = useState<MetalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetalPrices();
    const interval = setInterval(fetchMetalPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchMetalPrices = async () => {
    try {
      const response = await fetch('/api/metals/top/4');
      if (response.ok) {
        const data = await response.json();
        setMetals(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch metal prices:', error);
      // Fallback data if API fails
      setMetals([
        { symbol: "XAU", name: "Gold", price: 2045.67, change_24h: 1.8, unit: "oz", last_updated: new Date().toISOString() },
        { symbol: "XAG", name: "Silver", price: 24.89, change_24h: -0.5, unit: "oz", last_updated: new Date().toISOString() },
        { symbol: "XPT", name: "Platinum", price: 1056.34, change_24h: 2.3, unit: "oz", last_updated: new Date().toISOString() },
        { symbol: "XPD", name: "Palladium", price: 1234.78, change_24h: -1.2, unit: "oz", last_updated: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getMetalColor = (symbol: string) => {
    const colors = {
      XAU: { color: "text-yellow-600", bgColor: "bg-yellow-100", borderColor: "border-yellow-200" },
      XAG: { color: "text-gray-600", bgColor: "bg-gray-100", borderColor: "border-gray-200" },
      XPT: { color: "text-blue-600", bgColor: "bg-blue-100", borderColor: "border-blue-200" },
      XPD: { color: "text-purple-600", bgColor: "bg-purple-100", borderColor: "border-purple-200" }
    };
    return colors[symbol as keyof typeof colors] || { color: "text-gray-600", bgColor: "bg-gray-100", borderColor: "border-gray-200" };
  };

  const getMetalDescription = (symbol: string) => {
    const descriptions = {
      XAU: "Ultimate store of value and inflation hedge",
      XAG: "Industrial metal with strong investment demand",
      XPT: "Rare automotive catalyst with limited supply",
      XPD: "Critical for clean technology applications"
    };
    return descriptions[symbol as keyof typeof descriptions] || "Precious metal investment";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Precious Metals</h1>
              <p className="text-xl text-gray-600">
                Secure your wealth with physical precious metals
              </p>
            </div>
            <div className="text-right">
              <Button 
                onClick={fetchMetalPrices} 
                variant="outline" 
                size="sm"
                disabled={loading}
                className="mb-2"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <p className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 mb-1">Inflation Protection</h3>
              <p className="text-xs text-green-700">Hedge against currency devaluation</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 mb-1">Secure Storage</h3>
              <p className="text-xs text-blue-700">Insured vault storage worldwide</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 mb-1">Portfolio Balance</h3>
              <p className="text-xs text-purple-700">Diversify beyond traditional assets</p>
            </CardContent>
          </Card>

          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800 mb-1">Instant Trading</h3>
              <p className="text-xs text-orange-700">Buy and sell at market prices</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Market Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Live Market Prices</h2>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metals.map((metal) => {
              const metalStyle = getMetalColor(metal.symbol);
              return (
                <Card key={metal.symbol} className={`border ${metalStyle.borderColor} hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${metalStyle.bgColor} rounded-lg flex items-center justify-center`}>
                        <Coins className={`w-6 h-6 ${metalStyle.color}`} />
                      </div>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">{metal.name}</h3>
                      <p className="text-sm text-gray-500 uppercase">{metal.symbol}</p>
                    </div>

                    <div className="mb-4">
                      <div className="font-bold text-gray-900 text-xl">
                        ${metal.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">per {metal.unit}</div>
                      <div className={`text-sm flex items-center font-medium mt-1 ${
                        metal.change_24h >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {metal.change_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {metal.change_24h >= 0 ? '+' : ''}{metal.change_24h.toFixed(2)}%
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{getMetalDescription(metal.symbol)}</p>

                    <div className="space-y-2">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Buy {metal.name}
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Chart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="how-it-works" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="storage-security">Storage & Security</TabsTrigger>
            <TabsTrigger value="why-metals">Why Precious Metals</TabsTrigger>
          </TabsList>

          <TabsContent value="how-it-works" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Simple 3-Step Process</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Metal</h4>
                    <p className="text-gray-600">Select from gold, silver, platinum, or palladium. Start from as little as €25.</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Purchase</h4>
                    <p className="text-gray-600">We purchase allocated metals and store them in high-security vaults on your behalf.</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Trade Anytime</h4>
                    <p className="text-gray-600">Sell instantly at current market prices or hold for long-term wealth preservation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage-security" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Bank-Grade Security</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Your precious metals are stored in the world's most secure facilities with comprehensive insurance coverage.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Allocated Storage</h4>
                        <p className="text-sm text-gray-600">You own specific, identified metal bars - not paper certificates</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Global Vaults</h4>
                        <p className="text-sm text-gray-600">Secure facilities in Switzerland, UK, Canada, and Singapore</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Full Insurance</h4>
                        <p className="text-sm text-gray-600">Comprehensive coverage through Lloyd's of London underwriters</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Regular Audits</h4>
                        <p className="text-sm text-gray-600">Independent third-party audits ensure metal integrity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="why-metals" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Precious Metals?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        Historical Performance
                      </h4>
                      <p className="text-gray-600">Gold has maintained purchasing power over millennia, protecting wealth through economic cycles.</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        Crisis Protection
                      </h4>
                      <p className="text-gray-600">Precious metals often perform well during economic uncertainty and market volatility.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                        Portfolio Diversification
                      </h4>
                      <p className="text-gray-600">Low correlation with stocks and bonds provides balance to investment portfolios.</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Coins className="w-5 h-5 text-yellow-600 mr-2" />
                        Tangible Asset
                      </h4>
                      <p className="text-gray-600">Physical ownership of real assets that can't be printed or digitally created.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Your Precious Metals Journey
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of investors who trust us with their precious metals investments. 
            Start from just €25 with no storage fees for the first year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8">
              <Coins className="w-5 h-5 mr-2" />
              Start Investing Now
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white px-8">
              <Info className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
