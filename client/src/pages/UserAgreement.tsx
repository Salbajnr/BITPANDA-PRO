
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Shield, DollarSign, AlertTriangle, Users, TrendingUp, Lock, CheckCircle } from 'lucide-react';

const UserAgreement = () => {
  const tradingTerms = [
    {
      id: 'simulation',
      title: '1. Trading Simulation Nature',
      icon: <TrendingUp className="h-5 w-5" />,
      content: `This platform provides cryptocurrency trading simulation only. All trades are virtual and use simulated market data. No real money or cryptocurrency is involved in any transaction. Virtual profits and losses have no real-world value and cannot be withdrawn or converted to real currency.`
    },
    {
      id: 'market-data',
      title: '2. Market Data and Pricing',
      icon: <DollarSign className="h-5 w-5" />,
      content: `Market prices are derived from real cryptocurrency exchanges but may include delays or variations. Price movements are simulated and may not perfectly reflect real market conditions. We do not guarantee accuracy of pricing data or market simulation algorithms.`
    },
    {
      id: 'virtual-balance',
      title: '3. Virtual Balance Management',
      icon: <Shield className="h-5 w-5" />,
      content: `Users receive virtual trading balances for simulation purposes. These balances can be reset or modified by administrators for educational purposes. Virtual balances do not represent real financial obligations or assets.`
    },
    {
      id: 'trading-rules',
      title: '4. Trading Rules and Limitations',
      icon: <FileText className="h-5 w-5" />,
      content: `All trading activities must comply with platform rules. Users may not attempt to exploit simulation algorithms or engage in activities that would be illegal in real trading scenarios. We reserve the right to reset accounts or restrict access for violations.`
    },
    {
      id: 'educational',
      title: '5. Educational Purpose',
      icon: <Users className="h-5 w-5" />,
      content: `This platform is designed for educational and training purposes. Content and features are meant to simulate real trading environments for learning. Users should not consider this as financial advice or recommendation for real trading decisions.`
    },
    {
      id: 'data-collection',
      title: '6. Data Collection and Analytics',
      icon: <Lock className="h-5 w-5" />,
      content: `We collect trading simulation data to improve platform functionality and provide analytics. User trading patterns and performance data may be aggregated for platform improvements. Personal data handling follows our Privacy Policy.`
    },
    {
      id: 'platform-changes',
      title: '7. Platform Modifications',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `We reserve the right to modify, suspend, or discontinue any aspect of the platform. Features, virtual currencies, and simulation parameters may be updated without notice. Users will be notified of significant changes when possible.`
    },
    {
      id: 'liability',
      title: '8. Limitation of Liability',
      icon: <Shield className="h-5 w-5" />,
      content: `BITPANDA PRO is not liable for any decisions made based on simulation results. The platform is provided "as is" without warranties. Users acknowledge this is simulation only and should seek professional advice for real trading decisions.`
    }
  ];

  const riskDisclosures = [
    {
      title: 'Simulation Risk',
      description: 'Simulation results do not guarantee real trading performance',
      level: 'High'
    },
    {
      title: 'Educational Purpose',
      description: 'Platform designed for learning, not financial advice',
      level: 'Important'
    },
    {
      title: 'No Real Value',
      description: 'Virtual gains and losses have no monetary value',
      level: 'Critical'
    },
    {
      title: 'Market Differences',
      description: 'Simulated markets may differ from real market conditions',
      level: 'Medium'
    }
  ];

  const userResponsibilities = [
    'Use platform solely for educational and training purposes',
    'Maintain account security and confidentiality',
    'Comply with all platform rules and guidelines',
    'Not attempt to exploit or manipulate simulation systems',
    'Understand that all trading is simulated and has no real value',
    'Seek professional advice before making real trading decisions'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Agreement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Trading Simulation Terms & Conditions
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Trading Simulation Platform</span>
              </div>
              <p className="text-amber-700 dark:text-amber-300 mt-2">
                This agreement governs your use of our cryptocurrency trading simulation platform. 
                No real money or cryptocurrency is involved.
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="agreement" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agreement">User Agreement</TabsTrigger>
              <TabsTrigger value="trading">Trading Terms</TabsTrigger>
              <TabsTrigger value="risks">Risk Disclosure</TabsTrigger>
              <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
            </TabsList>

            {/* User Agreement Tab */}
            <TabsContent value="agreement">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Trading Simulation Agreement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-8">
                      {tradingTerms.map((section, index) => (
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
                          {index < tradingTerms.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trading Terms Tab */}
            <TabsContent value="trading">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Trading Simulation Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Virtual Trading Only
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          All trades are simulated using virtual currency with no real-world value.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Educational Purpose
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Platform designed to teach cryptocurrency trading concepts and strategies.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Real Market Data
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Uses real cryptocurrency price feeds for realistic simulation experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Portfolio Tracking</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Monitor virtual portfolio performance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Trading Analytics</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Detailed trading statistics and insights</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">Market Data</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Real-time cryptocurrency price information</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Disclosure Tab */}
            <TabsContent value="risks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Risk Disclosure Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Important Risk Notice</span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 mt-2">
                        This is a simulation platform only. Results do not reflect real trading performance and should not be used as basis for actual investment decisions.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {riskDisclosures.map((risk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{risk.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              risk.level === 'Critical' ? 'bg-red-100 text-red-800' :
                              risk.level === 'High' ? 'bg-orange-100 text-orange-800' :
                              risk.level === 'Important' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {risk.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Responsibilities Tab */}
            <TabsContent value="responsibilities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    User Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        By using this platform, you agree to:
                      </h3>
                      <ul className="space-y-2">
                        {userResponsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start gap-2 text-blue-700 dark:text-blue-300">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-center p-6 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Agreement Confirmation</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        By using BITPANDA PRO, you confirm that you have read, understood, and agree to abide by this User Agreement.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          I Accept the Agreement
                        </button>
                        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          Download Agreement
                        </button>
                      </div>
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

export default UserAgreement;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Scale,
  Globe,
  Lock,
  DollarSign,
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function UserAgreement() {
  const [acceptedSections, setAcceptedSections] = useState({
    terms: false,
    privacy: false,
    trading: false,
    risk: false
  });

  const allAccepted = Object.values(acceptedSections).every(Boolean);

  const handleSectionAccept = (section: keyof typeof acceptedSections) => {
    setAcceptedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const agreementSections = [
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: <FileText className="h-5 w-5" />,
      summary: 'General terms and conditions for using BITPANDA PRO',
      content: `
1. ACCEPTANCE OF TERMS
By accessing and using BITPANDA PRO services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

2. ACCOUNT REGISTRATION
- You must be at least 18 years old to use our services
- You must provide accurate and complete information
- You are responsible for maintaining account security
- One account per person is allowed

3. SERVICES PROVIDED
- Cryptocurrency trading platform
- Portfolio management tools
- Market data and analysis
- Educational resources

4. USER RESPONSIBILITIES
- Comply with all applicable laws and regulations
- Maintain confidentiality of account credentials
- Report suspicious activities immediately
- Use services for legitimate purposes only

5. PROHIBITED ACTIVITIES
- Money laundering or terrorist financing
- Market manipulation or fraudulent activities
- Violating any applicable laws or regulations
- Using automated trading systems without permission

6. INTELLECTUAL PROPERTY
All content, trademarks, and intellectual property belong to BITPANDA PRO or its licensors.

7. LIMITATION OF LIABILITY
BITPANDA PRO's liability is limited to the maximum extent permitted by law.

8. TERMINATION
We reserve the right to suspend or terminate accounts that violate these terms.
      `
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Lock className="h-5 w-5" />,
      summary: 'How we collect, use, and protect your personal information',
      content: `
1. INFORMATION COLLECTION
We collect information you provide directly:
- Account registration details
- Transaction history
- Communication records
- Support interactions

2. AUTOMATIC INFORMATION COLLECTION
- IP addresses and device information
- Browser type and version
- Usage patterns and preferences
- Cookies and similar technologies

3. USE OF INFORMATION
Your information is used to:
- Provide and maintain our services
- Process transactions
- Comply with legal requirements
- Improve user experience
- Send important notifications

4. INFORMATION SHARING
We do not sell your personal information. We may share information:
- With service providers
- For legal compliance
- With your explicit consent
- In case of business transfer

5. DATA SECURITY
We implement industry-standard security measures:
- Encryption of sensitive data
- Regular security audits
- Access controls and monitoring
- Incident response procedures

6. YOUR RIGHTS
You have the right to:
- Access your personal data
- Correct inaccurate information
- Delete your account
- Data portability
- Opt-out of marketing communications

7. DATA RETENTION
We retain your data as long as necessary for service provision and legal compliance.

8. INTERNATIONAL TRANSFERS
Your data may be transferred to countries with different privacy laws. We ensure adequate protection through appropriate safeguards.
      `
    },
    {
      id: 'trading',
      title: 'Trading Terms',
      icon: <DollarSign className="h-5 w-5" />,
      summary: 'Specific terms for trading activities and transactions',
      content: `
1. TRADING SERVICES
BITPANDA PRO provides cryptocurrency trading services subject to these terms and applicable regulations.

2. ORDER EXECUTION
- Orders are executed based on current market conditions
- We use best execution practices
- Orders may be partially filled
- Market volatility can affect execution prices

3. FEES AND CHARGES
- Trading fees are clearly displayed
- Fees are deducted from your account automatically
- Fee schedules may change with advance notice
- Additional fees may apply for premium services

4. MARKET DATA
- Real-time market data is provided for trading purposes
- Data accuracy is not guaranteed
- Third-party data providers may have separate terms
- Past performance does not guarantee future results

5. TRADING LIMITS
- Daily and monthly trading limits may apply
- Limits are based on account verification level
- Additional verification may be required for higher limits
- We reserve the right to impose additional limits

6. SETTLEMENT AND CLEARING
- Trades settle according to standard market practices
- Cryptocurrency transfers may take time to confirm
- Settlement times vary by asset and network congestion
- Failed transactions may be reversed

7. CUSTODY SERVICES
- We provide secure custody for your digital assets
- Assets are held in segregated accounts
- Cold storage is used for majority of funds
- Insurance coverage applies to custodied assets

8. MARKET DISRUPTIONS
In case of market disruptions, we may:
- Suspend trading temporarily
- Cancel or modify orders
- Implement emergency procedures
- Communicate changes promptly
      `
    },
    {
      id: 'risk',
      title: 'Risk Disclosure',
      icon: <AlertCircle className="h-5 w-5" />,
      summary: 'Important information about trading risks and potential losses',
      content: `
1. GENERAL RISK WARNING
Trading cryptocurrencies involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether trading is appropriate for you.

2. MARKET RISKS
- Cryptocurrency markets are highly volatile
- Prices can change rapidly and unpredictably
- Market liquidity may vary significantly
- External factors can cause extreme price movements

3. TECHNOLOGY RISKS
- Technical failures may occur
- Internet connectivity issues can affect trading
- Cybersecurity threats exist
- Software bugs or glitches may happen

4. REGULATORY RISKS
- Cryptocurrency regulations are evolving
- New laws may affect market access
- Compliance requirements may change
- Regulatory actions can impact prices

5. COUNTERPARTY RISKS
- Third-party service providers may fail
- Exchange or platform risks
- Settlement and custody risks
- Liquidity provider risks

6. OPERATIONAL RISKS
- Human error in trading decisions
- Misunderstanding of platform features
- Inadequate risk management
- Emotional trading decisions

7. LIQUIDITY RISKS
- Some assets may have limited liquidity
- Large orders may affect market prices
- Order execution may be delayed
- Slippage may occur during volatile periods

8. LOSS OF CAPITAL
- You may lose some or all of your investment
- Past performance is not indicative of future results
- Diversification does not guarantee profits
- Only invest what you can afford to lose

9. RISK MANAGEMENT
We recommend:
- Start with small amounts
- Use stop-loss orders
- Diversify your portfolio
- Keep informed about market conditions
- Seek professional advice if needed

10. NO INVESTMENT ADVICE
BITPANDA PRO does not provide investment advice. All trading decisions are your responsibility.
      `
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
            <span>📋 Legal Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            User Agreement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read and accept our terms of service, privacy policy, and risk disclosures to use BITPANDA PRO services.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agreement Progress</h3>
              <span className="text-sm text-gray-600">
                {Object.values(acceptedSections).filter(Boolean).length} of {Object.keys(acceptedSections).length} sections accepted
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(acceptedSections).map(([key, accepted]) => (
                <div
                  key={key}
                  className={`h-2 rounded-full ${
                    accepted ? 'bg-green-500' : 'bg-gray-200'
                  } transition-colors duration-200`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agreement Sections */}
        <div className="space-y-6">
          {agreementSections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      acceptedSections[section.id as keyof typeof acceptedSections] 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {section.icon}
                    </div>
                    {section.title}
                  </CardTitle>
                  {acceptedSections[section.id as keyof typeof acceptedSections] && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-2">{section.summary}</p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64 p-6">
                  <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                    {section.content}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={section.id}
                      checked={acceptedSections[section.id as keyof typeof acceptedSections]}
                      onCheckedChange={() => handleSectionAccept(section.id as keyof typeof acceptedSections)}
                    />
                    <label 
                      htmlFor={section.id}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      I have read and agree to the {section.title}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          
          <Button
            className={`flex-1 ${
              allAccepted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!allAccepted}
          >
            {allAccepted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept All Terms
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Please Accept All Sections
              </>
            )}
          </Button>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Notice:</p>
              <p>
                By accepting these terms, you acknowledge that you understand the risks involved in cryptocurrency trading 
                and that you are legally bound by these agreements. These terms may be updated periodically, and you will 
                be notified of any significant changes.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Need Help Understanding These Terms?</h4>
            <p className="text-gray-600 mb-4">
              Our legal and compliance team is available to answer your questions.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                Contact Legal Team
              </Button>
              <Button variant="outline" size="sm">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
