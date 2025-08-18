import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  PieChart,
  AlertCircle,
  Wallet,
  Timer,
  Eye
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

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
    description: "Professional-grade trading interface with real-time charts and advanced order management.",
    color: "text-green-500"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Multi-layer security with cold storage, 2FA, and insurance protection for your assets.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description: "Ultra-low latency trading engine with instant order execution and real-time data.",
    color: "text-green-500"
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Comprehensive portfolio tracking with performance metrics and detailed reports.",
    color: "text-green-500"
  },
  {
    icon: Globe,
    title: "Global Market Access",
    description: "Trade 500+ cryptocurrencies with access to global markets and liquidity pools.",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Expert customer support team available around the clock to assist you.",
    color: "text-green-500"
  }
];

const stats = [
  { label: "Active Traders", value: "2M+", icon: Users },
  { label: "Trading Volume", value: "$50B+", icon: Activity },
  { label: "Cryptocurrencies", value: "500+", icon: PieChart },
  { label: "Countries", value: "180+", icon: Globe }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-green-100 pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Badge */}
            <Badge className="mb-8 bg-green-500 hover:bg-green-600 text-white border-none px-6 py-2 text-sm font-medium">
              🚀 Professional Crypto Trading Platform
            </Badge>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
              Trade Crypto with
              <span className="text-green-500 block mt-2">Confidence</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience seamless cryptocurrency trading with advanced tools, real-time market data, and bank-grade security. Join millions of traders worldwide.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-10 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Live Market Data</h2>
            <p className="text-xl text-gray-600">Real-time prices from global cryptocurrency markets</p>
          </div>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img 
                        src={getCryptoLogo(crypto.symbol)} 
                        alt={crypto.name}
                        className="w-8 h-8 object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-black text-lg">{crypto.name}</div>
                      <div className="text-sm text-gray-500">{crypto.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-black text-xl">
                      ${crypto.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end ${
                      crypto.change >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Volume</div>
                    <div className="font-semibold text-black">{crypto.volume}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for traders by traders, our platform combines cutting-edge technology with intuitive design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full group-hover:bg-green-500 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-black mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Security & Trust</h2>
            <p className="text-xl text-gray-600">Your security is our top priority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-green-200 bg-white">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-black">Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Multi-signature wallets, cold storage, and advanced encryption protect your funds</p>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-white">
              <CardHeader className="text-center">
                <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-black">2FA Authentication</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Two-factor authentication and biometric security for maximum account protection</p>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-white">
              <CardHeader className="text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-black">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Fully licensed and compliant with global financial regulations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-green-100 mb-10">
            Join millions of traders and start your crypto journey today. No hidden fees, no minimum deposits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-10 py-4 rounded-xl text-lg transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-green-400">BITPANDA PRO</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                The world's leading cryptocurrency trading platform. Trade with confidence, security, and professional tools.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/trading" className="hover:text-green-400 transition-colors">Spot Trading</Link></li>
                <li><Link href="/markets" className="hover:text-green-400 transition-colors">Markets</Link></li>
                <li><Link href="/portfolio" className="hover:text-green-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/alerts" className="hover:text-green-400 transition-colors">Price Alerts</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/help" className="hover:text-green-400 transition-colors">Help Center</Link></li>
                <li><Link href="/security" className="hover:text-green-400 transition-colors">Security</Link></li>
                <li><Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 BITPANDA PRO. All rights reserved. | Licensed and regulated cryptocurrency exchange.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}