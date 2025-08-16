import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Rocket, Bitcoin, Menu, X, Wallet, ChartLine, Shield, Bot, 
  Newspaper, Settings, University, CreditCard, RefreshCw, 
  Scale, Lock, ClipboardCheck, Archive, UserX, Users,
  Gem, ArrowRight, Star, PlayCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import { AnimatedChart } from "@/components/AnimatedChart";
import { NewsTicker } from "@/components/NewsTicker";
import { FeatureCard } from "@/components/FeatureCard";
import { StepIndicator } from "@/components/StepIndicator";
import { FloatingParticles } from "@/components/FloatingParticles";

export default function EnhancedLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(42568.92);
  const [portfolioChange, setPortfolioChange] = useState(3.11);

  // Sample chart data
  const cryptoData = {
    labels: Array(20).fill(''),
    values: [62000, 62200, 62500, 62300, 62100, 61900, 61700, 61800, 62000, 62300, 62500, 62700, 62600, 62400, 62300, 62500, 62700, 62900, 63100, 63000],
    label: 'Bitcoin'
  };

  const metalsData = {
    labels: Array(20).fill(''),
    values: [2380, 2385, 2382, 2386, 2389, 2392, 2395, 2398, 2396, 2393, 2390, 2387, 2384, 2382, 2385, 2388, 2391, 2394, 2396, 2393],
    label: 'Gold'
  };

  const portfolioData = {
    labels: ['Bitcoin', 'Ethereum', 'Gold', 'Silver', 'Stablecoins'],
    values: [35, 25, 20, 10, 10],
    label: 'Portfolio Allocation'
  };

  // Update portfolio value periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.5) * 200);
      setPortfolioChange(prev => (Math.random() - 0.5) * 4);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fade-in animation observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-lg tracking-wide">
            <div className="w-6 h-6 border-2 border-accent rounded rotate-45 animate-pulse" />
            <span>bitpanda.pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-accent transition-all duration-200 font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#markets" className="text-muted-foreground hover:text-accent transition-all duration-200 font-medium relative group">
              Markets
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#how" className="text-muted-foreground hover:text-accent transition-all duration-200 font-medium relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#deposit" className="text-muted-foreground hover:text-accent transition-all duration-200 font-medium relative group">
              Deposit Methods
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#trust" className="text-muted-foreground hover:text-accent transition-all duration-200 font-medium relative group">
              Security & Trust
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <Button 
              className="bg-accent hover:bg-accent/90 text-background font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
              asChild
            >
              <a href="/auth">Create Account</a>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-4 space-y-4">
            <a href="#features" className="block hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#markets" className="block hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Markets</a>
            <a href="#how" className="block hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#deposit" className="block hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Deposit Methods</a>
            <a href="#trust" className="block hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Security & Trust</a>
            <Button className="w-full bg-accent hover:bg-accent/90" asChild>
              <a href="/auth">Create Account</a>
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-border">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-20 animate-pulse" />
          <FloatingParticles />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="hero-content max-w-4xl space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
                Fast-Track Your Investments in{' '}
                <span className="text-accent">Crypto & Precious Metals</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                <strong>bitpanda.pro</strong> seamlessly combines cryptocurrency trading with physical gold, silver, and other metals. Enjoy real-time pricing, secure storage options, automated savings plans, and a professional dashboard for all your assets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/20 transition-all duration-200"
                  asChild
                >
                  <a href="/auth">
                    <Rocket className="mr-2 w-5 h-5" />
                    Get Started Today
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border hover:bg-muted font-medium"
                  asChild
                >
                  <a href="#markets">
                    <ChartLine className="mr-2 w-5 h-5" />
                    View Live Markets
                  </a>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm"><strong>Unified Platform</strong> · Crypto + Metals</span>
                </div>
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm"><strong>Real-Time</strong> Data & Insights</span>
                </div>
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm"><strong>Secure & Verified</strong> Transactions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold relative">
                Everything You Need in One Secure Platform
                <div className="absolute -bottom-2 left-0 w-3/5 h-1 bg-accent rounded-full" />
              </h2>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              <FeatureCard
                icon={Wallet}
                title="Unified Wallets & Portfolios"
                description="Manage cryptocurrencies and precious metals in one place. Track balances, allocations, and performance with intuitive tools."
                delay={0}
              />
              <FeatureCard
                icon={ChartLine}
                title="Live Market Insights"
                description="Access streaming prices for BTC, ETH, Gold (XAU), Silver (XAG), and more. Low-latency updates for informed decisions."
                delay={100}
              />
              <FeatureCard
                icon={Shield}
                title="Secure & Verified Deposits"
                description="Deposit via top exchanges like Binance, Bybit, or Crypto.com. Upload proof for quick admin verification."
                delay={200}
              />
              <FeatureCard
                icon={Bot}
                title="Automated Savings Plans"
                description="Set up recurring DCA for crypto or metals. Flexible, with options to pause, resume, or adjust."
                delay={300}
              />
              <FeatureCard
                icon={Newspaper}
                title="Knowledge & News Hub"
                description="Stay informed with curated news, market analyses, and guides on crypto and precious metals investing."
                delay={400}
              />
              <FeatureCard
                icon={Settings}
                title="Admin Oversight & Compliance"
                description="Robust admin tools for balance management, deposit approvals, audits, and regulatory compliance."
                delay={500}
              />
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section id="markets" className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold relative">
                Markets at a Glance
                <div className="absolute -bottom-2 left-0 w-3/5 h-1 bg-accent rounded-full" />
              </h2>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {/* Crypto Chart */}
              <div className="bg-card border border-border rounded-xl p-7 fade-in hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <Bitcoin className="w-6 h-6 text-orange-500" />
                  Top Cryptocurrencies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Monitor BTC, ETH, SOL, USDT with real-time depth, spreads, and performance metrics.
                </p>
                <AnimatedChart type="line" data={cryptoData} />
                <div className="mt-4 font-mono text-sm text-muted-foreground">
                  BTC    $62,430  +0.84%<br />
                  ETH    $3,124   -0.12%<br />
                  SOL    $146     +1.05%
                </div>
              </div>

              {/* Metals Chart */}
              <div className="bg-card border border-border rounded-xl p-7 fade-in hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <Gem className="w-6 h-6 text-yellow-500" />
                  Precious Metals
                </h3>
                <p className="text-muted-foreground mb-4">
                  Track Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD) prices and daily changes.
                </p>
                <AnimatedChart type="line" data={metalsData} />
                <div className="mt-4 font-mono text-sm text-muted-foreground">
                  XAU    $2,386   +0.21%<br />
                  XAG    $28.41   -0.44%<br />
                  XPT    $1,007   +0.10%
                </div>
              </div>

              {/* Portfolio Overview */}
              <div className="bg-card border border-border rounded-xl p-7 fade-in hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <ChartLine className="w-6 h-6 text-blue-500" />
                  Portfolio Overview
                </h3>
                <p className="text-muted-foreground mb-4">
                  View your total asset value, diversification, and daily profit/loss after signing in.
                </p>
                <div className="text-3xl font-bold font-mono mb-2">
                  ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center gap-2 mb-4 ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% Today
                </div>
                <AnimatedChart type="doughnut" data={portfolioData} showLegend />
              </div>
            </div>
          </div>
        </section>

        {/* News Ticker */}
        <NewsTicker />

        {/* How It Works Section */}
        <section id="how" className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 text-center relative inline-block left-1/2 transform -translate-x-1/2">
              How It Works
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/5 h-1 bg-accent rounded-full" />
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StepIndicator
                number={1}
                title="Sign Up & Verify"
                description="Create an account and complete quick identity verification."
              />
              <StepIndicator
                number={2}
                title="Select Assets"
                description="Choose from crypto or precious metals like gold and silver."
              />
              <StepIndicator
                number={3}
                title="Deposit Funds"
                description="Send via your preferred method and upload transaction proof."
              />
              <StepIndicator
                number={4}
                title="Get Verified"
                description="Our team reviews and credits your balance securely."
              />
              <StepIndicator
                number={5}
                title="Trade & Invest"
                description="Buy, sell, save, and monitor your portfolio 24/7."
                isLast
              />
            </div>
          </div>
        </section>

        {/* Deposit Methods Section */}
        <section id="deposit" className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-4 relative">
              Deposit Methods
              <div className="absolute -bottom-2 left-0 w-3/5 h-1 bg-accent rounded-full" />
            </h2>
            <p className="text-muted-foreground mb-16">Fund your account using any of these trusted methods.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={University}
                title="Bank Transfer (SEPA)"
                description="Secure EUR deposits directly from your bank account. SEPA transfers typically complete within 1 business day."
              />
              <FeatureCard
                icon={Bitcoin}
                title="Crypto Wallet"
                description="Deposit directly from your external crypto wallet. Supports BTC, ETH, USDT and 50+ other coins."
              />
              <FeatureCard
                icon={CreditCard}
                title="Credit/Debit Card"
                description="Instant deposits with Visa or Mastercard. Low 1.5% fee with immediate account funding."
              />
              <FeatureCard
                icon={RefreshCw}
                title="Exchange Transfer"
                description="Transfer from Binance, Bybit, or Crypto.com. Upload proof for fast admin verification."
              />
            </div>
          </div>
        </section>

        {/* Security & Trust Section */}
        <section id="trust" className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 relative">
              Built on Security & Trust
              <div className="absolute -bottom-2 left-0 w-3/5 h-1 bg-accent rounded-full" />
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Scale}
                title="Regulatory Compliance"
                description="Fully compliant with European standards for data, IT, and anti-money laundering."
              />
              <FeatureCard
                icon={Lock}
                title="Advanced Encryption"
                description="TLS encryption, hashed credentials, and role-based access controls."
              />
              <FeatureCard
                icon={ClipboardCheck}
                title="Comprehensive Audits"
                description="Detailed logs for every action, ensuring transparency and accountability."
              />
              <FeatureCard
                icon={Archive}
                title="Secure Storage"
                description="Physical metals in insured vaults; crypto in cold wallets."
              />
              <FeatureCard
                icon={UserX}
                title="Anonymous Options"
                description="Limited anonymous purchases compliant with regulations."
              />
              <FeatureCard
                icon={Users}
                title="Trusted by Millions"
                description="Join a growing community with excellent user reviews."
              />
            </div>
          </div>
        </section>

        {/* Ready to Invest Section */}
        <section id="start" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 text-center relative inline-block left-1/2 transform -translate-x-1/2">
              Ready to Invest?
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/5 h-1 bg-accent rounded-full" />
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4 fade-in hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up in minutes to access markets, deposits, and personalized tools.
                </p>
                <Button size="lg" className="bg-accent hover:bg-accent/90 w-full" asChild>
                  <a href="/auth">Create Account</a>
                </Button>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4 fade-in hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">Existing User?</h3>
                <p className="text-muted-foreground">
                  Log in to your dashboard and manage your investments seamlessly.
                </p>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <a href="/auth">Sign In</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 font-bold text-lg tracking-wide mb-4">
                <div className="w-9 h-9 border-2 border-accent rounded rotate-45" />
                <span>bitpanda.pro</span>
              </div>
              <p className="text-muted-foreground mb-6">
                The premier platform for unified cryptocurrency and precious metals trading. Secure, regulated, and trusted by investors worldwide.
              </p>
              <div className="flex gap-4">
                <div className="w-9 h-9 bg-muted/20 hover:bg-accent hover:text-background rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                  <span className="text-sm font-bold">T</span>
                </div>
                <div className="w-9 h-9 bg-muted/20 hover:bg-accent hover:text-background rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                  <span className="text-sm font-bold">F</span>
                </div>
                <div className="w-9 h-9 bg-muted/20 hover:bg-accent hover:text-background rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                  <span className="text-sm font-bold">L</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-foreground transition-colors">Markets</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Trading</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Portfolio</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Mobile App</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-foreground transition-colors">About</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Press</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-foreground transition-colors">API Docs</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Status</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Fees</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="#" className="block hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Terms</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Compliance</a>
                  <a href="#" className="block hover:text-foreground transition-colors">Security</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 BITPANDA PRO. All rights reserved. Investments carry risks of financial losses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}