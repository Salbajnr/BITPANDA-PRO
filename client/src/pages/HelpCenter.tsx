
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
  ChevronRight, ExternalLink, Clock, CheckCircle
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    {
      title: 'Getting Started Guide',
      description: 'New to crypto trading? Start here',
      icon: <Book className="h-6 w-6" />,
      badge: 'Popular',
      link: '/tutorials'
    },
    {
      title: 'Trading Tutorial',
      description: 'Learn how to place your first trade',
      icon: <TrendingUp className="h-6 w-6" />,
      badge: 'Essential',
      link: '/academy'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: <MessageSquare className="h-6 w-6" />,
      badge: 'Support',
      link: '/contact'
    },
    {
      title: 'Security Guide',
      description: 'Keep your account secure',
      icon: <Shield className="h-6 w-6" />,
      badge: 'Important',
      link: '/security'
    }
  ];

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="h-5 w-5" />,
      description: 'Basic platform navigation and setup',
      articleCount: 12
    },
    {
      id: 'trading',
      title: 'Trading & Orders',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'How to trade and manage orders',
      articleCount: 18
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: <Users className="h-5 w-5" />,
      description: 'Profile, settings, and verification',
      articleCount: 15
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: <Shield className="h-5 w-5" />,
      description: 'Protect your account and funds',
      articleCount: 9
    },
    {
      id: 'payments',
      title: 'Deposits & Payments',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Adding funds and payment methods',
      articleCount: 7
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: <Settings className="h-5 w-5" />,
      description: 'Troubleshooting common problems',
      articleCount: 11
    }
  ];

  const faqData = [
    {
      category: 'getting-started',
      question: 'What is BITPANDA PRO and how does it work?',
      answer: 'BITPANDA PRO is a cryptocurrency trading simulation platform designed for educational purposes. All trading is done with virtual currency, allowing you to learn trading strategies without real financial risk. The platform uses real market data to provide a realistic trading experience.'
    },
    {
      category: 'getting-started',
      question: 'How do I create an account and get started?',
      answer: 'Creating an account is simple: 1) Click "Sign up" and provide your email and password, 2) Verify your email address, 3) Complete your profile setup, 4) Start trading with your virtual balance. No real money or documents are required since this is a simulation platform.'
    },
    {
      category: 'trading',
      question: 'How do I place my first trade?',
      answer: 'To place a trade: 1) Go to the Markets page, 2) Select a cryptocurrency, 3) Click "Buy" or "Sell", 4) Enter the amount you want to trade, 5) Review and confirm your order. Remember, all trades use virtual currency for educational purposes only.'
    },
    {
      category: 'trading',
      question: 'What types of orders can I place?',
      answer: 'Currently, you can place market orders (buy/sell immediately at current price) and limit orders (buy/sell when price reaches your specified level). We plan to add more advanced order types like stop-loss and take-profit orders in future updates.'
    },
    {
      category: 'account',
      question: 'Can I reset my virtual balance?',
      answer: 'Yes, as this is a simulation platform, administrators can reset virtual balances for educational purposes. You can request a balance reset through the contact form if needed for learning scenarios.'
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to User Settings from the main menu, where you can update your profile information, change your password, and manage your account preferences. Changes are saved automatically.'
    },
    {
      category: 'security',
      question: 'How secure is my account?',
      answer: 'Even though this is a simulation platform, we take security seriously. We use encrypted connections, secure password storage, and follow best practices for data protection. Always use a strong, unique password for your account.'
    },
    {
      category: 'security',
      question: 'What should I do if I forget my password?',
      answer: 'Use the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password. For security, password reset links expire after 24 hours.'
    },
    {
      category: 'payments',
      question: 'Can I deposit real money into this platform?',
      answer: 'No, BITPANDA PRO is a simulation platform only. No real money deposits are accepted or processed. All trading is done with virtual currency for educational purposes. If you want to trade with real money, you would need to use a licensed cryptocurrency exchange.'
    },
    {
      category: 'technical',
      question: 'Why are prices sometimes delayed or different?',
      answer: 'Our platform uses real cryptocurrency price feeds, but there may be slight delays or variations for simulation purposes. This helps create realistic trading conditions while maintaining the educational nature of the platform.'
    },
    {
      category: 'technical',
      question: 'The platform is loading slowly. What can I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If problems persist, check your internet connection or contact support. The platform works best on modern browsers with JavaScript enabled.'
    }
  ];

  const supportChannels = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <MessageSquare className="h-6 w-6" />,
      availability: '24/7 Available',
      responseTime: 'Usually within 5 minutes',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="h-6 w-6" />,
      availability: 'support@bitpandapro.com',
      responseTime: 'Within 24 hours',
      action: 'Send Email'
    },
    {
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      icon: <FileText className="h-6 w-6" />,
      availability: 'Always Available',
      responseTime: 'Instant access',
      action: 'View Docs'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: <Users className="h-6 w-6" />,
      availability: 'Community Moderated',
      responseTime: 'Varies',
      action: 'Join Forum'
    }
  ];

  const filteredFAQ = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Get the support you need to succeed with BITPANDA PRO
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {action.icon}
                  </div>
                  <Badge variant={action.badge === 'Popular' ? 'default' : 'secondary'}>
                    {action.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{action.description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Browse Categories</TabsTrigger>
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="support">Contact Support</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.title}</h3>
                          <p className="text-sm text-gray-500">{category.articleCount} articles</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                        <span>View articles</span>
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
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQ.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredFAQ.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No FAQs found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="grid md:grid-cols-2 gap-6">
                {supportChannels.map((channel, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {channel.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{channel.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{channel.description}</p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">{channel.availability}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600 dark:text-gray-300">{channel.responseTime}</span>
                            </div>
                          </div>
                          <Button className="w-full">
                            {channel.action}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
