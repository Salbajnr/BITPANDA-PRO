
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Smartphone,
  ChevronRight,
  Star,
  Play,
  CheckCircle,
  Globe,
  Lock,
  Award,
  ArrowRight,
  DollarSign,
  TrendingDown,
  Bot,
  Newspaper,
  Settings
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import FeatureCard from "@/components/FeatureCard";
import FloatingParticles from "@/components/FloatingParticles";
import AnimatedChart from "@/components/AnimatedChart";
import LiveMarketStats from "@/components/LiveMarketStats";
import NewsTicker from "@/components/NewsTicker";
import VisualIdentityShowcase from "@/components/VisualIdentityShowcase";

const topCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 45234.56, change: 2.34, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2876.43, change: -1.23, volume: "12.8B" },
  { symbol: "BNB", name: "BNB", price: 298.76, change: 3.45, volume: "2.1B" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change: 1.87, volume: "890M" },
  { symbol: "SOL", name: "Solana", price: 98.32, change: 4.12, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" }
];

const features = [
  {
    icon: TrendingUp,
    title: "Advanced Trading Tools",
    description: "Professional-grade trading interface with real-time charts, technical indicators, and order management.",
    bgColor: "from-orange-500 to-yellow-500"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Multi-layer security with cold storage, 2FA, and insurance protection for your digital assets.",
    bgColor: "from-blue-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description: "Ultra-low latency trading engine with instant order execution and real-time market data.",
    bgColor: "from-green-500 to-teal-500"
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Comprehensive portfolio tracking with performance metrics, risk analysis, and profit/loss reports.",
    bgColor: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Global Market Access",
    description: "Trade 500+ cryptocurrencies with access to global markets and liquidity pools.",
    bgColor: "from-red-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join millions of traders worldwide with social trading features and expert insights.",
    bgColor: "from-indigo-500 to-blue-500"
  }
];

const educationCourses = [
  {
    level: "Beginner",
    title: "Crypto Fundamentals",
    duration: "2 hours",
    lessons: 12,
    description: "Learn the basics of cryptocurrency, blockchain technology, and how to start trading safely."
  },
  {
    level: "Intermediate", 
    title: "Technical Analysis",
    duration: "4 hours",
    lessons: 24,
    description: "Master chart patterns, indicators, and trading strategies used by professional traders."
  },
  {
    level: "Advanced",
    title: "Portfolio Management",
    duration: "6 hours", 
    lessons: 36,
    description: "Advanced risk management, portfolio optimization, and institutional trading strategies."
  }
];

const securityFeatures = [
  { feature: "2FA Authentication", status: "Active" },
  { feature: "Cold Storage", status: "99%" },
  { feature: "Insurance Coverage", status: "$500M" },
  { feature: "Regulatory Compliance", status: "Global" },
  { feature: "24/7 Monitoring", status: "Active" },
  { feature: "Audit Reports", status: "Monthly" }
];

const newsItems = [
  {
    title: "Bitcoin Reaches New All-Time High",
    time: "2 hours ago",
    category: "Market"
  },
  {
    title: "Ethereum 2.0 Staking Rewards Increase",
    time: "4 hours ago", 
    category: "Updates"
  },
  {
    title: "New DeFi Protocol Launches on Polygon",
    time: "6 hours ago",
    category: "DeFi"
  }
];

const appFeatures = [
  { feature: "Real-time Price Alerts", available: true },
  { feature: "Biometric Authentication", available: true },
  { feature: "Offline Portfolio Tracking", available: true },
  { feature: "Advanced Charting", available: true },
  { feature: "Social Trading", available: false },
  { feature: "Staking Rewards", available: true }
];

export default function Landing() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trading");

  if (user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back!</h1>
          <p className="text-gray-300 mb-8">You're already logged in.</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <FloatingParticles />
      <Navbar />
      
      {/* News Ticker */}
      <NewsTicker />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-none px-4 py-2">
                🚀 Trade Crypto + Precious Metals
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Trade Crypto with
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"> Confidence</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Experience seamless cryptocurrency and precious metals trading with advanced tools, real-time market data, and robust security features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
                    Start Trading Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl text-lg transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-gray-400">Cryptocurrencies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">$50B+</div>
                  <div className="text-gray-400">Trading Volume</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <AnimatedChart />
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Stats */}
      <LiveMarketStats />

      {/* Featured Platform Showcase */}
      <VisualIdentityShowcase />

      {/* Market Insights */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Market Insights</h2>
            <p className="text-xl text-gray-300">Real-time data from global cryptocurrency markets</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-700">
              <TabsTrigger value="trading" className="text-white data-[state=active]:bg-orange-500">
                Top Gainers
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-white data-[state=active]:bg-orange-500">
                High Volume
              </TabsTrigger>
              <TabsTrigger value="market-cap" className="text-white data-[state=active]:bg-orange-500">
                Market Cap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trading" className="space-y-4">
              <div className="grid gap-4">
                {topCryptos.map((crypto, index) => (
                  <Card key={crypto.symbol} className="bg-slate-700 border-slate-600">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={getCryptoLogo(crypto.symbol)} 
                            alt={crypto.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{crypto.name}</div>
                          <div className="text-sm text-gray-400">{crypto.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${crypto.price.toLocaleString()}
                        </div>
                        <div className={`text-sm flex items-center ${
                          crypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Volume</div>
                        <div className="font-semibold text-white">{crypto.volume}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="volume">
              <div className="text-center py-12">
                <p className="text-gray-400">Volume data will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="market-cap">
              <div className="text-center py-12">
                <p className="text-gray-400">Market cap data will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need for professional cryptocurrency trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-slate-700 rounded-2xl border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Platform Features */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">BitPanda-Pro Platform Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combining cryptocurrency trading with precious metals investment in one unified platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={DollarSign}
              title="Dual Asset Portfolio"
              description="Manage both cryptocurrency and precious metals investments in a single dashboard with real-time pricing."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Multi-Platform Deposits"
              description="Deposit via top exchanges like Binance, Bybit, or Crypto.com. Upload proof for quick admin verification."
              delay={100}
            />
            <FeatureCard
              icon={Bot}
              title="Automated Savings Plans"
              description="Set up recurring DCA for crypto or metals. Flexible, with options to pause, resume, or adjust."
              delay={200}
            />
            <FeatureCard
              icon={Newspaper}
              title="Knowledge & News Hub"
              description="Stay informed with curated news, market analyses, and guides on crypto and precious metals investing."
              delay={300}
            />
            <FeatureCard
              icon={Settings}
              title="Admin Oversight & Compliance"
              description="Robust admin tools for balance management, deposit approvals, audits, and regulatory compliance."
              delay={400}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Comprehensive portfolio analytics with performance tracking, risk assessment, and profit/loss reporting."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Trading Tools Showcase */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Professional Trading Tools</h2>
              <p className="text-xl text-gray-300 mb-8">
                Access institutional-grade trading features designed for both beginners and professional traders.
              </p>
              
              <div className="space-y-4">
                {[
                  "Advanced charting with 100+ technical indicators",
                  "Real-time order book and market depth",
                  "Multiple order types (Market, Limit, Stop-Loss)",
                  "Portfolio rebalancing and risk management",
                  "API access for algorithmic trading",
                  "Social trading and copy trading features"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/auth">
                <Button className="mt-8 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-xl">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Live Trading Dashboard</h3>
                  <Badge className="bg-green-500">Live</Badge>
                </div>
                
                <div className="space-y-4">
                  {topCryptos.slice(0, 4).map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img 
                            src={getCryptoLogo(crypto.symbol)} 
                            alt={crypto.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{crypto.symbol}</div>
                          <div className="text-sm text-gray-400">{crypto.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${crypto.price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${
                          crypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crypto Education Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Crypto Education Hub</h2>
            <p className="text-xl text-gray-300">
              Master cryptocurrency trading with our comprehensive learning resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationCourses.map((course, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600 hover:border-orange-500 transition-all duration-300">
                <CardContent className="p-6">
                  <Badge className={`mb-4 ${
                    course.level === 'Beginner' ? 'bg-green-500' :
                    course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {course.level}
                  </Badge>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{course.duration}</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Bank-Grade Security</h2>
              <p className="text-xl text-gray-300 mb-8">
                Your assets are protected by multiple layers of security, industry-leading encryption, and comprehensive insurance coverage.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((item, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-sm text-gray-400">{item.feature}</div>
                    <div className="text-lg font-semibold text-white">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
                <div className="text-center mb-6">
                  <Lock className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Your Security Metrics</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Security Score</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-slate-600 rounded-full mr-2">
                        <div className="w-20 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-white font-semibold">98%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Assets Protected</span>
                    <span className="text-white font-semibold">$500M+</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Uptime</span>
                    <span className="text-white font-semibold">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Crypto News */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Latest Crypto News</h2>
              <p className="text-xl text-gray-300">Stay updated with the latest cryptocurrency market developments</p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((news, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600 hover:border-orange-500 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-orange-500">{news.category}</Badge>
                  <h3 className="text-lg font-semibold text-white mb-2">{news.title}</h3>
                  <p className="text-gray-400 text-sm">{news.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Promotion */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Trade on the Go</h2>
              <p className="text-xl text-gray-300 mb-8">
                Download our mobile app and never miss a trading opportunity. Available on iOS and Android.
              </p>
              
              <div className="space-y-3 mb-8">
                {appFeatures.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${item.available ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className={`${item.available ? 'text-gray-300' : 'text-gray-500'}`}>
                      {item.feature}
                    </span>
                    {!item.available && <Badge variant="outline" className="text-xs">Coming Soon</Badge>}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Smartphone className="mr-2 h-5 w-5" />
                  App Store
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Google Play
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl p-8 text-center">
                <Smartphone className="h-32 w-32 text-white mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">BitPanda Pro Mobile</h3>
                <p className="text-white/90">
                  Full trading capabilities in your pocket
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Trusted by Millions Worldwide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">10M+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">$50B+</div>
              <div className="text-gray-300">Trading Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-300">Cryptocurrencies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-8 w-8 text-yellow-400 fill-current" />
            ))}
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            "The most reliable and feature-rich cryptocurrency trading platform I've used. 
            The combination of crypto and precious metals trading makes it unique in the market."
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of traders and start your crypto journey today with BitPanda-Pro
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg">
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/features">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-xl text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">BitPanda-Pro</h3>
              <p className="text-gray-400 text-sm">
                The world's leading cryptocurrency and precious metals trading platform.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/trading">Spot Trading</Link></li>
                <li><Link href="/portfolio">Portfolio</Link></li>
                <li><Link href="/analytics">Analytics</Link></li>
                <li><Link href="/deposits">Deposits</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/tutorials">Tutorials</Link></li>
                <li><Link href="/academy">Academy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/security">Security</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 BitPanda-Pro. All rights reserved. | Bridging Traditional and Digital Assets 🌉
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
