
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { FileText, Shield, Users, AlertTriangle, Scale, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Terms() {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `By accessing and using BITPANDA PRO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These Terms of Service constitute a binding agreement between you and BITPANDA PRO regarding your use of our cryptocurrency trading simulation platform.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      icon: <Users className="h-5 w-5" />,
      content: `"Platform" refers to BITPANDA PRO cryptocurrency trading simulation platform and all associated services. "User" means any individual who creates an account and uses our services. "Services" means all features, functionalities, and services provided through the Platform, including but not limited to trading simulation, portfolio tracking, and educational resources. "Virtual Currency" means simulated digital assets with no real-world value used for educational purposes only.`
    },
    {
      id: 'account',
      title: '3. Account Registration and Security',
      icon: <Shield className="h-5 w-5" />,
      content: `You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. You may only maintain one account per person. Creating multiple accounts may result in suspension or termination of all accounts.`
    },
    {
      id: 'simulation',
      title: '4. Trading Simulation',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `BITPANDA PRO is a simulation platform designed for educational purposes only. All trading activities are simulated and do not involve real money or actual cryptocurrency transactions. Virtual balances, profits, and losses have no real-world value and cannot be withdrawn, exchanged, or converted to real currency. Market data may be delayed or modified for educational purposes. Performance in simulation does not guarantee real trading success.`
    },
    {
      id: 'prohibited',
      title: '5. Prohibited Uses',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `You may not use the Platform to violate any applicable laws or regulations, engage in fraudulent activities, attempt to gain unauthorized access to our systems, distribute malware or harmful content, harass or abuse other users, or use automated systems without explicit permission. Commercial use of the platform without authorization is prohibited. Any attempt to manipulate or exploit the simulation system may result in account termination.`
    },
    {
      id: 'intellectual',
      title: '6. Intellectual Property',
      icon: <Shield className="h-5 w-5" />,
      content: `The Platform and its original content, features, and functionality are owned by BITPANDA PRO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without explicit written permission. All trademarks, service marks, and logos used on the platform are the property of their respective owners.`
    },
    {
      id: 'limitation',
      title: '7. Limitation of Liability',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `In no event shall BITPANDA PRO be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses. Our total liability shall not exceed the amount paid by you, if any, for accessing the platform in the twelve months preceding the claim. This limitation applies regardless of the theory of liability.`
    },
    {
      id: 'termination',
      title: '8. Termination',
      icon: <Users className="h-5 w-5" />,
      content: `We may terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason including violation of these Terms. Upon termination, your right to use the Platform ceases immediately. All provisions that should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitation of liability.`
    },
    {
      id: 'changes',
      title: '9. Changes to Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.`
    },
    {
      id: 'contact',
      title: '10. Contact Information',
      icon: <Users className="h-5 w-5" />,
      content: `If you have any questions about these Terms of Service, please contact us at legal@bitpandapro.com or through our support system. For urgent legal matters, contact our legal department directly through the contact information provided on our website.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            <span>📋 Legal Terms</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600">
            <p className="mb-4">
              These Terms of Service ("Terms") govern your use of BITPANDA PRO's cryptocurrency 
              trading simulation platform and services.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Important Notice</span>
              </div>
              <p className="text-yellow-700 mt-2">
                This is a simulation platform. No real money or actual cryptocurrency is involved in any transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {sections.map((section, index) => (
                    <div key={section.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {section.icon}
                        </div>
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                      </div>
                      <div className="text-gray-700 leading-relaxed pl-11">
                        <p>{section.content}</p>
                      </div>
                      {index < sections.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Agreement Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Agreement Acknowledgment</h3>
                <p className="text-gray-600 mb-6">
                  By using BITPANDA PRO, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    I Agree to Terms
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <Clock className="w-4 h-4 inline mr-1" />
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
