
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Lock, Eye, UserCheck, FileText, Globe } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <FileText className="h-6 w-6" />,
      content: [
        "Personal identification information (name, email, phone number)",
        "Financial information (bank account details, transaction history)",
        "Identity verification documents (passport, driver's license)",
        "Device and usage information (IP address, browser type, activity logs)",
        "Communication records (support tickets, chat logs)"
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <UserCheck className="h-6 w-6" />,
      content: [
        "Provide and maintain our trading services",
        "Process transactions and verify your identity",
        "Comply with legal and regulatory requirements",
        "Improve our platform and user experience",
        "Communicate with you about your account and services",
        "Detect and prevent fraud and security threats"
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <Globe className="h-6 w-6" />,
      content: [
        "We do not sell your personal information to third parties",
        "We may share information with regulatory authorities as required",
        "Service providers who help us operate our platform",
        "Legal authorities when required by law or court order",
        "Business partners for joint services (with your consent)"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        "End-to-end encryption for all data transmission",
        "Multi-factor authentication for account access",
        "Regular security audits and penetration testing",
        "Secure data centers with 24/7 monitoring",
        "Employee background checks and training",
        "Incident response procedures for data breaches"
      ]
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Access your personal data and obtain copies",
        "Correct inaccurate or incomplete information",
        "Request deletion of your data (subject to legal requirements)",
        "Object to processing of your personal data",
        "Data portability to transfer your data",
        "Withdraw consent for optional data processing"
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve user experience",
        "Security cookies for fraud prevention",
        "Preference cookies to remember your settings",
        "You can manage cookie preferences in your browser",
        "Some features may not work if cookies are disabled"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how BITPANDA PRO collects, 
            uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    At BITPANDA PRO, we are committed to protecting your privacy and ensuring the security 
                    of your personal information. This Privacy Policy describes how we collect, use, 
                    disclose, and safeguard your information when you use our platform and services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We operate under strict European data protection regulations, including the General 
                    Data Protection Regulation (GDPR), and maintain the highest standards of data privacy 
                    and security.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    By using our services, you agree to the collection and use of information in accordance 
                    with this policy. If you do not agree with this policy, please do not use our services.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Account Information</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Retained while your account is active and for 7 years after closure for regulatory compliance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transaction Records</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Kept for 7 years as required by financial regulations and anti-money laundering laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Communication Logs</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Retained for 3 years for customer service and compliance purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Marketing Data</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Deleted immediately upon withdrawal of consent or account closure.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your data:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Standard Contractual Clauses approved by the European Commission
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Transfers only to countries with adequate data protection levels
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  Regular compliance audits of international partners
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact our Data Protection Officer.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@bitpanda-pro.com</p>
              <p><strong>Address:</strong> BITPANDA PRO, Wiedner Hauptstraße 94, 1050 Vienna, Austria</p>
              <p><strong>Phone:</strong> +43 1 234 5678</p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              We encourage you to review this Privacy Policy periodically to stay informed about how we 
              protect your information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
