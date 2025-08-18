
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  BarChart3,
  DollarSign,
  Filter,
  ArrowUpDown
} from "lucide-react";
import Navbar from "@/components/Navbar";

const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 1.85, sector: "Technology", market: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.85, change: -0.67, sector: "Technology", market: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: 2.14, sector: "Technology", market: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.86, change: -1.23, sector: "Consumer Discretionary", market: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.87, change: 3.45, sector: "Automotive", market: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.28, change: 4.12, sector: "Technology", market: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms Inc.", price: 485.67, change: -0.89, sector: "Technology", market: "NASDAQ" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 179.45, change: 0.56, sector: "Financial Services", market: "NYSE" }
];

const sectors = ["All", "Technology", "Financial Services", "Healthcare", "Consumer Discretionary", "Automotive"];

export default function Stocks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  useEffect(() => {
    let filtered = stocks.filter(stock => 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSector !== "All") {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    // Sort stocks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "change":
          return b.change - a.change;
        default:
          return 0;
      }
    });

    setFilteredStocks(filtered);
  }, [searchTerm, selectedSector, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stocks</h1>
          <p className="text-xl text-gray-600">
            Invest in fractional shares of your favorite companies from €1
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sector Filter */}
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>

            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">S&P 500</p>
                  <p className="text-2xl font-bold text-gray-900">4,567.23</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">+1.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">NASDAQ</p>
                  <p className="text-2xl font-bold text-gray-900">14,123.89</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="font-medium">-0.5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dow Jones</p>
                  <p className="text-2xl font-bold text-gray-900">35,789.45</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">+0.8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">VIX</p>
                  <p className="text-2xl font-bold text-gray-900">18.76</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="font-medium">-2.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stocks Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Available Stocks</h2>
            <p className="text-gray-600">Start investing from €1 with fractional shares</p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStocks.map((stock, index) => (
              <div key={stock.symbol} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{stock.name}</div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 uppercase font-medium">{stock.symbol}</span>
                        <Badge variant="secondary" className="text-xs">{stock.sector}</Badge>
                        <Badge variant="outline" className="text-xs">{stock.market}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-xl">
                      ${stock.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end font-medium ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start investing in stocks today
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Build your portfolio with fractional shares from the world's biggest companies. 
            No minimum investment, start from just €1.
          </p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8">
            Open Investment Account
          </Button>
        </div>
      </div>
    </div>
  );
}
