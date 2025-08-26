import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Redirect } from "wouter";
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
  Coins,
  Rocket,
  Cpu,
  Database,
  Binary,
  Layers,
  Target
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { useAuth } from "@/hooks/useAuth";
import FuturisticBackground from "@/components/FuturisticBackground";

const topCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 45234.56, change: 2.34, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2876.43, change: -1.23, volume: "12.8B" },
  { symbol: "BNB", name: "BNB", price: 298.76, change: 3.45, volume: "2.1B" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change: 1.87, volume: "890M" },
  { symbol: "SOL", name: "Solana", price: 98.32, change: 4.12, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" }
];

const futuristicFeatures = [
  {
    icon: Cpu,
    title: "Quantum Processing Engine",
    description: "Experience lightning-fast trade execution powered by next-gen quantum computing algorithms.",
    color: "from-cyan-400 to-blue-600",
    delay: "0ms"
  },
  {
    icon: Shield,
    title: "Neural Security Matrix",
    description: "Advanced AI-powered security protocols protecting your digital assets with military-grade encryption.",
    color: "from-purple-400 to-pink-600",
    delay: "200ms"
  },
  {
    icon: Database,
    title: "Blockchain Intelligence",
    description: "Real-time market analysis with predictive algorithms and cross-chain compatibility.",
    color: "from-green-400 to-teal-600",
    delay: "400ms"
  },
  {
    icon: Zap,
    title: "Instant Warp Transfers",
    description: "Zero-latency transactions across multiple networks with sub-second confirmations.",
    color: "from-yellow-400 to-orange-600",
    delay: "600ms"
  },
  {
    icon: Target,
    title: "Precision Trading AI",
    description: "Autonomous trading bots with machine learning capabilities for optimal market positioning.",
    color: "from-red-400 to-rose-600",
    delay: "800ms"
  },
  {
    icon: Layers,
    title: "Multi-Dimensional Portfolio",
    description: "Manage assets across multiple dimensions including DeFi, NFTs, and traditional markets.",
    color: "from-indigo-400 to-purple-600",
    delay: "1000ms"
  }
];

const trustMetrics = [
  {
    icon: Globe,
    title: "Global Network",
    value: "4M+",
    description: "Active Users Worldwide",
    glow: "text-cyan-400"
  },
  {
    icon: Lock,
    title: "Security Rating",
    value: "AAA+",
    description: "Military-Grade Protection",
    glow: "text-purple-400"
  },
  {
    icon: Award,
    title: "Platform Score",
    value: "99.9%",
    description: "Uptime Performance",
    glow: "text-green-400"
  },
  {
    icon: Binary,
    title: "Trading Volume",
    value: "$500B+",
    description: "Monthly Volume",
    glow: "text-orange-400"
  }
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [currentCrypto, setCurrentCrypto] = useState(0);
  const [glitchText, setGlitchText] = useState("BITPANDA PRO");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCrypto((prev) => (prev + 1) % topCryptos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Text glitch effect
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+={}[]|\\:;\"'<>,.?/~`";
    const originalText = "BITPANDA PRO";
    
    const glitchInterval = setInterval(() => {
      let glitched = "";
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitched += originalText[i];
        }
      }
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(originalText), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden matrix-bg">
      <FuturisticBackground />
      <Navbar />
      <LiveTicker />
      
      {/* Futuristic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="absolute inset-0 scan-lines"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="space-y-8 floating-element">
              <div className="space-y-6">
                <Badge className="cyber-card px-6 py-2 text-lg font-semibold neon-text border-0" data-testid="badge-platform">
                  <Rocket className="w-5 h-5 mr-2" />
                  NEXT-GEN CRYPTO PLATFORM
                </Badge>
                
                <h1 className="text-6xl lg:text-8xl font-bold leading-tight terminal-text">
                  <span className="neon-text">{glitchText}</span>
                </h1>
                
                <div className="text-2xl lg:text-3xl text-cyan-200 leading-relaxed max-w-4xl mx-auto">
                  <p className="mb-4">
                    Enter the <span className="neon-text">Future</span> of Digital Asset Trading
                  </p>
                  <p className="text-lg text-cyan-400 hologram-effect">
                    Powered by Advanced Quantum Technology
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                  <Link href="/auth">
                    <Button className="quantum-button text-xl px-12 py-4 min-w-[250px]" data-testid="button-start-trading">
                      <Zap className="w-6 h-6 mr-3" />
                      INITIATE PROTOCOL
                    </Button>
                  </Link>
                  
                  <Link href="/admin">
                    <Button className="energy-border bg-transparent text-cyan-400 hover:bg-cyan-400/10 text-xl px-12 py-4 min-w-[250px]" data-testid="button-admin-access">
                      <Shield className="w-6 h-6 mr-3" />
                      ADMIN ACCESS
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Holographic Data Stream */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="hologram-effect w-64 h-2 rounded-full"></div>
        </div>
      </section>

      {/* Futuristic Features Grid */}
      <section className="relative py-20 data-grid">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold neon-text mb-6">
              ADVANCED CAPABILITIES
            </h2>
            <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
              Experience the next evolution of cryptocurrency trading with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {futuristicFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="cyber-card h-full transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: feature.delay }}
                data-testid={`card-feature-${index}`}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center floating-element`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-cyan-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Crypto Data Display */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold neon-text mb-6">
              REAL-TIME MARKET DATA
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="glass-panel text-center transform hover:scale-105 transition-all duration-300" data-testid={`card-crypto-${crypto.symbol.toLowerCase()}`}>
                <CardContent className="p-4">
                  <div className="w-12 h-12 mx-auto mb-2">
                    {getCryptoLogo(crypto.symbol)}
                  </div>
                  <h3 className="font-bold text-cyan-100 mb-1">{crypto.symbol}</h3>
                  <p className="text-sm text-cyan-300 mb-2">${crypto.price.toLocaleString()}</p>
                  <Badge className={`${crypto.change >= 0 ? 'status-online' : 'status-error'} text-xs`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {trustMetrics.map((metric, index) => (
              <div key={index} className="text-center" data-testid={`metric-${index}`}>
                <div className="cyber-card p-6 transform hover:scale-105 transition-all duration-300">
                  <metric.icon className={`w-12 h-12 mx-auto mb-4 ${metric.glow}`} />
                  <h3 className={`text-3xl font-bold mb-2 ${metric.glow}`}>{metric.value}</h3>
                  <p className="text-cyan-200 font-semibold mb-1">{metric.title}</p>
                  <p className="text-cyan-400 text-sm">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="cyber-card p-12">
              <h2 className="text-4xl lg:text-5xl font-bold neon-text mb-6">
                JOIN THE REVOLUTION
              </h2>
              <p className="text-xl text-cyan-200 mb-8 max-w-2xl mx-auto">
                Step into the future of finance. Experience trading like never before with our next-generation platform.
              </p>
              <Link href="/auth">
                <Button className="quantum-button text-2xl px-16 py-6" data-testid="button-join-revolution">
                  <Rocket className="w-8 h-8 mr-4" />
                  LAUNCH SEQUENCE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}