import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Info,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

interface ETFData {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  expense: string;
  aum: string;
  description: string;
}

const etfDataFallback = [
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

  // Fetch ETFs from API
  const { data: etfData = etfDataFallback, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/etfs/market-data'],
    queryFn: async () => {
      try {
        return await api.get('/etfs/market-data');
      } catch (err) {
        console.error('Failed to fetch ETFs:', err);
        return etfDataFallback;
      }
    },
    refetchInterval: 60000,
    retry: 3
  });

  const [filteredEtfs, setFilteredEtfs] = useState<ETFData[]>([]);

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

            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
          {error ? (
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load ETF Data</h3>
                <p className="text-gray-600 mb-4">ETF trading is currently unavailable. Showing cached data.</p>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
              <p className="text-gray-600">Loading ETF data...</p>
            </div>
          ) : null}
          
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