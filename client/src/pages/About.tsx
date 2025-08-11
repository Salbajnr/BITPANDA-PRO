import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, TrendingUp, Award, Globe, Lock } from 'lucide-react';
import logoPath from '@/assets/logo.jpeg';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logoPath} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">BITPANDA PRO</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/about" className="text-white font-medium">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="/features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">BITPANDA PRO</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing crypto education through realistic trading simulation, empowering millions to master cryptocurrency markets before investing real money.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To democratize cryptocurrency education by providing the most realistic trading simulation platform. We believe everyone deserves to understand crypto markets without risking their hard-earned money.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our platform combines real-time market data with professional-grade tools, creating an authentic trading experience that prepares users for the real world of cryptocurrency trading.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">50K+</h3>
                  <p className="text-gray-300">Active Traders</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">$2B+</h3>
                  <p className="text-gray-300">Simulated Volume</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at BITPANDA PRO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
                <p className="text-gray-300">
                  Your data and privacy are our top priority. We use enterprise-grade security measures to protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Excellence</h3>
                <p className="text-gray-300">
                  We strive for perfection in every feature, ensuring our platform provides the most realistic trading experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Globe className="h-16 w-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Global Access</h3>
                <p className="text-gray-300">
                  Making crypto education accessible to everyone, anywhere in the world, with support for multiple languages.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Experienced professionals from finance, technology, and education sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">John Smith</h3>
                <p className="text-green-400 mb-3">CEO & Founder</p>
                <p className="text-gray-300 text-sm">
                  Former Goldman Sachs trader with 15+ years in financial markets. Passionate about crypto education.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">SL</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sarah Lee</h3>
                <p className="text-blue-400 mb-3">CTO</p>
                <p className="text-gray-300 text-sm">
                  Tech visionary from Silicon Valley with expertise in blockchain technology and scalable platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">MJ</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mike Johnson</h3>
                <p className="text-purple-400 mb-3">Head of Product</p>
                <p className="text-gray-300 text-sm">
                  UX expert and product strategist focused on making complex financial tools accessible to everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust BITPANDA PRO for their crypto education.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={logoPath} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">BITPANDA PRO</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Secured by SSL
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                FDIC Insured
              </span>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 BITPANDA PRO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}