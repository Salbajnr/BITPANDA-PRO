import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import logoPath from '@/assets/logo.jpeg';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

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
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-white font-medium">Contact</a>
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
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Us</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about crypto trading simulation? Need help with your account? We're here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <Input
                        type="text"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-400"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-400"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-400"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      required
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-400"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <Textarea
                      required
                      rows={5}
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-400"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  We're committed to providing exceptional support to our community. Whether you're a beginner or an experienced trader, our team is here to help you make the most of our platform.
                </p>
              </div>

              <div className="grid gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Office Address</h3>
                      <p className="text-gray-300">
                        123 Crypto Street<br />
                        Financial District<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Phone Support</h3>
                      <p className="text-gray-300">
                        +1 (555) 123-4567<br />
                        24/7 Customer Support
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                      <p className="text-gray-300">
                        support@bitpandapro.com<br />
                        sales@bitpandapro.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Business Hours</h3>
                      <p className="text-gray-300">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Weekend: 10:00 AM - 4:00 PM EST
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300">
              Quick answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  How realistic is the trading simulation?
                </h3>
                <p className="text-gray-300">
                  Our simulation uses real-time market data from major exchanges, providing an authentic trading experience that mirrors actual cryptocurrency markets.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Is my personal information secure?
                </h3>
                <p className="text-gray-300">
                  Absolutely. We use bank-level encryption and security measures to protect your data. We never share your information with third parties.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Can I practice with different cryptocurrencies?
                </h3>
                <p className="text-gray-300">
                  Yes! Our platform supports over 100+ cryptocurrencies including Bitcoin, Ethereum, and many altcoins with real market data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src={logoPath} alt="BITPANDA PRO" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">BITPANDA PRO</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 BITPANDA PRO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}