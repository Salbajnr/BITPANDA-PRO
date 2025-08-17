import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Shield, Zap, Globe, Users, ArrowRight, Star } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  type: 'crypto' | 'metal';
}

export default function Landing() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both crypto and metals data
    Promise.all([
      fetch('/api/crypto/trending').then(r => r.ok ? r.json() : []),
      fetch('/api/metals/prices').then(r => r.ok ? r.json() : [])
    ])
    .then(([cryptoData, metalsData]) => {
      const combinedData: MarketData[] = [
        ...(cryptoData.slice(0, 4) || []).map((coin: any) => ({
          symbol: coin.symbol?.toUpperCase() || '',
          name: coin.name || '',
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
          type: 'crypto' as const
        })),
        ...(metalsData || []).map((metal: any) => ({
          symbol: metal.symbol || '',
          name: metal.name || '',
          price: metal.price || 0,
          change24h: metal.changePercent24h || 0,
          type: 'metal' as const
        }))
      ];
      setMarketData(combinedData);
    })
    .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number, type: 'crypto' | 'metal') => {
    if (type === 'metal') {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return price > 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
              Dual Asset Trading Platform
            </Badge>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
              Trade <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Crypto</span> & 
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"> Precious Metals</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 dark:text-slate-300">
              The world's first comprehensive platform combining cryptocurrency and precious metals trading. 
              Diversify your portfolio with both digital and physical assets in one secure platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0" data-testid="button-register">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            Live Market Data
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((asset, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-asset-${asset.symbol}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{asset.symbol}</span>
                          <Badge variant={asset.type === 'crypto' ? 'default' : 'secondary'}>
                            {asset.type === 'crypto' ? 'CRYPTO' : 'METAL'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{asset.name}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl font-semibold" data-testid={`price-${asset.symbol}`}>
                        {formatPrice(asset.price, asset.type)}
                        {asset.type === 'metal' && <span className="text-sm text-slate-500 ml-1">/oz</span>}
                      </div>
                      <div data-testid={`change-${asset.symbol}`}>
                        {formatChange(asset.change24h)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Why Choose BitPanda Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "Your assets are protected by military-grade encryption and cold storage technology."
              },
              {
                icon: Zap,
                title: "Lightning Fast Trades", 
                description: "Execute trades in milliseconds with our advanced matching engine."
              },
              {
                icon: Globe,
                title: "Dual Asset Trading",
                description: "Trade both cryptocurrencies and precious metals on one unified platform."
              },
              {
                icon: Users,
                title: "24/7 Support",
                description: "Get help anytime with our round-the-clock customer support team."
              },
              {
                icon: Star,
                title: "Premium Analytics",
                description: "Advanced charting tools and market insights to inform your trading decisions."
              },
              {
                icon: TrendingUp,
                title: "Portfolio Management",
                description: "Track and manage your diversified portfolio with real-time performance metrics."
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`feature-card-${index}`}>
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-orange-500 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Trade Multiple Asset Classes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" data-testid="card-crypto-section">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                  Cryptocurrencies
                </CardTitle>
                <CardDescription>
                  Trade the world's leading digital assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Bitcoin (BTC)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Ethereum (ETH)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Binance Coin (BNB)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Cardano (ADA)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Solana (SOL)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>And 100+ more coins</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20" data-testid="card-metals-section">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                  Precious Metals
                </CardTitle>
                <CardDescription>
                  Invest in time-tested store of value assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Gold (XAU)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Silver (XAG)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Platinum (XPT)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Palladium (XPD)</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Physical delivery available</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Secure storage options</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of traders who trust BitPanda Pro for their cryptocurrency and precious metals investments.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100" data-testid="button-cta-register">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex justify-center space-x-8 text-sm text-slate-400 mb-4">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 BitPanda Pro. All rights reserved. Cryptocurrency and precious metals trading involves risk.
          </p>
        </div>
      </footer>
    </div>
  );
}