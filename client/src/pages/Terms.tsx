import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, User, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FileText className="h-6 w-6" />,
      content: [
        "By accessing or using BITPANDA PRO services, you agree to be bound by these Terms",
        "You must be at least 18 years old to use our services",
        "These Terms constitute a legally binding agreement between you and BITPANDA PRO",
        "If you do not agree to these Terms, you must not use our services"
      ]
    },
    {
      id: "account",
      title: "Account Registration and Security",
      icon: <User className="h-6 w-6" />,
      content: [
        "You must provide accurate and complete information during registration",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You must notify us immediately of any unauthorized access to your account",
        "We reserve the right to suspend or terminate accounts that violate these Terms",
        "One account per person is permitted"
      ]
    },
    {
      id: "trading",
      title: "Trading Services",
      icon: <CreditCard className="h-6 w-6" />,
      content: [
        "Trading involves significant risk and may result in loss of capital",
        "We provide a platform for trading but do not provide investment advice",
        "You are solely responsible for your trading decisions",
        "We reserve the right to limit or restrict trading activities",
        "All trades are subject to our risk management procedures"
      ]
    },
    {
      id: "fees",
      title: "Fees and Charges",
      icon: <Scale className="h-6 w-6" />,
      content: [
        "Trading fees are clearly disclosed on our website and platform",
        "Fees may vary based on trading volume and account type",
        "We reserve the right to modify fees with reasonable notice",
        "Additional fees may apply for premium services",
        "All fees are non-refundable unless otherwise specified"
      ]
    },
    {
      id: "compliance",
      title: "Regulatory Compliance",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "We operate under strict European financial regulations",
        "You must comply with all applicable laws in your jurisdiction",
        "We may require additional documentation for compliance purposes",
        "Certain services may not be available in all jurisdictions",
        "We cooperate with regulatory authorities as required"
      ]
    },
    {
      id: "risks",
      title: "Risk Disclosure",
      icon: <AlertTriangle className="h-6 w-6" />,
      content: [
        "Trading in financial instruments involves substantial risk of loss",
        "Past performance does not guarantee future results",
        "Leverage can amplify both profits and losses",
        "Market volatility can result in rapid price changes",
        "You should not invest more than you can afford to lose"
      ]
    }
  ];

  const prohibitedActivities = [
    "Market manipulation or insider trading",
    "Money laundering or terrorist financing",
    "Using the platform for illegal purposes",
    "Creating multiple accounts",
    "Attempting to hack or breach our security",
    "Providing false or misleading information",
    "Violating any applicable laws or regulations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read these Terms of Service carefully before using BITPANDA PRO. 
            These terms govern your access to and use of our trading platform and services.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Welcome to BITPANDA PRO</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These Terms of Service ("Terms") govern your access to and use of the BITPANDA PRO 
                trading platform and related services provided by BITPANDA PRO GmbH, a company 
                registered in Austria.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                BITPANDA PRO is a regulated financial services provider authorized by the Austrian 
                Financial Market Authority (FMA) to provide investment services within the European Union.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                By using our services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and our Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
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

        {/* Prohibited Activities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The following activities are strictly prohibited on our platform:
            </p>
            <ul className="space-y-3">
              {prohibitedActivities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{activity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To the maximum extent permitted by law, BITPANDA PRO shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including but 
                not limited to loss of profits, data, or use, arising out of or relating to your 
                use of our services.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our total liability to you for any claim arising out of or relating to these Terms 
                or our services shall not exceed the amount of fees paid by you to us in the 
                twelve (12) months preceding the event giving rise to the claim.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Nothing in these Terms shall limit our liability for death or personal injury 
                caused by our negligence, fraud, or any other liability that cannot be excluded 
                or limited under applicable law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You may terminate your account at any time by contacting our customer support. 
                We may suspend or terminate your account immediately if you violate these Terms 
                or if required by law or regulation.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upon termination, your right to use our services will cease immediately. 
                We will process the withdrawal of your funds according to our standard procedures, 
                subject to any applicable fees and regulatory requirements.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Provisions of these Terms that by their nature should survive termination shall 
                survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law and Jurisdiction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Austria, 
              without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Any disputes arising out of or relating to these Terms or our services shall be 
              subject to the exclusive jurisdiction of the courts of Vienna, Austria.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@bitpanda-pro.com</p>
              <p><strong>Address:</strong> BITPANDA PRO GmbH, Wiedner Hauptstraße 94, 1050 Vienna, Austria</p>
              <p><strong>Phone:</strong> +43 1 234 5678</p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right to modify these Terms at any time. We will provide notice of 
              material changes by posting the updated Terms on our website and updating the 
              "Last updated" date. Your continued use of our services after any such changes 
              constitutes your acceptance of the new Terms. If you do not agree to the modified 
              Terms, you must stop using our services.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;