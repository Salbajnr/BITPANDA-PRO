
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Shield, Zap, Users, BarChart3, ChartLine, Clock, 
  Activity, DollarSign, Headphones, Star, Award, CheckCircle,
  Smartphone, Globe, Lock, Bell, Menu, X, ArrowRight, Quote
} from "lucide-react";
import { useEffect, useState } from "react";
import logoImage from "@/assets/logo.jpeg";
import asset1 from "@/assets/IMG_5549.jpeg";
import asset2 from "@/assets/IMG_5550.jpeg";
import asset3 from "@/assets/IMG_5551.jpeg";
import asset4 from "@/assets/IMG_5552.jpeg";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  color: string;
  icon: string;
  chartData: number[];
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  timeAgo: string;
  source: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [marketData, setMarketData] = useState<MarketData[]>([
    { 
      symbol: "BTC/USD", 
      name: "Bitcoin", 
      price: 43250.00, 
      change: 2.45, 
      volume: "$2.4B", 
      color: "bg-orange-500", 
      icon: "₿",
      chartData: [42000, 42500, 41800, 43200, 42900, 43800, 43250]
    },
    { 
      symbol: "ETH/USD", 
      name: "Ethereum", 
      price: 2680.50, 
      change: -1.23, 
      volume: "$1.2B", 
      color: "bg-blue-500", 
      icon: "Ξ",
      chartData: [2720, 2650, 2780, 2690, 2640, 2700, 2680]
    },
    { 
      symbol: "SOL/USD", 
      name: "Solana", 
      price: 98.75, 
      change: 5.67, 
      volume: "$580M", 
      color: "bg-purple-500", 
      icon: "S",
      chartData: [92, 94, 96, 95, 99, 102, 98]
    },
    { 
      symbol: "ADA/USD", 
      name: "Cardano", 
      price: 0.485, 
      change: 3.21, 
      volume: "$340M", 
      color: "bg-indigo-500", 
      icon: "A",
      chartData: [0.46, 0.47, 0.45, 0.48, 0.49, 0.47, 0.485]
    },
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

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Marcus Weber",
      role: "Portfolio Manager",
      company: "Swiss Capital Management",
      content: "BITPANDA PRO has revolutionized our institutional trading operations. The liquidity depth and execution speed are unmatched in the European market.",
      rating: 5,
      avatar: asset1
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      role: "Head of Digital Assets",
      company: "Barcelona Investment Fund",
      content: "The regulatory compliance and security measures give us complete confidence. Our clients trust us because we trust BITPANDA PRO.",
      rating: 5,
      avatar: asset2
    },
    {
      id: 3,
      name: "Thomas Müller",
      role: "Crypto Trader",
      company: "Independent Investor",
      content: "From a retail investor perspective, the professional tools and analytics rival those of major investment banks. Incredible platform.",
      rating: 5,
      avatar: asset3
    },
    {
      id: 4,
      name: "Sophie Laurent",
      role: "Fund Manager",
      company: "Paris Digital Assets",
      content: "The customer support and dedicated account management service is exceptional. They truly understand institutional needs.",
      rating: 5,
      avatar: asset4
    }
  ];

  // Simulate live market updates with more realistic price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => {
          const priceChange = (Math.random() - 0.5) * 0.015; // More realistic price movements
          const newPrice = item.price * (1 + priceChange);
          const changePercent = ((newPrice - item.price) / item.price) * 100;
          
          // Update chart data
          const newChartData = [...item.chartData.slice(1), newPrice];
          
          return {
            ...item,
            price: newPrice,
            change: item.change + changePercent * 0.1, // Gradual change accumulation
            chartData: newChartData
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  // Generate SVG path for chart
  const generateChartPath = (data: number[], width: number = 200, height: number = 80) => {
    if (data.length < 2) return "";
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Enhanced Floating Crypto Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-16 h-16 opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">₿</span>
          </div>
        </div>
        <div className="absolute top-[25%] right-[10%] w-12 h-12 opacity-30 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2.5s'}}>
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">Ξ</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[15%] w-10 h-10 opacity-30 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '4s'}}>
          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
        <div className="absolute top-[40%] right-[5%] w-8 h-8 opacity-30 animate-bounce" style={{animationDelay: '3s', animationDuration: '3.5s'}}>
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                <img src={logoImage} alt="BITPANDA PRO" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-wide">BITPANDA PRO</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Home</a>
              <a href="/about" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">About</a>
              <a href="/features" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Features</a>
              <a href="/contact" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Contact</a>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Trading
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-slate-800"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900/98 backdrop-blur-lg border-b border-slate-700">
              <div className="px-4 py-6 space-y-4">
                <a 
                  href="/" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </a>
                <a 
                  href="/features" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="/contact" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <Button
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium"
                >
                  Start Trading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-green-500/10 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="inline-block px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-primary/20 to-green-500/20 border border-primary/30">
                <span className="text-sm font-medium text-white">🏆 TRUSTED BY 2.5M+ INVESTORS ACROSS EUROPE</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Europe's Leading
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                  {" "}Crypto Investment
                </span>
                {" "}Platform
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Regulated, secure, and trusted by millions. Start your cryptocurrency investment journey with Europe's most awarded digital asset platform.
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
                  <span>EU Regulated & Licensed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Award className="text-green-500 w-4 h-4" />
                  </div>
                  <span>€100M+ Insurance Coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="text-green-500 w-4 h-4" />
                  </div>
                  <span>2.5M+ Investors</span>
                </div>
              </div>
            </div>
            <div className="animate-in slide-in-from-right duration-1000 hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-green-500/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">₿</span>
                        </div>
                        <div>
                          <span className="font-bold text-lg">BTC/USD</span>
                          <div className="text-xs text-gray-400">Bitcoin</div>
                        </div>
                      </div>
                      <span className={`font-bold ${marketData[0].change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData[0].change >= 0 ? '+' : ''}{marketData[0].change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-4xl font-bold mb-4">
                      ${marketData[0].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="h-32 relative mb-4 bg-slate-900/50 rounded-xl p-2">
                      <svg viewBox="0 0 300 120" className="w-full h-full">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#22C55E" />
                          </linearGradient>
                          <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#F97316" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path 
                          d={generateChartPath(marketData[0].chartData, 280, 100)}
                          fill="none" 
                          stroke="url(#chartGradient)" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-lg"
                        />
                        <path 
                          d={`${generateChartPath(marketData[0].chartData, 280, 100)} L 280,100 L 0,100 Z`}
                          fill="url(#chartFill)"
                        />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">24h Volume</div>
                        <div className="font-semibold text-white">{marketData[0].volume}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">24h Change</div>
                        <div className={`font-semibold ${marketData[0].change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${(marketData[0].price * (marketData[0].change / 100)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Live Market Data Section */}
      <section id="markets" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 text-white">Live Market Data</h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">Real-time prices and market trends for the top cryptocurrencies</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketData.map((crypto, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${crypto.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-xl">{crypto.icon}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-white">{crypto.symbol}</span>
                      <div className="text-sm text-gray-400">{crypto.name}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${crypto.change >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </span>
                </div>
                <div className="text-2xl font-bold mb-4 text-white">
                  ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="h-16 mb-4 relative bg-slate-900/30 rounded-lg p-1">
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={crypto.change >= 0 ? "#22C55E" : "#EF4444"} />
                        <stop offset="100%" stopColor={crypto.change >= 0 ? "#16A34A" : "#DC2626"} />
                      </linearGradient>
                    </defs>
                    <path 
                      d={generateChartPath(crypto.chartData, 180, 40)}
                      fill="none" 
                      stroke={`url(#gradient-${index})`} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Vol: {crypto.volume}</span>
                  <span className="flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-green-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">What Our Clients Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trusted by professionals across Europe's financial industry
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-primary/30" />
              </div>
              
              <div className="text-center mb-8">
                <p className="text-xl text-gray-300 leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/30">
                  <img 
                    src={testimonials[currentTestimonial].avatar} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-primary text-sm font-medium">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-primary shadow-lg scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Enterprise Investment Solutions</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Institutional-grade infrastructure trusted by banks, hedge funds, and millions of European investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">EU Regulatory Compliance</h3>
              <p className="text-gray-400">
                Fully regulated under MiCA framework with FSMA license. Your assets are protected by European law and €100M insurance coverage.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
                <ChartLine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Institutional Analytics</h3>
              <p className="text-gray-400">
                Bloomberg Terminal-grade analytics, real-time portfolio management, and professional research tools used by top European investment firms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Market-Making Liquidity</h3>
              <p className="text-gray-400">
                Direct access to institutional liquidity pools and prime brokerage services with spreads as low as 0.01%.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
              <p className="text-gray-400">
                Ultra-low latency trading engine with institutional-grade order execution.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Mobile Trading</h3>
              <p className="text-gray-400">
                Trade anywhere with our advanced mobile app featuring all professional tools.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg">
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

      {/* Trust & Compliance Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Trusted by Leading Institutions</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Regulatory compliance and security certifications that matter to European investors
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 border border-slate-500 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">MiCA</div>
              <div className="text-sm text-gray-300">EU Compliant</div>
            </div>
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 border border-slate-500 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">FSMA</div>
              <div className="text-sm text-gray-300">Licensed</div>
            </div>
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 border border-slate-500 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">SOC 2</div>
              <div className="text-sm text-gray-300">Type II</div>
            </div>
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 border border-slate-500 text-center shadow-lg">
              <div className="text-3xl font-bold text-orange-400 mb-2">€100M</div>
              <div className="text-sm text-gray-300">Insured</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Best Crypto Platform 2024</h3>
              <p className="text-gray-400">European FinTech Awards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4.8/5 Trustpilot Rating</h3>
              <p className="text-gray-400">50,000+ verified reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Available in 27 EU Countries</h3>
              <p className="text-gray-400">Full regulatory compliance</p>
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
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-2xl">₿</span>
              </div>
              <span className="font-semibold text-white">Bitcoin</span>
              <span className="text-sm text-green-500">+2.45%</span>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-2xl">Ξ</span>
              </div>
              <span className="font-semibold text-white">Ethereum</span>
              <span className="text-sm text-red-500">-1.23%</span>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-2xl text-blue-400">₳</span>
              </div>
              <span className="font-semibold text-white">Cardano</span>
              <span className="text-sm text-green-500">+3.21%</span>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-2xl text-green-400">◎</span>
              </div>
              <span className="font-semibold text-white">Solana</span>
              <span className="text-sm text-green-500">+5.67%</span>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-xl text-yellow-400 font-bold">BNB</span>
              </div>
              <span className="font-semibold text-white">BNB</span>
              <span className="text-sm text-green-500">+1.89%</span>
            </div>
            
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 shadow-lg">
                <span className="text-lg text-purple-400 font-bold">MATIC</span>
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
              <div key={news.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
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
          <h2 className="text-4xl font-bold text-white mb-6">Start Your Investment Journey</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 2.5 million investors across Europe who trust BITPANDA PRO with their cryptocurrency investments. Regulated, secure, and award-winning.
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
              <span className="text-white/80">EU regulated & licensed</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <CheckCircle className="text-green-400 text-sm w-4 h-4" />
              </div>
              <span className="text-white/80">€100M insurance coverage</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <CheckCircle className="text-green-400 text-sm w-4 h-4" />
              </div>
              <span className="text-white/80">Dedicated relationship manager</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12">
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
              <h4 className="font-semibold text-lg mb-4 text-white">TOP INSTRUMENTS</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Forex</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Indices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Commodities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cryptocurrency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shares</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">SUPPORTS</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/help-center" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/tutorials" className="hover:text-white transition-colors">How to Deposit</a></li>
                <li><a href="/tutorials" className="hover:text-white transition-colors">How to Withdraw</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors">Open Account</a></li>
                <li><a href="/kyc" className="hover:text-white transition-colors">Verify Your Account</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Customer Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">LEARN MORE</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/tutorials" className="hover:text-white transition-colors">Responsible Trading</a></li>
                <li><a href="/tutorials" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="/help-center" className="hover:text-white transition-colors">Avoid Scam</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/about-us" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              BITPANDA PRO Copyright Protected © 2024. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Secured by SSL
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                EU Regulated
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
