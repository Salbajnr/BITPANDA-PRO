
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  Calendar,
  DollarSign,
  PiggyBank,
  Target,
  Repeat,
  Clock,
  BarChart3,
  CheckCircle,
  Plus
} from "lucide-react";
import Navbar from "@/components/Navbar";

const savingsPlans = [
  {
    id: 1,
    name: "Bitcoin Dollar-Cost Averaging",
    asset: "Bitcoin",
    symbol: "BTC",
    amount: 50,
    frequency: "Weekly",
    status: "Active",
    totalInvested: 2400,
    currentValue: 2856,
    nextExecution: "2025-01-22"
  },
  {
    id: 2,
    name: "World ETF Plan",
    asset: "MSCI World ETF",
    symbol: "IWDA",
    amount: 200,
    frequency: "Monthly",
    status: "Active",
    totalInvested: 2400,
    currentValue: 2654,
    nextExecution: "2025-02-01"
  },
  {
    id: 3,
    name: "Gold Accumulation",
    asset: "Gold",
    symbol: "XAU",
    amount: 100,
    frequency: "Monthly",
    status: "Paused",
    totalInvested: 800,
    currentValue: 845,
    nextExecution: "Paused"
  }
];

const popularAssets = [
  { name: "Bitcoin", symbol: "BTC", type: "Crypto", minAmount: 1 },
  { name: "Ethereum", symbol: "ETH", type: "Crypto", minAmount: 1 },
  { name: "MSCI World ETF", symbol: "IWDA", type: "ETF", minAmount: 5 },
  { name: "S&P 500 ETF", symbol: "SPY", type: "ETF", minAmount: 5 },
  { name: "Gold", symbol: "XAU", type: "Metal", minAmount: 10 },
  { name: "Apple", symbol: "AAPL", type: "Stock", minAmount: 1 }
];

const frequencies = ["Weekly", "Bi-weekly", "Monthly", "Quarterly"];

export default function SavingsPlans() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const totalInvested = savingsPlans.reduce((sum, plan) => sum + plan.totalInvested, 0);
  const totalValue = savingsPlans.reduce((sum, plan) => sum + plan.currentValue, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = ((totalGain / totalInvested) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Savings Plans</h1>
          <p className="text-xl text-gray-600">
            Automate your investments with recurring purchases
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalInvested.toLocaleString()}</p>
                </div>
                <PiggyBank className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalValue.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Gain/Loss</p>
                  <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    €{totalGain.toLocaleString()}
                  </p>
                  <p className={`text-sm ${totalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {totalGain >= 0 ? '+' : ''}{totalGainPercent}%
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {savingsPlans.filter(plan => plan.status === 'Active').length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Savings Plans</h2>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Savings Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                  <select 
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select an asset</option>
                    {popularAssets.map(asset => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.name} ({asset.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (€)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Create Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Savings Plans List */}
        <div className="space-y-4 mb-8">
          {savingsPlans.map((plan) => (
            <Card key={plan.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <PiggyBank className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">{plan.asset} ({plan.symbol})</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center lg:text-left">
                    <p className="text-sm text-gray-600">Amount & Frequency</p>
                    <p className="font-semibold text-gray-900">€{plan.amount} {plan.frequency}</p>
                  </div>

                  <div className="text-center lg:text-left">
                    <p className="text-sm text-gray-600">Total Invested</p>
                    <p className="font-semibold text-gray-900">€{plan.totalInvested.toLocaleString()}</p>
                  </div>

                  <div className="text-center lg:text-left">
                    <p className="text-sm text-gray-600">Current Value</p>
                    <p className="font-semibold text-gray-900">€{plan.currentValue.toLocaleString()}</p>
                    <div className={`text-sm ${plan.currentValue >= plan.totalInvested ? 'text-green-600' : 'text-red-500'}`}>
                      {plan.currentValue >= plan.totalInvested ? '+' : ''}
                      {(((plan.currentValue - plan.totalInvested) / plan.totalInvested) * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-3">
                    <div className="text-right">
                      <Badge 
                        variant={plan.status === 'Active' ? 'default' : 'secondary'}
                        className={plan.status === 'Active' ? 'bg-green-500' : ''}
                      >
                        {plan.status}
                      </Badge>
                      {plan.status === 'Active' && (
                        <p className="text-xs text-gray-500 mt-1">Next: {plan.nextExecution}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why use Savings Plans?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Dollar-Cost Averaging</h4>
              <p className="text-gray-600">Reduce the impact of market volatility by investing regularly over time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Automated Investing</h4>
              <p className="text-gray-600">Set it and forget it - your investments happen automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Disciplined Approach</h4>
              <p className="text-gray-600">Build wealth systematically without emotional market timing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
