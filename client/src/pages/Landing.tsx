
import { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";

const topCryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 45234.56, change: 2.34, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2876.43, change: -1.23, volume: "12.8B" },
  { symbol: "BNB", name: "BNB", price: 298.76, change: 3.45, volume: "2.1B" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change: 1.87, volume: "890M" },
  { symbol: "SOL", name: "Solana", price: 98.32, change: 4.12, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" }
];

const trustIndicators = [
  {
    icon: Shield,
    title: "Regulated",
    description: "Austria based and European regulated crypto & securities broker platform",
    link: "/security",
    linkLabel: "Read more"
  },
  {
    icon: Lock,
    title: "Safe and secure",
    description: "Funds secured in offline wallets. Fully compliant with European data, IT and money laundering standards.",
    link: "/security",
    linkLabel: "Read more"
  },
  {
    icon: Award,
    title: "Trusted",
    description: "7+ million happy users. Excellent Trustpilot rating.",
    link: "#",
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

const investmentCards = [
  {
    title: "Cryptocurrencies",
    description: "Buy, sell, and swap the cryptocurrencies you want anytime, anywhere.",
    image: "https://a.storyblok.com/f/176646/960x600/6795a4c32d/website_homepage_cryptocurrencies.png",
    alt: "Hand holding a clear coin with a Bitcoin symbol, against a transparent background.",
    link: "/cryptocurrencies"
  },
  {
    title: "Stocks*",
    description: "Invest in fractions of your favourite companies without buying a full share.",
    image: "https://a.storyblok.com/f/176646/960x600/cc80628f6b/website_homepage_stocks.png",
    alt: "A row of metallic dominoes with various brand logos, including Apple, arranged in a cascading pattern against a white background.",
    link: "/stocks"
  },
  {
    title: "ETFs*",
    description: "Invest in fractions of your favourite ETFs* without buying a full share.",
    image: "https://a.storyblok.com/f/176646/960x600/bc62fd7985/website_homepage_etfs.png",
    alt: "A transparent, cylindrical plastic object with a cross-shaped divider inside, viewed from an angle.",
    link: "/etfs"
  },
  {
    title: "Commodities*",
    description: "Fortify your portfolio with commodities* and shield it against inflation.",
    image: "https://a.storyblok.com/f/176646/960x600/ff72d39829/website_homepage_commodities.png",
    alt: "Two white bags with gold leaf and coffee bean designs stand next to a dark green barrel.",
    link: "/commodities"
  },
  {
    title: "Crypto Indices",
    description: "Auto-invest in the whole crypto market with a single click.",
    image: "https://a.storyblok.com/f/176646/960x600/b971c0ccf7/website_homepage_crypto-indices.png",
    alt: "Transparent petri dishes labeled 'Fi,' 'Infra,' and 'BCI25,' stacked and slightly tilted against a white background.",
    link: "/crypto-indices"
  },
  {
    title: "Precious Metals",
    description: "Diversify your portfolio by investing in physically-backed precious metals.",
    image: "https://a.storyblok.com/f/176646/960x600/5c79402c90/website_homepage_metals.png",
    alt: "Several metallic rectangular boxes in gold and silver shades are arranged in a dynamic, tilted formation against a neutral background.",
    link: "/metals"
  }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 pt-24 pb-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[#103e36]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight uppercase text-white font-bitpanda-compressed">
                Fast-track your financial freedom.
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Join over 7 million people investing in 650+ cryptos and 3,000+ digital assets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-green-600 hover:bg-gray-100 font-medium">
                  <Link href="/auth">
                    Start investing
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img 
                src="https://a.storyblok.com/f/176646/1084x1364/c95624c12c/website_homepage_header.png" 
                alt="Man in a gray suit with a striped shirt, sitting and holding a phone, looking to the side, with a green background." 
                className="max-w-md w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-white">
                  <indicator.icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{indicator.title}</h3>
                <p className="text-white/90 mb-4">{indicator.description}</p>
                <Button variant="link" asChild className="text-white underline">
                  <Link href={indicator.link}>{indicator.linkLabel}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Your Investments Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-green-600 mb-4 font-bitpanda-compressed uppercase">
              All your investments.
              <br />
              All on Bitpanda.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentCards.map((card, index) => (
              <Card key={index} className="bg-gray-50 hover:shadow-lg transition-shadow duration-300 border-0 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={card.image} 
                    alt={card.alt} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold text-green-600 mb-2">{card.title}</CardTitle>
                  <p className="text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Investing in stocks, ETFs and commodities carries risks. Conduct your own research before concluding a transaction.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              *Stocks and ETFs are the underlying assets of the contracts offered as Bitpanda Stocks and are brought to you by Bitpanda Financial Services GmbH. 
              More information about the product is available at bitpanda.com. For more details, consult the prospectus available at bitpanda.com.
            </p>
          </div>
        </div>
      </section>

      {/* More Money in Portfolio */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-green-600 mb-4 font-bitpanda-compressed uppercase">
              More than an investment platform
            </h2>
          </div>
          <Card className="bg-green-600 text-white rounded-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="bg-gray-600 text-white mb-4 w-fit">
                  Invest with zero deposit fees
                </Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-4">
                  More money in your portfolio
                </CardTitle>
                <p className="text-white/90 mb-6">
                  No deposit or withdrawal fees on any payment method for all fiat currencies. 
                  More opportunities to grow your investments and make impactful decisions.
                </p>
                <Button variant="secondary" className="w-fit">
                  Read more
                </Button>
              </CardContent>
              <div className="bg-gray-100 flex items-center justify-center p-8">
                <img 
                  src="https://a.storyblok.com/f/176646/2063x2126/81da40be44/website_homepage_more-money-in-you-portfolio_en.png" 
                  alt="Payment options: Apple Pay, PayPal, Mastercard, and Visa, all listed as free."
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-bitpanda-compressed uppercase">
              Get started in minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 mb-6">
                  <img 
                    src={step.image} 
                    alt={step.alt} 
                    className="w-full h-auto max-w-xs mx-auto"
                  />
                </div>
                <Badge variant="secondary" className="mb-4 bg-white text-green-600">
                  {step.number}
                </Badge>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/90">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keep Tabs Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-green-600 mb-4 font-bitpanda-compressed uppercase">
              Keep tabs on your favourite assets
            </h2>
          </div>
          <div className="space-y-4">
            {topCryptos.map((crypto, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={getCryptoLogo(crypto.symbol)} 
                      alt={crypto.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{crypto.name}</h3>
                      <p className="text-sm text-gray-500">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-lg">€{crypto.price.toLocaleString()}</h3>
                    <p className={`text-sm ${crypto.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {crypto.change > 0 ? '+' : ''}{crypto.change}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            Past performance is not an indication of future performance.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bitpanda-compressed uppercase">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join millions of investors who trust BITPANDA PRO for their financial future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/auth">
                Start Trading Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <p className="text-sm mt-6 text-white/75">
            Get started in under 5 minutes • No hidden fees • European regulated
          </p>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-bitpanda-compressed uppercase">
              Questions? We're here for you
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-green-700 text-white border-0">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4">
                  <Users className="w-full h-full" />
                </div>
                <CardTitle className="text-xl mb-4">Community</CardTitle>
                <p className="mb-4">
                  Join our online community so you can be the first to hear about company news, new products and more.
                </p>
                <Button variant="link" className="text-white underline">
                  Join us
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-green-700 text-white border-0">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4">
                  <Activity className="w-full h-full" />
                </div>
                <CardTitle className="text-xl mb-4">Contact us</CardTitle>
                <p className="mb-4">
                  Our Bitpanda Helpdesk is filled with in-depth articles, and if you need more help, we are always available to lend a helping hand through our contact form.
                </p>
                <Button variant="link" className="text-white underline">
                  Go to Helpdesk
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-2xl font-bold text-white font-bitpanda-compressed uppercase">BITPANDA PRO</span>
              </div>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Europe's leading cryptocurrency trading platform. Regulated, secure, and trusted by millions of users across the continent. Start your investment journey with confidence.
              </p>
              <div className="flex space-x-4">
                <Globe className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <TrendingUp className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Shield className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Users className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Invest</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cryptocurrencies" className="text-gray-300 hover:text-white">Cryptocurrencies</Link></li>
                <li><Link href="/stocks" className="text-gray-300 hover:text-white">Stocks</Link></li>
                <li><Link href="/etfs" className="text-gray-300 hover:text-white">ETFs</Link></li>
                <li><Link href="/metals" className="text-gray-300 hover:text-white">Precious Metals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="text-gray-300 hover:text-white">Press</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy</Link></li>
                <li><Link href="/security" className="text-gray-300 hover:text-white">Security</Link></li>
                <li><Link href="/imprint" className="text-gray-300 hover:text-white">Imprint</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 BITPANDA PRO. All rights reserved. Bitpanda GmbH ve grup şirketleri (Bitpanda) Türkiye'de bankacılık ve finansal hizmetler kanunlarının düzenlediği hiçbir faaliyet için yetkilendirilmemiştir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
