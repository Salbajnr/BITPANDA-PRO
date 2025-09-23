
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Eye, Cookie, Database, Lock, Globe, UserCheck, AlertTriangle, Download } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Privacy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const privacySections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: <Database className="h-5 w-5" />,
      content: `We collect information you provide directly during account registration (name, email, profile information), information collected automatically (device information, IP address, usage patterns, browser type), information from authentication providers (when you sign in with third-party services), and information from public sources (market data, cryptocurrency prices). We also collect technical data about your interactions with our simulation platform for educational and improvement purposes.`
    },
    {
      id: 'usage',
      title: '2. How We Use Your Information',
      icon: <Eye className="h-5 w-5" />,
      content: `We use your information to provide and maintain our simulation services, personalize your educational experience, communicate important updates and educational content, ensure platform security and prevent fraud, comply with legal obligations and regulatory requirements, analyze usage patterns to improve our platform, and provide customer support. All usage is focused on delivering educational value and maintaining a secure simulation environment.`
    },
    {
      id: 'sharing',
      title: '3. Information Sharing and Disclosure',
      icon: <Globe className="h-5 w-5" />,
      content: `We do not sell your personal information to third parties. We may share information with trusted service providers who assist in platform operation (hosting, analytics, email services), for legal compliance (law enforcement requests, court orders), in case of business transfers (mergers, acquisitions), and with your explicit consent. All third-party sharing is governed by strict data protection agreements and GDPR compliance requirements.`
    },
    {
      id: 'security',
      title: '4. Data Security Measures',
      icon: <Lock className="h-5 w-5" />,
      content: `We implement industry-standard security measures including 256-bit SSL encryption for all data transmission, secure server infrastructure with regular security updates, access controls and authentication protocols, regular security audits and penetration testing, incident response procedures for security breaches, and secure data backup and recovery systems. Your educational trading data is protected with the same standards as financial institutions.`
    },
    {
      id: 'retention',
      title: '5. Data Retention and Deletion',
      icon: <Database className="h-5 w-5" />,
      content: `We retain your information for as long as necessary to provide our educational services, typically while your account remains active and for up to 7 years thereafter for legal and regulatory compliance. You can request deletion of your data at any time, subject to legal requirements. Anonymized usage data may be retained indefinitely for research and platform improvement purposes. Account data is automatically purged after extended periods of inactivity.`
    },
    {
      id: 'rights',
      title: '6. Your Privacy Rights (GDPR)',
      icon: <UserCheck className="h-5 w-5" />,
      content: `Under GDPR and other privacy laws, you have the right to access your personal data and receive a copy, correct inaccurate or incomplete information, delete your personal data ("right to be forgotten"), restrict processing in certain circumstances, receive your data in a portable format, object to processing based on legitimate interests, and withdraw consent where applicable. You can exercise these rights through your account settings or by contacting our Data Protection Officer.`
    },
    {
      id: 'cookies',
      title: '7. Cookies and Tracking Technologies',
      icon: <Cookie className="h-5 w-5" />,
      content: `We use cookies and similar technologies to enhance your experience, remember your preferences, analyze platform usage, provide security features, and deliver personalized educational content. You can manage cookie preferences through your browser settings or our cookie preference center. Essential cookies required for platform functionality cannot be disabled, but optional cookies require your consent.`
    },
    {
      id: 'international',
      title: '8. International Data Transfers',
      icon: <Globe className="h-5 w-5" />,
      content: `Your data may be transferred to and processed in countries outside your residence. We ensure adequate protection through appropriate safeguards such as EU-US Data Privacy Framework compliance, Standard Contractual Clauses (SCCs), adequacy decisions by the European Commission, and binding corporate rules. All international transfers maintain the same level of protection as required by GDPR and other applicable privacy laws.`
    }
  ];

  const gdprRights = [
    { title: 'Right to Access', description: 'Request copies of your personal data and information about how it\'s processed' },
    { title: 'Right to Rectification', description: 'Request correction of inaccurate or incomplete personal data' },
    { title: 'Right to Erasure', description: 'Request deletion of your personal data ("right to be forgotten")' },
    { title: 'Right to Restrict Processing', description: 'Limit how we process your personal data in certain circumstances' },
    { title: 'Right to Data Portability', description: 'Receive your personal data in a structured, machine-readable format' },
    { title: 'Right to Object', description: 'Object to processing based on legitimate interests or direct marketing' },
    { title: 'Right to Withdraw Consent', description: 'Withdraw consent for processing where consent is the legal basis' },
    { title: 'Right to Lodge a Complaint', description: 'File a complaint with your local data protection authority' }
  ];

  const handleCookieChange = (type: string, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>🔒 Privacy Protection</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600">
            <p className="mb-4">
              Your privacy is important to us. This Privacy Policy explains how BITPANDA PRO 
              collects, uses, and protects your information in compliance with GDPR and other privacy laws.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <p className="text-blue-700 mt-2">
                We comply with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="policy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="gdpr">Your Rights</TabsTrigger>
              <TabsTrigger value="cookies">Cookie Settings</TabsTrigger>
            </TabsList>

            {/* Privacy Policy Tab */}
            <TabsContent value="policy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Privacy Policy Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-8">
                      {privacySections.map((section, index) => (
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
                          {index < privacySections.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GDPR Rights Tab */}
            <TabsContent value="gdpr">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-6 w-6" />
                      Your Privacy Rights Under GDPR
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {gdprRights.map((right, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <h3 className="font-semibold mb-2 text-blue-700">{right.title}</h3>
                          <p className="text-sm text-gray-600">{right.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exercise Your Rights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      To exercise any of your privacy rights, please contact us using the methods below:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <h4 className="font-medium text-green-800">Email</h4>
                          <p className="text-sm text-green-600">privacy@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <h4 className="font-medium text-blue-800">Data Protection Officer</h4>
                          <p className="text-sm text-blue-600">dpo@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <h4 className="font-medium">Response Time</h4>
                          <p className="text-sm text-gray-600">Within 30 days of request (as required by GDPR)</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Submit Privacy Request
                    </button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cookie Settings Tab */}
            <TabsContent value="cookies">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cookie className="h-6 w-6" />
                    Cookie Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Cookie Notice</span>
                      </div>
                      <p className="text-amber-700 mt-2">
                        We use cookies to enhance your experience, analyze platform usage, and provide personalized content. You can manage your preferences below.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { 
                          key: 'necessary', 
                          title: 'Necessary Cookies', 
                          description: 'Required for basic platform functionality, security, and user authentication',
                          required: true 
                        },
                        { 
                          key: 'functional', 
                          title: 'Functional Cookies', 
                          description: 'Remember your preferences, language settings, and customize your experience' 
                        },
                        { 
                          key: 'analytics', 
                          title: 'Analytics Cookies', 
                          description: 'Help us understand platform usage and improve educational content delivery' 
                        },
                        { 
                          key: 'marketing', 
                          title: 'Marketing Cookies', 
                          description: 'Used to deliver relevant educational content and platform updates' 
                        }
                      ].map((cookie) => (
                        <div key={cookie.key} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{cookie.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{cookie.description}</p>
                          </div>
                          <div className="flex items-center ml-4">
                            {cookie.required ? (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={true}
                                  disabled
                                  className="mr-2 opacity-50"
                                />
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Required</span>
                              </div>
                            ) : (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={cookiePreferences[cookie.key as keyof typeof cookiePreferences]}
                                  onChange={(e) => handleCookieChange(cookie.key, e.target.checked)}
                                  className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Preferences
                      </button>
                      <button 
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setCookiePreferences({ necessary: true, analytics: true, marketing: true, functional: true })}
                      >
                        Accept All
                      </button>
                      <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Policy
                      </button>
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
