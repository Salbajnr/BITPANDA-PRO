
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  PieChart,
  DollarSign,
  Globe,
  Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";

const etfs = [
  { 
    symbol: "SPY", 
    name: "SPDR S&P 500 ETF Trust", 
    price: 456.78, 
    change: 1.2, 
    category: "Equity", 
    region: "US",
    fee: 0.09,
    description: "Tracks the S&P 500 index"
  },
  { 
    symbol: "VTI", 
    name: "Vanguard Total Stock Market ETF", 
    price: 234.56, 
    change: -0.8, 
    category: "Equity", 
    region: "US",
    fee: 0.03,
    description: "Total US stock market exposure"
  },
  { 
    symbol: "QQQ", 
    name: "Invesco QQQ Trust", 
    price: 378.92, 
    change: 2.1, 
    category: "Technology", 
    region: "US",
    fee: 0.20,
    description: "NASDAQ-100 technology stocks"
  },
  { 
    symbol: "VEA", 
    name: "Vanguard FTSE Developed Markets ETF", 
    price: 48.73, 
    change: 0.5, 
    category: "International", 
    region: "Global",
    fee: 0.05,
    description: "Developed markets outside US and Canada"
  },
  { 
    symbol: "BND", 
    name: "Vanguard Total Bond Market ETF", 
    price: 78.45, 
    change: -0.2, 
    category: "Bonds", 
    region: "US",
    fee: 0.03,
    description: "US investment-grade bonds"
  },
  { 
    symbol: "GLD", 
    name: "SPDR Gold Shares", 
    price: 189.34, 
    change: 1.8, 
    category: "Commodities", 
    region: "Global",
    fee: 0.40,
    description: "Physical gold exposure"
  }
];

const categories = ["All", "Equity", "Bonds", "Technology", "International", "Commodities"];

export default function Etfs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEtfs = etfs.filter(etf => {
    const matchesSearch = etf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         etf.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || etf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ETFs</h1>
          <p className="text-xl text-gray-600">
            Diversify your portfolio with low-cost exchange-traded funds
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <PieChart className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Diversification</h3>
              <p className="text-gray-600">Get exposure to hundreds of stocks with a single investment</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Fees</h3>
              <p className="text-gray-600">Most ETFs have expense ratios below 0.20%</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600">See exactly what you own with daily holdings disclosure</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search ETFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* ETFs List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Available ETFs</h2>
            <p className="text-gray-600">Build a diversified portfolio with low-cost ETFs</p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredEtfs.map((etf, index) => (
              <div key={etf.symbol} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{etf.name}</div>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500 uppercase font-medium">{etf.symbol}</span>
                        <Badge variant="secondary" className="text-xs">{etf.category}</Badge>
                        <Badge variant="outline" className="text-xs">{etf.region}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{etf.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-xl">
                      ${etf.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end font-medium ${
                      etf.change >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {etf.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {etf.change >= 0 ? '+' : ''}{etf.change}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fee: {etf.fee}%
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              New to ETFs?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exchange-traded funds (ETFs) are investment funds that track an index, commodity, 
              bonds, or basket of assets. They offer instant diversification and low fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Global Exposure</h4>
              <p className="text-sm text-gray-600">Access markets worldwide with a single purchase</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cost Effective</h4>
              <p className="text-sm text-gray-600">Lower fees than actively managed funds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Diversification</h4>
              <p className="text-sm text-gray-600">Spread risk across hundreds of investments</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
              Learn More About ETFs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
