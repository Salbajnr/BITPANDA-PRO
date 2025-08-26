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
  Coins,
  Rocket,
  Cpu,
  Database
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

const features = [
  {
    icon: TrendingUp,
    title: "Trade in minutes from only €1",
    description: "Start trading cryptocurrencies with the minimum investment that fits your budget.",
    color: "text-green-500"
  },
  {
    icon: Shield,
    title: "Your No.1 European broker",
    description: "Regulated by Austrian Financial Market Authority (FMA) and trusted across Europe.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Trade 24/7",
    description: "Access global cryptocurrency markets around the clock with instant execution.",
    color: "text-green-500"
  },
  {
    icon: DollarSign,
    title: "Fee-free on all deposits",
    description: "No hidden fees on deposits. Transparent pricing for all your trading activities.",
    color: "text-green-500"
  },
  {
    icon: BarChart3,
    title: "500+ Assets",
    description: "Trade cryptocurrencies, stocks, ETFs, indices and precious metals all in one place.",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "2M+ Active Users",
    description: "Join millions of investors who trust BITPANDA PRO for their investment needs.",
    color: "text-green-500"
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <style jsx>{`
        :root {
          --primary-green: #00C4B4; /* Bitpanda green */
          --dark-green: #1A3C34; /* Holland Gold dark green */
          --gold-accent: #D4A017; /* Holland Gold gold */
          --white: #FFFFFF;
          --gray: #2D2D2D;
          --light-gray: #F5F5F5;
          --card-bg: rgba(255, 255, 255, 0.95);
          --glass-bg: rgba(255, 255, 255, 0.3);
          --blur: blur(10px);
          --shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .btn-bitpanda {
          background: var(--primary-green);
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          color: var(--white);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-bitpanda:hover {
          background: #00b3a4;
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(0, 196, 180, 0.5);
        }

        .btn-outline-bitpanda {
          background: transparent;
          border: 2px solid var(--primary-green);
          color: var(--primary-green);
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-outline-bitpanda:hover {
          background: var(--primary-green);
          color: var(--white);
          box-shadow: 0 0 12px rgba(0, 196, 180, 0.5);
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .section-gradient {
          background: linear-gradient(135deg, rgba(0, 196, 180, 0.1), rgba(26, 60, 52, 0.1));
          position: relative;
          overflow: hidden;
        }

        .section-gradient::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 196, 180, 0.2), transparent);
          animation: pulse 12s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.15; }
        }

        .icon-glow {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .icon-glow:hover {
          transform: scale(1.15);
          filter: drop-shadow(0 0 6px rgba(0, 196, 180, 0.5));
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--primary-green), var(--dark-green));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .gold-accent {
          color: var(--gold-accent);
        }

        .gradient-bg {
          background: var(--white);
          transition: background 0.3s ease;
        }

        .enhanced-card {
          background: var(--card-bg);
          border: 1px solid rgba(0, 196, 180, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .enhanced-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .btn-enhanced {
          background: var(--primary-green);
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          color: var(--white);
          transition: all 0.3s ease;
        }

        .btn-enhanced:hover {
          background: #00b3a4;
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(0, 196, 180, 0.5);
        }

        @media (max-width: 768px) {
          .glass-card, .enhanced-card {
            border-radius: 10px;
          }

          .btn-bitpanda, .btn-outline-bitpanda, .btn-enhanced {
            padding: 10px 24px;
            font-size: 14px;
          }

          h1 {
            font-size: 2.5rem;
          }

          h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      <Navbar />
      <LiveTicker />
      <FuturisticBackground />

      {/* Hero Section */}
      <section className="relative section-gradient pt-24 pb-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-dark-green rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full text-sm font-medium mb-8 animate-slide-in">
              <Shield className="w-4 h-4 text-green-500" />
              <span>🇦🇹 Austria based and European regulated</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              BITPANDA PRO
              <span className="text-gradient block mt-2">Start Investing Today</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Trade in minutes from only €1. Your No.1 European broker for stocks, crypto, indices, ETFs, and precious metals. Trade 24/7. Fee-free on all deposits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <Link href="/auth">
                <Button size="lg" className="btn-bitpanda text-lg h-14">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" className="btn-outline-bitpanda text-lg h-14">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="glass-card p-4 flex items-center space-x-3 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="icon-glow w-12 h-12 flex items-center justify-center bg-green-500/20 rounded-full">
                    <span className="text-2xl">{indicator.badge}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{indicator.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{indicator.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-light-gray dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">How to Get Started</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Create your account and start trading in just a few minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200 dark:bg-green-500/30"></div>
                )}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-500 rounded-full text-white icon-glow">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth">
              <Button size="lg" className="btn-bitpanda text-lg h-14">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Live Prices</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Real-time market data for top cryptocurrencies</p>
          </div>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <img 
                        src={getCryptoLogo(crypto.symbol)} 
                        alt={crypto.name}
                        className="w-8 h-8 object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">{crypto.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 uppercase">{crypto.symbol}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white text-xl">
                      €{crypto.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end font-medium ${
                      crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">24h Volume</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{crypto.volume}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Trading Section */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Advanced Crypto Trading</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Trade over 200 cryptocurrencies with professional tools and real-time analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Spot Trading",
                description: "Buy and sell cryptocurrencies instantly at current market prices",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                ),
                features: ["200+ Trading Pairs", "Advanced Charts", "Order Book", "Price Alerts"]
              },
              {
                title: "Margin Trading",
                description: "Amplify your trading potential with up to 10x leverage",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                ),
                features: ["Up to 10x Leverage", "Risk Management", "Stop Loss Orders", "Liquidation Protection"]
              },
              {
                title: "DCA Strategy", 
                description: "Automate your investments with dollar-cost averaging",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M12 4V1L8 5h3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9h2c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"/>
                    <path d="M9 13v6l4-4H10z"/>
                  </svg>
                ),
                features: ["Automated Investing", "Custom Schedules", "Portfolio Balancing", "Tax Optimization"]
              },
              {
                title: "Staking Rewards",
                description: "Earn passive income by staking your cryptocurrencies",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ),
                features: ["Up to 12% APY", "Flexible Terms", "Auto-Compound", "25+ Stakeable Coins"]
              }
            ].map((feature, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-500/20 rounded-xl icon-glow">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Precious Metals Section */}
      <section className="py-20 bg-light-gray dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Precious Metals Trading</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Diversify your portfolio with physical gold, silver, platinum, and palladium
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card className="enhanced-card group animate-slide-in">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Physical Metals Portfolio</h3>
                <div className="space-y-6">
                  {[
                    { 
                      metal: "Gold (XAU)", 
                      price: "€1,945.50", 
                      change: "+0.8%", 
                      symbol: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 gold-accent">
                          <circle cx="12" cy="8" r="6" fill="#FFD700"/>
                          <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="#B8860B"/>
                        </svg>
                      )
                    },
                    { 
                      metal: "Silver (XAG)", 
                      price: "€22.85", 
                      change: "+1.2%", 
                      symbol: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
                          <circle cx="12" cy="8" r="6" fill="#C0C0C0"/>
                          <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="#A8A8A8"/>
                        </svg>
                      )
                    },
                    { 
                      metal: "Platinum (XPT)", 
                      price: "€915.30", 
                      change: "-0.3%", 
                      symbol: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-300">
                          <circle cx="12" cy="8" r="6" fill="#E5E4E2"/>
                          <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="#D3D3D3"/>
                        </svg>
                      )
                    },
                    { 
                      metal: "Palladium (XPD)", 
                      price: "€1,235.80", 
                      change: "+2.1%", 
                      symbol: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-400">
                          <circle cx="12" cy="8" r="6" fill="#CED0CE"/>
                          <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="#B8B8B8"/>
                        </svg>
                      )
                    }
                  ].map((metal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 glass-card">
                      <div className="flex items-center space-x-3">
                        <div className="icon-glow w-12 h-12 flex items-center justify-center">
                          {metal.symbol}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{metal.metal}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Per troy ounce</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{metal.price}</div>
                        <div className={`text-sm font-medium ${metal.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {metal.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card group animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Metals Saving Plans</h3>
                <div className="space-y-4">
                  <div className="p-4 glass-card">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Gold Savings Plan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Automatically invest in gold from €25/month</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-300">Storage fee: 0.5% p.a.</span>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Popular</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "✓ Physical gold stored in Swiss vaults",
                      "✓ Fully allocated and segregated storage", 
                      "✓ Insurance coverage up to €100M",
                      "✓ Option to take physical delivery",
                      "✓ No minimum investment period"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Why Choose BITPANDA PRO</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Europe's leading investment platform for digital and traditional assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-500/20 rounded-xl icon-glow">
                    <feature.icon className="w-8 h-8 text-green-500" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-light-gray dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Regulated & Secure</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Your security and trust are our priorities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "EU Regulated",
                description: "Licensed by the Austrian Financial Market Authority (FMA)",
                badge: "🇦🇹 Austria"
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "95% of assets in cold storage with multi-signature security",
                badge: "256-bit SSL"
              },
              {
                icon: Award,
                title: "Award Winning",
                description: "Recognized as Europe's most trusted platform",
                badge: "🏆 2024"
              }
            ].map((feature, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-500/20 rounded-xl icon-glow">
                    <feature.icon className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{feature.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join over 2 million users on BITPANDA PRO. Start trading from €1 with no deposit fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth">
              <Button size="lg" className="btn-bitpanda text-lg h-14">
                Get Started Now
              </Button>
            </Link>
            <Button size="lg" className="btn-outline-bitpanda text-lg h-14">
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Free to Join</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Start from €1</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> 0% Deposit Fees</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> EU Regulated</span>
          </div>
        </div>
      </section>

      {/* Asset Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">500+ Assets to Choose From</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Diversify with cryptocurrencies, stocks, ETFs, and precious metals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "₿",
                title: "Cryptocurrencies",
                description: "Bitcoin, Ethereum, and 100+ digital assets",
                count: "100+ assets",
                color: "from-green-500 to-dark-green"
              },
              {
                icon: "📈",
                title: "Stocks",
                description: "Leading global companies and growth stocks",
                count: "200+ stocks",
                color: "from-green-500 to-dark-green"
              },
              {
                icon: "📊",
                title: "ETFs",
                description: "Diversified funds and sector ETFs",
                count: "150+ ETFs",
                color: "from-green-500 to-dark-green"
              },
              {
                icon: "🥇",
                title: "Precious Metals",
                description: "Gold, Silver, Platinum and Palladium",
                count: "4 metals",
                color: "from-gold-accent to-dark-green"
              }
            ].map((category, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r ${category.color} rounded-xl text-white text-2xl font-bold icon-glow`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{category.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-light-gray dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Security You Can Trust</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              BITPANDA PRO prioritizes your security with industry-leading measures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "EU Regulated",
                description: "Licensed by the Austrian Financial Market Authority (FMA).",
                badge: "🇦🇹 Austria"
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "Advanced encryption and cold storage for your assets.",
                badge: "256-bit SSL"
              },
              {
                icon: Award,
                title: "Deposit Protection",
                description: "Up to €100,000 protected by the Austrian Deposit Guarantee Scheme.",
                badge: "€100k Protected"
              },
              {
                icon: Eye,
                title: "Transparent Fees",
                description: "Clear pricing with no hidden costs.",
                badge: "0% Deposit Fees"
              },
              {
                icon: Users,
                title: "Trusted by Millions",
                description: "Over 2 million active users worldwide.",
                badge: "2M+ Users"
              },
              {
                icon: Timer,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your needs.",
                badge: "Always Available"
              }
            ].map((feature, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-500/20 rounded-xl icon-glow">
                    <feature.icon className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{feature.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insights & Analytics Section */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Advanced Market Analytics</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Make informed decisions with professional-grade tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Real-Time Data",
                description: "Live market data with millisecond latency",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                ),
                stats: "99.9% Uptime",
                color: "from-green-500 to-dark-green"
              },
              {
                title: "AI-Powered Insights",
                description: "Predict market trends with machine learning",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S13.24 11.25 12 11.25 9.75 10.24 9.75 9S10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.33 2.67-2 4-2h2c1.33 0 4 .67 4 2V17z"/>
                    <circle cx="12" cy="9" r="2"/>
                    <path d="M6 15h2v2H6zm10 0h2v2h-2z"/>
                  </svg>
                ),
                stats: "85% Accuracy",
                color: "from-green-500 to-dark-green"
              },
              {
                title: "Portfolio Analytics",
                description: "Track and optimize your investments",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                ),
                stats: "20+ Metrics",
                color: "from-green-500 to-dark-green"
              }
            ].map((feature, index) => (
              <Card key={index} className="enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r ${feature.color} icon-glow text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{feature.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Learn & Grow Your Wealth</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Access premium educational content and market research
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="enhanced-card group animate-slide-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="icon-glow w-12 h-12 flex items-center justify-center mr-4 bg-green-500/20 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S12.24 10.25 11 10.25 8.75 9.24 8.75 8S9.76 5.75 11 5.75zm-4.5 8.5c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V15H6.5v-2.75z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">BITPANDA PRO Academy</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Crypto Fundamentals", progress: 85, level: "Beginner" },
                    { title: "Technical Analysis", progress: 60, level: "Intermediate" },
                    { title: "DeFi & Yield Farming", progress: 40, level: "Advanced" },
                    { title: "Risk Management", progress: 90, level: "Essential" }
                  ].map((course, idx) => (
                    <div key={idx} className="p-4 glass-card hover:scale-105 transition-transform duration-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{course.level}</Badge>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{course.progress}% Complete</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card group animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="icon-glow w-12 h-12 flex items-center justify-center mr-4 bg-green-500/20 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 16H5V6h2v2h2V6h6v2h2V6h2v12z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Market Research</h3>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Bitcoin Halving Impact Analysis",
                      date: "Today",
                      category: "Cryptocurrency",
                      readTime: "8 min read"
                    },
                    {
                      title: "Gold vs Bitcoin: Digital vs Traditional Store of Value",
                      date: "Yesterday",
                      category: "Precious Metals",
                      readTime: "12 min read"
                    },
                    {
                      title: "European Crypto Regulations Update 2024",
                      date: "2 days ago",
                      category: "Regulatory",
                      readTime: "6 min read"
                    },
                    {
                      title: "Q4 Market Outlook: Crypto & Precious Metals",
                      date: "1 week ago",
                      category: "Analysis",
                      readTime: "15 min read"
                    }
                  ].map((article, idx) => (
                    <div key={idx} className="p-4 glass-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{article.title}</h4>
                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/50">{article.category}</Badge>
                          <span>{article.date}</span>
                        </div>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">Award-Winning Platform</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Recognized by industry leaders across Europe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { award: "Best Crypto Platform", year: "2024", org: "FinTech Awards" },
              { award: "Most Trusted Broker", year: "2024", org: "Investment Weekly" },
              { award: "Best User Experience", year: "2023", org: "Digital Finance" },
              { award: "Top Security Rating", year: "2023", org: "CryptoCompare" }
            ].map((award, index) => (
              <div key={index} className="text-center p-6 enhanced-card group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Award className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{award.award}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{award.org} {award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Start Your Investment Journey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join 2M+ investors on BITPANDA PRO. Trade from €1 with no deposit fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth">
              <Button size="lg" className="btn-bitpanda text-lg h-14">
                Get Started Now
              </Button>
            </Link>
            <Button size="lg" className="btn-outline-bitpanda text-lg h-14">
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Free to Join</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Start from €1</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> 0% Deposit Fees</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> EU Regulated</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <Link href="/">
                <div className="flex items-center space-x-2 mb-6">
                  <img 
                    src="/src/assets/bitpanda-logo.svg" 
                    alt="BITPANDA PRO" 
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                  <span className="text-xl font-bold text-gradient">BITPANDA PRO</span>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Europe's leading platform for trading cryptocurrencies, stocks, ETFs, and metals. Licensed and regulated in Austria.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center glass-card px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  🇦🇹 Austria based
                </span>
                <span className="flex items-center glass-card px-3 py-1 rounded-full">
                  <Award className="w-4 h-4 mr-2 text-green-500" />
                  EU regulated
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-500">Invest</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/markets" className="hover:text-green-500 transition-colors">Cryptocurrencies</Link></li>
                <li><Link href="/stocks" className="hover:text-green-500 transition-colors">Stocks</Link></li>
                <li><Link href="/etfs" className="hover:text-green-500 transition-colors">ETFs</Link></li>
                <li><Link href="/precious-metals" className="hover:text-green-500 transition-colors">Precious Metals</Link></li>
                <li><Link href="/crypto-indices" className="hover:text-green-500 transition-colors">Crypto Indices</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-500">Learn</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/academy" className="hover:text-green-500 transition-colors">BITPANDA PRO Academy</Link></li>
                <li><Link href="/news" className="hover:text-green-500 transition-colors">News</Link></li>
                <li><Link href="/tutorials" className="hover:text-green-500 transition-colors">Getting Started</Link></li>
                <li><Link href="/help" className="hover:text-green-500 transition-colors">Help Centre</Link></li>
                <li><Link href="/api" className="hover:text-green-500 transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-500">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/about" className="hover:text-green-500 transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-green-500 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-green-500 transition-colors">Press</Link></li>
                <li><Link href="/security" className="hover:text-green-500 transition-colors">Security</Link></li>
                <li><Link href="/contact" className="hover:text-green-500 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div>
                <p className="text-gray-300 text-sm mb-2">
                  © 2025 BITPANDA PRO Technology GmbH. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs max-w-3xl">
                  Licensed by the Austrian Financial Market Authority (FMA). Deposits protected up to €100,000.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4 text-xs text-gray-300">
                  <Link href="/terms" className="hover:text-green-500 transition-colors">Terms of use</Link>
                  <Link href="/privacy" className="hover:text-green-500 transition-colors">Privacy policy</Link>
                  <Link href="/imprint" className="hover:text-green-500 transition-colors">Imprint</Link>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400">Follow us:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="w-8 h-8 glass-card rounded-full flex items-center justify-center hover:bg-green-500/50 transition-colors">
                      <span className="text-xs text-white">X</span>
                    </a>
                    <a href="#" className="w-8 h-8 glass-card rounded-full flex items-center justify-center hover:bg-green-500/50 transition-colors">
                      <span className="text-xs text-white">YT</span>
                    </a>
                    <a href="#" className="w-8 h-8 glass-card rounded-full flex items-center justify-center hover:bg-green-500/50 transition-colors">
                      <span className="text-xs text-white">IG</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}