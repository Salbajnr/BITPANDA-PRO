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
  Settings,
  Activity,
  Target,
  Layers,
  Clock
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
  }
];

const tradingTools = [
  {
    icon: Activity,
    title: "Real-Time Market Data",
    description: "Live price feeds, order books, and market depth charts for informed trading decisions."
  },
  {
    icon: Target,
    title: "Advanced Order Types",
    description: "Market, limit, stop-loss, and trailing stop orders with precision execution."
  },
  {
    icon: Layers,
    title: "Professional Charts",
    description: "TradingView integration with 100+ technical indicators and drawing tools."
  },
  {
    icon: Clock,
    title: "24/7 Trading",
    description: "Access global cryptocurrency markets around the clock with minimal downtime."
  }
];

const securityFeatures = [
  { icon: Shield, text: "Multi-Signature Cold Storage" },
  { icon: Lock, text: "Advanced 2FA Authentication" },
  { icon: Award, text: "Insurance Protection Fund" },
  { icon: Globe, text: "Global Compliance Standards" }
];

function Landing() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="hero-gradient section-spacing-large">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className={`flex-1 space-y-8 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
              <div className="space-y-4">
                <Badge 
                  variant="secondary" 
                  className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  World's Leading Crypto Exchange
                </Badge>
                
                <h1 className="text-hero brand-text-gradient text-balance">
                  Trade Crypto with Confidence on BITPANDA PRO
                </h1>
                
                <p className="text-subtitle text-muted-foreground max-w-2xl text-balance">
                  Join millions of traders worldwide on the most secure and user-friendly cryptocurrency exchange. 
                  Advanced trading tools, real-time market data, and institutional-grade security.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="btn-primary glow-effect"
                  asChild
                >
                  <Link href={user ? "/dashboard" : "/auth"}>
                    {user ? "Go to Dashboard" : "Start Trading Now"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-secondary"
                  asChild
                >
                  <Link href="/markets">
                    <Play className="w-5 h-5 mr-2" />
                    Explore Markets
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-orange-500/10 text-orange-400">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10">
                <AnimatedChart 
                  type="line" 
                  data={{ 
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
                    values: [42000, 45000, 43000, 47000, 49000, 52000], 
                    label: 'Bitcoin Price' 
                  }} 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent rounded-2xl blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Stats */}
      <section className="border-t border-border">
        <LiveMarketStats />
      </section>

      {/* Top Cryptocurrencies */}
      <section className="section-spacing">
        <div className="container-max">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trade <span className="brand-text-gradient">Top Cryptocurrencies</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access the world's most popular digital assets with competitive spreads and deep liquidity.
            </p>
          </div>

          <div className="grid-auto-fit">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="crypto-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                        {getCryptoLogo(crypto.symbol)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{crypto.name}</h3>
                        <p className="text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg portfolio-value">
                        ${crypto.price.toLocaleString()}
                      </p>
                      <div className={`flex items-center ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-medium">
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>24h Volume</span>
                      <span className="font-medium">{crypto.volume}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild className="btn-secondary">
              <Link href="/markets">
                View All Markets
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trading Tools Section */}
      <section className="section-spacing bg-gradient-to-b from-transparent to-card/50">
        <div className="container-max">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Professional <span className="brand-text-gradient">Trading Tools</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to trade like a professional. Advanced features for both beginners and experts.
            </p>
          </div>

          <div className="feature-grid">
            {tradingTools.map((tool, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                      <tool.icon className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing">
        <div className="container-max">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="brand-text-gradient">BITPANDA PRO</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for traders, by traders. Experience the most comprehensive cryptocurrency trading platform.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <section className="border-t border-border">
        <NewsTicker />
      </section>

      {/* CTA Section */}
      <section className="section-spacing-large hero-gradient">
        <div className="container-max text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Start <span className="brand-text-gradient">Trading?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join millions of users worldwide and experience the future of cryptocurrency trading.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary glow-effect text-lg px-8 py-6"
                asChild
              >
                <Link href={user ? "/dashboard" : "/auth"}>
                  <DollarSign className="w-6 h-6 mr-2" />
                  {user ? "Start Trading" : "Create Account"}
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-secondary text-lg px-8 py-6"
                asChild
              >
                <Link href="/academy">
                  <Bot className="w-6 h-6 mr-2" />
                  Learn to Trade
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold brand-text-gradient">5M+</div>
                <div className="text-muted-foreground mt-2">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold brand-text-gradient">$2.8T</div>
                <div className="text-muted-foreground mt-2">Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold brand-text-gradient">24/7</div>
                <div className="text-muted-foreground mt-2">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container-max py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-gradient-to-r from-orange-500 to-yellow-500 flex-center">
                  <span className="text-black font-bold text-sm">BP</span>
                </div>
                <span className="text-xl font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-muted-foreground">
                The world's leading cryptocurrency trading platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Products</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/markets" className="block hover:text-orange-400 transition-colors">Markets</Link>
                <Link href="/trading" className="block hover:text-orange-400 transition-colors">Trading</Link>
                <Link href="/portfolio" className="block hover:text-orange-400 transition-colors">Portfolio</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/about" className="block hover:text-orange-400 transition-colors">About Us</Link>
                <Link href="/security" className="block hover:text-orange-400 transition-colors">Security</Link>
                <Link href="/careers" className="block hover:text-orange-400 transition-colors">Careers</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/help" className="block hover:text-orange-400 transition-colors">Help Center</Link>
                <Link href="/academy" className="block hover:text-orange-400 transition-colors">Academy</Link>
                <Link href="/support" className="block hover:text-orange-400 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 BITPANDA PRO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-orange-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-orange-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;