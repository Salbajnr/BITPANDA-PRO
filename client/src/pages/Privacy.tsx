
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Eye, Cookie, Database, Lock, Globe, UserCheck, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const privacySections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <Database className="h-5 w-5" />,
      content: `We collect information you provide directly (account registration, profile information), information collected automatically (usage data, device information), and information from third parties (authentication providers, market data providers).`
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <Eye className="h-5 w-5" />,
      content: `We use your information to provide and maintain our services, personalize your experience, communicate with you, ensure platform security, comply with legal obligations, and improve our services.`
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <Globe className="h-5 w-5" />,
      content: `We do not sell your personal information. We may share information with service providers, for legal compliance, business transfers, or with your consent. All sharing is governed by strict data protection agreements.`
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <Lock className="h-5 w-5" />,
      content: `We implement industry-standard security measures including encryption, secure servers, regular security audits, access controls, and incident response procedures to protect your information.`
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <Database className="h-5 w-5" />,
      content: `We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. You can request deletion of your data subject to legal requirements.`
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: <UserCheck className="h-5 w-5" />,
      content: `Under GDPR and other privacy laws, you have rights to access, correct, delete, port, and restrict processing of your data. You can also object to processing and withdraw consent where applicable.`
    }
  ];

  const gdprRights = [
    { title: 'Right to Access', description: 'Request copies of your personal data' },
    { title: 'Right to Rectification', description: 'Request correction of inaccurate data' },
    { title: 'Right to Erasure', description: 'Request deletion of your data' },
    { title: 'Right to Restrict Processing', description: 'Limit how we use your data' },
    { title: 'Right to Data Portability', description: 'Receive your data in a portable format' },
    { title: 'Right to Object', description: 'Object to certain data processing activities' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Your privacy is important to us. This Privacy Policy explains how BITPANDA PRO 
              collects, uses, and protects your information.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mt-2">
                We comply with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="policy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR Rights</TabsTrigger>
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
                            {section.icon}
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                            {section.content.split(', ').map((item, idx) => (
                              <p key={idx} className="mb-2">• {item}</p>
                            ))}
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
                      Your GDPR Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {gdprRights.map((right, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{right.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{right.description}</p>
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
                    <p className="text-gray-600 dark:text-gray-300">
                      To exercise any of your privacy rights, please contact us using the methods below:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">privacy@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Data Protection Officer</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">dpo@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Response Time</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Within 30 days of request</p>
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
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Cookie Notice</span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                        We use cookies to enhance your experience and improve our services. You can manage your preferences below.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'necessary', title: 'Necessary Cookies', description: 'Required for basic site functionality', required: true },
                        { key: 'functional', title: 'Functional Cookies', description: 'Remember your preferences and settings' },
                        { key: 'analytics', title: 'Analytics Cookies', description: 'Help us understand how you use our site' },
                        { key: 'marketing', title: 'Marketing Cookies', description: 'Used to deliver relevant advertisements' }
                      ].map((cookie) => (
                        <div key={cookie.key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{cookie.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{cookie.description}</p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={cookiePreferences[cookie.key]}
                              disabled={cookie.required}
                              onChange={(e) => setCookiePreferences(prev => ({
                                ...prev,
                                [cookie.key]: e.target.checked
                              }))}
                              className="mr-2"
                            />
                            {cookie.required && <span className="text-xs text-gray-500">(Required)</span>}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Preferences
                      </button>
                      <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Accept All
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Eye, Cookie, Database, Lock, Globe, UserCheck, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const privacySections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <Database className="h-5 w-5" />,
      content: `We collect information you provide directly (account registration, profile information), information collected automatically (usage data, device information), and information from third parties (authentication providers, market data providers).`
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <Eye className="h-5 w-5" />,
      content: `We use your information to provide and maintain our services, personalize your experience, communicate with you, ensure platform security, comply with legal obligations, and improve our services.`
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <Globe className="h-5 w-5" />,
      content: `We do not sell your personal information. We may share information with service providers, for legal compliance, business transfers, or with your consent. All sharing is governed by strict data protection agreements.`
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <Lock className="h-5 w-5" />,
      content: `We implement industry-standard security measures including encryption, secure servers, regular security audits, access controls, and incident response procedures to protect your information.`
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <Database className="h-5 w-5" />,
      content: `We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. You can request deletion of your data subject to legal requirements.`
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: <UserCheck className="h-5 w-5" />,
      content: `Under GDPR and other privacy laws, you have rights to access, correct, delete, port, and restrict processing of your data. You can also object to processing and withdraw consent where applicable.`
    }
  ];

  const gdprRights = [
    { title: 'Right to Access', description: 'Request copies of your personal data' },
    { title: 'Right to Rectification', description: 'Request correction of inaccurate data' },
    { title: 'Right to Erasure', description: 'Request deletion of your data' },
    { title: 'Right to Restrict Processing', description: 'Limit how we use your data' },
    { title: 'Right to Data Portability', description: 'Receive your data in a portable format' },
    { title: 'Right to Object', description: 'Object to certain data processing activities' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Your privacy is important to us. This Privacy Policy explains how BITPANDA PRO 
              collects, uses, and protects your information.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mt-2">
                We comply with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="policy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR Rights</TabsTrigger>
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
                            {section.icon}
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                            {section.content.split(', ').map((item, idx) => (
                              <p key={idx} className="mb-2">• {item}</p>
                            ))}
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
                      Your GDPR Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {gdprRights.map((right, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{right.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{right.description}</p>
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
                    <p className="text-gray-600 dark:text-gray-300">
                      To exercise any of your privacy rights, please contact us using the methods below:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">privacy@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Data Protection Officer</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">dpo@bitpandapro.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Response Time</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Within 30 days of request</p>
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
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Cookie Notice</span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                        We use cookies to enhance your experience and improve our services. You can manage your preferences below.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'necessary', title: 'Necessary Cookies', description: 'Required for basic site functionality', required: true },
                        { key: 'functional', title: 'Functional Cookies', description: 'Remember your preferences and settings' },
                        { key: 'analytics', title: 'Analytics Cookies', description: 'Help us understand how you use our site' },
                        { key: 'marketing', title: 'Marketing Cookies', description: 'Used to deliver relevant advertisements' }
                      ].map((cookie) => (
                        <div key={cookie.key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{cookie.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{cookie.description}</p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={cookiePreferences[cookie.key]}
                              disabled={cookie.required}
                              onChange={(e) => setCookiePreferences(prev => ({
                                ...prev,
                                [cookie.key]: e.target.checked
                              }))}
                              className="mr-2"
                            />
                            {cookie.required && <span className="text-xs text-gray-500">(Required)</span>}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Preferences
                      </button>
                      <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Accept All
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
