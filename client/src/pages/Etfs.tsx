
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
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  BarChart3,
  PieChart,
  Globe,
  DollarSign,
  Star,
  Shield,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const etfData = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    category: "US Equity",
    price: 412.56,
    change: 1.23,
    changePercent: 0.30,
    volume: "45.2M",
    expense: "0.09%",
    aum: "$385.2B",
    description: "Tracks the S&P 500 Index"
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    category: "Technology",
    price: 368.45,
    change: -2.15,
    changePercent: -0.58,
    volume: "32.1M",
    expense: "0.20%",
    aum: "$175.8B",
    description: "Tracks the NASDAQ-100 Index"
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    category: "US Equity",
    price: 245.78,
    change: 0.89,
    changePercent: 0.36,
    volume: "12.5M",
    expense: "0.03%",
    aum: "$1.2T",
    description: "Tracks the entire US stock market"
  },
  {
    symbol: "IWDA",
    name: "iShares Core MSCI World UCITS ETF",
    category: "Global Equity",
    price: 78.92,
    change: 0.45,
    changePercent: 0.57,
    volume: "5.8M",
    expense: "0.20%",
    aum: "$52.1B",
    description: "Tracks developed world markets"
  },
  {
    symbol: "EIMI",
    name: "iShares Core MSCI Emerging Markets",
    category: "Emerging Markets",
    price: 58.34,
    change: -0.78,
    changePercent: -1.32,
    volume: "2.1M",
    expense: "0.18%",
    aum: "$12.5B",
    description: "Tracks emerging market equities"
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    category: "Bonds",
    price: 78.45,
    change: 0.12,
    changePercent: 0.15,
    volume: "8.9M",
    expense: "0.03%",
    aum: "$298.7B",
    description: "Tracks the US bond market"
  }
];

const categories = ["All", "US Equity", "Global Equity", "Technology", "Emerging Markets", "Bonds", "Real Estate"];

export default function Etfs() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEtfs, setFilteredEtfs] = useState(etfData);

  useEffect(() => {
    let filtered = etfData;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(etf => etf.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(etf => 
        etf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etf.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEtfs(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BarChart3 className="w-4 h-4" />
              <span>🇪🇺 UCITS ETFs available</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              ETFs
              <span className="text-green-600 block mt-2">Exchange-Traded Funds</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Diversify your portfolio with ETFs. Access global markets, sectors, and themes with low-cost, transparent funds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4">
                Start investing
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-4">
                Learn about ETFs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search ETFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <div className="flex flex-wrap gap-2">
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
      </section>

      {/* ETF List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {filteredEtfs.map((etf) => (
              <Card key={etf.symbol} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{etf.symbol}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {etf.category}
                            </Badge>
                          </div>
                          <h4 className="text-lg text-gray-700 mb-2">{etf.name}</h4>
                          <p className="text-sm text-gray-600">{etf.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Expense Ratio</span>
                          <div className="font-semibold">{etf.expense}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">AUM</span>
                          <div className="font-semibold">{etf.aum}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Volume</span>
                          <div className="font-semibold">{etf.volume}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Category</span>
                          <div className="font-semibold">{etf.category}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          €{etf.price.toFixed(2)}
                        </div>
                        <div className={`flex items-center justify-end text-sm font-medium ${
                          etf.change >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {etf.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {etf.change >= 0 ? '+' : ''}€{etf.change.toFixed(2)} ({etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%)
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none">
                          Invest
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEtfs.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No ETFs found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Why ETFs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why invest in ETFs?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ETFs offer diversification, low costs, and easy access to global markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PieChart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Diversification</h3>
              <p className="text-gray-600">Access hundreds or thousands of stocks with a single purchase</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Low Costs</h3>
              <p className="text-gray-600">Lower expense ratios compared to actively managed funds</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Access</h3>
              <p className="text-gray-600">Invest in markets and sectors worldwide from one platform</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to diversify your portfolio?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Start investing in ETFs from just €1. Build a diversified portfolio with low-cost funds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4">
              Start investing
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-12 py-4">
              Learn more
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
