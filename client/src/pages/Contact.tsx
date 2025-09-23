
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Mail, Phone, MapPin, Clock, MessageSquare, 
  Send, CheckCircle, Globe, Headphones, Shield,
  Users, Award, ExternalLink, Calendar, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactMethods = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      responseTime: "Usually within 2 minutes",
      action: "Start Chat",
      color: "bg-blue-500",
      priority: "high"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message about your inquiry",
      availability: "support@bitpandapro.com",
      responseTime: "Within 4 hours",
      action: "Send Email",
      color: "bg-green-500",
      priority: "medium"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our support experts",
      availability: "+43 1 123 456 789",
      responseTime: "Mon-Fri 9AM-6PM CET",
      action: "Call Now",
      color: "bg-purple-500",
      priority: "medium"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Video Call Support",
      description: "Screen sharing and personal assistance",
      availability: "Scheduled Sessions",
      responseTime: "Within 24 hours",
      action: "Book Session",
      color: "bg-orange-500",
      priority: "low"
    }
  ];

  const offices = [
    {
      city: "Vienna",
      country: "Austria",
      address: "Campus 2, Jakov-Lind-Straße 2, 1020 Vienna",
      phone: "+43 1 123 456 789",
      email: "vienna@bitpandapro.com",
      type: "Headquarters",
      timezone: "CET (GMT+1)",
      hours: "Mon-Fri 9AM-6PM"
    },
    {
      city: "London",
      country: "United Kingdom", 
      address: "25 Old Broad Street, London EC2N 1HN",
      phone: "+44 20 7123 4567",
      email: "london@bitpandapro.com",
      type: "European Operations",
      timezone: "GMT",
      hours: "Mon-Fri 9AM-5PM"
    },
    {
      city: "Barcelona",
      country: "Spain",
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      phone: "+34 93 123 4567",
      email: "barcelona@bitpandapro.com",
      type: "Southern Europe Hub",
      timezone: "CET (GMT+1)",
      hours: "Mon-Fri 10AM-6PM"
    }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'account', label: 'Account Issues' },
    { value: 'education', label: 'Educational Questions' },
    { value: 'partnership', label: 'Business Partnership' },
    { value: 'press', label: 'Press & Media' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Headphones className="w-4 h-4" />
              <span>🌍 Global Support Team</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
              <span className="text-blue-600 block mt-2">We're Here to Help</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Have questions about our educational platform, need technical support, or want to learn more about our services? 
              Our expert team is ready to assist you 24/7.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Average response: 2 minutes
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                500K+ users supported
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-purple-500" />
                99.8% satisfaction rate
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-orange-500" />
                Multi-language support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-lg text-gray-600">We offer multiple ways to get in touch based on your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <div className="space-y-1 mb-4">
                    <Badge variant="outline" className="text-xs">{method.availability}</Badge>
                    <p className="text-xs text-gray-500">{method.responseTime}</p>
                  </div>
                  <Button className="w-full" size="sm">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form & Office Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for contacting us. We'll get back to you within 4 hours.
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      Ticket #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </Badge>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {supportCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information about your inquiry, including any relevant details that might help us assist you better..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Office Locations & Quick Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Our Global Offices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{office.city}, {office.country}</h4>
                            <Badge variant="outline" className="mt-1">{office.type}</Badge>
                          </div>
                          <MapPin className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                            {office.address}
                          </p>
                          <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {office.phone}
                          </p>
                          <p className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {office.email}
                          </p>
                          <p className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {office.hours} ({office.timezone})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Expected Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        <span>Live Chat</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">&lt; 2 min</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span>Email</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">&lt; 4 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-purple-600" />
                        <span>Phone</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Business hours</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 mb-1">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium text-sm">Security Issues</span>
                      </div>
                      <p className="text-red-600 text-xs">For account security concerns, use live chat immediately</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800 mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium text-sm">Technical Problems</span>
                      </div>
                      <p className="text-orange-600 text-xs">Platform issues require immediate assistance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Global Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="font-semibold mb-4 flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Europe (Vienna, London)
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM CET</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM CET</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p className="text-xs text-green-600 font-medium">Live Chat: 24/7</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-4 flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Southern Europe (Barcelona)
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Monday - Friday:</strong> 10:00 AM - 6:00 PM CET</p>
                    <p><strong>Saturday:</strong> 11:00 AM - 3:00 PM CET</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p className="text-xs text-green-600 font-medium">Live Chat: 24/7</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-4 flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5 text-orange-600" />
                    Emergency Support
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Live Chat:</strong> 24/7 Available</p>
                    <p><strong>Email:</strong> Always monitored</p>
                    <p><strong>Emergency Line:</strong> +43 1 123 456 789</p>
                    <p className="text-xs text-blue-600 font-medium">Critical issues only</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
