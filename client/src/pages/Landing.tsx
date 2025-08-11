
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, TrendingUp, Shield, Zap, Users, BarChart3, ArrowRight, Star, CheckCircle, Award,
  Newspaper, Rocket, Smartphone, Headphones, ChartLine, Bell, Globe, Lock,
  Activity, DollarSign, Clock, Briefcase
} from "lucide-react";
import { useEffect, useState } from "react";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  color: string;
  icon: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timeAgo: string;
  source: string;
  categoryColor: string;
}

export default function Landing() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: "BTC/USD", name: "Bitcoin", price: 43250.00, change: 2.45, volume: "$2.4B", color: "bg-orange-500", icon: "₿" },
    { symbol: "ETH/USD", name: "Ethereum", price: 2680.50, change: -1.23, volume: "$1.2B", color: "bg-blue-500", icon: "Ξ" },
    { symbol: "SOL/USD", name: "Solana", price: 98.75, change: 5.67, volume: "$580M", color: "bg-purple-500", icon: "S" },
    { symbol: "ADA/USD", name: "Cardano", price: 0.485, change: 3.21, volume: "$340M", color: "bg-indigo-500", icon: "A" },
  ]);

  const [newsItems] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Bitcoin Reaches New Monthly High",
      description: "BTC surges past $43K as institutional adoption continues to grow amid favorable regulatory developments.",
      category: "Bitcoin",
      timeAgo: "2 hours ago",
      source: "CryptoNews",
      categoryColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    },
    {
      id: 2,
      title: "DeFi TVL Reaches $50B Milestone",
      description: "Total Value Locked in DeFi protocols hits new record as yield farming opportunities expand.",
      category: "DeFi",
      timeAgo: "4 hours ago",
      source: "DeFi Pulse",
      categoryColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    {
      id: 3,
      title: "New Crypto Framework Approved",
      description: "Major jurisdiction announces comprehensive cryptocurrency regulation providing clarity for institutions.",
      category: "Regulation",
      timeAgo: "6 hours ago",
      source: "Regulatory Watch",
      categoryColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  ]);

  const [stats] = useState([
    { value: "2M+", label: "Active Traders", icon: Users },
    { value: "500M+", label: "Trades Executed", icon: Activity },
    { value: "99.9%", label: "Uptime", icon: Clock },
    { value: "24/7", label: "Support", icon: Headphones }
  ]);

  // Simulate live market updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% change
          change: item.change + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">BITPANDA PRO</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-green-600 transition-colors">Features</a>
              <a href="#markets" className="text-slate-600 dark:text-slate-300 hover:text-green-600 transition-colors">Markets</a>
              <a href="#news" className="text-slate-600 dark:text-slate-300 hover:text-green-600 transition-colors">News</a>
              <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white">
                Start Trading
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="flex items-center bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                  <Star className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    #1 Professional Trading Platform
                  </span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Next-Generation
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                  Crypto Trading
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Experience secure trading, live market insights, and real-time news on the most advanced crypto platform. 
                Built for professionals, designed for everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-all">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all">
                  View Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>2M+ Users</span>
                </div>
              </div>
            </div>

            <div className="animate-in slide-in-from-right duration-1000 delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-80 h-80 mx-auto bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-72 h-72 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-32 h-32 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="animate-in fade-in duration-1000" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6 text-green-600 mr-2" />
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section id="markets" className="py-20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Live Market Data</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Real-time cryptocurrency prices with live updates</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((crypto, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold">{crypto.icon}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{crypto.symbol}</span>
                    </div>
                    <Badge variant={crypto.change >= 0 ? "default" : "destructive"} className={crypto.change >= 0 ? "bg-green-100 text-green-800" : ""}>
                      {crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Vol: {crypto.volume}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose BITPANDA PRO?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Advanced trading tools, institutional-grade security, and real-time insights for professional traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Bank-Grade Security</CardTitle>
                <CardDescription>
                  Multi-layer security protocols, cold storage, and insurance protection for your digital assets.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ChartLine className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Live Market Insights</CardTitle>
                <CardDescription>
                  Real-time analytics, advanced charting tools, and AI-powered market predictions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time News</CardTitle>
                <CardDescription>
                  Curated crypto news, market analysis, and instant notifications for market-moving events.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                <CardDescription>
                  Ultra-low latency trading engine with sub-millisecond order execution.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Mobile Trading</CardTitle>
                <CardDescription>
                  Trade anywhere with our advanced mobile app featuring all professional tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">24/7 Support</CardTitle>
                <CardDescription>
                  Round-the-clock customer support with dedicated account managers for pro traders.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Latest Crypto News</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Stay updated with real-time market news and analysis</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <Card key={news.id} className="hover:shadow-xl transition-all border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <Badge className={`mb-4 ${news.categoryColor}`}>
                    {news.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{news.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{news.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{news.timeAgo}</span>
                    <span>{news.source}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Get started with crypto trading simulation in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Create Account</h3>
              <p className="text-slate-600 dark:text-slate-400">Sign up with your email and get instant access to our trading platform with professional-grade tools.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Get Virtual Funds</h3>
              <p className="text-slate-600 dark:text-slate-400">Start with $0 and receive virtual currency from admins to practice your trading strategies.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Start Trading</h3>
              <p className="text-slate-600 dark:text-slate-400">Use real market data and advanced tools to make trades, hone your skills, and grow your virtual portfolio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Traders Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of successful traders who started their journey with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "BITPANDA PRO helped me understand crypto markets before I invested real money. The platform is incredibly realistic!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Alex Smith</div>
                    <div className="text-sm text-slate-500">Day Trader</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "The real-time data and professional tools make this the best crypto simulation platform out there."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Maria Johnson</div>
                    <div className="text-sm text-slate-500">Portfolio Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "Started as a complete beginner. Now I'm confident enough to trade with real money thanks to this platform."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">DC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">David Chen</div>
                    <div className="text-sm text-slate-500">Crypto Investor</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of traders who trust BITPANDA PRO for their crypto trading needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={handleLogin} size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 transition-all">
              Learn More
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>$0 Starting Balance</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Real Market Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Leaf className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-slate-400 mb-4">
                The next-generation cryptocurrency trading simulation platform for learning and mastering crypto markets.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Markets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BITPANDA PRO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
