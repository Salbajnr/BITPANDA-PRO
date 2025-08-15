import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Shield, Zap, Users, BarChart3, ChartLine, Clock, 
  Activity, DollarSign, Headphones, Star, Award, CheckCircle,
  Smartphone, Globe, Lock, Bell, Menu, X, ArrowRight, Quote,
  PlayCircle, Briefcase, CreditCard, Wallet, Target, Layers,
  Building2, UserCheck, CreditCard as CardIcon, TrendingDown,
  Coins, PieChart, Banknote, Gem
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
  const [roiData, setRoiData] = useState({
    initial: 1000,
    monthly: 200,
    apy: 8,
    projectedValue: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      color: "from-[#00D4AA] to-[#00B39F]",
      emoji: "🔐"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning-Fast Execution",
      description: "Execute trades in milliseconds with our high-performance matching engine and global liquidity pools",
      color: "from-[#FFB82F] to-[#F7931A]",
      emoji: "⚡"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Professional Analytics",
      description: "Advanced charting tools, technical indicators, and AI-powered market insights for informed decisions",
      color: "from-[#3B82F6] to-[#1D4ED8]",
      emoji: "📊"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join millions of traders worldwide with 24/7 multilingual support and educational resources",
      color: "from-[#8B5CF6] to-[#7C3AED]",
      emoji: "🧠"
    },
    {
      icon: <ChartLine className="w-8 h-8" />,
      title: "Real-Time Charts",
      description: "GPU-smooth rendering with candles, depth charts, and multiple timeframes for professional analysis",
      color: "from-[#F59E0B] to-[#D97706]",
      emoji: "📈"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategy Backtesting",
      description: "Paper-trade and run backtests to refine your trading strategies with historical data",
      color: "from-[#EF4444] to-[#DC2626]",
      emoji: "🎯"
    }
  ];

  const trustFeatures = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Regulación",
      description: "Regulado por la UE con licencias completas",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguridad",
      description: "Protección de grado bancario y seguros",
      bgColor: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Confianza",
      description: "Más de 4 millones de usuarios confían en nosotros",
      bgColor: "from-purple-500 to-pink-600"
    }
  ];

  const assetFeatures = [
    {
      icon: <Coins className="w-12 h-12" />,
      title: "Criptomonedas",
      description: "Bitcoin, Ethereum y 350+ criptomonedas",
      bgColor: "from-orange-500 to-amber-600",
      assets: ["BTC", "ETH", "ADA", "DOT"]
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Acciones",
      description: "Acciones fraccionadas de las mejores empresas",
      bgColor: "from-blue-500 to-indigo-600",
      assets: ["AAPL", "TSLA", "GOOGL", "AMZN"]
    },
    {
      icon: <PieChart className="w-12 h-12" />,
      title: "ETFs",
      description: "Fondos cotizados diversificados",
      bgColor: "from-green-500 to-teal-600",
      assets: ["SPY", "QQQ", "VTI", "ARKK"]
    },
    {
      icon: <Banknote className="w-12 h-12" />,
      title: "Materias primas",
      description: "Oro, plata y productos básicos",
      bgColor: "from-yellow-500 to-orange-600",
      assets: ["GOLD", "SILVER", "OIL", "GAS"]
    },
    {
      icon: <Gem className="w-12 h-12" />,
      title: "Inversión respaldada por metales",
      description: "Inversiones físicas en metales preciosos",
      bgColor: "from-gray-500 to-slate-600",
      assets: ["AU", "AG", "PT", "PD"]
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Índices cripto",
      description: "Índices diversificados de criptomonedas",
      bgColor: "from-purple-500 to-violet-600",
      assets: ["BCI", "DCI", "MCI", "SCI"]
    }
  ];

  const howItWorksSteps = [
    {
      number: "01",
      title: "Registro",
      description: "Crea tu cuenta en minutos con verificación rápida",
      icon: <UserCheck className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Verificación",
      description: "Verifica tu identidad de forma segura y sencilla",
      icon: <Shield className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Depósito",
      description: "Añade fondos con tarjeta, transferencia o cripto",
      icon: <CardIcon className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Trading",
      description: "Comienza a invertir en cientos de activos",
      icon: <TrendingUp className="w-8 h-8" />
    }
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

  // ROI Calculator
  const calculateROI = () => {
    const { initial, monthly, apy } = roiData;
    const monthlyRate = apy / 100 / 12;
    const months = 24;
    let balance = initial;
    
    for (let i = 1; i <= months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    
    setRoiData(prev => ({ ...prev, projectedValue: balance }));
  };

  useEffect(() => {
    calculateROI();
  }, [roiData.initial, roiData.monthly, roiData.apy]);

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
    <div className="min-h-screen bg-white text-black overflow-x-hidden relative">
      {/* Bybit-inspired Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,182,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,182,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-radial from-green-400/10 to-transparent blur-3xl" />
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
            <div className="hidden md:flex items-center space-x-6">
              {["Invierte", "Precios", "Web3", "Productos", "Aprende", "Empresas", "Conócenos", "Ayuda"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[#8B949E] hover:text-white transition-colors relative group font-medium text-sm"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1db584] to-[#00B39F] group-hover:w-full transition-all duration-300" />
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
                  Iniciar sesión
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-[#1db584] to-[#00B39F] hover:from-[#00B39F] hover:to-[#1db584] text-white font-semibold shadow-lg"
                  onClick={() => window.location.href = "/auth"}
                >
                  Empieza ahora
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
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1db584]/10 to-[#00B39F]/10 rounded-full border border-[#1db584]/30 mb-6">
                  <Star className="w-4 h-4 text-[#1db584] mr-2" />
                  <span className="text-sm text-[#1db584]">Con la confianza de más de 4 millones de usuarios</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Fast-track your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#1db584] via-[#00B39F] to-[#1db584] bg-clip-text text-transparent">
                    financial freedom
                  </span>
                </h1>
                
                <p className="text-xl text-[#8B949E] leading-relaxed max-w-lg">
                  La plataforma de inversión más confiable de Europa. Invierte en criptomonedas, acciones, ETFs, 
                  materias primas y más con total seguridad y transparencia.
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
                    className="bg-gradient-to-r from-[#1db584] to-[#00B39F] hover:from-[#00B39F] hover:to-[#1db584] text-white font-semibold shadow-2xl px-8 py-6 text-lg rounded-xl"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Empieza
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
                    className="border-[#2B2F36] text-white hover:bg-[#2B2F36]/50 px-8 py-6 text-lg rounded-xl font-medium"
                  >
                    <PlayCircle className="mr-2 w-5 h-5" />
                    Ver Demo
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

      {/* Modern Ticker Section */}
      <section className="py-3 border-y border-[#2B2F36] bg-[#161A1E]/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB82F]/5 via-transparent to-[#F7931A]/5" />
        <div className="max-w-7xl mx-auto overflow-hidden px-4">
          <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-sm font-medium">
            {[
              { symbol: "BTC", price: "$68,355", change: "+1.2%", positive: true },
              { symbol: "ETH", price: "$3,210", change: "-0.4%", positive: false },
              { symbol: "SOL", price: "$182.4", change: "+2.1%", positive: true },
              { symbol: "XRP", price: "$0.62", change: "+0.7%", positive: true },
              { symbol: "BNB", price: "$598.3", change: "+0.9%", positive: true },
              { symbol: "ADA", price: "$0.52", change: "-0.3%", positive: false },
              { symbol: "AVAX", price: "$34.82", change: "+4.1%", positive: true },
              { symbol: "DOT", price: "$7.25", change: "-0.8%", positive: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#8B949E]">{item.symbol}</span>
                <span className="text-white font-semibold">{item.price}</span>
                <span className={item.positive ? "text-[#00D4AA]" : "text-[#F84638]"}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee { 
            0% { transform: translateX(0) } 
            100% { transform: translateX(-50%) } 
          }
        `}</style>
      </section>

      {/* Trust & Assurance Blocks */}
      <section className="relative z-10 py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.bgColor} flex items-center justify-center shadow-lg`}>
                    {IconComponent}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#8B949E] text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards - Asset Types */}
      <section className="relative z-10 py-20 bg-[#0B0E11]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Invierte en todo lo que te interesa
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Accede a una amplia gama de activos financieros desde una sola plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assetFeatures.map((asset, index) => {
              const IconComponent = asset.icon;
              return (
                <motion.div
                  key={asset.title}
                  className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#2B2F36] hover:border-[#1db584]/50 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${asset.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{asset.title}</h3>
                  <p className="text-[#8B949E] mb-6 leading-relaxed">{asset.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {asset.assets.map((assetName, idx) => (
                      <Badge
                        key={assetName}
                        variant="secondary"
                        className="bg-[#2B2F36] text-[#8B949E] hover:bg-[#1db584] hover:text-white transition-colors"
                      >
                        {assetName}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Cómo funciona
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Comienza a invertir en cuatro pasos sencillos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#1db584] to-[#00B39F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {IconComponent}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFB82F] rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-[#8B949E] leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="relative z-10 py-20 bg-[#1E2329]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Market Overview */}
            <motion.div
              className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-[#FFB82F] mr-2" />
                Market Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#8B949E]">Total Market Cap</span>
                  <span className="text-white font-semibold">$2.1T</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B949E]">24h Volume</span>
                  <span className="text-white font-semibold">$89.2B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B949E]">BTC Dominance</span>
                  <span className="text-white font-semibold">52.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B949E]">Fear & Greed Index</span>
                  <span className="text-[#00D4AA] font-semibold">Greed (78)</span>
                </div>
              </div>
            </motion.div>

            {/* Top Gainers */}
            <motion.div
              className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-[#00D4AA] mr-2" />
                Top Gainers (24h)
              </h3>
              <div className="space-y-3">
                {[
                  { symbol: "SOL", change: "+15.2%" },
                  { symbol: "AVAX", change: "+12.8%" },
                  { symbol: "ADA", change: "+9.4%" },
                  { symbol: "DOT", change: "+7.1%" }
                ].map((coin, index) => (
                  <div key={coin.symbol} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getCryptoLogo(coin.symbol, 24)}
                      <span className="text-white font-medium">{coin.symbol}</span>
                    </div>
                    <span className="text-[#00D4AA] font-semibold">{coin.change}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trading Volume */}
            <motion.div
              className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 text-[#F7931A] mr-2" />
                Volume Leaders
              </h3>
              <div className="space-y-3">
                {[
                  { symbol: "BTC", volume: "$2.4B" },
                  { symbol: "ETH", volume: "$1.2B" },
                  { symbol: "SOL", volume: "$580M" },
                  { symbol: "ADA", volume: "$340M" }
                ].map((coin, index) => (
                  <div key={coin.symbol} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getCryptoLogo(coin.symbol, 24)}
                      <span className="text-white font-medium">{coin.symbol}</span>
                    </div>
                    <span className="text-[#8B949E] font-semibold">{coin.volume}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trading Tools Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Professional Trading Tools
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Access advanced trading features designed for both beginners and professional traders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ChartLine className="w-8 h-8" />,
                title: "Advanced Charts",
                description: "TradingView integration with 100+ indicators",
                feature: "Real-time data"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Orders",
                description: "Execute trades in under 10ms globally",
                feature: "0.02% fees"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Liquidity",
                description: "Access to major exchanges worldwide",
                feature: "Deep orderbooks"
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: "Smart Alerts",
                description: "AI-powered price and volume notifications",
                feature: "Custom triggers"
              }
            ].map((tool, index) => (
              <motion.div
                key={index}
                className="bg-[#161A1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36] hover:border-[#FFB82F]/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFB82F] to-[#F7931A] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-[#8B949E] text-sm mb-3">{tool.description}</p>
                <div className="inline-flex items-center px-3 py-1 bg-[#FFB82F]/10 rounded-full border border-[#FFB82F]/20">
                  <span className="text-[#FFB82F] text-xs font-medium">{tool.feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-[#0A0F1A] to-[#161A1E]">
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
                Everything for Pro-Level Trading
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Lightning charts, instant execution, portfolio insights, and enterprise-grade security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-[#FFB82F]/30 transition-all duration-300 h-full group-hover:shadow-2xl hover:shadow-[#FFB82F]/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB82F] to-[#F7931A] text-white grid place-items-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300 text-2xl">
                    {feature.emoji}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-[#8B949E] leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive ROI Investment Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-white/5 to-[#161A1E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Grow with smart,
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                  automated investing
                </span>
              </h2>
              <p className="text-xl text-[#8B949E] mb-8">
                Create recurring plans, diversify by strategy, and track potential outcomes with our ROI simulator.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs text-[#8B949E] mb-2 block">Initial Amount ($)</label>
                  <input
                    type="number"
                    value={roiData.initial}
                    onChange={(e) => setRoiData(prev => ({ ...prev, initial: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#2B2F36] bg-[#161A1E]/80 text-white focus:border-[#FFB82F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B949E] mb-2 block">Monthly ($)</label>
                  <input
                    type="number"
                    value={roiData.monthly}
                    onChange={(e) => setRoiData(prev => ({ ...prev, monthly: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#2B2F36] bg-[#161A1E]/80 text-white focus:border-[#FFB82F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B949E] mb-2 block">Expected APY (%)</label>
                  <input
                    type="number"
                    value={roiData.apy}
                    onChange={(e) => setRoiData(prev => ({ ...prev, apy: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#2B2F36] bg-[#161A1E]/80 text-white focus:border-[#FFB82F] focus:outline-none"
                  />
                </div>
              </div>

              <Button 
                onClick={calculateROI}
                className="bg-gradient-to-r from-[#00D4AA] to-[#00B39F] hover:from-[#00B39F] hover:to-[#00D4AA] text-white font-semibold mb-4"
              >
                Calculate Projection
              </Button>

              <p className="text-sm text-[#8B949E]">*For illustration only. Not financial advice.</p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36] shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Projected Portfolio Value</h3>
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    ${roiData.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="bg-[#0B1324]/60 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-[#8B949E]">Total Invested</div>
                      <div className="text-lg font-semibold text-white">
                        ${(roiData.initial + (roiData.monthly * 24)).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-[#8B949E]">Potential Gains</div>
                      <div className="text-lg font-semibold text-[#00D4AA]">
                        ${(roiData.projectedValue - roiData.initial - (roiData.monthly * 24)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Start Investing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Crypto Education Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Learn & Earn Crypto
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Master cryptocurrency trading with our comprehensive educational resources
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Beginner's Guide",
                description: "Start your crypto journey with fundamentals",
                topics: ["What is Bitcoin?", "How to buy crypto", "Wallet security", "Basic trading"],
                icon: <Users className="w-6 h-6" />,
                level: "Beginner",
                color: "from-[#00D4AA] to-[#00B39F]"
              },
              {
                title: "Trading Strategies",
                description: "Advanced techniques for profitable trading",
                topics: ["Technical analysis", "Risk management", "DeFi strategies", "Futures trading"],
                icon: <BarChart3 className="w-6 h-6" />,
                level: "Intermediate",
                color: "from-[#FFB82F] to-[#F7931A]"
              },
              {
                title: "Market Analysis",
                description: "Professional insights and market research",
                topics: ["Market trends", "Tokenomics", "Project analysis", "Portfolio theory"],
                icon: <Award className="w-6 h-6" />,
                level: "Advanced",
                color: "from-[#8B5CF6] to-[#7C3AED]"
              }
            ].map((course, index) => (
              <motion.div
                key={index}
                className="bg-[#161A1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36] hover:border-[#FFB82F]/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-[#2B2F36]/60 rounded-full">
                    <span className="text-[#8B949E] text-xs font-medium">{course.level}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{course.title}</h3>
                <p className="text-[#8B949E] mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-6">
                  {course.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                      <span className="text-sm text-[#8B949E]">{topic}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-[#2B2F36] to-[#161A1E] hover:from-[#FFB82F]/20 hover:to-[#F7931A]/20 text-white border border-[#2B2F36] font-medium">
                  Start Learning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="relative z-10 py-20 bg-[#1E2329]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Bank-Grade
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                  Security
                </span>
              </h2>
              <p className="text-xl text-[#8B949E] mb-8">
                Your funds are protected by military-grade encryption and multi-layer security protocols used by leading financial institutions worldwide.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: "256-bit SSL Encryption" },
                  { icon: <Lock className="w-5 h-5" />, text: "Multi-Signature Wallets" },
                  { icon: <Globe className="w-5 h-5" />, text: "Cold Storage (95% of funds)" },
                  { icon: <Bell className="w-5 h-5" />, text: "Real-time Fraud Detection" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00D4AA] to-[#00B39F] rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#2B2F36]">
                <h3 className="text-2xl font-semibold text-white mb-6">Security Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Uptime", value: "99.99%", color: "text-[#00D4AA]" },
                    { label: "Zero Hacks", value: "5+ Years", color: "text-[#00D4AA]" },
                    { label: "Insurance", value: "$100M", color: "text-[#FFB82F]" },
                    { label: "Compliance", value: "SOC 2", color: "text-[#FFB82F]" }
                  ].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
                      <div className="text-[#8B949E] text-sm">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Pricing Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Simple, transparent pricing
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Start free, scale when you're ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                description: "Paper trading & portfolio basics",
                price: "$0",
                features: [
                  "Real-time charts (delayed data)",
                  "10 assets",
                  "Community support",
                  "Basic portfolio tracking"
                ],
                buttonText: "Get Started",
                buttonAction: "/auth",
                popular: false
              },
              {
                name: "Pro",
                description: "Live data & advanced analytics",
                price: "$19",
                period: "/mo",
                features: [
                  "Full real-time market data",
                  "100+ assets & futures",
                  "Portfolio analytics",
                  "Priority support",
                  "Advanced charting tools"
                ],
                buttonText: "Upgrade",
                buttonAction: "/auth",
                popular: true
              },
              {
                name: "Enterprise",
                description: "Teams & custom controls",
                price: "Custom",
                features: [
                  "SLA & dedicated infrastructure",
                  "Admin audit & SSO",
                  "Custom integrations",
                  "White-label options"
                ],
                buttonText: "Talk to Sales",
                buttonAction: "/contact",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative rounded-2xl p-6 transition-all duration-300 group hover:scale-105 ${
                  plan.popular 
                    ? "border-2 border-[#FFB82F] bg-gradient-to-b from-[#FFB82F]/10 to-[#F7931A]/5 shadow-2xl shadow-[#FFB82F]/20" 
                    : "border border-[#2B2F36] bg-[#161A1E]/80 backdrop-blur-xl"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-[#8B949E] mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-lg text-[#8B949E]">{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00D4AA] flex-shrink-0 mt-0.5" />
                      <span className="text-[#8B949E] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full font-semibold ${
                    plan.popular 
                      ? "bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black" 
                      : "border border-[#FFB82F] text-[#FFB82F] hover:bg-[#FFB82F]/10"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => window.location.href = plan.buttonAction}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                Latest Crypto News
              </span>
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Stay updated with the latest developments in the cryptocurrency world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Bitcoin Reaches New All-Time High",
                excerpt: "BTC breaks through $45,000 resistance level amid institutional adoption",
                time: "2 hours ago",
                category: "Market",
                image: "📈"
              },
              {
                title: "Ethereum 2.0 Staking Rewards Increase",
                excerpt: "Latest network upgrade brings improved yield opportunities for validators",
                time: "5 hours ago",
                category: "Technology",
                image: "🔧"
              },
              {
                title: "DeFi TVL Surpasses $200B Milestone",
                excerpt: "Total value locked in decentralized finance protocols reaches new record",
                time: "1 day ago",
                category: "DeFi",
                image: "💎"
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                className="bg-[#161A1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2B2F36] hover:border-[#FFB82F]/30 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center px-3 py-1 bg-[#FFB82F]/10 rounded-full border border-[#FFB82F]/20">
                    <span className="text-[#FFB82F] text-xs font-medium">{article.category}</span>
                  </div>
                  <span className="text-[#8B949E] text-sm">{article.time}</span>
                </div>
                
                <div className="text-4xl mb-4">{article.image}</div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#FFB82F] transition-colors">
                  {article.title}
                </h3>
                <p className="text-[#8B949E] text-sm leading-relaxed">{article.excerpt}</p>
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

      {/* Mobile App Section */}
      <section className="relative z-10 py-20 bg-[#1E2329]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Trade On The Go
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] bg-clip-text text-transparent">
                  Mobile First
                </span>
              </h2>
              <p className="text-xl text-[#8B949E] mb-8">
                Download our award-winning mobile app and trade cryptocurrencies anywhere, anytime with the same professional tools available on desktop.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { icon: <Smartphone className="w-5 h-5" />, text: "iOS & Android", desc: "Native apps" },
                  { icon: <Bell className="w-5 h-5" />, text: "Push Notifications", desc: "Real-time alerts" },
                  { icon: <Globe className="w-5 h-5" />, text: "Offline Mode", desc: "View portfolios" },
                  { icon: <Lock className="w-5 h-5" />, text: "Biometric Login", desc: "Face/Touch ID" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#FFB82F] to-[#F7931A] rounded-xl flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{feature.text}</div>
                      <div className="text-[#8B949E] text-sm">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-[#FFB82F] to-[#F7931A] hover:from-[#F7931A] hover:to-[#FFB82F] text-black font-semibold">
                  <Smartphone className="mr-2 w-4 h-4" />
                  Download App
                </Button>
                <Button variant="outline" className="border-[#2B2F36] text-white hover:bg-[#2B2F36]/50 font-medium">
                  View QR Code
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#2B2F36]">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">App Features</h3>
                <div className="space-y-4">
                  {[
                    { feature: "Advanced charting", status: "✓" },
                    { feature: "One-tap trading", status: "✓" },
                    { feature: "Portfolio tracking", status: "✓" },
                    { feature: "Price alerts", status: "✓" },
                    { feature: "News & analysis", status: "✓" },
                    { feature: "DeFi integration", status: "Soon" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1E2329]/60 rounded-xl">
                      <span className="text-white">{item.feature}</span>
                      <span className={`text-sm font-medium ${item.status === 'Soon' ? 'text-[#FFB82F]' : 'text-[#00D4AA]'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#2B2F36] text-center">
                  <div className="text-3xl font-bold text-white mb-1">4.8★</div>
                  <div className="text-[#8B949E] text-sm">App Store Rating (50k+ reviews)</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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

      {/* Real-time Asset Listings - Todos los activos */}
      <section className="relative z-10 py-20 bg-[#0B0E11]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Todos los activos
            </h2>
            <p className="text-xl text-[#8B949E] max-w-3xl mx-auto">
              Precios en tiempo real de las principales criptomonedas y activos financieros
            </p>
          </motion.div>

          <motion.div
            className="bg-[#161A1E]/90 backdrop-blur-xl rounded-2xl border border-[#2B2F36] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketData.map((crypto, index) => (
                  <motion.div
                    key={crypto.symbol}
                    className="bg-[#0B0E11]/50 rounded-xl p-4 hover:bg-[#2B2F36]/30 transition-colors cursor-pointer group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getCryptoLogo(crypto.icon, 32)}
                        <div>
                          <div className="text-white font-semibold">{crypto.symbol}</div>
                          <div className="text-sm text-[#8B949E]">{crypto.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          ${crypto.price.toFixed(crypto.price < 1 ? 4 : 2)}
                        </div>
                        <div className={`text-sm font-medium ${
                          crypto.change >= 0 ? 'text-[#1db584]' : 'text-red-500'
                        }`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-[#8B949E]">
                      <span>Vol: {crypto.volume}</span>
                      <div className="w-20 h-8">
                        {generateMiniChart(crypto.chartData, crypto.change >= 0)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-[#1db584] text-[#1db584] hover:bg-[#1db584] hover:text-white"
                  onClick={() => window.location.href = '/markets'}
                >
                  Ver todos los mercados
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#161A1E] border-t border-[#2B2F36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img src={logoImage} alt="BITPANDA PRO" className="h-12 w-12 rounded-lg" />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#1db584] to-[#00B39F] bg-clip-text text-transparent">
                    BITPANDA PRO
                  </span>
                  <p className="text-xs text-[#8B949E]">Plataforma profesional de trading</p>
                </div>
              </div>
              <p className="text-[#8B949E] mb-6 max-w-xs">
                La plataforma de inversión más confiable de Europa para criptomonedas, acciones y más.
              </p>
              
              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <a href="#" className="w-8 h-8 bg-[#2B2F36] rounded-full flex items-center justify-center hover:bg-[#1db584] transition-colors">
                  <span className="text-white text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-[#2B2F36] rounded-full flex items-center justify-center hover:bg-[#1db584] transition-colors">
                  <span className="text-white text-sm">t</span>
                </a>
                <a href="#" className="w-8 h-8 bg-[#2B2F36] rounded-full flex items-center justify-center hover:bg-[#1db584] transition-colors">
                  <span className="text-white text-sm">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-[#2B2F36] rounded-full flex items-center justify-center hover:bg-[#1db584] transition-colors">
                  <span className="text-white text-sm">yt</span>
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Productos</h4>
              <ul className="space-y-3 text-[#8B949E]">
                <li><a href="#" className="hover:text-white transition-colors">Criptomonedas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Acciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ETFs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Materias primas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Índices cripto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Metales preciosos</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Soporte</h4>
              <ul className="space-y-3 text-[#8B949E]">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cómo depositar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cómo retirar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verificar cuenta</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Atención al cliente</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chat en vivo</a></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Aprende</h4>
              <ul className="space-y-3 text-[#8B949E]">
                <li><a href="#" className="hover:text-white transition-colors">Trading responsable</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Academia de trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Análisis de mercado</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Evitar estafas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Empresa</h4>
              <ul className="space-y-3 text-[#8B949E]">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Inversionistas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustentabilidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidad</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-[#2B2F36] mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#8B949E]">
                <a href="/terms" className="hover:text-white transition-colors">Términos y condiciones</a>
                <a href="/privacy" className="hover:text-white transition-colors">Política de privacidad</a>
                <a href="/cookies" className="hover:text-white transition-colors">Política de cookies</a>
                <a href="/legal" className="hover:text-white transition-colors">Aviso legal</a>
                <a href="/security" className="hover:text-white transition-colors">Seguridad</a>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-[#8B949E] flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-[#1db584]" />
                  Regulado por la UE
                </span>
                <span className="text-[#8B949E]">
                  Licencia BaFin
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-[#8B949E]">
              <p>
                © 2025 BITPANDA PRO. Todos los derechos reservados. 
                Las inversiones conllevan riesgos de pérdidas financieras.
              </p>
              <p className="mt-2">
                BITPANDA PRO es una marca registrada. 
                Autorizada y regulada por la Autoridad Federal de Supervisión Financiera Alemana (BaFin).
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}