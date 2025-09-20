
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { FileText, Shield, Users, AlertTriangle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `By accessing and using BITPANDA PRO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      icon: <Users className="h-5 w-5" />,
      content: `"Platform" refers to BITPANDA PRO cryptocurrency trading simulation platform. "User" means any individual who creates an account. "Services" means all features, functionalities, and services provided through the Platform.`
    },
    {
      id: 'account',
      title: '3. Account Registration and Security',
      icon: <Shield className="h-5 w-5" />,
      content: `You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      id: 'simulation',
      title: '4. Trading Simulation',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `BITPANDA PRO is a simulation platform. All trading activities are simulated and do not involve real money or actual cryptocurrency transactions. Virtual balances have no real-world value and cannot be withdrawn or exchanged for real currency.`
    },
    {
      id: 'prohibited',
      title: '5. Prohibited Uses',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `You may not use the Platform for any unlawful purpose, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, or to attempt to gain unauthorized access to our systems.`
    },
    {
      id: 'intellectual',
      title: '6. Intellectual Property',
      icon: <Shield className="h-5 w-5" />,
      content: `The Platform and its original content, features, and functionality are owned by BITPANDA PRO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
    },
    {
      id: 'limitation',
      title: '7. Limitation of Liability',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `In no event shall BITPANDA PRO be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`
    },
    {
      id: 'termination',
      title: '8. Termination',
      icon: <Users className="h-5 w-5" />,
      content: `We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.`
    },
    {
      id: 'changes',
      title: '9. Changes to Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.`
    },
    {
      id: 'contact',
      title: '10. Contact Information',
      icon: <Users className="h-5 w-5" />,
      content: `If you have any questions about these Terms of Service, please contact us at legal@bitpandapro.com or through our support system.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              These Terms of Service ("Terms") govern your use of BITPANDA PRO's cryptocurrency 
              trading simulation platform and services.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Important Notice</span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                This is a simulation platform. No real money or actual cryptocurrency is involved in any transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
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
                        {section.icon}
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                        {section.content.split('. ').map((sentence, idx) => (
                          <p key={idx} className="mb-2">{sentence}{sentence.endsWith('.') ? '' : '.'}</p>
                        ))}
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
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  By using BITPANDA PRO, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    I Agree to Terms
                  </button>
                  <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { FileText, Shield, Users, AlertTriangle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `By accessing and using BITPANDA PRO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      icon: <Users className="h-5 w-5" />,
      content: `"Platform" refers to BITPANDA PRO cryptocurrency trading simulation platform. "User" means any individual who creates an account. "Services" means all features, functionalities, and services provided through the Platform.`
    },
    {
      id: 'account',
      title: '3. Account Registration and Security',
      icon: <Shield className="h-5 w-5" />,
      content: `You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      id: 'simulation',
      title: '4. Trading Simulation',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `BITPANDA PRO is a simulation platform. All trading activities are simulated and do not involve real money or actual cryptocurrency transactions. Virtual balances have no real-world value and cannot be withdrawn or exchanged for real currency.`
    },
    {
      id: 'prohibited',
      title: '5. Prohibited Uses',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `You may not use the Platform for any unlawful purpose, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, or to attempt to gain unauthorized access to our systems.`
    },
    {
      id: 'intellectual',
      title: '6. Intellectual Property',
      icon: <Shield className="h-5 w-5" />,
      content: `The Platform and its original content, features, and functionality are owned by BITPANDA PRO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
    },
    {
      id: 'limitation',
      title: '7. Limitation of Liability',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `In no event shall BITPANDA PRO be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`
    },
    {
      id: 'termination',
      title: '8. Termination',
      icon: <Users className="h-5 w-5" />,
      content: `We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.`
    },
    {
      id: 'changes',
      title: '9. Changes to Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.`
    },
    {
      id: 'contact',
      title: '10. Contact Information',
      icon: <Users className="h-5 w-5" />,
      content: `If you have any questions about these Terms of Service, please contact us at legal@bitpandapro.com or through our support system.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              These Terms of Service ("Terms") govern your use of BITPANDA PRO's cryptocurrency 
              trading simulation platform and services.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Important Notice</span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                This is a simulation platform. No real money or actual cryptocurrency is involved in any transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
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
                        {section.icon}
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                        {section.content.split('. ').map((sentence, idx) => (
                          <p key={idx} className="mb-2">{sentence}{sentence.endsWith('.') ? '' : '.'}</p>
                        ))}
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
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  By using BITPANDA PRO, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    I Agree to Terms
                  </button>
                  <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
