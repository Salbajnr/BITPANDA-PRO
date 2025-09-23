
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { 
  Search, HelpCircle, MessageSquare, Book, Phone, Mail, 
  FileText, CreditCard, Shield, TrendingUp, Users, Settings,
  ChevronRight, ExternalLink, Clock, CheckCircle, Video,
  Download, Headphones, Globe, AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    {
      title: 'Getting Started Guide',
      description: 'New to crypto education? Start here',
      icon: <Book className="h-6 w-6" />,
      badge: 'Essential',
      link: '/tutorials',
      color: 'bg-green-500'
    },
    {
      title: 'Trading Simulation Tutorial',
      description: 'Learn how to use our platform',
      icon: <TrendingUp className="h-6 w-6" />,
      badge: 'Popular',
      link: '/academy',
      color: 'bg-blue-500'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: <MessageSquare className="h-6 w-6" />,
      badge: '24/7 Available',
      link: '/contact',
      color: 'bg-purple-500'
    },
    {
      title: 'Security Guide',
      description: 'Keep your account secure',
      icon: <Shield className="h-6 w-6" />,
      badge: 'Important',
      link: '/security',
      color: 'bg-red-500'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: <Video className="h-6 w-6" />,
      badge: 'New',
      link: '/academy',
      color: 'bg-orange-500'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: <Users className="h-6 w-6" />,
      badge: 'Community',
      link: '#',
      color: 'bg-teal-500'
    }
  ];

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="h-5 w-5" />,
      description: 'Basic platform navigation and account setup',
      articleCount: 15,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'simulation',
      title: 'Trading Simulation',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'How to use trading simulation features',
      articleCount: 22,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: <Users className="h-5 w-5" />,
      description: 'Profile, settings, and account verification',
      articleCount: 18,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: <Shield className="h-5 w-5" />,
      description: 'Protect your account and personal information',
      articleCount: 12,
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 'education',
      title: 'Educational Resources',
      icon: <FileText className="h-5 w-5" />,
      description: 'Learn about cryptocurrency and investing',
      articleCount: 35,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Settings className="h-5 w-5" />,
      description: 'Troubleshooting and technical issues',
      articleCount: 14,
      color: 'text-teal-600 bg-teal-100'
    }
  ];

  const faqData = [
    {
      category: 'getting-started',
      question: 'What is BITPANDA PRO and how does it work?',
      answer: 'BITPANDA PRO is a comprehensive cryptocurrency education and trading simulation platform. It allows users to learn about digital assets, practice trading with virtual currency, and develop investment skills in a risk-free environment. All trading is simulated using real market data, providing an authentic learning experience without financial risk.'
    },
    {
      category: 'getting-started',
      question: 'How do I create an account and get started?',
      answer: 'Creating an account is simple: 1) Click "Sign up" on our homepage, 2) Provide your email and create a secure password, 3) Verify your email address, 4) Complete your profile setup, 5) Start exploring with your virtual trading balance. No financial information or documents are required since this is an educational platform.'
    },
    {
      category: 'simulation',
      question: 'How do I place my first simulated trade?',
      answer: 'To place a simulated trade: 1) Navigate to the Markets page, 2) Select a cryptocurrency you want to trade, 3) Click "Buy" or "Sell", 4) Enter the amount in virtual currency, 5) Review the order details, 6) Confirm your simulated trade. All trades use virtual currency for educational purposes only.'
    },
    {
      category: 'simulation',
      question: 'What types of orders can I place in the simulation?',
      answer: 'Our simulation supports various order types: Market orders (execute immediately at current price), Limit orders (execute when price reaches your target), Stop-loss orders (automatically sell to limit losses), and Take-profit orders (automatically sell to secure gains). These help you learn different trading strategies risk-free.'
    },
    {
      category: 'account',
      question: 'Can I reset my virtual trading balance?',
      answer: 'Yes! Since this is an educational platform, you can request a virtual balance reset through your account settings or by contacting support. This is useful for trying different trading strategies or starting fresh with new learning objectives. Balance resets are instant and free.'
    },
    {
      category: 'account',
      question: 'How do I update my profile and account information?',
      answer: 'Go to Settings from your dashboard menu where you can update your personal information, change your password, set notification preferences, and customize your learning experience. All changes are saved automatically and securely encrypted.'
    },
    {
      category: 'security',
      question: 'How secure is my account and personal information?',
      answer: 'We take security seriously with bank-grade protection: encrypted data transmission and storage, secure password requirements, optional two-factor authentication, regular security monitoring, and GDPR-compliant data protection. Even though this is educational, your privacy and security are paramount.'
    },
    {
      category: 'security',
      question: 'What should I do if I forget my password?',
      answer: 'Use the "Forgot Password" link on the login page, enter your registered email address, and we\'ll send you a secure password reset link. The link expires after 24 hours for security. If you need additional help, contact our support team.'
    },
    {
      category: 'education',
      question: 'What educational resources are available?',
      answer: 'We offer comprehensive educational resources: interactive tutorials and courses, real-time market analysis and insights, beginner to advanced trading guides, risk management education, video tutorials and webinars, market news and research, and a community forum for discussion and learning.'
    },
    {
      category: 'education',
      question: 'Is this platform suitable for complete beginners?',
      answer: 'Absolutely! Our platform is designed for all experience levels. Complete beginners can start with our "Crypto 101" course, basic trading tutorials, guided simulations, and risk-free practice environment. Advanced users can access sophisticated analytics, complex trading strategies, and institutional-level tools.'
    },
    {
      category: 'technical',
      question: 'Why is the platform loading slowly or not working?',
      answer: 'If you experience technical issues: 1) Refresh the page and clear browser cache, 2) Try using a different browser or incognito mode, 3) Check your internet connection, 4) Disable browser extensions temporarily, 5) Contact support if problems persist. Our platform works best on modern browsers with JavaScript enabled.'
    },
    {
      category: 'technical',
      question: 'Can I use BITPANDA PRO on mobile devices?',
      answer: 'Yes! Our platform is fully responsive and works on all devices: smartphones, tablets, and desktops. We also offer dedicated mobile apps for iOS and Android with full trading simulation features, push notifications, and offline educational content access.'
    }
  ];

  const supportChannels = [
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: <MessageSquare className="h-6 w-6" />,
      availability: '24/7 Available',
      responseTime: 'Usually within 2 minutes',
      action: 'Start Chat',
      color: 'bg-green-500'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="h-6 w-6" />,
      availability: 'support@bitpandapro.com',
      responseTime: 'Within 4 hours',
      action: 'Send Email',
      color: 'bg-blue-500'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: <Phone className="h-6 w-6" />,
      availability: '+43 1 123 456 789',
      responseTime: 'Mon-Fri 9AM-6PM CET',
      action: 'Call Now',
      color: 'bg-purple-500'
    },
    {
      title: 'Video Call Support',
      description: 'Screen sharing and personal assistance',
      icon: <Video className="h-6 w-6" />,
      availability: 'Scheduled Sessions',
      responseTime: 'Within 24 hours',
      action: 'Book Session',
      color: 'bg-orange-500'
    },
    {
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      icon: <FileText className="h-6 w-6" />,
      availability: 'Always Available',
      responseTime: 'Instant access',
      action: 'Browse Docs',
      color: 'bg-teal-500'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and experts',
      icon: <Users className="h-6 w-6" />,
      availability: 'Community Moderated',
      responseTime: 'Community driven',
      action: 'Join Forum',
      color: 'bg-indigo-500'
    }
  ];

  const filteredFAQ = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <HelpCircle className="w-4 h-4" />
            <span>🆘 Help & Support</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get the support you need to succeed with BITPANDA PRO's educational platform
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles, tutorials, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Average response: 2 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Multi-language support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Help Topics</h2>
            <p className="text-lg text-gray-600">Quick access to the most commonly needed resources</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${action.color} rounded-xl text-white`}>
                      {action.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Get started</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="categories" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="categories">Browse Topics</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
              <TabsTrigger value="support">Contact Support</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 ${category.color} rounded-lg`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.title}</h3>
                          <p className="text-sm text-gray-500">{category.articleCount} articles</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <span>Browse articles</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchQuery && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        Showing {filteredFAQ.length} result{filteredFAQ.length !== 1 ? 's' : ''} for "{searchQuery}"
                      </p>
                    </div>
                  )}
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQ.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`} 
                        className="border rounded-lg px-4 hover:bg-gray-50 transition-colors"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                faq.category === 'getting-started' ? 'bg-green-500' :
                                faq.category === 'simulation' ? 'bg-blue-500' :
                                faq.category === 'account' ? 'bg-purple-500' :
                                faq.category === 'security' ? 'bg-red-500' :
                                faq.category === 'education' ? 'bg-orange-500' :
                                'bg-teal-500'
                              }`} />
                            </div>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pl-5">
                          <div className="pt-2 pb-4">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {filteredFAQ.length === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500 mb-6">We couldn't find any FAQs matching "{searchQuery}"</p>
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportChannels.map((channel, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${channel.color} rounded-xl text-white flex-shrink-0`}>
                          {channel.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-2">{channel.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{channel.availability}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">{channel.responseTime}</span>
                            </div>
                          </div>
                          <Button className="w-full" size="sm">
                            {channel.action}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">Emergency Support</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 mb-2">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">Security Issues</span>
                        </div>
                        <p className="text-red-600 text-sm">For account security concerns, use live chat immediately</p>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                          <Headphones className="h-5 w-5" />
                          <span className="font-medium">Technical Problems</span>
                        </div>
                        <p className="text-orange-600 text-sm">Platform issues require immediate assistance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
