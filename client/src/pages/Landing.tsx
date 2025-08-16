
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Shield, Zap, Users, BarChart3, ChartLine, Clock, 
  Activity, DollarSign, Headphones, Star, Award, CheckCircle,
  Smartphone, Globe, Lock, Bell, Menu, X, ArrowRight, Quote,
  PlayCircle, Briefcase, CreditCard, Wallet, Target, Layers,
  Building2, UserCheck, CreditCard as CardIcon, TrendingDown,
  Coins, Coins as ChartPie, Banknote, Gem, ChartColumn
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/logo.jpeg";
import { getCryptoLogo, BitcoinLogo, EthereumLogo, SolanaLogo, AvalancheLogo, CardanoLogo, PolkadotLogo } from "@/components/CryptoLogos";

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

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marketData, setMarketData] = useState<MarketData[]>([
    { 
      symbol: "BTC/USD", 
      name: "Bitcoin", 
      price: 43250.00, 
      change: 2.45, 
      volume: "$2.4B", 
      color: "from-orange-400 to-orange-600", 
      icon: "BTC",
      chartData: [42000, 42500, 41800, 43200, 42900, 43800, 43250]
    },
    { 
      symbol: "ETH/USD", 
      name: "Ethereum", 
      price: 2680.50, 
      change: -1.23, 
      volume: "$1.2B", 
      color: "from-blue-400 to-blue-600", 
      icon: "ETH",
      chartData: [2720, 2650, 2780, 2690, 2640, 2700, 2680]
    },
    { 
      symbol: "SOL/USD", 
      name: "Solana", 
      price: 98.75, 
      change: 5.67, 
      volume: "$580M", 
      color: "from-purple-400 to-purple-600", 
      icon: "SOL",
      chartData: [92, 94, 96, 95, 99, 102, 98]
    },
    { 
      symbol: "ADA/USD", 
      name: "Cardano", 
      price: 0.485, 
      change: 3.21, 
      volume: "$340M", 
      color: "from-indigo-400 to-indigo-600", 
      icon: "ADA",
      chartData: [0.46, 0.47, 0.45, 0.48, 0.49, 0.47, 0.485]
    },
  ]);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "Multi-signature wallets, cold storage, and advanced encryption protocols protect your assets 24/7",
      emoji: "🔐"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning-Fast Execution",
      description: "Execute trades in milliseconds with our high-performance matching engine and global liquidity pools",
      emoji: "⚡"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Professional Analytics",
      description: "Advanced charting tools, technical indicators, and AI-powered market insights for informed decisions",
      emoji: "📊"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join millions of traders worldwide with 24/7 multilingual support and educational resources",
      emoji: "🧠"
    },
  ];

  const stats = [
    { value: "$50B+", label: "Volumen diario de trading", icon: <Activity className="w-6 h-6" /> },
    { value: "4M+", label: "Usuarios activos", icon: <Users className="w-6 h-6" /> },
    { value: "350+", label: "Activos cripto", icon: <Wallet className="w-6 h-6" /> },
    { value: "180+", label: "Países atendidos", icon: <Globe className="w-6 h-6" /> }
  ];

  // Simulate live market updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => {
          const priceChange = (Math.random() - 0.5) * 0.02;
          const newPrice = item.price * (1 + priceChange);
          const changePercent = ((newPrice - item.price) / item.price) * 100;
          const newChartData = [...item.chartData.slice(1), newPrice];

          return {
            ...item,
            price: newPrice,
            change: item.change + changePercent * 0.15,
            chartData: newChartData
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateMiniChart = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 30;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="inline-block">
        <path
          d={`M ${points.join(" L ")}`}
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="relative z-50 bg-white border-b border-gray-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={logoImage} alt="BITPANDA PRO" className="h-10 w-10 rounded-lg shadow-md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BITPANDA PRO
                </h1>
                <p className="text-xs text-gray-600">Professional Trading Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Markets", "Trading", "Features", "Academy", "Help"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:bg-gray-100 font-medium"
                onClick={() => window.location.href = "/auth"}
              >
                Sign In
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                onClick={() => window.location.href = "/auth"}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-6 space-y-4">
                {["Markets", "Trading", "Features", "Academy", "Help"].map((item) => (
                  <a key={item} href="#" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-700 hover:bg-gray-100 font-medium"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
                  <Star className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600 font-medium">Trusted by 4M+ users worldwide</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Professional Crypto
                  <br />
                  <span className="text-blue-600">Trading Platform</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Europe's most trusted investment platform. Trade cryptocurrencies, stocks, ETFs, 
                  commodities and more with complete security and transparency.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg px-8 py-6 text-lg rounded-xl"
                  onClick={() => window.location.href = "/auth"}
                >
                  Start Trading
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl font-medium"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center gap-8 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$50B+</div>
                  <div className="text-sm text-gray-600">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">350+</div>
                  <div className="text-sm text-gray-600">Crypto Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">180+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </motion.div>
            </div>

            {/* Live Market Data Panel */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Live Markets</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-600 font-medium">Live</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {marketData.map((crypto, index) => (
                    <motion.div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {getCryptoLogo(crypto.icon, 40)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{crypto.symbol}</div>
                          <div className="text-sm text-gray-600">{crypto.name}</div>
                        </div>
                      </div>

                      <div className="text-center">
                        {generateMiniChart(crypto.chartData, crypto.change > 0)}
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${crypto.price.toLocaleString(undefined, { 
                            minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                            maximumFractionDigits: crypto.price < 1 ? 4 : 2
                          })}
                        </div>
                        <div className={`text-sm font-medium ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                    onClick={() => window.location.href = "/auth"}
                  >
                    View All Markets
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Trading Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access advanced trading features designed for both beginners and professional traders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join millions of traders who trust BITPANDA PRO for their cryptocurrency trading needs. 
              Start with as little as $10 and unlock the future of finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg px-12 py-6 text-lg rounded-xl"
                onClick={() => window.location.href = "/auth"}
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-6 text-lg rounded-xl font-medium"
              >
                <Briefcase className="mr-2 w-5 h-5" />
                Professional Account
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Instant Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src={logoImage} alt="BITPANDA PRO" className="h-12 w-12 rounded-lg" />
                <div>
                  <span className="text-2xl font-bold text-white">BITPANDA PRO</span>
                  <p className="text-xs text-gray-400">Professional Trading Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-xs">
                Europe's most trusted investment platform for cryptocurrencies, stocks and more.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Products</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cryptocurrencies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stocks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ETFs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Commodities</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Deposit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Withdraw</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/legal" className="hover:text-white transition-colors">Legal Notice</a>
                <a href="/security" className="hover:text-white transition-colors">Security</a>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <span className="text-gray-400 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  EU Regulated
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                © 2025 BITPANDA PRO. All rights reserved. 
                Investments carry risks of financial losses.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
