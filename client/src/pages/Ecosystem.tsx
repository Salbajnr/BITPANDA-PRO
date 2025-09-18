
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Coins, 
  Smartphone, 
  CreditCard, 
  Wallet,
  TrendingUp,
  Shield,
  Globe,
  Users,
  ArrowRight,
  ExternalLink,
  Play,
  Download
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Ecosystem() {
  const products = [
    {
      name: "BITPANDA PRO",
      description: "Professional cryptocurrency trading platform for advanced users",
      features: ["Advanced Trading", "Real-time Data", "API Access", "Institutional Tools"],
      status: "active",
      link: "/",
      color: "blue"
    },
    {
      name: "BITPANDA",
      description: "User-friendly platform for buying and selling cryptocurrencies",
      features: ["Simple Interface", "DCA Plans", "Staking", "Educational Content"],
      status: "active",
      link: "https://bitpanda.com",
      color: "green"
    },
    {
      name: "BITPANDA Card",
      description: "Debit card for spending your crypto and traditional assets",
      features: ["Metal Card", "Cashback", "No FX Fees", "Apple/Google Pay"],
      status: "active",
      link: "#",
      color: "purple"
    },
    {
      name: "BITPANDA Ecosystem Token",
      description: "Utility token providing benefits across the entire ecosystem",
      features: ["Trading Fee Discounts", "VIP Benefits", "Exclusive Access", "Governance"],
      status: "active",
      link: "#",
      color: "orange"
    }
  ];

  const stats = [
    { number: "4M+", label: "Global Users", icon: <Users className="h-6 w-6" /> },
    { number: "€50B+", label: "Trading Volume", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "600+", label: "Digital Assets", icon: <Coins className="h-6 w-6" /> },
    { number: "50+", label: "Countries", icon: <Globe className="h-6 w-6" /> }
  ];

  const features = [
    {
      title: "One Account, Multiple Products",
      description: "Seamlessly switch between all BITPANDA products with a single account",
      icon: <Wallet className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Unified Portfolio",
      description: "View and manage all your assets across different products in one place",
      icon: <TrendingUp className="w-8 h-8 text-green-600" />
    },
    {
      title: "Enhanced Security",
      description: "Bank-grade security measures protecting your assets across the ecosystem",
      icon: <Shield className="w-8 h-8 text-purple-600" />
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support for all ecosystem products",
      icon: <Users className="w-8 h-8 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Coins className="w-4 h-4" />
              <span>🌐 Complete Digital Asset Ecosystem</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              BITPANDA Ecosystem
              <span className="text-blue-600 block mt-2">Everything you need for digital assets</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              A comprehensive suite of products and services designed to make investing in 
              digital assets simple, secure, and accessible for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Explore Ecosystem
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Download Apps
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the full range of BITPANDA products designed for every type of investor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                    </div>
                    <Badge className={`${
                      product.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      product.color === 'green' ? 'bg-green-100 text-green-800' :
                      product.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {product.status === 'active' ? 'Live' : 'Coming Soon'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          product.color === 'blue' ? 'bg-blue-500' :
                          product.color === 'green' ? 'bg-green-500' :
                          product.color === 'purple' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      product.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      product.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                      product.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                      'bg-orange-600 hover:bg-orange-700'
                    }`}
                    onClick={() => window.open(product.link, product.link.startsWith('http') ? '_blank' : '_self')}
                  >
                    {product.link.startsWith('http') ? (
                      <>
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ecosystem Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of an integrated digital asset ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Apps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Trade on the Go
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access the full BITPANDA ecosystem from your mobile device. Trade, invest, 
                and manage your portfolio anywhere, anytime.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-900">Real-time trading and portfolio management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-900">Biometric authentication and security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-900">Integrated card management</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Smartphone className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white text-center">
                <Smartphone className="w-24 h-24 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">Mobile App Preview</h3>
                <p className="opacity-80">Coming soon with enhanced features</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join the BITPANDA Ecosystem</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Start your digital asset journey with Europe's leading cryptocurrency ecosystem. 
            Over 4 million users trust BITPANDA for their investments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4">
              <Users className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
