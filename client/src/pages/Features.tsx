import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Shield, Zap, BarChart3, Globe, 
  Smartphone, Users, Clock, Award, Target,
  Activity, Layers, Bell, Lock
} from 'lucide-react';
import logoPath from '@/assets/logo.jpeg';

export default function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Market Data",
      description: "Live cryptocurrency prices from major exchanges updated every second",
      color: "text-green-400",
      bgColor: "from-green-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Charting",
      description: "Professional-grade charts with technical indicators and drawing tools",
      color: "text-blue-400",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Risk-Free Trading",
      description: "Practice with virtual funds without any financial risk",
      color: "text-purple-400",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description: "Lightning-fast order execution matching real market conditions",
      color: "text-yellow-400",
      bgColor: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access to 100+ cryptocurrencies from exchanges worldwide",
      color: "text-cyan-400",
      bgColor: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Trade on any device with our fully responsive design",
      color: "text-pink-400",
      bgColor: "from-pink-500 to-pink-600"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logoPath} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">BITPANDA PRO</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="/features" className="text-white font-medium">Features</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Features</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools designed to make you a better crypto trader through realistic simulation and professional-grade features.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Tools Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Professional Trading Tools
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze markets and execute successful trades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Start with our free plan or upgrade for advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <p className="text-4xl font-bold text-green-400 mb-2">$0</p>
                  <p className="text-gray-300">Perfect for beginners</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    $10,000 virtual funds
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Basic charting tools
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    10+ cryptocurrencies
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Email support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-white/15 to-white/10 backdrop-blur-sm border-green-400/50 hover:border-green-400 transition-all transform scale-105">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="bg-green-500 text-white mb-4">Most Popular</Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <p className="text-4xl font-bold text-green-400 mb-2">$29</p>
                  <p className="text-gray-300">per month</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    $100,000 virtual funds
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Advanced charting & indicators
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    100+ cryptocurrencies
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Portfolio analytics
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <p className="text-4xl font-bold text-blue-400 mb-2">$99</p>
                  <p className="text-gray-300">per month</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Unlimited virtual funds
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Custom indicators
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    All assets & markets
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    24/7 phone support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    API access
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bank-Level Security
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Your data and privacy are protected with enterprise-grade security measures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">SSL Encryption</h3>
              <p className="text-gray-300 text-sm">256-bit SSL encryption for all data transmission</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GDPR Compliant</h3>
              <p className="text-gray-300 text-sm">Full compliance with data protection regulations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
              <p className="text-gray-300 text-sm">We never share your personal information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">SOC 2 Certified</h3>
              <p className="text-gray-300 text-sm">Industry-standard security certifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Master Crypto Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders who started their journey with our platform.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all">
            Start Trading Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src={logoPath} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">BITPANDA PRO</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 BITPANDA PRO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}