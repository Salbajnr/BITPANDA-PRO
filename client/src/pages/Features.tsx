
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
import { 
  Shield, 
  Zap, 
  Globe, 
  PieChart, 
  Smartphone, 
  CreditCard,
  TrendingUp,
  Lock,
  Users,
  BarChart3
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Level Security",
      description: "Your assets are protected with military-grade encryption and cold storage technology."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Execute trades in milliseconds with our high-performance trading engine."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Trade 24/7 from anywhere in the world with support for 50+ countries."
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Portfolio Analytics",
      description: "Advanced analytics and insights to track your investment performance."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Trading",
      description: "Full-featured mobile app for trading on the go, available on iOS and Android."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Easy Deposits",
      description: "Multiple payment methods including bank transfers, cards, and crypto deposits."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Advanced Trading",
      description: "Professional trading tools including limit orders, stop-loss, and margin trading."
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Regulatory Compliance",
      description: "Fully licensed and regulated, ensuring your investments are protected by law."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support from our team of crypto experts."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Data",
      description: "Live market data, charts, and analytics powered by institutional-grade feeds."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Platform Features</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the powerful features that make our platform the perfect choice for both 
              beginners and professional traders in the cryptocurrency market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of traders who trust our platform for their cryptocurrency investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Start Trading Now
              </button>
              <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
