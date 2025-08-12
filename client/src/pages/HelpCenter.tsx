import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, MessageCircle, FileText, Video, Users, Shield, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: <Users className="h-6 w-6" />,
      articles: [
        "How to Create an Account",
        "Account Verification Process",
        "Platform Overview",
        "First Trade Guide"
      ]
    },
    {
      title: "Deposits & Withdrawals",
      icon: <FileText className="h-6 w-6" />,
      articles: [
        "How to Deposit Funds",
        "Withdrawal Process",
        "Payment Methods",
        "Processing Times"
      ]
    },
    {
      title: "Trading",
      icon: <Video className="h-6 w-6" />,
      articles: [
        "How to Place Orders",
        "Order Types Explained",
        "Leverage & Margin",
        "Risk Management"
      ]
    },
    {
      title: "Security",
      icon: <Shield className="h-6 w-6" />,
      articles: [
        "Two-Factor Authentication",
        "Account Security Tips",
        "Suspicious Activity",
        "Password Protection"
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-8 w-8 text-green-500" />,
      action: "Send Email",
      available: "Response within 24h"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts",
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BITPANDA PRO Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Find answers, get support, and learn how to use our platform
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search for help articles..."
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {option.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{option.description}</p>
                <Button className="w-full mb-2">{option.action}</Button>
                <p className="text-sm text-gray-500">{option.available}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {helpCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <Link key={articleIndex} to={`/help/article/${article.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <span>{article}</span>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "How to verify your account",
                "Understanding trading fees",
                "Setting up 2FA security",
                "How to deposit cryptocurrency",
                "Withdrawal limits explained",
                "Platform navigation guide"
              ].map((article, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>{article}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;