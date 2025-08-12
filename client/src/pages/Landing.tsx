import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Shield, Zap, Users, BarChart3, ChartLine, Clock, 
  Activity, DollarSign, Headphones, Star, Award, CheckCircle,
  Smartphone, Globe, Lock, Bell, Menu, X, ArrowRight, Quote,
  PlayCircle, Briefcase, CreditCard, Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
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

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  icon: string;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
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
    { 
      symbol: "AVAX/USD", 
      name: "Avalanche", 
      price: 34.82, 
      change: 4.12, 
      volume: "$290M", 
      color: "from-red-400 to-red-600", 
      icon: "AVAX",
      chartData: [32, 33, 35, 34, 36, 35, 34.82]
    },
    { 
      symbol: "DOT/USD", 
      name: "Polkadot", 
      price: 7.25, 
      change: -0.89, 
      volume: "$180M", 
      color: "from-pink-400 to-pink-600", 
      icon: "DOT",
      chartData: [7.1, 7.3, 7.0, 7.4, 7.2, 7.35, 7.25]
    }
  ]);

  const [floatingElements] = useState<FloatingElement[]>([
    { id: 1, x: 5, y: 10, icon: "BTC", color: "from-orange-400 to-orange-600", delay: 0, duration: 6, size: 64 },
    { id: 2, x: 85, y: 15, icon: "ETH", color: "from-blue-400 to-blue-600", delay: 1, duration: 7, size: 56 },
    { id: 3, x: 10, y: 70, icon: "SOL", color: "from-purple-400 to-purple-600", delay: 2, duration: 8, size: 48 },
    { id: 4, x: 90, y: 75, icon: "ADA", color: "from-indigo-400 to-indigo-600", delay: 3, duration: 6.5, size: 52 },
    { id: 5, x: 15, y: 40, icon: "AVAX", color: "from-red-400 to-red-600", delay: 4, duration: 7.5, size: 44 },
    { id: 6, x: 75, y: 45, icon: "DOT", color: "from-pink-400 to-pink-600", delay: 5, duration: 9, size: 40 },
  ]);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Grade Security",
      description: "Multi-signature wallets, cold storage, and advanced encryption protocols protect your assets 24/7",
      color: "from-[#00D4AA] to-[#00B39F]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning-Fast Execution",
      description: "Execute trades in milliseconds with our high-performance matching engine and global liquidity pools",
      color: "from-[#FFB82F] to-[#F7931A]"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Professional Analytics",
      description: "Advanced charting tools, technical indicators, and AI-powered market insights for informed decisions",
      color: "from-[#3B82F6] to-[#1D4ED8]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join millions of traders worldwide with 24/7 multilingual support and educational resources",
      color: "from-[#8B5CF6] to-[#7C3AED]"
    }
  ];

  const stats = [
    { value: "$50B+", label: "Daily Trading Volume", icon: <Activity className="w-6 h-6" /> },
    { value: "2M+", label: "Active Traders", icon: <Users className="w-6 h-6" /> },
    { value: "350+", label: "Crypto Assets", icon: <Wallet className="w-6 h-6" /> },
    { value: "180+", label: "Countries Served", icon: <Globe className="w-6 h-6" /> }
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

  // Auto-cycle features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-cycle hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 8000);

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
          stroke={isPositive ? "#00D4AA" : "#F84638"}
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white overflow-x-hidden relative">
      {/* Bybit-inspired Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,182,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,182,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-400/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-1/2 h-1/2 bg-gradient-radial from-blue-400/10 to-transparent blur-3xl" />
      </div>

      {/* Floating Crypto Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center shadow-2xl">
              {getCryptoLogo(element.icon, element.size * 0.8, "opacity-60")}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation - Bybit Style */}
      <motion.nav 
        className="relative z-50 bg-[#161A1E]/95 backdrop-blur-xl border-b border-[#2B2F36]"
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
              <img src={logoImage} alt="BITPANDA PRO" className="h-10 w-10 rounded-lg shadow-lg" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                  BITPANDA PRO
                </h1>
                <p className="text-xs text-[#8B949E]">Professional Trading Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Markets", "Trading", "Features", "Security", "Academy"].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-[#8B949E] hover:text-white transition-colors relative group font-medium"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFB82F] to-[#F7931A] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  className="text-white border-[#2B2F36] hover:bg-[#2B2F36]/50 font-medium"
                  onClick={() => window.location.href = "/auth"}
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold shadow-lg"
                  onClick={() => window.location.href = "/auth"}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
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
              className="md:hidden bg-[#161A1E]/95 backdrop-blur-xl border-t border-[#2B2F36]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-6 space-y-4">
                {["Markets", "Trading", "Features", "Security", "Academy"].map((item) => (
                  <a key={item} href="#" className="block text-[#8B949E] hover:text-white transition-colors font-medium">
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full text-white border-[#2B2F36] font-medium"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FFB82F] to-[#F7931A] text-black font-semibold"
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
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FFB82F]/10 to-[#F7931A]/10 rounded-full border border-[#FFB82F]/30 mb-6">
                  <Star className="w-4 h-4 text-[#FFB82F] mr-2" />
                  <span className="text-sm text-[#FFB82F]">Trusted by 2M+ Traders Worldwide</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Trade Crypto
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#FFB82F] via-[#F7931A] to-[#FFB82F] bg-clip-text text-transparent">
                    Like a Pro
                  </span>
                </h1>
                
                <p className="text-xl text-[#8B949E] leading-relaxed max-w-lg">
                  Experience the next generation of cryptocurrency trading with institutional-grade tools, 
                  lightning-fast execution, and unparalleled security.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold shadow-2xl px-8 py-6 text-lg rounded-xl"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Start Trading Now
                    <TrendingUp className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[#2B2F36] text-white hover:bg-[#2B2F36]/50 px-8 py-6 text-lg rounded-xl font-medium"
                  >
                    <PlayCircle className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center gap-8 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$50B+</div>
                  <div className="text-sm text-[#8B949E]">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">350+</div>
                  <div className="text-sm text-[#8B949E]">Crypto Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">180+</div>
                  <div className="text-sm text-[#8B949E]">Countries</div>
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
              <div className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36] shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Live Markets</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />
                    <span className="text-sm text-[#00D4AA] font-medium">Live</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {marketData.map((crypto, index) => (
                    <motion.div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 bg-[#1E2329]/60 rounded-xl hover:bg-[#2B2F36]/60 transition-colors cursor-pointer group border border-[#2B2F36]/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center shadow-lg">
                          {getCryptoLogo(crypto.icon, 40)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{crypto.symbol}</div>
                          <div className="text-sm text-[#8B949E]">{crypto.name}</div>
                        </div>
                      </div>

                      <div className="text-center">
                        {generateMiniChart(crypto.chartData, crypto.change > 0)}
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${crypto.price.toLocaleString(undefined, { 
                            minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                            maximumFractionDigits: crypto.price < 1 ? 4 : 2
                          })}
                        </div>
                        <div className={`text-sm font-medium ${crypto.change >= 0 ? 'text-[#00D4AA]' : 'text-[#F84638]'}`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 pt-4 border-t border-[#2B2F36]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold rounded-xl"
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
      <section className="relative z-10 py-32 bg-[#1E2329]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Why Choose BITPANDA PRO?
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Experience the difference with our cutting-edge platform designed for both beginners and professional traders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-[#161A1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#2B2F36] hover:border-[#FFB82F]/30 transition-all duration-300 h-full group-hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-[#8B949E] leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FFB82F]/10 to-[#F7931A]/10 rounded-3xl p-12 border border-[#FFB82F]/30">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFB82F] to-[#F7931A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-[#8B949E]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Ready to Start Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Trading Journey?
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] mb-12 max-w-2xl mx-auto">
              Join millions of traders who trust BITPANDA PRO for their cryptocurrency trading needs. 
              Start with as little as $10 and unlock the future of finance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold shadow-2xl px-12 py-6 text-lg rounded-xl"
                  onClick={() => window.location.href = "/auth"}
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#2B2F36] text-white hover:bg-[#2B2F36]/50 px-12 py-6 text-lg rounded-xl font-medium"
                >
                  <Briefcase className="mr-2 w-5 h-5" />
                  Professional Account
                </Button>
              </motion.div>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[#8B949E]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                <span>Instant Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#161A1E]/90 backdrop-blur-xl border-t border-[#2B2F36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={logoImage} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                BITPANDA PRO
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-[#8B949E]">
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/about-us" className="hover:text-white transition-colors">About</a>
              <a href="/help-center" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#2B2F36] text-center text-sm text-[#8B949E]">
            <p>© 2025 BITPANDA PRO. All rights reserved. Cryptocurrency trading involves risk.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}