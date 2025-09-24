
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, MessageCircle, Phone, Mail, FileText, Shield, 
  CreditCard, TrendingUp, Settings, AlertTriangle, HelpCircle,
  Clock, CheckCircle, BookOpen
} from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Topics", icon: BookOpen },
    { id: "account", label: "Account & Verification", icon: Shield },
    { id: "trading", label: "Trading & Orders", icon: TrendingUp },
    { id: "deposits", label: "Deposits & Withdrawals", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "technical", label: "Technical Issues", icon: Settings },
  ];

  const faqs = [
    {
      id: "1",
      category: "account",
      question: "How do I verify my account?",
      answer: "Account verification requires uploading a government-issued ID and proof of address. Go to Account Settings > Verification and follow the step-by-step process. Verification typically takes 24-48 hours."
    },
    {
      id: "2",
      category: "trading",
      question: "What's the difference between market and limit orders?",
      answer: "Market orders execute immediately at the current market price, while limit orders only execute when the price reaches your specified level. Market orders offer speed, limit orders offer price control."
    },
    {
      id: "3",
      category: "deposits",
      question: "How long do deposits take to process?",
      answer: "Bank transfers: 1-3 business days. Credit/debit cards: Instant to 30 minutes. Cryptocurrency deposits: 10-60 minutes depending on network confirmation times."
    },
    {
      id: "4",
      category: "security",
      question: "How do I enable two-factor authentication (2FA)?",
      answer: "Go to Security Settings > Two-Factor Authentication. Download an authenticator app like Google Authenticator, scan the QR code, and enter the verification code. Always save your backup codes safely."
    },
    {
      id: "5",
      category: "trading",
      question: "What are stop-loss orders and how do they work?",
      answer: "Stop-loss orders automatically sell your position when the price drops to a specified level, helping limit losses. They're essential for risk management but don't guarantee execution at exact prices during volatile markets."
    },
    {
      id: "6",
      category: "deposits",
      question: "Are there any fees for deposits?",
      answer: "Bank transfers and cryptocurrency deposits are free. Credit/debit card deposits have a 1.5% fee. Check our fee schedule for detailed information on all transaction costs."
    },
    {
      id: "7",
      category: "technical",
      question: "Why can't I log into my account?",
      answer: "Check your internet connection, ensure you're using the correct email/password, and try clearing your browser cache. If 2FA is enabled, ensure your authenticator app time is synchronized."
    },
    {
      id: "8",
      category: "account",
      question: "Can I change my registered email address?",
      answer: "Yes, go to Account Settings > Profile Information. You'll need to verify the new email address and may need to re-verify certain security settings for your protection."
    },
    {
      id: "9",
      category: "trading",
      question: "What is slippage and how can I minimize it?",
      answer: "Slippage is the difference between expected and actual execution price. Minimize it by trading during high-volume periods, using limit orders, and avoiding large orders in low-liquidity markets."
    },
    {
      id: "10",
      category: "security",
      question: "How do I report suspicious account activity?",
      answer: "Immediately contact our security team at security@bitpanda-pro.com or use the 'Report Issue' button in your account. Change your password and enable 2FA if not already active."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Help Center
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-slate-400 focus:border-blue-400"
              />
            </div>
          </div>

          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="faq" className="text-white">FAQ</TabsTrigger>
              <TabsTrigger value="contact" className="text-white">Contact Support</TabsTrigger>
              <TabsTrigger value="guides" className="text-white">Guides</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>

              {/* FAQ List */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Frequently Asked Questions ({filteredFaqs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="bg-white/5 rounded-lg border-white/10"
                      >
                        <AccordionTrigger className="px-4 py-3 text-white hover:text-blue-400 text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-slate-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No FAQ items match your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Methods */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Methods</CardTitle>
                    <CardDescription className="text-slate-300">
                      Choose the best way to reach our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-blue-400" />
                      <div>
                        <h4 className="font-semibold text-white">Live Chat</h4>
                        <p className="text-sm text-slate-300">Available 24/7 for immediate assistance</p>
                        <Button size="sm" className="mt-2">Start Chat</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <Mail className="h-6 w-6 text-green-400" />
                      <div>
                        <h4 className="font-semibold text-white">Email Support</h4>
                        <p className="text-sm text-slate-300">support@bitpanda-pro.com</p>
                        <p className="text-xs text-slate-400">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <Phone className="h-6 w-6 text-purple-400" />
                      <div>
                        <h4 className="font-semibold text-white">Phone Support</h4>
                        <p className="text-sm text-slate-300">+43 1 234 5678</p>
                        <p className="text-xs text-slate-400">Mon-Fri, 9:00-18:00 CET</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Send us a Message</CardTitle>
                    <CardDescription className="text-slate-300">
                      We'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Subject
                      </label>
                      <Input 
                        placeholder="Brief description of your issue"
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Category
                      </label>
                      <select className="w-full p-2 rounded-md bg-white/5 border border-white/20 text-white">
                        <option value="">Select a category</option>
                        <option value="account">Account Issues</option>
                        <option value="trading">Trading Problems</option>
                        <option value="deposits">Deposits/Withdrawals</option>
                        <option value="security">Security Concerns</option>
                        <option value="technical">Technical Issues</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Message
                      </label>
                      <Textarea 
                        placeholder="Please describe your issue in detail..."
                        rows={4}
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    
                    <Button className="w-full">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Getting Started Guide",
                    description: "Complete walkthrough for new users",
                    icon: BookOpen,
                    time: "15 min read"
                  },
                  {
                    title: "Trading Basics",
                    description: "Learn the fundamentals of cryptocurrency trading",
                    icon: TrendingUp,
                    time: "20 min read"
                  },
                  {
                    title: "Security Best Practices",
                    description: "Keep your account and funds secure",
                    icon: Shield,
                    time: "10 min read"
                  },
                  {
                    title: "Advanced Trading Features",
                    description: "Master stop-loss, limit orders, and more",
                    icon: Settings,
                    time: "25 min read"
                  },
                  {
                    title: "Tax Reporting",
                    description: "Understanding cryptocurrency tax obligations",
                    icon: FileText,
                    time: "18 min read"
                  },
                  {
                    title: "Troubleshooting Common Issues",
                    description: "Solutions to frequent problems",
                    icon: AlertTriangle,
                    time: "12 min read"
                  }
                ].map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-sm">{guide.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-400">{guide.time}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm">{guide.description}</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full">
                          Read Guide
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
