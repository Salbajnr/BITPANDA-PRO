
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Shield, Zap, Users, BarChart3, ChartLine, Clock, 
  Activity, DollarSign, Headphones, Star, Award, CheckCircle,
  Smartphone, Globe, Lock, Bell
} from "lucide-react";
import { useEffect, useState } from "react";
import logoImage from "@/assets/logo.jpeg";

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
    },
    {
      id: 2,
      title: "DeFi TVL Reaches $50B Milestone",
      description: "Total Value Locked in DeFi protocols hits new record as yield farming opportunities expand.",
      category: "DeFi",
      timeAgo: "4 hours ago",
      source: "DeFi Pulse",
    },
    {
      id: 3,
      title: "New Crypto Framework Approved",
      description: "Major jurisdiction announces comprehensive cryptocurrency regulation providing clarity for institutions.",
      category: "Regulation",
      timeAgo: "6 hours ago",
      source: "Regulatory Watch",
    }
  ]);

  // Simulate live market updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.02),
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
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Floating Crypto Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-16 h-16 opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}>
          <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">₿</span>
          </div>
        </div>
        <div className="absolute top-[25%] right-[10%] w-12 h-12 opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}>
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">Ξ</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[15%] w-10 h-10 opacity-20 animate-bounce" style={{animationDelay: '2.5s'}}>
          <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={logoImage} alt="BITPANDA PRO" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-wide">BITPANDA PRO</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Features</a>
              <a href="#markets" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Markets</a>
              <a href="#assets" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Assets</a>
              <a href="#news" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">News</a>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Start Trading
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-green-500/10 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="inline-block px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-primary/20 to-green-500/20 border border-primary/30">
                <span className="text-sm font-medium text-white">🚀 TRENDING: BTC +3.2% • ETH +1.8%</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Next-Generation
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                  {" "}Crypto Trading
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Experience secure trading, live market insights, and real-time news on the most advanced crypto platform. 
                Built for professionals, designed for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Trading Now
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-full text-lg font-bold transition-all"
                >
                  View Demo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-8 mt-10 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield className="text-green-500 w-4 h-4" />
                  </div>
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Zap className="text-green-500 w-4 h-4" />
                  </div>
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="text-green-500 w-4 h-4" />
                  </div>
                  <span>2M+ Users</span>
                </div>
              </div>
            </div>
            <div className="animate-in slide-in-from-right duration-1000 hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-green-500/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-full h-full bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-green-500 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">₿</span>
                        </div>
                        <span className="font-bold">BTC/USD</span>
                      </div>
                      <span className="text-green-500 font-bold">+2.45%</span>
                    </div>
                    <div className="text-4xl font-bold mb-4">$43,250.00</div>
                    <div className="h-32 relative mb-4">
                      <svg viewBox="0 0 300 150" className="w-full h-full">
                        <path 
                          d="M0,150 L50,120 L100,130 L150,90 L200,110 L250,70 L300,100" 
                          fill="none" 
                          stroke="url(#chartGradient)" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="animate-pulse"
                        />
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5D5CDE" />
                            <stop offset="100%" stopColor="#22C55E" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="text-sm text-gray-400 flex justify-between">
                      <span>24h Vol: $2.4B</span>
                      <span>24h Change: +$1,250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section id="markets" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-white">Live Market Data</h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">Real-time prices and market trends for the top cryptocurrencies</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketData.map((crypto, index) => (
              <div key={index} className="bg-slate-700 rounded-2xl p-6 border border-slate-600 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center animate-pulse`}>
                      <span className="text-white font-bold text-lg">{crypto.icon}</span>
                    </div>
                    <span className="font-semibold text-lg text-white">{crypto.symbol}</span>
                  </div>
                  <span className={`text-sm font-semibold ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2 text-white">
                  ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="h-20 mb-4 relative">
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <path 
                      d={crypto.change >= 0 ? 
                        "M0,60 L40,50 L80,55 L120,30 L160,40 L200,20" : 
                        "M0,50 L40,70 L80,60 L120,40 L160,45 L200,55"
                      }
                      fill="none" 
                      stroke={crypto.change >= 0 ? "#22C55E" : "#EF4444"} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm text-gray-400">Vol: {crypto.volume}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Professional Trading Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced tools and enterprise-grade infrastructure built for serious traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Bank-Grade Security</h3>
              <p className="text-gray-400">
                Multi-layer security protocols, cold storage, and insurance protection for your digital assets.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <ChartLine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Advanced Analytics</h3>
              <p className="text-gray-400">
                Professional charting tools, technical indicators, and real-time market analysis.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Real-Time Data</h3>
              <p className="text-gray-400">
                Live market data feeds with sub-millisecond latency for accurate trading decisions.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
              <p className="text-gray-400">
                Ultra-low latency trading engine with institutional-grade order execution.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Mobile Trading</h3>
              <p className="text-gray-400">
                Trade anywhere with our advanced mobile app featuring all professional tools.
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">24/7 Support</h3>
              <p className="text-gray-400">
                Round-the-clock customer support with dedicated account managers for pro traders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assets Section */}
      <section id="assets" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Diverse Crypto Assets</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trade over 100+ cryptocurrencies with competitive fees and deep liquidity
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">₿</span>
              </div>
              <span className="font-semibold text-white">Bitcoin</span>
              <span className="text-sm text-green-500">+2.45%</span>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">Ξ</span>
              </div>
              <span className="font-semibold text-white">Ethereum</span>
              <span className="text-sm text-red-500">-1.23%</span>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl text-blue-400">₳</span>
              </div>
              <span className="font-semibold text-white">Cardano</span>
              <span className="text-sm text-green-500">+3.21%</span>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl text-green-400">◎</span>
              </div>
              <span className="font-semibold text-white">Solana</span>
              <span className="text-sm text-green-500">+5.67%</span>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl text-yellow-400">BNB</span>
              </div>
              <span className="font-semibold text-white">BNB</span>
              <span className="text-sm text-green-500">+1.89%</span>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl text-purple-400">MATIC</span>
              </div>
              <span className="font-semibold text-white">Polygon</span>
              <span className="text-sm text-red-500">-0.75%</span>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-medium transition-all"
            >
              View All 100+ Assets
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Latest Crypto News</h2>
            <p className="text-lg text-gray-400">Stay updated with real-time market news and analysis</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <div key={news.id} className="bg-slate-800 rounded-2xl border border-slate-600 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-primary/20 to-green-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-primary/30 text-white text-sm rounded-full mb-2 font-medium">
                      {news.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">{news.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 mb-4">
                    {news.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{news.timeAgo}</span>
                    <span className="font-semibold text-primary">{news.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of traders who trust BITPANDA PRO for their crypto trading needs. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Create Account
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-10 py-4 rounded-full text-lg font-bold transition-all"
            >
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <CheckCircle className="text-green-400 text-sm w-4 h-4" />
              </div>
              <span className="text-white/80">No minimum deposit</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <CheckCircle className="text-green-400 text-sm w-4 h-4" />
              </div>
              <span className="text-white/80">Competitive fees</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <CheckCircle className="text-green-400 text-sm w-4 h-4" />
              </div>
              <span className="text-white/80">24/7 customer support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={logoImage} alt="BITPANDA PRO" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-xs">
                The next-generation crypto trading platform for professionals.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Users className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Activity className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Markets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 BITPANDA PRO. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Secured by SSL
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                FDIC Insured
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
