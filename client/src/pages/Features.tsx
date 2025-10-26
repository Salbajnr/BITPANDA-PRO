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
      title: "Mobile First",
      description: "Fully responsive design optimized for all devices",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer support in multiple languages",
      bgColor: "from-orange-500 to-amber-600"
    },
    {
      icon: Clock,
      title: "Instant Deposits",
      description: "Fast deposits and withdrawals with multiple payment methods",
      bgColor: "from-teal-500 to-cyan-600"
    }
  ];

  const tradingFeatures = [
    {
      title: "Spot Trading",
      description: "Buy and sell cryptocurrencies at current market prices",
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: "Advanced Orders",
      description: "Limit, stop-loss, and take-profit orders for precise trading",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Portfolio Analytics",
      description: "Track performance with comprehensive analytics and reporting",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: "Price Alerts",
      description: "Get notified when your favorite assets reach target prices",
      icon: <Bell className="w-6 h-6" />
    }
  ];

  const securityFeatures = [
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "Cold Storage",
      description: "Your funds are stored offline for maximum security",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Insurance Coverage",
      description: "Your assets are protected with comprehensive insurance",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Regular Audits",
      description: "Independent security audits ensure platform integrity",
      icon: <Layers className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src={logoImage} alt="BITPANDA PRO" className="h-8 w-8 rounded-full" />
              <span className="text-xl font-bold text-slate-900">BITPANDA PRO</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="/markets" className="text-slate-600 hover:text-slate-900 transition-colors">Markets</a>
              <a href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <a href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
              <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
                <a href="/markets" className="text-slate-600 hover:text-slate-900 transition-colors">Markets</a>
                <a href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
                <a href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  <Button variant="outline" onClick={handleLogin} className="w-full">
                    Login
                  </Button>
                  <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
            ✨ Platform Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> Trade Smart</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Discover the powerful features that make BITPANDA PRO the preferred choice for traders worldwide. 
            From advanced security to lightning-fast execution, we've got you covered.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
            Explore Features
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Traders
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Experience the next generation of cryptocurrency trading with our comprehensive suite of tools and features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Advanced Trading Tools
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Take your trading to the next level with professional-grade tools and features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tradingFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bank-Grade Security
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Your assets are protected by multiple layers of security designed to keep your funds safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust BITPANDA PRO for their cryptocurrency trading needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3"
            >
              Start Trading Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logoImage} alt="BITPANDA PRO" className="h-8 w-8 rounded-full" />
                <span className="text-lg font-bold text-white">BITPANDA PRO</span>
              </div>
              <p className="text-gray-400 text-sm">
                The leading cryptocurrency trading platform for professionals and beginners alike.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
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