
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Users, Award, TrendingUp, Globe, 
  CheckCircle, Star, Building, Target, Heart,
  Zap, BarChart3, Clock, ArrowRight, Menu, X
} from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/logo.jpeg";

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const stats = [
    { number: "2.5M+", label: "Active Investors", icon: Users },
    { number: "€100M", label: "Insurance Coverage", icon: Shield },
    { number: "27", label: "EU Countries", icon: Globe },
    { number: "4.8/5", label: "Trustpilot Rating", icon: Star }
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Your data and privacy are our top priority. We use enterprise-grade security measures to protect your information.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Everything we build is designed with our users in mind, ensuring the best possible trading experience.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to bring you the latest trading tools and investment opportunities.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "BITPANDA PRO was established with a vision to democratize cryptocurrency trading in Europe."
    },
    {
      year: "2019",
      title: "EU Regulation",
      description: "Became one of the first fully regulated crypto platforms under European financial law."
    },
    {
      year: "2021",
      title: "1M Users",
      description: "Reached our first million registered users across European markets."
    },
    {
      year: "2023",
      title: "€100M Insurance",
      description: "Secured comprehensive insurance coverage to protect user assets."
    },
    {
      year: "2024",
      title: "2.5M Investors",
      description: "Now serving over 2.5 million investors with award-winning platform."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Floating Crypto Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-16 h-16 opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}>
          <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">₿</span>
          </div>
        </div>
        <div className="absolute top-[25%] right-[10%] w-12 h-12 opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}>
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">Ξ</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[15%] w-10 h-10 opacity-20 animate-bounce" style={{animationDelay: '2.5s'}}>
          <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/98 backdrop-blur-xl border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={logoImage} alt="BITPANDA PRO" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-wide">BITPANDA PRO</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-primary transition-all duration-150 hover:underline underline-offset-4 decoration-primary" rel="prefetch">Home</a>
              <a href="/about" className="text-primary font-medium underline underline-offset-4 decoration-primary">About</a>
              <a href="/features" className="text-gray-300 hover:text-primary transition-all duration-150 hover:underline underline-offset-4 decoration-primary" rel="prefetch">Features</a>
              <a href="/contact" className="text-gray-300 hover:text-primary transition-all duration-150 hover:underline underline-offset-4 decoration-primary" rel="prefetch">Contact</a>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Start Trading
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-slate-800"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900 backdrop-blur-xl border-b border-slate-700 shadow-xl">
              <div className="px-4 py-6 space-y-4">
                <a 
                  href="/" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="block text-primary font-medium py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </a>
                <a 
                  href="/features" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="/contact" 
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <Button
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-full transition-all font-medium"
                >
                  Start Trading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-green-500/10 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-in slide-in-from-bottom duration-1000">
            <div className="inline-block px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-primary/20 to-green-500/20 border border-primary/30">
              <span className="text-sm font-medium text-white">🏆 EUROPE'S LEADING CRYPTO PLATFORM</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              About
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                {" "}BITPANDA PRO
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to make cryptocurrency trading accessible, secure, and profitable for everyone in Europe. 
              Since 2018, we've been building the most trusted platform for digital asset investment.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center animate-in slide-in-from-bottom duration-1000" style={{animationDelay: `${index * 200}ms`}}>
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <h2 className="text-4xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                At BITPANDA PRO, we believe that everyone should have access to professional-grade cryptocurrency trading tools. 
                Our mission is to democratize digital asset investment across Europe while maintaining the highest standards of security and regulation.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                We're not just a trading platform – we're your trusted partner in the journey toward financial freedom through cryptocurrency investment.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                  </div>
                  <span className="text-white">EU Regulated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                  </div>
                  <span className="text-white">Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                  </div>
                  <span className="text-white">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="animate-in slide-in-from-right duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-green-500/30 rounded-3xl blur-3xl opacity-60"></div>
                <div className="relative bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">2018</div>
                      <div className="text-sm text-gray-400">Founded</div>
                    </div>
                    <div className="text-center">
                      <Award className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">15+</div>
                      <div className="text-sm text-gray-400">Awards</div>
                    </div>
                    <div className="text-center">
                      <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">27</div>
                      <div className="text-sm text-gray-400">Countries</div>
                    </div>
                    <div className="text-center">
                      <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">2.5M</div>
                      <div className="text-sm text-gray-400">Happy Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at BITPANDA PRO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="bg-slate-800 rounded-2xl border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Key milestones in building Europe's leading crypto platform
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-green-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 text-left' : 'pr-8 text-right'}`}>
                    <Card className="bg-slate-700 border border-slate-600 hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-3">{milestone.title}</h3>
                        <p className="text-gray-400">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-primary to-green-500 rounded-full border-4 border-slate-800"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of investors who trust BITPANDA PRO for their cryptocurrency trading needs. Start building your portfolio today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started Now
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-10 py-4 rounded-full text-lg font-bold transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={logoImage} alt="BITPANDA PRO" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold">BITPANDA PRO</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-xs">
                The next-generation crypto trading platform for professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">TOP INSTRUMENTS</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Forex</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Indices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Commodities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cryptocurrency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shares</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">SUPPORTS</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Deposit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Withdraw</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Open Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verify Your Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">LEARN MORE</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Responsible Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Avoid Scam</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              BITPANDA PRO Copyright Protected © 2024. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                EU Regulated
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
