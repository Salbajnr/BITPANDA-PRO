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
  { symbol: "BTC", name: "Bitcoin", price: 62430.25, change: 0.84, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 3124.87, change: -0.12, volume: "12.8B" },
  { symbol: "SOL", name: "Solana", price: 146.20, change: 1.05, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" }
];

const topMetals = [
  { symbol: "XAU", name: "Gold", price: 2386.10, change: 0.21, volume: "18.5B" },
  { symbol: "XAG", name: "Silver", price: 28.41, change: -0.44, volume: "4.2B" },
  { symbol: "XPT", name: "Platinum", price: 1007.50, change: 0.10, volume: "1.1B" },
  { symbol: "XPD", name: "Palladium", price: 1056.22, change: -0.32, volume: "0.8B" }
];

const features = [
  {
    icon: Wallet,
    title: "Unified Wallets",
    description: "Manage crypto and precious metals side-by-side. Clear balances, portfolio value, and allocation."
  },
  {
    icon: Activity,
    title: "Live Market Insights",
    description: "Streaming prices for BTC, ETH, XAU, XAG and more. Fast updates optimized for low latency."
  },
  {
    icon: Shield,
    title: "Secure Deposits",
    description: "Pick a method (Binance, Bybit, Crypto.com, etc.), send funds, upload proof—our team confirms."
  },
  {
    icon: PieChart,
    title: "Savings Plans",
    description: "Automate recurring DCA in crypto or metals. Flexible intervals with pause/resume controls."
  },
  {
    icon: Globe,
    title: "Knowledge Hub",
    description: "Curated crypto & metals news plus guides for smarter, long-term investing."
  },
  {
    icon: Cpu,
    title: "Admin-Grade Oversight",
    description: "Dedicated admin route for balance controls, deposit approvals, audit logs, and risk checks."
  }
];

const steps = [
  {
    number: "1",
    title: "Sign up",
    description: "Create your account and log in."
  },
  {
    number: "2",
    title: "Choose asset",
    description: "Crypto or precious metals."
  },
  {
    number: "3",
    title: "Deposit",
    description: "Pick a method, send funds, upload proof."
  },
  {
    number: "4",
    title: "Confirm",
    description: "Admin verifies and updates your balance."
  },
  {
    number: "5",
    title: "Trade & save",
    description: "Invest, DCA, and track performance."
  }
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Separation of Duties",
    description: "Dedicated admin route for approvals and adjustments; user route for trading and deposits."
  },
  {
    icon: Database,
    title: "Encrypted Data",
    description: "Transport-layer encryption, hashed credentials, and strict role checks."
  },
  {
    icon: Eye,
    title: "Audit Trails",
    description: "Every critical action is logged for accountability and compliance readiness."
  }
];

// Helper functions
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatChange = (change: number) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0e1116] text-[#eaecee]">
      <style jsx>{`
        :root {
          --bg: #0e1116; /* Dark background from provided code */
          --card: #151a22; /* Card background */
          --text: #eaecee; /* Primary text */
          --muted: #a7b0bc; /* Muted text */
          --primary-green: #00C4B4; /* Bitpanda green */
          --dark-green: #1A3C34; /* Holland Gold dark green */
          --gold-accent: #D4A017; /* Holland Gold gold, aligned with provided #d4af37 */
          --white: #FFFFFF;
          --light-gray: #F5F5F5;
          --border: #1f2631;
          --shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .btn {
          display: inline-block;
          padding: 12px 24px;
          border: 2px solid var(--primary-green);
          background: var(--primary-green);
          color: var(--white);
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #00b3a4;
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(0, 196, 180, 0.5);
        }

        .btn--ghost {
          background: transparent;
          border: 2px solid var(--gold-accent);
          color: var(--gold-accent);
        }

        .btn--ghost:hover {
          background: var(--gold-accent);
          color: var(--bg);
          box-shadow: 0 0 12px rgba(212, 160, 23, 0.5);
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          border: 2px solid var(--gold-accent);
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: var(--gold-accent);
          font-size: 16px;
          font-weight: bold;
        }

        .glow {
          position: absolute;
          inset: -30%;
          background: radial-gradient(60% 60% at 30% 20%, rgba(0, 196, 180, 0.15), transparent 60%);
          animation: pulse 12s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.15; }
        }

        .sep {
          height: 1px;
          background: var(--border);
          margin: 12px 0 24px;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .icon-glow {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .icon-glow:hover {
          transform: scale(1.15);
          filter: drop-shadow(0 0 6px rgba(0, 196, 180, 0.5));
        }

        .gold-accent {
          color: var(--gold-accent);
        }

        .gradient-bg {
          background: linear-gradient(135deg, rgba(0, 196, 180, 0.1), rgba(26, 60, 52, 0.1));
        }

        @media (max-width: 768px) {
          .glass-card {
            border-radius: 10px;
          }

          .btn, .btn--ghost {
            padding: 10px 20px;
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

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0e1116] bg-opacity-85 backdrop-filter backdrop-saturate-150 backdrop-blur-md border-b border-[#1f2631]">
        <div className="container flex items-center justify-between py-4 px-5 max-w-[1120px] mx-auto">
          <div className="flex items-center gap-3 font-bold tracking-wider text-[#eaecee]">
            <span className="logo-icon">B</span>
            <span>BITPANDA PRO</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-[var(--primary-green)] transition-colors">Features</a>
            <a href="#markets" className="hover:text-[var(--primary-green)] transition-colors">Markets</a>
            <a href="#metals" className="hover:text-[var(--primary-green)] transition-colors">Metals</a>
            <a href="#how" className="hover:text-[var(--primary-green)] transition-colors">How it Works</a>
            <a href="#trust" className="hover:text-[var(--primary-green)] transition-colors">Security</a>
            <Link href="/auth/user/register" className="btn">Create Account</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 border-b border-[#1f2631] gradient-bg">
          <div className="glow"></div>
          <div className="container max-w-[1120px] mx-auto px-5">
            <div className="text-center animate-fade-in">
              <Badge className="mb-6 bg-[var(--primary-green)]/20 text-[var(--primary-green)] border-[var(--primary-green)]/50">
                🇦🇹 Austria based & EU regulated
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Trade Crypto & Precious Metals Seamlessly
                <span className="block mt-2 text-[var(--primary-green)]">Start from €1</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-3xl mx-auto">
                <strong>BITPANDA PRO</strong> unifies cryptocurrency and physical metals investing. Real-time prices, secure deposits, and intelligent savings plans in one sleek platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in">
                <Link href="/auth/user/register">
                  <Button className="btn text-lg">Get Started</Button>
                </Link>
                <Link href="#markets">
                  <Button className="btn btn--ghost text-lg">Explore Markets</Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-[var(--primary-green)]/20 text-[var(--primary-green)] border-[var(--primary-green)]/50">
                  Dual Assets: Crypto + Metals
                </Badge>
                <Badge className="bg-[var(--primary-green)]/20 text-[var(--primary-green)] border-[var(--primary-green)]/50">
                  Real-Time Data
                </Badge>
                <Badge className="bg-[var(--primary-green)]/20 text-[var(--primary-green)] border-[var(--primary-green)]/50">
                  Secure Deposits
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-[var(--light-gray)] text-[#0e1116]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="icon-glow w-10 h-10 flex items-center justify-center bg-[var(--primary-green)]/20 rounded-full mr-3">
                        <feature.icon className="w-6 h-6 text-[var(--primary-green)]" />
                      </div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-[var(--muted)]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section id="markets" className="py-16 border-b border-[#1f2631]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Markets at a Glance</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass-card animate-slide-in">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Top Cryptocurrencies</h3>
                  <p className="text-[var(--muted)] mb-4">Real-time prices for leading digital assets.</p>
                  <div className="space-y-3 font-mono text-sm">
                    {topCryptos.map((crypto, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={getCryptoLogo(crypto.symbol)} alt={crypto.name} className="w-6 h-6 rounded-full" />
                          <span>{crypto.symbol} ({crypto.name})</span>
                        </div>
                        <div className="text-right">
                          <div>€{formatPrice(crypto.price)}</div>
                          <div className={crypto.change >= 0 ? 'text-[var(--primary-green)]' : 'text-red-500'}>
                            {formatChange(crypto.change)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Top Precious Metals</h3>
                  <p className="text-[var(--muted)] mb-4">Gold, Silver, Platinum, and Palladium prices.</p>
                  <div className="space-y-3 font-mono text-sm">
                    {topMetals.map((metal, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--gold-accent)] flex items-center justify-center">
                            <span className="text-[var(--bg)] text-xs font-bold">{metal.symbol}</span>
                          </div>
                          <span>{metal.symbol} ({metal.name})</span>
                        </div>
                        <div className="text-right">
                          <div>€{formatPrice(metal.price)}</div>
                          <div className={metal.change >= 0 ? 'text-[var(--primary-green)]' : 'text-red-500'}>
                            {formatChange(metal.change)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <h3 className="text-lg font-bold mb-2">Portfolio Summary</h3>
                  <p className="text-[var(--muted)]">Track your total value across crypto and metals with daily P/L after signing in.</p>
                  <Link href="/auth/user/login" className="btn btn--ghost mt-4">View Dashboard</Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Precious Metals Section */}
        <section id="metals" className="py-16 bg-[var(--light-gray)] text-[#0e1116]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Invest in Precious Metals</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card animate-slide-in">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Physical Metals Portfolio</h3>
                  <div className="space-y-4">
                    {topMetals.map((metal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 glass-card">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--gold-accent)] flex items-center justify-center icon-glow">
                            <span className="text-[var(--bg)] text-sm font-bold">{metal.symbol}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{metal.name}</div>
                            <div className="text-sm text-[var(--muted)]">Per troy ounce</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">€{formatPrice(metal.price)}</div>
                          <div className={metal.change >= 0 ? 'text-[var(--primary-green)]' : 'text-red-500'}>
                            {formatChange(metal.change)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Metals Savings Plans</h3>
                  <div className="space-y-4">
                    <div className="p-4 glass-card">
                      <h4 className="font-bold mb-2">Gold Savings Plan</h4>
                      <p className="text-[var(--muted)] mb-3">Invest in gold from €25/month with secure storage.</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[var(--muted)]">Storage fee: 0.5% p.a.</span>
                        <Badge className="bg-[var(--primary-green)]/20 text-[var(--primary-green)] border-[var(--primary-green)]/50">Popular</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Physical gold stored in Swiss vaults",
                        "Fully allocated and segregated storage",
                        "Insurance coverage up to €100M",
                        "Option to take physical delivery"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-[var(--muted)]">
                          <CheckCircle className="w-4 h-4 mr-2 text-[var(--primary-green)]" />
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

        {/* How it Works Section */}
        <section id="how" className="py-16 border-b border-[#1f2631]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <Card key={index} className="glass-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4 text-center">
                    <span className="inline-block w-8 h-8 border border-[var(--gold-accent)] rounded-full text-center leading-7 font-bold mb-3 gold-accent">{step.number}</span>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-[var(--muted)] text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Trust Section */}
        <section id="trust" className="py-16 bg-[var(--light-gray)] text-[#0e1116]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security & Trust</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="glass-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="icon-glow w-10 h-10 flex items-center justify-center bg-[var(--primary-green)]/20 rounded-full mr-3">
                        <feature.icon className="w-6 h-6 text-[var(--primary-green)]" />
                      </div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-[var(--muted)]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8 animate-slide-in">
              <Link href="/security">
                <Button className="btn btn--ghost">Learn More About Security</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Advanced Trading Section */}
        <section id="trading" className="py-16 border-b border-[#1f2631]">
          <div className="container max-w-[1120px] mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Trading Tools</h2>
            <div className="sep"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Spot Trading",
                  description: "Buy and sell cryptocurrencies instantly at current market prices",
                  icon: <TrendingUp className="w-6 h-6 text-[var(--primary-green)]" />,
                  features: ["200+ Trading Pairs", "Advanced Charts", "Order Book", "Price Alerts"]
                },
                {
                  title: "Margin Trading",
                  description: "Amplify your trading potential with up to 10x leverage",
                  icon: <BarChart3 className="w-6 h-6 text-[var(--primary-green)]" />,
                  features: ["Up to 10x Leverage", "Risk Management", "Stop Loss Orders", "Liquidation Protection"]
                },
                {
                  title: "DCA Strategy",
                  description: "Automate your investments with dollar-cost averaging",
                  icon: <PieChart className="w-6 h-6 text-[var(--primary-green)]" />,
                  features: ["Automated Investing", "Custom Schedules", "Portfolio Balancing", "Tax Optimization"]
                },
                {
                  title: "Staking Rewards",
                  description: "Earn passive income by staking your cryptocurrencies",
                  icon: <Star className="w-6 h-6 text-[var(--primary-green)]" />,
                  features: ["Up to 12% APY", "Flexible Terms", "Auto-Compound", "25+ Stakeable Coins"]
                }
              ].map((feature, index) => (
                <Card key={index} className="glass-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-[var(--primary-green)]/20 rounded-full icon-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-[var(--muted)] text-sm mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-[var(--muted)]">
                          <div className="w-2 h-2 bg-[var(--primary-green)] rounded-full mr-2"></div>
                          {feat}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="start" className="py-16 bg-[var(--primary-green)] text-[var(--white)]">
          <div className="container max-w-[1120px] mx-auto px-5 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Ready to Start Investing?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Join over 2 million users on BITPANDA PRO. Trade from €1 with no deposit fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in">
              <Link href="/auth/user/register">
                <Button className="btn bg-[var(--white)] text-[var(--bg)] hover:bg-[#f0f0f0] hover:text-[var(--bg)]">Create Account</Button>
              </Link>
              <Link href="/auth/user/login">
                <Button className="btn btn--ghost">Sign In</Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2" /> Free to Join</span>
              <span className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2" /> Start from €1</span>
              <span className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2" /> 0% Deposit Fees</span>
              <span className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2" /> EU Regulated</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 bg-[var(--dark-green)] text-[var(--white)]">
        <div className="container max-w-[1120px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="logo-icon">B</span>
                <span className="text-lg font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-[var(--muted)] text-sm mb-4">
                Europe's leading platform for trading cryptocurrencies and precious metals. Licensed and regulated in Austria.
              </p>
              <div className="flex gap-3">
                <span className="glass-card px-3 py-1 text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-[var(--primary-green)]" />
                  EU Regulated
                </span>
                <span className="glass-card px-3 py-1 text-sm flex items-center">
                  <Award className="w-4 h-4 mr-2 text-[var(--primary-green)]" />
                  Trusted by 2M+
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--primary-green)]">Invest</h4>
              <ul className="space-y-2 text-[var(--muted)] text-sm">
                <li><Link href="/markets" className="hover:text-[var(--primary-green)] transition-colors">Cryptocurrencies</Link></li>
                <li><Link href="/metals" className="hover:text-[var(--primary-green)] transition-colors">Precious Metals</Link></li>
                <li><Link href="/savings" className="hover:text-[var(--primary-green)] transition-colors">Savings Plans</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--primary-green)]">Learn</h4>
              <ul className="space-y-2 text-[var(--muted)] text-sm">
                <li><Link href="/academy" className="hover:text-[var(--primary-green)] transition-colors">Academy</Link></li>
                <li><Link href="/news" className="hover:text-[var(--primary-green)] transition-colors">News</Link></li>
                <li><Link href="/help" className="hover:text-[var(--primary-green)] transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--primary-green)]">Company</h4>
              <ul className="space-y-2 text-[var(--muted)] text-sm">
                <li><Link href="/about" className="hover:text-[var(--primary-green)] transition-colors">About</Link></li>
                <li><Link href="/security" className="hover:text-[var(--primary-green)] transition-colors">Security</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--primary-green)] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1f2631] mt-8 pt-6 text-sm text-[var(--muted)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p>© 2025 BITPANDA PRO Technology GmbH. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/terms" className="hover:text-[var(--primary-green)] transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-[var(--primary-green)] transition-colors">Privacy</Link>
                <Link href="/imprint" className="hover:text-[var(--primary-green)] transition-colors">Imprint</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}