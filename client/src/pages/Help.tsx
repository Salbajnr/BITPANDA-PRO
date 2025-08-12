import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircleIcon, SearchIcon, BookOpenIcon, MessageCircleIcon, 
  ShieldIcon, DollarSignIcon, TrendingUpIcon, SettingsIcon,
  ChevronDownIcon, ChevronRightIcon, MailIcon, PhoneIcon,
  ClockIcon, CheckCircleIcon
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'To create an account, click the "Sign Up" button on the homepage. Fill in your email, username, and password. You\'ll receive a confirmation email to verify your account.',
    tags: ['account', 'signup', 'registration']
  },
  {
    id: '2',
    category: 'Trading',
    question: 'How do I buy cryptocurrency?',
    answer: 'To buy crypto: 1) Navigate to the Trading page, 2) Select the cryptocurrency you want to buy, 3) Enter the amount, 4) Review the order details, 5) Click "Buy Now" to execute the trade.',
    tags: ['buy', 'trading', 'purchase']
  },
  {
    id: '3',
    category: 'Trading',
    question: 'What are trading fees?',
    answer: 'We charge a competitive trading fee of 0.25% per trade. This fee is automatically calculated and displayed before you confirm any transaction.',
    tags: ['fees', 'trading', 'cost']
  },
  {
    id: '4',
    category: 'Security',
    question: 'How is my account secured?',
    answer: 'Your account is protected with industry-standard security measures including encryption, secure sessions, and optional two-factor authentication.',
    tags: ['security', 'safety', '2fa']
  },
  {
    id: '5',
    category: 'Portfolio',
    question: 'How do I track my portfolio performance?',
    answer: 'Visit the Portfolio Analytics page to see detailed charts, performance metrics, asset allocation, and gain/loss calculations for your investments.',
    tags: ['portfolio', 'tracking', 'performance']
  },
  {
    id: '6',
    category: 'Watchlist',
    question: 'What is the watchlist feature?',
    answer: 'The watchlist allows you to track cryptocurrencies you\'re interested in without buying them. You can set price alerts and monitor their performance.',
    tags: ['watchlist', 'alerts', 'monitoring']
  },
];

const categories = ['All', 'Getting Started', 'Trading', 'Security', 'Portfolio', 'Watchlist'];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your support system
    console.log('Support form submitted:', supportForm);
    setSupportForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Help & Support
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Get answers to common questions or contact our support team for assistance
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpenIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Learn the basics of using the platform
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUpIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Trading Guide</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Master cryptocurrency trading
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <ShieldIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Keep your account safe and secure
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <SettingsIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Settings</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customize your experience
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircleIcon className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-faq"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`button-category-${category.replace(' ', '-').toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden"
                data-testid={`faq-${faq.id}`}
              >
                <button
                  className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                
                {expandedFAQ === faq.id && (
                  <div className="p-4 border-t bg-slate-50 dark:bg-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <HelpCircleIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No FAQ items found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleIcon className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Name
                  </label>
                  <Input
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                    required
                    data-testid="input-support-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                    required
                    data-testid="input-support-email"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Subject
                </label>
                <Input
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                  required
                  data-testid="input-support-subject"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Message
                </label>
                <Textarea
                  rows={5}
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                  required
                  data-testid="textarea-support-message"
                />
              </div>
              
              <Button type="submit" className="w-full" data-testid="button-submit-support">
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">Weekend</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">10:00 AM - 4:00 PM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">support@bitpanda-pro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">1-800-CRYPTO-1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Average Response Time</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Under 2 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}