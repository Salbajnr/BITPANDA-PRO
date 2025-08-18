
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  DollarSign,
  Search,
  Filter,
  BarChart3,
  Zap,
  Globe,
  Fuel,
  Wheat,
  Mountain
} from "lucide-react";
import Navbar from "@/components/Navbar";

const commodities = [
  { 
    symbol: "BRENT", 
    name: "Brent Crude Oil", 
    price: 73.45, 
    change: 2.1,
    category: "Energy",
    description: "North Sea crude oil benchmark",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: Fuel
  },
  { 
    symbol: "NATGAS", 
    name: "Natural Gas", 
    price: 2.89, 
    change: -1.3,
    category: "Energy",
    description: "Natural gas futures contract",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: Zap
  },
  { 
    symbol: "WHEAT", 
    name: "Wheat", 
    price: 594.25, 
    change: 0.8,
    category: "Agriculture",
    description: "Chicago wheat futures",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: Wheat
  },
  { 
    symbol: "SOYBEAN", 
    name: "Soybeans", 
    price: 1247.50, 
    change: -0.5,
    category: "Agriculture",
    description: "Chicago soybean futures",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: Wheat
  },
  { 
    symbol: "COPPER", 
    name: "Copper", 
    price: 4.12, 
    change: 1.7,
    category: "Metals",
    description: "Industrial metal futures",
    color: "text-orange-800",
    bgColor: "bg-orange-200",
    icon: Mountain
  },
  { 
    symbol: "NICKEL", 
    name: "Nickel", 
    price: 16.87, 
    change: -2.1,
    category: "Metals",
    description: "London Metal Exchange nickel",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: Mountain
  },
  { 
    symbol: "CORN", 
    name: "Corn", 
    price: 423.75, 
    change: 1.2,
    category: "Agriculture",
    description: "Chicago corn futures",
    color: "text-yellow-700",
    bgColor: "bg-yellow-200",
    icon: Wheat
  },
  { 
    symbol: "COFFEE", 
    name: "Coffee", 
    price: 215.30, 
    change: 0.9,
    category: "Agriculture",
    description: "Arabica coffee futures",
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    icon: Globe
  }
];

const categories = ["All", "Energy", "Agriculture", "Metals"];

export default function Commodities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCommodities = commodities.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || commodity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>/</span>
          <span>Prices</span>
          <span>/</span>
          <span className="text-green-600 font-medium">Commodities</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Commodities* prices
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the current commodities prices, price history and charts at a glance. 
            Follow your favourite commodity* price today. Terms and risks apply.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Trading</h3>
              <p className="text-gray-600">Trade commodities around the clock with real-time pricing</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Markets</h3>
              <p className="text-gray-600">Access international commodity markets from one platform</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Fees</h3>
              <p className="text-gray-600">Competitive pricing with transparent fee structure</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search commodities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Category:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Commodities Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Live Commodities Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCommodities.map((commodity, index) => {
              const IconComponent = commodity.icon;
              return (
                <Card key={commodity.symbol} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${commodity.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${commodity.color}`} />
                      </div>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">{commodity.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 uppercase">{commodity.symbol}</p>
                        <Badge variant="outline" className="text-xs">
                          {commodity.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="font-bold text-gray-900 text-xl">
                        ${commodity.price.toLocaleString()}
                      </div>
                      <div className={`text-sm flex items-center font-medium mt-1 ${
                        commodity.change >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {commodity.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {commodity.change >= 0 ? '+' : ''}{commodity.change}%
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{commodity.description}</p>

                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Trade {commodity.symbol}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Commodity Market Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Sector</h3>
              <p className="text-gray-600 mb-4">
                Energy commodities like crude oil and natural gas are influenced by geopolitical events, 
                supply chain disruptions, and global economic conditions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Real-time price tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Market volatility indicators
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Supply & demand analysis
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agricultural Commodities</h3>
              <p className="text-gray-600 mb-4">
                Agricultural futures are affected by weather patterns, seasonal cycles, 
                and global food demand trends.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Seasonal price patterns
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Weather impact analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Global trade flows
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Get Started */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to start trading commodities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up and complete your verification to access commodity trading</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fund Your Account</h3>
              <p className="text-gray-600">Deposit funds using various payment methods to start trading</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Trading</h3>
              <p className="text-gray-600">Choose your commodities and execute trades with real-time pricing</p>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Risk Notice</h3>
          <p className="text-yellow-700 text-sm">
            *Commodity trading involves significant risk and may not be suitable for all investors. 
            Prices can be extremely volatile and you may lose more than your initial investment. 
            Please ensure you understand the risks before trading.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to start trading commodities?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Join thousands of traders who trust BitpandaPro for commodity trading. 
            Start with as little as €25 and access global commodity markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8">
              Start Trading Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
