import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  Star,
  Shield,
  Coins,
  Globe,
  Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCryptoLogo } from "@/components/CryptoLogos";
import { useQuery } from "@tanstack/react-query";

const cryptoIndices = [
  {
    id: "bci10",
    name: "BITPANDA CRYPTO INDEX",
    symbol: "BCI10",
    description: "Top 10 cryptocurrencies by market cap, automatically rebalanced",
    price: 1243.56,
    change: 3.45,
    changePercent: 0.28,
    volume: "2.8M",
    components: 10,
    marketCap: "1.2T",
    rebalancing: "Monthly",
    topHoldings: [
      { symbol: "BTC", weight: 45.2 },
      { symbol: "ETH", weight: 28.1 },
      { symbol: "BNB", weight: 8.3 },
      { symbol: "XRP", weight: 5.4 },
      { symbol: "SOL", weight: 4.1 }
    ]
  },
  {
    id: "bci25",
    name: "BITPANDA CRYPTO INDEX 25",
    symbol: "BCI25",
    description: "Top 25 cryptocurrencies with broader diversification",
    price: 856.78,
    change: -1.23,
    changePercent: -0.14,
    volume: "1.5M",
    components: 25,
    marketCap: "1.8T",
    rebalancing: "Monthly",
    topHoldings: [
      { symbol: "BTC", weight: 35.8 },
      { symbol: "ETH", weight: 22.4 },
      { symbol: "BNB", weight: 6.7 },
      { symbol: "XRP", weight: 4.9 },
      { symbol: "ADA", weight: 3.8 }
    ]
  },
  {
    id: "defi",
    name: "DEFI INDEX",
    symbol: "DEFI",
    description: "Decentralized Finance protocols and tokens",
    price: 245.67,
    change: 5.67,
    changePercent: 2.36,
    volume: "890K",
    components: 15,
    marketCap: "180B",
    rebalancing: "Quarterly",
    topHoldings: [
      { symbol: "UNI", weight: 18.5 },
      { symbol: "AAVE", weight: 15.2 },
      { symbol: "COMP", weight: 12.8 },
      { symbol: "MKR", weight: 11.4 },
      { symbol: "SNX", weight: 9.7 }
    ]
  },
  {
    id: "metaverse",
    name: "METAVERSE INDEX",
    symbol: "META",
    description: "Gaming, NFTs, and virtual world cryptocurrencies",
    price: 167.34,
    change: -2.45,
    changePercent: -1.44,
    volume: "650K",
    components: 12,
    marketCap: "85B",
    rebalancing: "Quarterly",
    topHoldings: [
      { symbol: "MANA", weight: 22.1 },
      { symbol: "SAND", weight: 19.8 },
      { symbol: "AXS", weight: 16.5 },
      { symbol: "ENJ", weight: 13.2 },
      { symbol: "FLOW", weight: 10.9 }
    ]
  }
];

export default function CryptoIndices() {
  // Fetch real crypto indices data
  const { data: indices = [], isLoading, error } = useQuery({
    queryKey: ['/api/crypto/indices'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/crypto/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbols: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT']
          })
        });
        if (!response.ok) return [];
        return response.json();
      } catch {
        return [];
      }
    },
    refetchInterval: 30000
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <PieChart className="w-4 h-4" />
              <span>🚀 Diversified crypto exposure</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Crypto Indices
              <span className="text-green-600 block mt-2">Diversified crypto portfolios</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Invest in diversified crypto portfolios with automatic rebalancing. Get exposure to top cryptocurrencies without picking individual coins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4">
                Start investing
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-4">
                Learn about indices
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Indices List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {indices.map((index) => (
              <Card key={index.id} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Index Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <PieChart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{index.symbol}</h3>
                              <p className="text-lg text-gray-700">{index.name}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{index.description}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            €{index.price.toFixed(2)}
                          </div>
                          <div className={`flex items-center justify-end text-sm font-medium ${
                            index.change >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {index.change >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {index.change >= 0 ? '+' : ''}€{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>

                      {/* Index Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Components</div>
                          <div className="font-bold text-gray-900">{index.components}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Market Cap</div>
                          <div className="font-bold text-gray-900">{index.marketCap}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Volume (24h)</div>
                          <div className="font-bold text-gray-900">{index.volume}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Rebalancing</div>
                          <div className="font-bold text-gray-900">{index.rebalancing}</div>
                        </div>
                      </div>

                      {/* Top Holdings */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Top Holdings</h4>
                        <div className="space-y-2">
                          {index.topHoldings.map((holding, idx) => (
                            <div key={holding.symbol} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={getCryptoLogo(holding.symbol)} 
                                  alt={holding.symbol}
                                  className="w-6 h-6"
                                />
                                <span className="font-medium text-gray-900">{holding.symbol}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{holding.weight}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Panel */}
                    <div className="lg:col-span-1">
                      <div className="bg-green-50 p-6 rounded-lg h-full flex flex-col">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-4">Start investing</h4>
                          <p className="text-sm text-gray-600 mb-6">
                            Minimum investment: €1
                            <br />
                            No management fees
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Invest now
                          </Button>
                          <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                            View details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why crypto indices?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get diversified crypto exposure with professional portfolio management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PieChart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Diversification</h3>
              <p className="text-gray-600">Spread risk across multiple cryptocurrencies automatically</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Auto-Rebalancing</h3>
              <p className="text-gray-600">Professional rebalancing maintains optimal portfolio weights</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reduced Risk</h3>
              <p className="text-gray-600">Lower volatility compared to individual cryptocurrencies</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Start with crypto indices today</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Get instant exposure to the crypto market with professionally managed, diversified portfolios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4">
              Start investing
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-12 py-4">
              Compare indices
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}