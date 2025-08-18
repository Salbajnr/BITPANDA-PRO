
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { CryptoApiService } from "@/services/cryptoApi";
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
  Settings,
  Activity,
  Target,
  Layers,
  Clock,
  Eye,
  Wallet,
  LineChart,
  MousePointer,
  Cpu,
  Database,
  Sparkles,
  Coins,
  ShieldCheck,
  Headphones,
  Building,
  Rocket,
  TrendingUpIcon,
  Bitcoin
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import FeatureCard from "@/components/FeatureCard";
import FloatingParticles from "@/components/FloatingParticles";
import AnimatedChart from "@/components/AnimatedChart";
import LiveMarketStats from "@/components/LiveMarketStats";
import NewsTicker from "@/components/NewsTicker";

const topCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 45234.56, change: 2.34, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2876.43, change: -1.23, volume: "12.8B" },
  { symbol: "BNB", name: "BNB", price: 298.76, change: 3.45, volume: "2.1B" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change: 1.87, volume: "890M" },
  { symbol: "SOL", name: "Solana", price: 98.32, change: 4.12, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" }
];

function Landing() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Fetch real crypto data
  const { data: cryptoData, isLoading: cryptoLoading } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: () => CryptoApiService.getTopCryptos(6),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-30"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-in slide-in-from-left duration-1000' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-100">Europe's #1 Crypto Trading Platform</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Trade Crypto
                  <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Like a Pro
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Join over 5 million traders worldwide on the most secure and advanced cryptocurrency exchange. 
                  Professional tools, real-time analytics, and institutional-grade security.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link href={user ? "/dashboard" : "/auth"}>
                    {user ? "Open Dashboard" : "Start Trading Free"}
                    <Rocket className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg backdrop-blur-sm"
                  asChild
                >
                  <Link href="/markets">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {[
                  { icon: ShieldCheck, label: "Bank-Level Security" },
                  { icon: Globe, label: "EU Regulated" },
                  { icon: Award, label: "ISO Certified" },
                  { icon: Headphones, label: "24/7 Support" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                      <item.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <span className="text-sm text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className={`relative ${isVisible ? 'animate-in slide-in-from-right duration-1000' : 'opacity-0'}`}>
              <div className="relative">
                {/* Main Chart Card */}
                <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                          <Bitcoin className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Bitcoin (BTC)</h3>
                          <p className="text-sm text-slate-400">Real-time price</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">$67,234.56</p>
                        <div className="flex items-center text-green-400 text-sm">
                          <TrendingUpIcon className="w-4 h-4 mr-1" />
                          +2.34%
                        </div>
                      </div>
                    </div>
                    <AnimatedChart 
                      type="area" 
                      data={{ 
                        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'], 
                        values: [64000, 65500, 67000, 66800, 67234, 67500], 
                        label: 'BTC Price' 
                      }} 
                    />
                  </CardContent>
                </Card>

                {/* Floating Elements */}
                <Card className="absolute -top-4 -right-4 bg-slate-800/90 border-slate-600 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live Trading</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute -bottom-4 -left-4 bg-slate-800/90 border-slate-600 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-400">24h Volume</p>
                      <p className="font-bold text-lg">$2.8B</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Stats */}
      <section className="border-t border-slate-800">
        <LiveMarketStats />
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
              Professional Trading Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Trade Successfully
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Advanced tools and features designed for both beginners and professional traders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Advanced Charts",
                description: "Professional TradingView charts with 100+ indicators and drawing tools.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Ultra-low latency execution with sub-millisecond order matching.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Bank Security",
                description: "Multi-layer security with cold storage and insurance protection.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Smartphone,
                title: "Mobile Trading",
                description: "Trade on the go with our award-winning mobile application.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Portfolio Analytics",
                description: "Deep insights into your portfolio performance and risk metrics.",
                gradient: "from-red-500 to-rose-500"
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "24/7 customer support from our team of trading experts.",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700 hover:bg-slate-900/70 transition-all duration-300 group hover:scale-105">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cryptocurrencies */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Trade Top
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {" "}Cryptocurrencies
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Access the world's most popular digital assets with competitive fees and deep liquidity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptoLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-slate-700 rounded w-24"></div>
                        <div className="h-4 bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              (cryptoData || topCryptos).map((crypto, index) => (
                <Card key={crypto.symbol} className="bg-slate-900/50 border-slate-700 hover:bg-slate-900/70 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                          {getCryptoLogo(crypto.symbol)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{crypto.name}</h3>
                          <p className="text-slate-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Price</span>
                        <span className="font-bold text-lg">
                          ${(crypto.current_price || crypto.price)?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">24h Change</span>
                        <div className={`flex items-center ${(crypto.price_change_percentage_24h || crypto.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(crypto.price_change_percentage_24h || crypto.change) >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          <span className="font-medium">
                            {(crypto.price_change_percentage_24h || crypto.change) >= 0 ? '+' : ''}
                            {(crypto.price_change_percentage_24h || crypto.change)?.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Volume</span>
                        <span className="text-sm font-medium">
                          {crypto.total_volume ? 
                            `$${(crypto.total_volume / 1e9).toFixed(1)}B` : 
                            crypto.volume
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold px-8 py-3"
            >
              <Link href="/markets">
                View All Markets
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <section className="border-t border-slate-800">
        <NewsTicker />
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {" "}Millions
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Join the world's fastest-growing cryptocurrency trading community
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "5M+", label: "Active Traders", icon: Users },
              { value: "$2.8T", label: "Trading Volume", icon: BarChart3 },
              { value: "180+", label: "Countries", icon: Globe },
              { value: "24/7", label: "Support", icon: Headphones }
            ].map((stat, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700 text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Start Trading in Minutes</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Crypto Journey?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join millions of traders worldwide and experience the most advanced cryptocurrency trading platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href={user ? "/dashboard" : "/auth"}>
                  <DollarSign className="w-6 h-6 mr-2" />
                  {user ? "Open Dashboard" : "Create Free Account"}
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg backdrop-blur-sm"
                asChild
              >
                <Link href="/academy">
                  <Bot className="w-6 h-6 mr-2" />
                  Learn to Trade
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-black font-bold text-lg">BP</span>
                </div>
                <span className="text-2xl font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Europe's leading cryptocurrency trading platform. Trade with confidence, security, and advanced tools.
              </p>
              <div className="flex space-x-4">
                {/* Social Links */}
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-slate-400" />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Newspaper className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Products</h4>
              <div className="space-y-3">
                {[
                  { label: "Spot Trading", href: "/trading" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "Markets", href: "/markets" },
                  { label: "Mobile App", href: "#" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="block text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <div className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Careers", href: "/careers" },
                  { label: "Security", href: "/security" },
                  { label: "Press", href: "#" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="block text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Support</h4>
              <div className="space-y-3">
                {[
                  { label: "Help Center", href: "/help" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Academy", href: "/academy" },
                  { label: "API Docs", href: "#" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="block text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 BITPANDA PRO. All rights reserved. Licensed and regulated in the EU.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
