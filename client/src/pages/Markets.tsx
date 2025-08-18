import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { getCryptoLogo } from "@/components/CryptoLogos";
import {
  TrendingUp, TrendingDown, Search, RefreshCw,
  Bitcoin, Star, Eye
} from "lucide-react";

export default function Markets() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch crypto data
  const { data: cryptoData, isLoading, refetch } = useQuery({
    queryKey: ['/api/crypto/market-data'],
    refetchInterval: 30000,
  });

  // Filter data based on search
  const filteredData = cryptoData?.filter((item: any) => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatPrice = (price: number) => {
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
                Crypto Markets
              </h1>
              <p className="text-xl text-gray-600">
                Live cryptocurrency prices and market data
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="border border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500"
              />
            </div>
          </CardContent>
        </Card>

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
                Cryptocurrency Markets
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
                    {filteredData.map((asset: any, index: number) => (
                      <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-500">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={asset.image || getCryptoLogo(asset.symbol)} 
                              alt={asset.symbol}
                              className="w-8 h-8"
                            />
                            <div>
                              <div className="font-medium text-black">{asset.symbol}</div>
                              <div className="text-sm text-gray-500">{asset.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-black">
                            {formatPrice(asset.current_price)}
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
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}