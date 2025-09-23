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
  Clock,
  TrendingUp,
  Users,
  Target
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
      title: 'General Terms of Service',
      icon: <FileText className="h-5 w-5" />,
      summary: 'General platform usage terms and user responsibilities',
      content: `
1. ACCEPTANCE OF TERMS
By accessing and using BITPANDA PRO services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations.

2. ACCOUNT REGISTRATION AND SECURITY
- You must be at least 18 years old to use our services
- You must provide accurate and complete information during registration
- You are responsible for maintaining the security of your account credentials
- One account per person is allowed; multiple accounts may result in suspension

3. PLATFORM SERVICES AND FEATURES
- Cryptocurrency trading simulation with virtual currency
- Portfolio management and tracking tools
- Educational resources and market analysis
- Real-time market data and charting tools
- Risk management and analytics features

4. USER RESPONSIBILITIES AND CONDUCT
- Comply with all applicable laws and regulations in your jurisdiction
- Maintain confidentiality of account credentials and security information
- Report suspicious activities or security breaches immediately
- Use services for legitimate educational purposes only
- Respect other users and maintain professional conduct

5. PROHIBITED ACTIVITIES AND RESTRICTIONS
- Money laundering, terrorist financing, or other illegal financial activities
- Market manipulation, fraud, or deceptive trading practices
- Violating any applicable laws, regulations, or third-party rights
- Using automated trading systems or bots without explicit permission
- Attempting to reverse engineer or compromise platform security

6. INTELLECTUAL PROPERTY RIGHTS
All platform content, trademarks, and intellectual property belong to BITPANDA PRO or its licensors. Users may not reproduce, distribute, or create derivative works without permission.

7. LIABILITY LIMITATIONS AND DISCLAIMERS
BITPANDA PRO's liability is limited to the maximum extent permitted by law. We provide services "as is" without warranties of any kind.

8. ACCOUNT TERMINATION AND SUSPENSION
We reserve the right to suspend or terminate accounts that violate these terms, engage in prohibited activities, or pose security risks.
      `
    },
    {
      id: 'privacy',
      title: 'Privacy Policy Agreement',
      icon: <Lock className="h-5 w-5" />,
      summary: 'Data collection, processing, and protection practices',
      content: `
1. INFORMATION COLLECTION AND PROCESSING
We collect and process personal information including:
- Account registration details (name, email, contact information)
- Trading activity and transaction history within the simulation
- Technical data (IP addresses, device information, browser details)
- Usage patterns and platform interaction data

2. DATA USAGE AND PURPOSE
Your information is used to:
- Provide and maintain simulation services
- Process virtual transactions and maintain records
- Communicate important updates and educational content
- Ensure platform security and prevent unauthorized access
- Comply with legal and regulatory requirements
- Improve user experience and platform functionality

3. INFORMATION SHARING AND DISCLOSURE
We do not sell personal information. Information may be shared with:
- Authorized service providers under strict confidentiality agreements
- Legal authorities when required by law or regulation
- Business partners for legitimate educational purposes (with consent)
- In case of business transfer or merger (with continued protection)

4. DATA SECURITY AND PROTECTION
We implement comprehensive security measures:
- Advanced encryption for all data transmission and storage
- Multi-factor authentication and access controls
- Regular security audits and vulnerability assessments
- Incident response procedures for potential breaches
- Secure backup and disaster recovery systems

5. DATA RETENTION AND DELETION
We retain information for:
- Active account period plus reasonable time for legal compliance
- Up to 7 years for regulatory and audit purposes
- Anonymized analytics data may be retained indefinitely
- Users can request data deletion subject to legal requirements

6. YOUR PRIVACY RIGHTS (GDPR COMPLIANCE)
Under applicable privacy laws, you have rights to:
- Access your personal data and understand how it's processed
- Correct inaccurate or incomplete information
- Request deletion of your personal data
- Restrict or object to certain processing activities
- Receive portable copies of your data
- Withdraw consent where applicable

7. COOKIES AND TRACKING TECHNOLOGIES
We use cookies and similar technologies for:
- Essential platform functionality and security
- Personalization and user experience enhancement
- Analytics and performance monitoring
- Marketing and educational content delivery (with consent)

8. INTERNATIONAL DATA TRANSFERS
Data may be transferred internationally with appropriate safeguards including Standard Contractual Clauses and adequacy decisions.
      `
    },
    {
      id: 'trading',
      title: 'Trading Simulation Agreement',
      icon: <DollarSign className="h-5 w-5" />,
      summary: 'Specific terms for trading activities and simulation features',
      content: `
1. SIMULATION NATURE AND SCOPE
BITPANDA PRO provides cryptocurrency trading simulation services where:
- All trading activities use virtual currency with no real-world value
- Market data is derived from real sources but may include delays or modifications
- Trading results are for educational purposes only
- No actual financial instruments or real money is involved

2. VIRTUAL CURRENCY AND PORTFOLIO MANAGEMENT
- Users receive virtual trading balances for simulation purposes
- Virtual gains and losses have no monetary value
- Portfolio values are calculated using simulated market conditions
- Virtual balances can be reset for educational scenarios
- No withdrawal or conversion to real currency is possible

3. TRADING FEATURES AND FUNCTIONALITY
Available trading options include:
- Spot trading simulation with major cryptocurrencies
- Portfolio diversification and asset allocation tools
- Risk management features including stop-loss simulation
- Real-time market data and advanced charting tools
- Educational trading strategies and backtesting capabilities

4. ORDER EXECUTION AND PROCESSING
- Orders are processed using simulation algorithms
- Execution may differ from real market conditions
- Slippage and market impact are simulated for educational value
- Order types include market, limit, and conditional orders
- Trade history and performance tracking are maintained

5. MARKET DATA AND PRICING
- Prices derived from real cryptocurrency exchanges
- Data may include intentional delays for educational purposes
- Market volatility simulation based on historical patterns
- No guarantee of data accuracy or real-time precision
- Educational modifications may be applied to enhance learning

6. EDUCATIONAL PURPOSE AND LIMITATIONS
This platform is designed to:
- Teach cryptocurrency trading concepts and strategies
- Provide risk-free environment for learning and practice
- Demonstrate portfolio management principles
- Educate users about market dynamics and analysis
- NOT provide investment advice or recommendations

7. PERFORMANCE TRACKING AND ANALYTICS
- Comprehensive performance metrics and reporting
- Risk analysis and portfolio optimization tools
- Comparative analysis with market benchmarks
- Historical performance tracking and trends
- Educational insights and improvement recommendations

8. PLATFORM MODIFICATIONS AND UPDATES
We reserve the right to:
- Modify simulation parameters and features
- Update available cryptocurrencies and trading pairs
- Enhance educational content and functionality
- Reset or modify virtual balances for educational purposes
- Temporarily suspend services for maintenance or improvements
      `
    },
    {
      id: 'risk',
      title: 'Risk Disclosure Statement',
      icon: <AlertCircle className="h-5 w-5" />,
      summary: 'Important risk information and educational disclaimers',
      content: `
1. GENERAL RISK WARNING
This risk disclosure provides important information about cryptocurrency trading risks. While this is a simulation platform, understanding these risks is crucial for your education:
- Cryptocurrency markets are highly volatile and unpredictable
- Simulation results do not guarantee real trading performance
- Past performance does not indicate future results
- Real cryptocurrency trading involves substantial risk of loss

2. SIMULATION-SPECIFIC RISKS AND LIMITATIONS
Using this simulation platform involves certain educational limitations:
- Simulated market conditions may not reflect real trading environments
- Order execution in simulation may differ significantly from real markets
- Emotional and psychological factors of real trading are not replicated
- Market liquidity and slippage may not be accurately simulated
- Real-world trading costs and fees may not be fully represented

3. CRYPTOCURRENCY MARKET RISKS (EDUCATIONAL)
Understanding these market risks is essential for your education:
- Extreme price volatility and rapid value changes
- Regulatory uncertainty and potential government interventions
- Technology risks including cybersecurity threats and system failures
- Market manipulation and irregular trading patterns
- Liquidity risks and potential difficulty executing trades

4. TECHNOLOGY AND OPERATIONAL RISKS
Risks associated with digital platforms and technology:
- System outages, technical failures, or connectivity issues
- Cybersecurity threats including hacking and data breaches
- Software bugs or glitches affecting platform functionality
- Internet connectivity problems affecting access
- Mobile device limitations and compatibility issues

5. REGULATORY AND COMPLIANCE RISKS
Legal and regulatory considerations:
- Changing cryptocurrency regulations and compliance requirements
- Jurisdictional differences in legal treatment
- Tax implications and reporting obligations
- Anti-money laundering and know-your-customer requirements
- Potential restrictions on cryptocurrency activities

6. EDUCATIONAL OBJECTIVES AND LIMITATIONS
This platform aims to educate users about:
- Cryptocurrency market dynamics and trading principles
- Risk management strategies and portfolio diversification
- Technical analysis and fundamental research methods
- Market psychology and behavioral finance concepts
- However, simulation cannot replicate all aspects of real trading

7. NO INVESTMENT ADVICE DISCLAIMER
Important disclaimers regarding our services:
- BITPANDA PRO does not provide investment, financial, or legal advice
- All educational content is for informational purposes only
- Users should seek professional advice before making real investments
- Platform content should not be considered as recommendations
- Individual financial circumstances and risk tolerance must be considered

8. RISK MANAGEMENT EDUCATION
We encourage users to learn about:
- Diversification strategies to manage portfolio risk
- Position sizing and capital allocation principles
- Stop-loss and risk management techniques
- Market research and analysis methodologies
- Emotional discipline and trading psychology

9. REAL TRADING CONSIDERATIONS
Before engaging in real cryptocurrency trading, consider:
- Starting with small amounts you can afford to lose
- Developing a clear trading strategy and risk management plan
- Understanding all fees, costs, and tax implications
- Using only regulated and reputable trading platforms
- Continuing education and staying informed about market developments

10. ACKNOWLEDGMENT OF UNDERSTANDING
By accepting this risk disclosure, you acknowledge:
- You understand the educational nature of this simulation
- You recognize the limitations and risks described above
- You will not rely solely on simulation results for real trading decisions
- You understand the importance of professional advice for real investments
- You accept responsibility for your educational journey and any future trading decisions
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            <span>📋 User Agreement</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            User Agreement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Please read and accept our comprehensive user agreement to use BITPANDA PRO services.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Trading Simulation Platform</span>
            </div>
            <p className="text-amber-700 mt-2">
              This agreement governs your use of our cryptocurrency trading simulation platform. 
              No real money or cryptocurrency is involved.
            </p>
          </div>
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
                  className={`h-2 rounded-full transition-colors duration-200 ${
                    accepted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
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
            Download Agreement
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
                By accepting these terms, you acknowledge that you understand the educational nature of this platform
                and that you are legally bound by these agreements. These terms may be updated periodically with advance notice.
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