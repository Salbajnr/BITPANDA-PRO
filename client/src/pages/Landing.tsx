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
  Coins // Added Coins icon for the footer logo
} from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { useAuth } from "@/hooks/useAuth";

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
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "Your No.1 European broker",
    description: "Regulated by Austrian Financial Market Authority (FMA) and trusted across Europe.",
    color: "text-green-600"
  },
  {
    icon: Zap,
    title: "Trade 24/7",
    description: "Access global cryptocurrency markets around the clock with instant execution.",
    color: "text-green-600"
  },
  {
    icon: DollarSign,
    title: "Fee-free on all deposits",
    description: "No hidden fees on deposits. Transparent pricing for all your trading activities.",
    color: "text-green-600"
  },
  {
    icon: BarChart3,
    title: "500+ Assets",
    description: "Trade cryptocurrencies, stocks, ETFs, indices and precious metals all in one place.",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "2M+ Active Users",
    description: "Join millions of investors who trust BITPANDA PRO for their investment needs.",
    color: "text-green-600"
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
    <div className="min-h-screen bg-background transition-colors">
      <Navbar />
      <LiveTicker />

      {/* Hero Section - Following Bitpanda's exact style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-green-950/20 dark:via-background dark:to-green-950/20 pt-24 pb-20 transition-colors">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>🇦🇹 Austria based and European regulated</span>
            </div>

            {/* Main Heading - Bitpanda Style */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              BITPANDA PRO -
              <span className="text-green-600 dark:text-green-400 block mt-2">Start investing today</span>
            </h1>

            {/* Subtitle - Exact Bitpanda copy */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
              Trade in minutes from only €1. Your No.1 European broker for stocks, crypto, indices, ETFs and precious metals. Trade 24/7. Fee-free on all deposits.
            </p>

            {/* CTA Buttons - Bitpanda Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="/api/login">
                <Button size="lg" className="btn-3d bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 rounded-lg text-lg h-14 transition-all duration-200">
                  Get started
                </Button>
              </a>

              <Button 
                variant="outline" 
                size="lg" 
                className="btn-3d border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-12 py-4 rounded-lg text-lg h-14 font-semibold transition-all duration-200"
              >
                Learn more
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 solid-card p-4 transition-all duration-200 hover:scale-105 gradient-3d">
                  <div className="icon-3d w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                    <span className="text-2xl">{indicator.badge}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-card-foreground text-sm">{indicator.title}</div>
                    <div className="text-xs text-muted-foreground">{indicator.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section - Bitpanda Exact Pattern */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How to get started</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create your account and start trading in just a few minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Sign up",
                description: "Create your free BITPANDA PRO account in under 2 minutes. No paperwork, no waiting.",
                icon: "👤"
              },
              {
                step: "2", 
                title: "Verify your identity",
                description: "Complete our fast identity verification process to secure your account and unlock all features.",
                icon: "✅"
              },
              {
                step: "3",
                title: "Start investing",
                description: "Deposit funds and start trading cryptocurrencies, stocks, ETFs and precious metals.",
                icon: "🚀"
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200 z-0"></div>
                )}

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-500 rounded-full text-white relative">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded-lg text-lg">
                Get started now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-20 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Live prices</h2>
            <p className="text-xl text-muted-foreground">Real-time market data for top cryptocurrencies</p>
          </div>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {topCryptos.map((crypto, index) => (
              <Card key={crypto.symbol} className="solid-card hover:border-green-300 transition-all duration-200 group">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <img 
                        src={getCryptoLogo(crypto.symbol)} 
                        alt={crypto.name}
                        className="w-8 h-8 object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-card-foreground text-lg">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground uppercase">{crypto.symbol}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-card-foreground text-xl">
                      €{crypto.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center justify-end font-medium ${
                      crypto.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                    }`}>
                      {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
                    <div className="font-semibold text-card-foreground">{crypto.volume}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Trading Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Advanced Crypto Trading</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trade over 200 cryptocurrencies with professional tools, real-time analytics, and institutional-grade security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Spot Trading",
                description: "Buy and sell cryptocurrencies instantly at current market prices with zero fees on maker orders",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                ),
                features: ["200+ Trading Pairs", "Advanced Charts", "Order Book", "Price Alerts"]
              },
              {
                title: "Margin Trading",
                description: "Amplify your trading potential with up to 10x leverage on major cryptocurrencies",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                ),
                features: ["Up to 10x Leverage", "Risk Management", "Stop Loss Orders", "Liquidation Protection"]
              },
              {
                title: "DCA Strategy", 
                description: "Automate your investments with dollar-cost averaging across multiple cryptocurrencies",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 4V1L8 5h3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9h2c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"/>
                    <path d="M9 13v6l4-4H10z"/>
                  </svg>
                ),
                features: ["Automated Investing", "Custom Schedules", "Portfolio Balancing", "Tax Optimization"]
              },
              {
                title: "Staking Rewards",
                description: "Earn passive income by staking your cryptocurrencies with competitive APY rates",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ),
                features: ["Up to 12% APY", "Flexible Terms", "Auto-Compound", "25+ Stakeable Coins"]
              }
            ].map((feature, index) => (
              <Card key={index} className="solid-card hover:border-blue-300 transition-all duration-300 group gradient-3d">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 icon-3d text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
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
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Precious Metals Trading & Saving</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Diversify your portfolio with physical precious metals. Buy, save, and trade gold, silver, platinum, and palladium with secure storage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="solid-card p-8 group hover:border-yellow-300 transition-all duration-300 gradient-3d">
              <h3 className="text-2xl font-bold text-card-foreground mb-6">Physical Metals Portfolio</h3>
              <div className="space-y-6">
                {[
                  { 
                    metal: "Gold (XAU)", 
                    price: "€1,945.50", 
                    change: "+0.8%", 
                    symbol: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-600">
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
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg solid-card">
                    <div className="flex items-center space-x-3">
                      <div className="icon-3d w-12 h-12 flex items-center justify-center">
                        {metal.symbol}
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">{metal.metal}</div>
                        <div className="text-sm text-muted-foreground">Per troy ounce</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-card-foreground">{metal.price}</div>
                      <div className={`text-sm font-medium ${metal.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                        {metal.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="solid-card p-8 group hover:border-yellow-300 transition-all duration-300 gradient-3d">
              <h3 className="text-2xl font-bold text-card-foreground mb-6">Metals Saving Plans</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
                  <h4 className="font-bold text-card-foreground mb-2">Gold Savings Plan</h4>
                  <p className="text-sm text-muted-foreground mb-3">Automatically invest in gold from €25/month</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Storage fee: 0.5% p.a.</span>
                    <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400">Popular</Badge>
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
                    <div key={idx} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bitpanda style */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why choose BITPANDA PRO</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Europe's leading investment platform combining traditional and digital assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="solid-card hover:border-green-300 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section - European Focus */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Regulated and secure</h2>
            <p className="text-xl text-gray-600">Your security and regulatory compliance is our priority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EU Regulated</h3>
              <p className="text-gray-600">Licensed by the Austrian Financial Market Authority (FMA) and fully compliant with European regulations</p>
            </Card>

            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Storage</h3>
              <p className="text-gray-600">95% of digital assets stored offline in military-grade cold storage with multi-signature security</p>
            </Card>

            <Card className="border border-gray-200 bg-white text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Award Winning</h3>
              <p className="text-gray-600">Recognized as Europe's most trusted crypto platform with multiple industry awards</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Bitpanda style */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start investing?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join over 2 million users who trust BITPANDA PRO. Start trading from just €1 with no deposit fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4 rounded-lg text-lg h-14 transition-all duration-200">
                Get started now
              </Button>
            </Link>

            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-12 py-4 rounded-lg text-lg h-14 font-semibold transition-all duration-200"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Asset Categories Section */}
      <section className="py-20 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">500+ Assets to choose from</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Diversify your portfolio with cryptocurrencies, stocks, ETFs, precious metals and more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "₿",
                title: "Cryptocurrencies",
                description: "Bitcoin, Ethereum, and 100+ digital assets",
                count: "100+ assets",
                color: "from-orange-500 to-yellow-500"
              },
              {
                icon: "📈",
                title: "Stocks",
                description: "Leading global companies and growth stocks",
                count: "200+ stocks",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: "📊",
                title: "ETFs",
                description: "Diversified funds and sector ETFs",
                count: "150+ ETFs",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: "🥇",
                title: "Precious Metals",
                description: "Gold, Silver, Platinum and Palladium",
                count: "4 metals",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((category, index) => (
              <Card key={index} className="solid-card hover:border-green-300 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r ${category.color} rounded-xl text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{category.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-medium border border-green-200 dark:border-green-700">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Security you can trust</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your security is our priority. BITPANDA PRO is regulated and uses industry-leading security measures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "EU Regulated",
                description: "Licensed by the Austrian Financial Market Authority (FMA) and compliant with EU regulations.",
                badge: "🇦🇹 Austria"
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "Advanced encryption, multi-factor authentication, and cold storage for digital assets.",
                badge: "256-bit SSL"
              },
              {
                icon: Award,
                title: "Deposit Protection",
                description: "Your deposits are protected up to €100,000 by the Austrian Deposit Guarantee Scheme.",
                badge: "€100k protected"
              },
              {
                icon: Eye,
                title: "Transparent Fees",
                description: "No hidden costs. Clear, competitive pricing on all trades and transactions.",
                badge: "0% deposit fees"
              },
              {
                icon: Users,
                title: "Trusted by Millions",
                description: "Over 2 million active users trust BITPANDA PRO with their investments.",
                badge: "2M+ users"
              },
              {
                icon: Timer,
                title: "24/7 Support",
                description: "Round-the-clock customer support to help you with any questions or issues.",
                badge: "Always available"
              }
            ].map((feature, index) => (
              <Card key={index} className="solid-card hover:border-green-300 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                  <Badge variant="outline" className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                    {feature.badge}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insights & Analytics Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Advanced Market Analytics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade tools and insights to make informed investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Real-Time Data",
                description: "Live market data from major exchanges worldwide with millisecond latency",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                ),
                stats: "99.9% Uptime",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "AI-Powered Insights",
                description: "Machine learning algorithms analyze market trends and predict price movements",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S13.24 11.25 12 11.25 9.75 10.24 9.75 9S10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.33 2.67-2 4-2h2c1.33 0 4 .67 4 2V17z"/>
                    <circle cx="12" cy="9" r="2"/>
                    <path d="M6 15h2v2H6zm10 0h2v2h-2z"/>
                  </svg>
                ),
                stats: "85% Accuracy",
                color: "from-purple-500 to-indigo-500"
              },
              {
                title: "Portfolio Analytics",
                description: "Comprehensive portfolio tracking with risk assessment and optimization suggestions",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                ),
                stats: "20+ Metrics",
                color: "from-green-500 to-teal-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="solid-card hover:border-purple-300 transition-all duration-300 group gradient-3d">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r ${feature.color} icon-3d text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-700">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Learn & Grow Your Wealth</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access premium educational content, market research, and expert analysis to enhance your investment knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="solid-card p-8 group hover:border-emerald-300 transition-all duration-300 gradient-3d">
              <div className="flex items-center mb-6">
                <div className="icon-3d w-12 h-12 flex items-center justify-center mr-4 bg-emerald-100 dark:bg-emerald-900/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-600">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S12.24 10.25 11 10.25 8.75 9.24 8.75 8S9.76 5.75 11 5.75zm-4.5 8.5c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V15H6.5v-2.75z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">BITPANDA PRO Academy</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Crypto Fundamentals", progress: 85, level: "Beginner" },
                  { title: "Technical Analysis", progress: 60, level: "Intermediate" },
                  { title: "DeFi & Yield Farming", progress: 40, level: "Advanced" },
                  { title: "Risk Management", progress: 90, level: "Essential" }
                ].map((course, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-card-foreground">{course.title}</h4>
                      <Badge variant="outline" className="text-xs">{course.level}</Badge>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{course.progress}% Complete</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="solid-card p-8 group hover:border-emerald-300 transition-all duration-300 gradient-3d">
              <div className="flex items-center mb-6">
                <div className="icon-3d w-12 h-12 flex items-center justify-center mr-4 bg-blue-100 dark:bg-blue-900/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 16H5V6h2v2h2V6h6v2h2V6h2v12z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">Market Research</h3>
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
                  <div key={idx} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-card-foreground mb-2 line-clamp-2">{article.title}</h4>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <span>{article.date}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section className="py-20 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Award-winning platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized by industry leaders and trusted by investors across Europe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { award: "Best Crypto Platform", year: "2024", org: "FinTech Awards" },
              { award: "Most Trusted Broker", year: "2024", org: "Investment Weekly" },
              { award: "Best User Experience", year: "2023", org: "Digital Finance" },
              { award: "Top Security Rating", year: "2023", org: "CryptoCompare" }
            ].map((award, index) => (
              <div key={index} className="text-center p-6 solid-card hover:scale-105 transition-all duration-200 group">
                <Award className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h4 className="font-bold text-card-foreground mb-2">{award.award}</h4>
                <p className="text-sm text-muted-foreground">{award.org} {award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start investing?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join over 2 million investors who trust BITPANDA PRO. Start with just €1 and build your portfolio today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4 rounded-lg text-lg h-14 transition-all duration-200">
                Get started now
              </Button>
            </Link>

            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-12 py-4 rounded-lg text-lg h-14 font-semibold transition-all duration-200"
            >
              Learn more
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-green-100">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free to join
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Start from €1
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              0% deposit fees
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              EU regulated
            </span>
          </div>
        </div>
      </section>

      {/* Footer - Bitpanda Exact Pattern */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <Link href="/">
                <div className="flex items-center space-x-2 mb-6">
                  <img 
                    src="/src/assets/bitpanda-logo.svg" 
                    alt="BITPANDA PRO" 
                    className="w-8 h-8 filter invert"
                  />
                  <span className="text-xl font-bold text-white">BITPANDA PRO</span>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                BITPANDA PRO is Europe's leading investment platform. Trade cryptocurrencies, stocks, precious metals and ETFs 24/7. 
                Licensed and regulated in Austria.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 mr-2" />
                  🇦🇹 Austria based
                </span>
                <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4 mr-2" />
                  EU regulated
                </span>
              </div>
            </div>

            {/* Invest */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">Invest</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/markets" className="hover:text-green-400 transition-colors">Cryptocurrencies</Link></li>
                <li><Link href="/stocks" className="hover:text-green-400 transition-colors">Stocks</Link></li>
                <li><Link href="/etfs" className="hover:text-green-400 transition-colors">ETFs</Link></li>
                <li><Link href="/precious-metals" className="hover:text-green-400 transition-colors">Precious Metals</Link></li>
                <li><Link href="/crypto-indices" className="hover:text-green-400 transition-colors">Crypto Indices</Link></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">Learn</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/academy" className="hover:text-green-400 transition-colors">BITPANDA PRO Academy</Link></li>
                <li><Link href="/news" className="hover:text-green-400 transition-colors">News</Link></li>
                <li><Link href="/tutorials" className="hover:text-green-400 transition-colors">Getting Started</Link></li>
                <li><Link href="/help" className="hover:text-green-400 transition-colors">Help Centre</Link></li>
                <li><Link href="/api" className="hover:text-green-400 transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/about" className="hover:text-green-400 transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-green-400 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-green-400 transition-colors">Press</Link></li>
                <li><Link href="/security" className="hover:text-green-400 transition-colors">Security</Link></li>
                <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  © 2025 BITPANDA PRO Technology GmbH. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs max-w-3xl">
                  BITPANDA PRO is licensed by the Austrian Financial Market Authority (FMA). 
                  Your deposits are protected up to €100,000 by the Austrian Deposit Guarantee Scheme.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of use</Link>
                  <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy policy</Link>
                  <Link href="/imprint" className="hover:text-green-400 transition-colors">Imprint</Link>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">Follow us:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                      <span className="text-xs">X</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                      <span className="text-xs">YT</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                      <span className="text-xs">IG</span>
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