
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
  Eye,
  European
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
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
    title: "Trade in minutes from only €1",
    description: "Start trading cryptocurrencies with the minimum investment that fits your budget.",
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "Your No.1 European broker",
    description: "Regulated by Austrian Financial Market Authority (FMA) and trusted across Europe.",
    color: "text-green-600"
  },
  {
    icon: Zap,
    title: "Trade 24/7",
    description: "Access global cryptocurrency markets around the clock with instant execution.",
    color: "text-green-600"
  },
  {
    icon: DollarSign,
    title: "Fee-free on all deposits",
    description: "No hidden fees on deposits. Transparent pricing for all your trading activities.",
    color: "text-green-600"
  },
  {
    icon: BarChart3,
    title: "500+ Assets",
    description: "Trade cryptocurrencies, stocks, ETFs, indices and precious metals all in one place.",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "2M+ Active Users",
    description: "Join millions of investors who trust BITPANDA PRO for their investment needs.",
    color: "text-green-600"
  }
];

const trustIndicators = [
  {
    icon: Shield,
    title: "EU Regulated",
    description: "Licensed by Austrian FMA",
    badge: "🇪🇺"
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Your funds are safe",
    badge: "🔒"
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Best Crypto Platform 2024",
    badge: "🏆"
  }
];

const steps = [
  {
    number: "01",
    title: "Sign up",
    description: "Create your free account in under 2 minutes",
    icon: Users
  },
  {
    number: "02", 
    title: "Verify",
    description: "Quick identity verification process",
    icon: CheckCircle
  },
  {
    number: "03",
    title: "Start Trading",
    description: "Buy your first crypto from €1",
    icon: TrendingUp
  }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />
      
      {/* Hero Section - Following Bitpanda's exact style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>🇦🇹 Austria based and European regulated</span>
            </div>
            
            {/* Main Heading - Bitpanda Style */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              BITPANDA PRO -
              <span className="text-green-600 block mt-2">Start investing today</span>
            </h1>
            
            {/* Subtitle - Exact Bitpanda copy */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
              Trade in minutes from only €1. Your No.1 European broker for stocks, crypto, indices, ETFs and precious metals. Trade 24/7. Fee-free on all deposits.
            </p>
            
            {/* CTA Buttons - Bitpanda Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 rounded-lg text-lg h-14 transition-all duration-200">
                  Get started
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-12 py-4 rounded-lg text-lg h-14 font-semibold transition-all duration-200"
              >
                Learn more
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-2xl">{indicator.badge}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-sm">{indicator.title}</div>
                    <div className="text-xs text-gray-600">{indicator.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Bitpanda style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live prices</h2>
            <p className="text-xl text-gray-600">Real-time market data for top cryptocurrencies</p>
          </div>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md">
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
                      <div className="font-bold text-gray-900 text-lg">{crypto.name}</div>
                      <div className="text-sm text-gray-500 uppercase">{crypto.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-xl">
                      €{crypto.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end font-medium ${
                      crypto.change >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">24h Volume</div>
                    <div className="font-semibold text-gray-900">{crypto.volume}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bitpanda style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why choose BITPANDA PRO</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Europe's leading investment platform combining traditional and digital assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-lg">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section - European Focus */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Regulated and secure</h2>
            <p className="text-xl text-gray-600">Your security and regulatory compliance is our priority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EU Regulated</h3>
              <p className="text-gray-600">Licensed by the Austrian Financial Market Authority (FMA) and fully compliant with European regulations</p>
            </Card>

            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Storage</h3>
              <p className="text-gray-600">95% of digital assets stored offline in military-grade cold storage with multi-signature security</p>
            </Card>

            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Award Winning</h3>
              <p className="text-gray-600">Recognized as Europe's most trusted crypto platform with multiple industry awards</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Bitpanda style */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start investing?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join over 2 million users who trust BITPANDA PRO. Start trading from just €1 with no deposit fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4 rounded-lg text-lg h-14 transition-all duration-200">
                Get started now
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-12 py-4 rounded-lg text-lg h-14 font-semibold transition-all duration-200"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - European Compliance Focus */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-green-400">BITPANDA PRO</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Austria based and European regulated cryptocurrency trading platform. Licensed by the Austrian Financial Market Authority (FMA).
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  🇦🇹 Austria based
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  EU regulated
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/trading" className="hover:text-green-400 transition-colors">Cryptocurrencies</Link></li>
                <li><Link href="/markets" className="hover:text-green-400 transition-colors">Stocks</Link></li>
                <li><Link href="/portfolio" className="hover:text-green-400 transition-colors">ETFs</Link></li>
                <li><Link href="/alerts" className="hover:text-green-400 transition-colors">Precious Metals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-green-400 transition-colors">About</Link></li>
                <li><Link href="/security" className="hover:text-green-400 transition-colors">Security</Link></li>
                <li><Link href="/terms" className="hover:text-green-400 transition-colors">Legal</Link></li>
                <li><Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 BITPANDA PRO. All rights reserved. BITPANDA PRO is licensed by the Austrian Financial Market Authority (FMA).
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  FMA Licensed
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  🇪🇺 EU Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
