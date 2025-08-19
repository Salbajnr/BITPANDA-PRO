
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Mail, Phone, MapPin, MessageSquare, Clock, Send, 
  HelpCircle, Users, Shield, FileText, ExternalLink,
  CheckCircle, AlertCircle, Globe, Headphones
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: <MessageSquare className="h-8 w-8" />,
      availability: '24/7 Available',
      responseTime: '< 5 minutes',
      status: 'online',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      icon: <Mail className="h-8 w-8" />,
      availability: 'support@bitpandapro.com',
      responseTime: '< 24 hours',
      status: 'available',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      icon: <Phone className="h-8 w-8" />,
      availability: '+1 (555) 123-CRYPTO',
      responseTime: 'Mon-Fri, 9AM-6PM EST',
      status: 'limited',
      action: 'Call Now'
    },
    {
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      icon: <HelpCircle className="h-8 w-8" />,
      availability: 'Available 24/7',
      responseTime: 'Instant access',
      status: 'online',
      action: 'Browse Articles'
    }
  ];

  const supportCategories = [
    { value: 'account', label: 'Account & Settings' },
    { value: 'trading', label: 'Trading & Orders' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'security', label: 'Security & Safety' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' }
  ];

  const companyInfo = {
    headquarters: {
      title: 'Global Headquarters',
      address: '123 Crypto Avenue, Suite 456',
      city: 'New York, NY 10001',
      country: 'United States'
    },
    europe: {
      title: 'European Office',
      address: 'Bitpanda Strasse 12',
      city: 'Vienna, 1010',
      country: 'Austria'
    },
    asia: {
      title: 'Asia Pacific Office',
      address: '88 Marina Bay Drive',
      city: 'Singapore, 018956',
      country: 'Singapore'
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form and show success message
    setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    setIsSubmitting(false);
    
    // You would handle actual form submission here
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            We're here to help with any questions about BITPANDA PRO
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Average response: 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {method.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{method.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium">{method.availability}</div>
                  <div className="text-xs text-gray-500">{method.responseTime}</div>
                </div>
                <Badge className={getStatusColor(method.status)}>
                  {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                </Badge>
                <Button className="w-full mt-4" variant="outline">
                  {method.action}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="contact-form" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact-form">Contact Form</TabsTrigger>
              <TabsTrigger value="offices">Our Offices</TabsTrigger>
              <TabsTrigger value="faq">Quick Help</TabsTrigger>
            </TabsList>

            {/* Contact Form Tab */}
            <TabsContent value="contact-form">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-6 w-6" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address *</label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Select a category</option>
                          {supportCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subject *</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief description of your inquiry"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please provide detailed information about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Times</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <span>Live Chat</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">< 5 min</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <span>Email</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">< 24 hours</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-yellow-600" />
                          <span>Phone</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Business hours</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800 dark:text-red-200">Security Issues</h4>
                            <p className="text-sm text-red-600 dark:text-red-300">For security concerns, use live chat immediately</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-800 dark:text-orange-200">Account Access</h4>
                            <p className="text-sm text-orange-600 dark:text-orange-300">Login issues require immediate assistance</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Offices Tab */}
            <TabsContent value="offices">
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(companyInfo).map(([key, office]) => (
                  <Card key={key}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">{office.title}</h3>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>{office.address}</p>
                        <p>{office.city}</p>
                        <p className="font-medium">{office.country}</p>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Globe className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Americas</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 2:00 PM EST</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Europe</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 2:00 PM CET</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Asia Pacific</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM SGT</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 2:00 PM SGT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quick Help Tab */}
            <TabsContent value="faq">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">How do I reset my password?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Use the "Forgot Password" link on the login page.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">Is this platform real trading?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">No, this is a simulation platform for educational purposes only.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium">How do I place a trade?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Go to Markets, select a crypto, and click Buy/Sell.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help Center
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      User Agreement
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Policy
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Getting Started Guide
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Contact;
