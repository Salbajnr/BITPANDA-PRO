import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, TrendingDown, Star, DollarSign } from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image?: string;
}

interface MetalData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  unit: string;
}

export default function Markets() {
  const [activeTab, setActiveTab] = useState("crypto");
  const [searchTerm, setSearchTerm] = useState(""); // State for search

  // Fetch crypto data
  const { data: cryptoResponse, isLoading: cryptoLoading, refetch: refetchCrypto } = useQuery({
    queryKey: ['/api/crypto/market-data'],
    refetchInterval: 30000,
  });

  // Fetch metals data
  const { data: metalsData, isLoading: metalsLoading, refetch: refetchMetals } = useQuery({
    queryKey: ['/api/metals/market-data'],
    refetchInterval: 60000,
  });

  // Extract crypto data from response object - handle different response formats
  let cryptoData: CryptoData[] = [];
  
  if (cryptoResponse) {
    if (Array.isArray(cryptoResponse)) {
      cryptoData = cryptoResponse;
    } else if (cryptoResponse.data && Array.isArray(cryptoResponse.data)) {
      cryptoData = cryptoResponse.data;
    } else if (typeof cryptoResponse === 'object') {
      // If it's an object with crypto data directly
      const values = Object.values(cryptoResponse);
      cryptoData = values.filter((item: any) => 
        item && typeof item === 'object' && item.symbol && item.current_price
      ) as CryptoData[];
    }
  }

  // Ensure cryptoData is always an array
  if (!Array.isArray(cryptoData)) {
    cryptoData = [];
  }

  // Filter and sort crypto data
  const filteredCryptos = searchTerm && cryptoData.length > 0 ? 
    cryptoData.filter((coin: CryptoData) =>
      coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : cryptoData;

  const topCryptos = filteredCryptos.slice(0, 50).sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const CryptoCard = ({ crypto }: { crypto: CryptoData }) => (
    <Card className="hover:shadow-lg transition-shadow border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={crypto.image || getCryptoLogo(crypto.symbol)} 
              alt={crypto.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = getCryptoLogo(crypto.symbol);
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
              <p className="text-sm text-gray-500">{crypto.symbol?.toUpperCase()}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price</span>
            <span className="font-bold text-lg">{formatCurrency(crypto.current_price)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">24h Change</span>
            <div className={`flex items-center space-x-1 ${
              crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {crypto.price_change_percentage_24h >= 0 ? 
                <TrendingUp className="w-4 h-4" /> : 
                <TrendingDown className="w-4 h-4" />
              }
              <span className="font-medium">
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Market Cap</span>
            <span className="font-medium">{formatMarketCap(crypto.market_cap)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Volume (24h)</span>
            <span className="font-medium">{formatMarketCap(crypto.total_volume)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MetalCard = ({ metal }: { metal: MetalData }) => (
    <Card className="hover:shadow-lg transition-shadow border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{metal.name}</h3>
              <p className="text-sm text-gray-500">{metal.symbol}</p>
            </div>
          </div>
          <Badge variant="secondary">{metal.unit}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price per {metal.unit}</span>
            <span className="font-bold text-lg">{formatCurrency(metal.current_price)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">24h Change</span>
            <div className={`flex items-center space-x-1 ${
              metal.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {metal.price_change_percentage_24h >= 0 ? 
                <TrendingUp className="w-4 h-4" /> : 
                <TrendingDown className="w-4 h-4" />
              }
              <span className="font-medium">
                {Math.abs(metal.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">Markets Overview</h1>
              <p className="text-xl text-gray-600">
                Real-time prices for cryptocurrencies and precious metals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search crypto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                onClick={() => {
                  refetchCrypto();
                  refetchMetals();
                }} 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Markets Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
            <TabsTrigger value="metals">Precious Metals</TabsTrigger>
          </TabsList>

          {/* Crypto Tab */}
          <TabsContent value="crypto">
            {cryptoLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : topCryptos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No cryptocurrencies match your search.' : 'Unable to load market data at this time.'}
                </p>
                <Button 
                  onClick={() => {
                    refetchCrypto();
                    setSearchTerm('');
                  }}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topCryptos.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Metals Tab */}
          <TabsContent value="metals">
            {metalsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(metalsData) && metalsData.map((metal: MetalData) => (
                  <MetalCard key={metal.id} metal={metal} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}