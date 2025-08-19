
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
