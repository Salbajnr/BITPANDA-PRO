
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle, 
  MessageCircle, Headphones, Shield, Menu, X, ArrowRight
} from 'lucide-react';
import logoImage from "@/assets/logo.jpeg";

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our expert team",
      contact: "support@bitpandapro.com",
      available: "24/7 Response"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our specialists",
      contact: "+43 1 123 4567",
      available: "Mon-Fri, 9 AM - 6 PM CET"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant help when you need it",
      contact: "Available in app",
      available: "24/7 Available"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with BITPANDA PRO?",
      answer: "Simply create an account, complete the verification process, and you can start trading immediately with our user-friendly platform."
    },
    {
      question: "Is my money safe with BITPANDA PRO?",
      answer: "Yes! We're fully regulated under European law with €100M insurance coverage and bank-grade security measures."
    },
    {
      question: "Can I practice with different cryptocurrencies?",
      answer: "Yes! Our platform supports over 100+ cryptocurrencies including Bitcoin, Ethereum, and many altcoins with real market data."
    },
    {
      question: "What are your trading fees?",
      answer: "We offer competitive fees starting from 0.1% with reduced rates for high-volume traders and professional accounts."
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
      <nav className="fixed w-full top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-700">
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
              <a href="/" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Home</a>
              <a href="/about" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">About</a>
              <a href="/features" className="text-gray-300 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Features</a>
              <a href="/contact" className="text-primary font-medium underline underline-offset-4 decoration-primary">Contact</a>
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
            <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-700">
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
                  className="block text-gray-300 hover:text-white transition-colors py-2 text-lg"
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
                  className="block text-primary font-medium py-2 text-lg"
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
              <span className="text-sm font-medium text-white">💬 24/7 EXPERT SUPPORT AVAILABLE</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              Get in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                {" "}Touch
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Have questions about cryptocurrency trading? Need help with your account? Our expert team is here to assist you 24/7. 
              Reach out through any of our convenient support channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How Can We Help You?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your preferred way to get in touch with our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="bg-slate-700 rounded-2xl border border-slate-600 transition-all duration-300 group hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{method.title}</h3>
                    <p className="text-gray-400 mb-4">{method.description}</p>
                    <div className="text-lg font-semibold text-primary mb-2">{method.contact}</div>
                    <div className="text-sm text-gray-500">{method.available}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="animate-in slide-in-from-left duration-1000">
              <h2 className="text-4xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-xl text-gray-300 mb-8">
                Fill out the form below and our team will get back to you within 24 hours. 
                For urgent matters, please use our live chat or phone support.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Expert Team</h4>
                    <p className="text-gray-400">Our certified trading specialists are ready to help you succeed.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <Clock className="text-green-500 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Quick Response</h4>
                    <p className="text-gray-400">We aim to respond to all inquiries within 24 hours or less.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                    <Shield className="text-green-500 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Secure Communication</h4>
                    <p className="text-gray-400">All communications are encrypted and your privacy is protected.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-in slide-in-from-right duration-1000">
              <Card className="bg-slate-800 border border-slate-600">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white mb-2 block">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-slate-700 border-slate-600 text-white focus:border-primary"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white mb-2 block">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-slate-700 border-slate-600 text-white focus:border-primary"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-white mb-2 block">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white focus:border-primary"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-white mb-2 block">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white focus:border-primary resize-none"
                        placeholder="Please describe your question or issue in detail..."
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">
              Quick answers to common questions about BITPANDA PRO
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-slate-700 border border-slate-600 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of investors who trust BITPANDA PRO. Get started today with our user-friendly platform and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Create Account
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-10 py-4 rounded-full text-lg font-bold transition-all"
            >
              Try Demo
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
