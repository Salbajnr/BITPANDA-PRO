
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  PiggyBank,
  Clock,
  Repeat,
  Shield,
  Calculator,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Settings
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const savingsPlans = [
  {
    id: "conservative",
    name: "Conservative Growth",
    description: "Low-risk portfolio focused on stability and consistent returns",
    expectedReturn: "4-6%",
    riskLevel: "Low",
    minInvestment: 25,
    composition: [
      { type: "Bonds", percentage: 60, color: "bg-blue-500" },
      { type: "Dividend ETFs", percentage: 30, color: "bg-green-500" },
      { type: "Cash", percentage: 10, color: "bg-gray-500" }
    ],
    features: ["Capital protection", "Steady income", "Low volatility"]
  },
  {
    id: "balanced",
    name: "Balanced Portfolio",
    description: "Diversified mix of growth and income investments",
    expectedReturn: "6-8%",
    riskLevel: "Medium",
    minInvestment: 50,
    composition: [
      { type: "Stocks", percentage: 60, color: "bg-green-500" },
      { type: "Bonds", percentage: 30, color: "bg-blue-500" },
      { type: "Commodities", percentage: 10, color: "bg-yellow-500" }
    ],
    features: ["Balanced risk-return", "Diversification", "Regular rebalancing"]
  },
  {
    id: "growth",
    name: "Growth Focus",
    description: "High-growth potential with higher risk tolerance",
    expectedReturn: "8-12%",
    riskLevel: "High",
    minInvestment: 100,
    composition: [
      { type: "Growth Stocks", percentage: 70, color: "bg-green-600" },
      { type: "Tech ETFs", percentage: 20, color: "bg-purple-500" },
      { type: "Emerging Markets", percentage: 10, color: "bg-orange-500" }
    ],
    features: ["High growth potential", "Long-term wealth building", "Active management"]
  },
  {
    id: "crypto",
    name: "Crypto Allocation",
    description: "Modern portfolio with cryptocurrency exposure",
    expectedReturn: "10-15%",
    riskLevel: "Very High",
    minInvestment: 25,
    composition: [
      { type: "Bitcoin", percentage: 40, color: "bg-orange-500" },
      { type: "Ethereum", percentage: 30, color: "bg-blue-600" },
      { type: "Crypto Indices", percentage: 30, color: "bg-purple-600" }
    ],
    features: ["Crypto diversification", "High volatility", "Digital assets"]
  }
];

const goals = [
  {
    icon: <PiggyBank className="w-8 h-8" />,
    title: "Emergency Fund",
    description: "Build a financial safety net for unexpected expenses",
    target: "3-6 months expenses",
    timeframe: "1-2 years"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Retirement",
    description: "Long-term wealth building for financial independence",
    target: "€500,000+",
    timeframe: "20-40 years"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "House Down Payment",
    description: "Save for your dream home purchase",
    target: "€50,000-200,000",
    timeframe: "5-10 years"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Wealth Building",
    description: "General investment for long-term growth",
    target: "Flexible",
    timeframe: "10+ years"
  }
];

export default function SavingsPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(savingsPlans[1]);
  const [monthlyAmount, setMonthlyAmount] = useState(100);
  const [timeHorizon, setTimeHorizon] = useState(10);

  const calculateProjection = () => {
    const expectedReturnLow = parseFloat(selectedPlan.expectedReturn.split('-')[0]) / 100;
    const monthlyContribution = monthlyAmount;
    const years = timeHorizon;
    const months = years * 12;
    
    // Future value of annuity formula
    const futureValue = monthlyContribution * (((1 + expectedReturnLow/12) ** months - 1) / (expectedReturnLow/12));
    const totalContributions = monthlyContribution * months;
    const totalGains = futureValue - totalContributions;
    
    return {
      futureValue: Math.round(futureValue),
      totalContributions: Math.round(totalContributions),
      totalGains: Math.round(totalGains)
    };
  };

  const projection = calculateProjection();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Repeat className="w-4 h-4" />
              <span>💰 Automated investing from €25/month</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Savings Plans
              <span className="text-green-600 block mt-2">Automated investing made simple</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Build wealth automatically with our savings plans. Set your goals, choose your strategy, and let our algorithms do the work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4">
                Start saving now
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-4">
                Calculate returns
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Plan Your Savings</h2>
            <p className="text-lg text-gray-600">See how your money can grow with compound interest</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Input */}
            <div>
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span>Savings Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Investment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      <Input
                        type="number"
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                        className="pl-8"
                        min="25"
                        step="25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Horizon (Years)
                    </label>
                    <Input
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Number(e.target.value))}
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Strategy
                    </label>
                    <select 
                      value={selectedPlan.id}
                      onChange={(e) => setSelectedPlan(savingsPlans.find(p => p.id === e.target.value) || savingsPlans[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {savingsPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} ({plan.expectedReturn} expected return)
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projection Results */}
            <div>
              <Card className="border border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Your Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      €{projection.futureValue.toLocaleString()}
                    </div>
                    <p className="text-gray-600">Estimated value after {timeHorizon} years</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-900">
                        €{projection.totalContributions.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Total invested</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-green-600">
                        €{projection.totalGains.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Potential gains</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress visualization</span>
                      <span>{Math.round((projection.totalGains / projection.futureValue) * 100)}% growth</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(projection.totalContributions / projection.futureValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-6">
                    Start This Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Plans */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Strategy</h2>
            <p className="text-lg text-gray-600">Professional portfolios tailored to your risk tolerance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {savingsPlans.map((plan) => (
              <Card key={plan.id} className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                selectedPlan.id === plan.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`} onClick={() => setSelectedPlan(plan)}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xl font-bold text-green-600">{plan.expectedReturn}</div>
                        <div className="text-xs text-gray-500">Expected return</div>
                      </div>
                      <Badge variant={plan.riskLevel === 'Low' ? 'secondary' : plan.riskLevel === 'Medium' ? 'default' : 'destructive'}>
                        {plan.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* Portfolio Composition */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Portfolio Mix</div>
                    <div className="space-y-2">
                      {plan.composition.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-gray-600">{item.type}</span>
                          </div>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">From €{plan.minInvestment}/month</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What are you saving for?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose a goal that matches your timeline and risk tolerance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-300 transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                      <p className="text-gray-600 mb-4">{goal.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Target Amount</div>
                          <div className="font-semibold text-gray-900">{goal.target}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Timeframe</div>
                          <div className="font-semibold text-gray-900">{goal.timeframe}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why choose our savings plans?</h2>
            <p className="text-xl text-gray-600">Automated investing with professional management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Repeat className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Investing</h3>
              <p className="text-gray-600">Set it and forget it. Your investments happen automatically every month</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Management</h3>
              <p className="text-gray-600">Expert portfolio management and automatic rebalancing</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Low Fees</h3>
              <p className="text-gray-600">Transparent, low-cost investing with no hidden fees</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Start building wealth today</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join thousands of investors who are building wealth with our automated savings plans.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4">
              Start investing
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-12 py-4">
              Schedule consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
