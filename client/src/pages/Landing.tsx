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
    title: "Regulated",
    description: "Austria based and European regulated crypto & securities broker platform",
    link: "/en/security",
    linkLabel: "Read more"
  },
  {
    icon: Lock,
    title: "Safe and secure",
    description: "Funds secured in offline wallets. Fully compliant with European data, IT and money laundering standards.",
    link: "/en/security",
    linkLabel: "Read more"
  },
  {
    icon: Award,
    title: "Trusted",
    description: "7+ million happy users. Excellent Trustpilot rating.",
    link: "https://www.trustpilot.com/review/www.bitpanda.com?languages=en&stars=5",
    linkLabel: "Read reviews"
  }
];

const steps = [
  {
    number: "01",
    title: "Register",
    description: "Sign up to create your free Bitpanda account.",
    image: "https://a.storyblok.com/f/176646/840x1080/4e498da1d7/website_homepage_register_en.png",
    alt: "Smartphone displaying Bitpanda app page with a woman holding a phone, promoting zero deposit fees and secure transactions."
  },
  {
    number: "02",
    title: "Verify",
    description: "Verify your identity with one of our trusted verification partners.",
    image: "https://a.storyblok.com/f/176646/840x1080/20149b912b/website_homepage_verify_en.png",
    alt: "Smartphone screen displaying a video selfie recording interface with a countdown timer and a stop button."
  },
  {
    number: "03",
    title: "Deposit",
    description: "Deposit your funds securely through popular options.",
    image: "https://a.storyblok.com/f/176646/840x1080/af2f5ef73e/website_homepage_deposit_en.png",
    alt: "Smartphone screen displaying a list of free payment methods: Apple Pay, PayPal, Mastercard, Visa, Online transfer, and Bank transfer."
  },
  {
    number: "04",
    title: "Trade",
    description: "Buy, sell and swap digital assets 24/7.",
    image: "https://a.storyblok.com/f/176646/840x1080/ffa905c022/website_homepage_trade_en.png",
    alt: "Smartphone displaying a Bitcoin trading app with price chart, current value at 102,326.25€, and options to buy, swap, or sell."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Portfolio Manager",
    content: "BITPANDA PRO has revolutionized how I manage my crypto investments. The analytics tools are exceptional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
  },
  {
    name: "Marco Rodriguez",
    role: "Day Trader",
    content: "The real-time market data and instant execution have significantly improved my trading performance.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
  },
  {
    name: "Emma Thompson",
    role: "Crypto Investor",
    content: "Best platform for beginners. The educational resources and customer support are outstanding.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
  }
];

const advancedFeatures = [
  {
    icon: Activity,
    title: "Real-time Analytics",
    description: "Advanced charting tools with 50+ technical indicators for professional trading decisions.",
    color: "text-blue-600"
  },
  {
    icon: Rocket,
    title: "Lightning Fast Execution",
    description: "Execute trades in milliseconds with our state-of-the-art matching engine.",
    color: "text-purple-600"
  },
  {
    icon: Database,
    title: "Deep Market Data",
    description: "Access to order books, market depth, and historical data for informed decisions.",
    color: "text-orange-600"
  },
  {
    icon: Cpu,
    title: "AI-Powered Insights",
    description: "Machine learning algorithms provide personalized investment recommendations.",
    color: "text-red-600"
  },
  {
    icon: PieChart,
    title: "Portfolio Optimization",
    description: "Automated rebalancing and risk management tools for optimal portfolio performance.",
    color: "text-green-600"
  },
  {
    icon: AlertCircle,
    title: "Smart Alerts",
    description: "Customizable price alerts and market notifications via SMS, email, and push notifications.",
    color: "text-yellow-600"
  }
];

const marketStats = [
  {
    value: "€2.8T",
    label: "Total Market Cap",
    icon: Globe,
    change: "+5.2%"
  },
  {
    value: "€127B",
    label: "24h Volume",
    icon: Activity,
    change: "+12.7%"
  },
  {
    value: "600+",
    label: "Cryptocurrencies",
    icon: Coins,
    change: "New listings weekly"
  },
  {
    value: "99.9%",
    label: "Uptime",
    icon: Shield,
    change: "Industry leading"
  }
];

const questions = [
  {
    icon: "https://a.storyblok.com/f/176646/150x150/406b7ee2bf/54_cryptoforeveryone_peoplecommunity_24x24px_white.svg",
    alt: "white people community symbol",
    title: "Community",
    description: "Join our online community so you can be the first to hear about company news, new products and more.",
    link: "https://support.bitpanda.com/hc/en-us/articles/4408844610578",
    linkLabel: "Join us"
  },
  {
    icon: "https://a.storyblok.com/f/176646/150x150/0021778981/05_contactus_chathelp_24x24px_white.svg",
    alt: "",
    title: "Contact us",
    description: "Our Bitpanda Helpdesk is filled with in-depth articles, and if you need more help, we are always available to lend a helping hand through our contact form.",
    link: "https://support.bitpanda.com/hc/en-us",
    linkLabel: "Go to Helpdesk"
  }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors">
      <Navbar />
      <LiveTicker />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-green-50 pt-24 pb-20 transition-colors overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg">
              <Rocket className="w-4 h-4 mr-2" />
              Europe's #1 Crypto Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Fast-track your financial freedom.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Join over 7 million people investing in 600+ cryptos and 3,000+ digital assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/auth">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Trading Now
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Eye className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>
            <img 
              src="https://a.storyblok.com/f/176646/1084x1364/c95624c12c/website_homepage_header.png" 
              alt="Man in a gray suit with a striped shirt, sitting and holding a phone, looking to the side, with a green background." 
              className="mx-auto mb-8 hover:scale-105 transition-transform duration-500"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">7M+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">600+</div>
                <div className="text-sm text-muted-foreground">Cryptocurrencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-muted-foreground">Trading</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">€0</div>
                <div className="text-sm text-muted-foreground">Deposit Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-muted/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <Card key={index} className="enhanced-card">
                <CardContent className="p-6 text-center">
                  <indicator.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>{indicator.title}</CardTitle>
                  <p className="mt-2">{indicator.description}</p>
                  <Button variant="link" asChild>
                    <Link href={indicator.link}>{indicator.linkLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            Investing in stocks, ETFs and commodities carries risks. Conduct your own research before concluding a transaction.
          </p>
          <p className="text-center text-muted-foreground text-sm">
            *Stocks and ETFs are the underlying assets of the contracts offered as Bitpanda Stocks and are brought to you by Bitpanda Financial Services GmbH. More information about the product is available at bitpanda.com. For more details, consult the prospectus available at bitpanda.com.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Get started in minutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="enhanced-card">
                <CardHeader className="text-center">
                  <Badge variant="secondary" className="mb-4">{step.number}</Badge>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={step.image} 
                    alt={step.alt} 
                    className="w-full h-auto mb-4"
                  />
                  <p className="text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Keep Tabs Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Keep tabs on your favourite assets</h2>
          <div className="grid gap-4">
            {topCryptos.map((crypto, index) => (
              <Card key={index} className="enhanced-card">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={getCryptoLogo(crypto.symbol)} 
                      alt={crypto.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold">{crypto.name}</h3>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold">€{crypto.price.toLocaleString()}</h3>
                    <p className={crypto.change > 0 ? 'text-green-600' : 'text-red-500'}>
                      {crypto.change > 0 ? '+' : ''}{crypto.change}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-muted-foreground text-sm">Past performance is not an indication of future performance.</p>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Market at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <Card key={index} className="enhanced-card text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground mb-2">{stat.label}</p>
                  <Badge variant="secondary" className="text-green-600">{stat.change}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Professional Trading Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access institutional-grade features designed for serious traders and investors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="enhanced-card group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <feature.icon className={`w-12 h-12 mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Trusted by Millions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="enhanced-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of investors who trust BITPANDA PRO for their financial future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-green-600">
              <Link href="/auth">
                <Users className="w-5 h-5 mr-2" />
                Start Trading Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Get started in under 5 minutes • No hidden fees • European regulated
          </p>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Questions? We’re here for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {questions.map((question, index) => (
              <Card key={index} className="bg-green-700">
                <CardContent className="p-6 text-center">
                  <img 
                    src={question.icon} 
                    alt={question.alt} 
                    className="w-12 h-12 mx-auto mb-4"
                  />
                  <CardTitle>{question.title}</CardTitle>
                  <p className="mt-2">{question.description}</p>
                  <Button variant="link" asChild className="text-white">
                    <Link href={question.link}>{question.linkLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <img 
                src="https://cdn.bitpanda.com/media/New%20navigation_Rebrand%203.0/Bitpanda_EN_trimmed.png" 
                alt="Bitpanda logo" 
                className="w-32 mb-6"
              />
              <p className="text-gray-300 mb-6">
                Bitpanda Stocks enables investing in fractional stocks. Fractional stocks in Europe are always enabled via a contract which replicates the underlying stock or ETF (financial instruments pursuant to section 1 item 7 lit. d WAG 2018). Investing in stocks and ETFs carries risks. For more details see the prospectus at bitpanda.com.
              </p>
            </div>
            {/* Other footer sections as per original */}
          </div>
        </div>
      </footer>
    </div>
  );
}