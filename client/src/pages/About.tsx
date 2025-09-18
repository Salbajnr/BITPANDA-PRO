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
