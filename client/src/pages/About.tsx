import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Globe, TrendingUp, Award, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-6">
            About BitpandaPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the future of digital asset trading with innovative dual-market solutions 
            combining cryptocurrency and precious metals investment opportunities.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At BitpandaPro, we believe in democratizing access to both digital and traditional 
              store-of-value assets. Our platform bridges the gap between modern cryptocurrency 
              trading and time-tested precious metals investment.
            </p>
            <p className="text-lg text-gray-600">
              We provide institutional-grade trading tools with user-friendly interfaces, 
              making sophisticated investment strategies accessible to everyone.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-gray-50 p-8 rounded-2xl">
            <Target className="w-12 h-12 text-green-500 mb-6" />
            <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To become the world's most trusted platform for dual-asset investment, 
              where traditional wealth preservation meets digital innovation.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-10 h-10 text-green-500 mb-4" />
              <CardTitle className="text-xl font-bold text-black">
                Security First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Bank-grade security with multi-layer protection, cold storage, 
                and insurance coverage for your digital assets.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-blue-500 mb-4" />
              <CardTitle className="text-xl font-bold text-black">
                Real-Time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Live market data from multiple exchanges and precious metals 
                markets, ensuring you have the most accurate pricing.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="w-10 h-10 text-yellow-500 mb-4" />
              <CardTitle className="text-xl font-bold text-black">
                Award Winning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Recognized by industry leaders for innovation in dual-asset 
                trading and exceptional user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-white mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.5B</div>
              <div className="text-green-100">Assets Under Management</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-100">Supported Assets</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-green-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-6">Our Leadership</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Led by industry veterans with decades of combined experience in traditional 
            finance, cryptocurrency, and precious metals markets.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Sarah Chen</h3>
              <p className="text-gray-600 mb-2">Chief Executive Officer</p>
              <p className="text-sm text-gray-500">Former Goldman Sachs, 15+ years in fintech</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Michael Rodriguez</h3>
              <p className="text-gray-600 mb-2">Chief Technology Officer</p>
              <p className="text-sm text-gray-500">Former Coinbase, blockchain security expert</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Emily Watson</h3>
              <p className="text-gray-600 mb-2">Chief Operations Officer</p>
              <p className="text-sm text-gray-500">Former APMEX, precious metals specialist</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust BitpandaPro for their dual-asset 
            investment needs. Start with as little as $10.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, Award, Globe, Shield, TrendingUp, Heart, Target, Zap,
  CheckCircle, BarChart3, Coins, Building, MapPin, Mail, Phone
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function About() {
  const stats = [
    { number: "4M+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "€50B+", label: "Trading Volume", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "600+", label: "Digital Assets", icon: <Coins className="h-6 w-6" /> },
    { number: "27", label: "European Countries", icon: <Globe className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security First",
      description: "Bank-grade security with multi-layer protection for your digital assets."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "European Excellence",
      description: "Fully regulated and compliant with European financial standards."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric",
      description: "Everything we build is designed with our users' needs at the center."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description: "Continuously pushing boundaries in digital asset trading technology."
    }
  ];

  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description: "BITPANDA was established in Vienna with a vision to democratize investing."
    },
    {
      year: "2019",
      title: "BITPANDA PRO Launch",
      description: "Launched professional trading platform for advanced users and institutions."
    },
    {
      year: "2021",
      title: "Series B Funding",
      description: "Raised €170M to expand across Europe and enhance platform capabilities."
    },
    {
      year: "2023",
      title: "1M+ Users",
      description: "Reached over 1 million verified users across European markets."
    },
    {
      year: "2024",
      title: "Advanced Features",
      description: "Introduced AI-powered analytics and institutional-grade trading tools."
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
              <Building className="w-4 h-4" />
              <span>🏢 About BITPANDA PRO</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About Us
              <span className="text-blue-600 block mt-2">Europe's Leading Crypto Platform</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              We're on a mission to democratize investing and make digital assets accessible to everyone. 
              Founded in Vienna, Austria, BITPANDA PRO has grown to become Europe's leading digital 
              asset trading platform.
            </p>
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

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To democratize investing by providing everyone with easy, secure, and cost-effective 
                access to digital assets. We believe that financial innovation should benefit everyone, 
                not just institutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Regulated by Austrian FMA</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">European Union compliance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Bank-grade security</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <Target className="w-16 h-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="opacity-90">
                  To become the most trusted and innovative digital asset platform in Europe, 
                  setting the standard for security, compliance, and user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at BITPANDA PRO
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border border-gray-200 hover:border-blue-300 transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in BITPANDA PRO's growth and development
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1 border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Want to Learn More?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Get in touch with our team to learn more about BITPANDA PRO 
            and how we're revolutionizing digital asset trading.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Vienna HQ</h3>
              <p className="text-blue-100 text-sm">Campus 2, Jakov-Lind-Straße 2</p>
              <p className="text-blue-100 text-sm">1020 Vienna, Austria</p>
            </div>

            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-blue-100 text-sm mb-2">hello@bitpanda.com</p>
              <p className="text-blue-100 text-sm">+43 1 123 456 789</p>
            </div>

            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <p className="text-blue-100 text-sm mb-2">24/7 Customer Support</p>
              <p className="text-blue-100 text-sm">Multiple Languages</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4">
              <Users className="w-5 h-5 mr-2" />
              View Careers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
