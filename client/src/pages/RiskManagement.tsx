import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Target,
  DollarSign,
  Percent,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface RiskMetrics {
  portfolioValue: number;
  dailyVar: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  riskScore: number;
}

interface RiskRule {
  id: string;
  name: string;
  type: 'position_size' | 'stop_loss' | 'daily_loss' | 'concentration';
  value: number;
  isActive: boolean;
  description: string;
}

export default function RiskManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [maxDailyLoss, setMaxDailyLoss] = useState([5]);
  const [maxPositionSize, setMaxPositionSize] = useState([20]);
  const [stopLossPercentage, setStopLossPercentage] = useState([10]);
  const [autoStopLoss, setAutoStopLoss] = useState(true);
  const [autoTakeProfit, setAutoTakeProfit] = useState(false);

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: riskMetrics } = useQuery({
    queryKey: ['/api/risk/metrics'],
    queryFn: async () => {
      const response = await fetch('/api/risk/metrics', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch risk metrics');
      return response.json();
    }
  });

  const { data: riskRules = [] } = useQuery({
    queryKey: ['/api/risk/rules'],
    queryFn: async () => {
      const response = await fetch('/api/risk/rules', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch risk rules');
      return response.json();
    }
  });

  const { data: exposureData = [] } = useQuery({
    queryKey: ['/api/risk/exposure'],
    queryFn: async () => {
      const response = await fetch('/api/risk/exposure', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch exposure data');
      return response.json();
    }
  });

  const updateRiskSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch('/api/risk/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to update risk settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk/rules'] });
    }
  });

  const handleSaveSettings = () => {
    const settings = {
      maxDailyLoss: maxDailyLoss[0],
      maxPositionSize: maxPositionSize[0],
      stopLossPercentage: stopLossPercentage[0],
      autoStopLoss,
      autoTakeProfit
    };
    updateRiskSettingsMutation.mutate(settings);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-green-600';
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Risk Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor and control your portfolio risk exposure
              </p>
            </div>

            {/* Risk Metrics Overview */}
            {riskMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Shield className={`h-8 w-8 mx-auto mb-2 ${getRiskColor(riskMetrics.riskScore)}`} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(riskMetrics.riskScore)}`}>
                        {riskMetrics.riskScore}/100
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Portfolio Value</p>
                      <p className="text-2xl font-bold">${riskMetrics.portfolioValue.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Daily VaR</p>
                      <p className="text-2xl font-bold text-red-600">{riskMetrics.dailyVar.toFixed(2)}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Max Drawdown</p>
                      <p className="text-2xl font-bold text-orange-600">{riskMetrics.maxDrawdown.toFixed(2)}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sharpe Ratio</p>
                      <p className="text-2xl font-bold">{riskMetrics.sharpeRatio.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Volatility</p>
                      <p className="text-2xl font-bold">{riskMetrics.volatility.toFixed(2)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-12 gap-6">
              {/* Risk Settings */}
              <div className="col-span-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Risk Control Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Max Daily Loss */}
                    <div>
                      <Label>Maximum Daily Loss: {maxDailyLoss[0]}%</Label>
                      <Slider
                        value={maxDailyLoss}
                        onValueChange={setMaxDailyLoss}
                        max={20}
                        min={1}
                        step={0.5}
                        className="mt-2"
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Automatically close all positions if daily loss exceeds this percentage
                      </p>
                    </div>

                    {/* Max Position Size */}
                    <div>
                      <Label>Maximum Position Size: {maxPositionSize[0]}%</Label>
                      <Slider
                        value={maxPositionSize}
                        onValueChange={setMaxPositionSize}
                        max={50}
                        min={5}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Maximum percentage of portfolio that can be allocated to a single position
                      </p>
                    </div>

                    {/* Stop Loss Percentage */}
                    <div>
                      <Label>Default Stop Loss: {stopLossPercentage[0]}%</Label>
                      <Slider
                        value={stopLossPercentage}
                        onValueChange={setStopLossPercentage}
                        max={25}
                        min={2}
                        step={0.5}
                        className="mt-2"
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Default stop loss percentage for new positions
                      </p>
                    </div>

                    {/* Auto Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Stop Loss</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Automatically set stop loss on new positions
                          </p>
                        </div>
                        <Switch checked={autoStopLoss} onCheckedChange={setAutoStopLoss} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Take Profit</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Automatically set take profit at 2:1 risk/reward ratio
                          </p>
                        </div>
                        <Switch checked={autoTakeProfit} onCheckedChange={setAutoTakeProfit} />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveSettings}
                      disabled={updateRiskSettingsMutation.isPending}
                      className="w-full"
                    >
                      {updateRiskSettingsMutation.isPending ? 'Saving...' : 'Save Risk Settings'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Exposure */}
              <div className="col-span-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Portfolio Exposure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {exposureData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={exposureData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {exposureData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No exposure data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Active Risk Rules */}
              <div className="col-span-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Active Risk Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {riskRules.length > 0 ? (
                      <div className="space-y-3">
                        {riskRules.map((rule: RiskRule) => (
                          <div key={rule.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              {rule.isActive ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <div>
                                <h4 className="font-medium">{rule.name}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {rule.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={rule.isActive ? "default" : "secondary"}>
                                {rule.value}%
                              </Badge>
                              <Badge variant="outline">
                                {rule.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No risk rules configured</p>
                        <p className="text-sm text-slate-400 mt-2">
                          Configure risk rules to protect your portfolio
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}