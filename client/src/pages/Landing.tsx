
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Globe, 
  ChartBar, 
  Lock,
  Play,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Wallet,
  Award,
  CheckCircle
} from 'lucide-react';
import { getCryptoLogo } from '@/components/CryptoLogos';
import { useQuery } from '@tanstack/react-query';

export default function Landing() {
  // Fetch real crypto data for display
  const { data: cryptoData } = useQuery({
    queryKey: ['landing-crypto-data'],
    queryFn: async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,polygon,chainlink&vs_currencies=usd&include_24hr_change=true&include_market_cap=true');
        return await response.json();
      } catch (error) {
        return {
          bitcoin: { usd: 45000, usd_24h_change: 2.5 },
          ethereum: { usd: 2800, usd_24h_change: 3.2 },
          cardano: { usd: 0.45, usd_24h_change: -1.1 },
          solana: { usd: 98, usd_24h_change: 5.7 },
          polygon: { usd: 0.85, usd_24h_change: 2.1 },
          chainlink: { usd: 15, usd_24h_change: 1.8 }
        };
      }
    },
    refetchInterval: 30000,
  });

  const cryptoList = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-600/20 text-blue-200 border-blue-500/30">
              🚀 Trade with Confidence
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Professional Crypto
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}Trading Platform
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Trade Bitcoin, Ethereum, and 100+ cryptocurrencies with advanced tools, 
              real-time data, and bank-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link to="/auth">Start Trading Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-slate-400 text-slate-300 hover:bg-slate-800 px-8 py-3">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-12 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Live Market Prices</h2>
            <p className="text-slate-400">Real-time cryptocurrency prices updated every 30 seconds</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cryptoList.map((crypto) => {
              const data = cryptoData?.[crypto.id];
              const price = data?.usd || 0;
              const change = data?.usd_24h_change || 0;
              const isPositive = change >= 0;

              return (
                <Card key={crypto.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="mr-2 text-2xl">
                        {getCryptoLogo(crypto.symbol)}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{crypto.symbol}</div>
                        <div className="text-xs text-slate-400">{crypto.name}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ${price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Professional trading tools and enterprise-grade security for serious traders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Bank-Grade Security</CardTitle>
                <CardDescription className="text-slate-400">
                  Multi-layer security with 2FA, cold storage, and insurance protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Advanced Trading Tools</CardTitle>
                <CardDescription className="text-slate-400">
                  Professional charts, technical indicators, and real-time market data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Mobile Trading</CardTitle>
                <CardDescription className="text-slate-400">
                  Trade anywhere with our responsive web platform and mobile apps
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Wallet className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Instant Deposits</CardTitle>
                <CardDescription className="text-slate-400">
                  Fast deposits and withdrawals with multiple payment methods
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Users className="h-12 w-12 text-red-400 mb-4" />
                <CardTitle className="text-white">24/7 Support</CardTitle>
                <CardDescription className="text-slate-400">
                  Expert customer support available around the clock
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Globe className="h-12 w-12 text-cyan-400 mb-4" />
                <CardTitle className="text-white">Global Access</CardTitle>
                <CardDescription className="text-slate-400">
                  Available worldwide with multi-language and currency support
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Professional Trading Experience
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Access advanced trading features designed for both beginners and professional traders.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Real-time market data and charts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Advanced order types (Market, Limit, Stop)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Portfolio management and analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Risk management tools</span>
                </div>
              </div>
              
              <Button asChild className="mt-8 bg-blue-600 hover:bg-blue-700">
                <Link to="/auth">
                  Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Trading Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">$2.4B+</div>
                    <div className="text-sm text-slate-400">Trading Volume</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50K+</div>
                    <div className="text-sm text-slate-400">Active Traders</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-slate-400">Cryptocurrencies</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800 rounded-lg">
                    <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">4.8/5</div>
                    <div className="text-sm text-slate-400">User Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust our platform for their cryptocurrency investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3">
              <Link to="/auth">Create Free Account</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3">
              <Link to="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
