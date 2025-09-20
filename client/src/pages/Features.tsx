
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { 
  TrendingUp, Shield, Zap, BarChart3, Globe, 
  Smartphone, Users, Clock, Award, Target,
  Activity, Layers, Bell, Lock, Menu, X, ArrowRight
} from 'lucide-react';
import logoImage from '@/assets/logo.jpeg';

export default function Features() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Multi-layer security with cold storage, 2FA, and insurance coverage up to €100M",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Advanced charting tools, technical indicators, and market analysis",
      bgColor: "from-blue-500 to-cyan-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description: "Ultra-low latency trading with institutional-grade order matching",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      icon: BarChart3,
      title: "Portfolio Management",
      description: "Comprehensive portfolio tracking with performance analytics",
      bgColor: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access to 100+ cryptocurrencies and traditional assets",
      bgColor: "from-indigo-500 to-blue-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Trading",
      description: "Full-featured mobile app for trading on the go",
      bgColor: "from-red-500 to-pink-600"
    }
  ];

  const tradingFeatures = [
    {
      icon: Target,
      title: "Order Types",
      description: "Market, limit, stop-loss, and advanced order types"
    },
    {
      icon: Activity,
      title: "Portfolio Analytics",
      description: "Detailed performance metrics and risk analysis"
    },
    {
      icon: Layers,
      title: "Multi-Asset Support",
      description: "Trade cryptocurrencies, forex, and commodities"
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description: "Custom notifications for price movements and market events"
    }
  ];

  const securityFeatures = [
    "256-bit SSL encryption",
    "Two-factor authentication",
    "Cold storage wallets",
    "Regular security audits",
    "EU regulatory compliance",
    "€100M insurance coverage"
  ];

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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Home</a>
              <a href="/about" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">About</a>
              <a href="/features" className="text-primary font-medium underline underline-offset-4 decoration-primary">Features</a>
              <a href="/contact" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Contact</a>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
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
            <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-700">
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
                  className="block text-primary font-medium py-2 text-lg"
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
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-green-500/10 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-in slide-in-from-bottom duration-1000">
            <div className="inline-block px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-primary/20 to-green-500/20 border border-primary/30">
              <span className="text-sm font-medium text-white">🚀 PROFESSIONAL TRADING TOOLS</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              Platform
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                {" "}Features
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Discover the advanced tools and features that make BITPANDA PRO the preferred choice for professional 
              cryptocurrency traders across Europe.
            </p>
          </div>
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

      {/* Trading Tools Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Professional Trading Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze markets and execute successful trades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="inline-block px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <span className="text-sm font-medium text-green-400">🔒 ENTERPRISE SECURITY</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Bank-Grade Security</h2>
              <p className="text-xl text-gray-300 mb-8">
                Your security is our top priority. We employ the same security measures used by leading financial institutions 
                to protect your assets and personal information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Shield className="text-green-500 w-3 h-3" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-in slide-in-from-right duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 to-emerald-500/30 rounded-3xl blur-3xl opacity-60"></div>
                <div className="relative bg-slate-700 rounded-3xl p-8 border border-slate-600 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">€100M Insurance</h3>
                    <p className="text-gray-400">Your funds are protected by comprehensive insurance coverage</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-600 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">Cold Storage</span>
                        <Badge className="bg-green-500/20 text-green-400">98%</Badge>
                      </div>
                      <div className="text-sm text-gray-400">Offline storage for maximum security</div>
                    </div>
                    
                    <div className="bg-slate-600 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">Multi-Sig Wallets</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-400">Multiple signature authorization required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Performance & Reliability</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built for high-frequency trading with institutional-grade infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-white font-semibold mb-1">Uptime</div>
              <div className="text-sm text-gray-400">Guaranteed availability</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">&lt;10ms</div>
              <div className="text-white font-semibold mb-1">Latency</div>
              <div className="text-sm text-gray-400">Lightning-fast execution</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">10M+</div>
              <div className="text-white font-semibold mb-1">Orders/Day</div>
              <div className="text-sm text-gray-400">Processing capacity</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">24/7</div>
              <div className="text-white font-semibold mb-1">Support</div>
              <div className="text-sm text-gray-400">Always available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Experience Professional Trading</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the thousands of professional traders who rely on BITPANDA PRO for their cryptocurrency investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Start Trading
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-10 py-4 rounded-full text-lg font-bold transition-all"
            >
              Try Demo
            </Button>
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
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Deposit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Withdraw</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Open Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verify Your Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">LEARN MORE</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Responsible Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Avoid Scam</a></li>
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
              BITPANDA PRO Copyright Protected © 2024. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
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
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, TrendingUp, Zap, Users, BarChart3, Globe,
  Smartphone, Lock, Award, CheckCircle, ArrowRight,
  CreditCard, Wallet, Bell, Settings, BookOpen, Headphones
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Features() {
  const mainFeatures = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Trading",
      description: "Professional trading tools with real-time charts, technical analysis, and order types",
      features: ["Real-time market data", "Advanced charting", "Multiple order types", "Portfolio analytics"],
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "Multi-layer security protocols to protect your assets and personal information",
      features: ["Two-factor authentication", "Cold storage", "Encrypted data", "Regular audits"],
      color: "green"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Trading",
      description: "Trade on the go with our fully-featured mobile application",
      features: ["iOS & Android apps", "Mobile-optimized UI", "Push notifications", "Biometric login"],
      color: "purple"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Portfolio Analytics",
      description: "Comprehensive portfolio tracking and performance analysis tools",
      features: ["Performance tracking", "Risk analysis", "Asset allocation", "Tax reporting"],
      color: "orange"
    }
  ];

  const tradingFeatures = [
    {
      title: "Spot Trading",
      description: "Buy and sell cryptocurrencies at current market prices",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Margin Trading",
      description: "Amplify your trading power with leverage up to 5x",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "DCA Orders",
      description: "Dollar-cost averaging for consistent investment strategies",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: "Stop-Loss Orders",
      description: "Protect your investments with automated risk management",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const securityFeatures = [
    {
      title: "Multi-Signature Wallets",
      description: "Enhanced security with multiple signature requirements",
      status: "Active"
    },
    {
      title: "Cold Storage",
      description: "95% of funds stored offline for maximum security",
      status: "Active"
    },
    {
      title: "Insurance Coverage",
      description: "Digital asset insurance up to €100M",
      status: "Active"
    },
    {
      title: "Regular Security Audits",
      description: "Third-party security assessments and penetration testing",
      status: "Active"
    }
  ];

  const supportedAssets = [
    { name: "Bitcoin", symbol: "BTC", type: "Cryptocurrency" },
    { name: "Ethereum", symbol: "ETH", type: "Cryptocurrency" },
    { name: "Stocks", symbol: "AAPL, TSLA, etc.", type: "Traditional Asset" },
    { name: "ETFs", symbol: "SPY, QQQ, etc.", type: "Fund" },
    { name: "Gold", symbol: "GOLD", type: "Precious Metal" },
    { name: "Silver", symbol: "SILVER", type: "Precious Metal" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>🚀 Platform Features</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features
              <span className="text-blue-600 block mt-2">Built for Professional Trading</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Discover the comprehensive suite of tools and features that make BITPANDA PRO 
              the preferred choice for serious crypto traders and investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
                <ArrowRight className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8 py-4">
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for professional cryptocurrency trading and investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      feature.color === 'green' ? 'bg-green-100 text-green-600' :
                      feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trading Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced trading features for every level of trader
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingFeatures.map((feature, index) => (
              <Card key={index} className="text-center border border-gray-200 hover:border-blue-300 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your security is our top priority. We employ multiple layers of protection 
                to ensure your funds and data are always safe.
              </p>

              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 text-white">
                <Shield className="w-16 h-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Regulated & Compliant</h3>
                <p className="opacity-90 mb-6">
                  Licensed by the Austrian Financial Market Authority (FMA) and fully 
                  compliant with European Union regulations.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">MiFID II Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">PCI DSS Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Assets */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported Assets</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trade a diverse range of digital and traditional assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedAssets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                  <p className="text-sm text-gray-600">{asset.symbol}</p>
                </div>
                <Badge variant="outline">{asset.type}</Badge>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">And many more assets available on the platform</p>
            <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white">
              View All Assets
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join millions of users who trust BITPANDA PRO for their cryptocurrency 
            trading and investment needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Trading Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4">
              <Headphones className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, TrendingUp, Zap, Users, BarChart3, Globe,
  Smartphone, Lock, Award, CheckCircle, ArrowRight,
  CreditCard, Wallet, Bell, Settings, BookOpen, Headphones
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Features() {
  const mainFeatures = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Trading",
      description: "Professional trading tools with real-time charts, technical analysis, and order types",
      features: ["Real-time market data", "Advanced charting", "Multiple order types", "Portfolio analytics"],
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "Multi-layer security protocols to protect your assets and personal information",
      features: ["Two-factor authentication", "Cold storage", "Encrypted data", "Regular audits"],
      color: "green"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Trading",
      description: "Trade on the go with our fully-featured mobile application",
      features: ["iOS & Android apps", "Mobile-optimized UI", "Push notifications", "Biometric login"],
      color: "purple"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Portfolio Analytics",
      description: "Comprehensive portfolio tracking and performance analysis tools",
      features: ["Performance tracking", "Risk analysis", "Asset allocation", "Tax reporting"],
      color: "orange"
    }
  ];

  const tradingFeatures = [
    {
      title: "Spot Trading",
      description: "Buy and sell cryptocurrencies at current market prices",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Margin Trading",
      description: "Amplify your trading power with leverage up to 5x",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "DCA Orders",
      description: "Dollar-cost averaging for consistent investment strategies",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: "Stop-Loss Orders",
      description: "Protect your investments with automated risk management",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const securityFeatures = [
    {
      title: "Multi-Signature Wallets",
      description: "Enhanced security with multiple signature requirements",
      status: "Active"
    },
    {
      title: "Cold Storage",
      description: "95% of funds stored offline for maximum security",
      status: "Active"
    },
    {
      title: "Insurance Coverage",
      description: "Digital asset insurance up to €100M",
      status: "Active"
    },
    {
      title: "Regular Security Audits",
      description: "Third-party security assessments and penetration testing",
      status: "Active"
    }
  ];

  const supportedAssets = [
    { name: "Bitcoin", symbol: "BTC", type: "Cryptocurrency" },
    { name: "Ethereum", symbol: "ETH", type: "Cryptocurrency" },
    { name: "Stocks", symbol: "AAPL, TSLA, etc.", type: "Traditional Asset" },
    { name: "ETFs", symbol: "SPY, QQQ, etc.", type: "Fund" },
    { name: "Gold", symbol: "GOLD", type: "Precious Metal" },
    { name: "Silver", symbol: "SILVER", type: "Precious Metal" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>🚀 Platform Features</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features
              <span className="text-blue-600 block mt-2">Built for Professional Trading</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Discover the comprehensive suite of tools and features that make BITPANDA PRO 
              the preferred choice for serious crypto traders and investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
                <ArrowRight className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8 py-4">
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for professional cryptocurrency trading and investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      feature.color === 'green' ? 'bg-green-100 text-green-600' :
                      feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trading Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced trading features for every level of trader
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingFeatures.map((feature, index) => (
              <Card key={index} className="text-center border border-gray-200 hover:border-blue-300 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your security is our top priority. We employ multiple layers of protection 
                to ensure your funds and data are always safe.
              </p>

              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Badge className="bg-green-100 text-green-800">{feature.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 text-white">
                <Shield className="w-16 h-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Regulated & Compliant</h3>
                <p className="opacity-90 mb-6">
                  Licensed by the Austrian Financial Market Authority (FMA) and fully 
                  compliant with European Union regulations.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">MiFID II Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">PCI DSS Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Assets */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported Assets</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trade a diverse range of digital and traditional assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedAssets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                  <p className="text-sm text-gray-600">{asset.symbol}</p>
                </div>
                <Badge variant="outline">{asset.type}</Badge>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">And many more assets available on the platform</p>
            <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white">
              View All Assets
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join millions of users who trust BITPANDA PRO for their cryptocurrency 
            trading and investment needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Trading Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4">
              <Headphones className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
