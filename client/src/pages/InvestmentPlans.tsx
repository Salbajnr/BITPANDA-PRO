
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, DollarSign, Calendar, Target, PieChart, 
  ArrowRight, CheckCircle, Star, Shield, Zap, Globe 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  expectedReturn: number;
  duration: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
  features: string[];
  isActive: boolean;
  totalInvested: number;
  totalInvestors: number;
}

interface UserInvestment {
  id: string;
  planId: string;
  planName: string;
  investedAmount: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  expectedReturn: number;
  actualReturn: number;
}

export default function InvestmentPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  // Fetch available investment plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/investment-plans'],
    queryFn: async () => {
      const response = await fetch('/api/investment-plans', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch investment plans');
      return response.json();
    }
  });

  // Fetch user's investments
  const { data: userInvestments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ['/api/investment-plans/my-investments'],
    queryFn: async () => {
      const response = await fetch('/api/investment-plans/my-investments', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user investments');
      return response.json();
    },
    enabled: !!user
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async (data: { planId: string; amount: number }) => {
      const response = await fetch('/api/investment-plans/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Investment failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your investment has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/investment-plans/my-investments'] });
      setSelectedPlan(null);
      setInvestmentAmount('');
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const handleInvest = () => {
    if (!selectedPlan || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (amount < selectedPlan.minInvestment) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is ${formatCurrency(selectedPlan.minInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({ planId: selectedPlan.id, amount });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Investment Plans
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Diversify your portfolio with our curated investment opportunities
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="available">Available Plans</TabsTrigger>
                <TabsTrigger value="my-investments">My Investments</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
                {plansLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-80 animate-pulse">
                        <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan: InvestmentPlan) => (
                      <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <Badge className={getRiskColor(plan.riskLevel)}>
                              {plan.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                          <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Expected Return</p>
                              <p className="text-lg font-bold text-green-600">{plan.expectedReturn}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                              <p className="text-lg font-bold">{plan.duration} months</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Min. Investment</p>
                            <p className="text-lg font-bold">{formatCurrency(plan.minInvestment)}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">Features:</p>
                            <ul className="text-xs space-y-1">
                              {plan.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(plan.totalInvested)} invested
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {plan.totalInvestors} investors
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="w-full" 
                                onClick={() => setSelectedPlan(plan)}
                              >
                                Invest Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Invest in {selectedPlan?.name}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedPlan && (
                                <div className="space-y-4">
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-slate-600">Expected Return:</span>
                                        <span className="font-bold text-green-600 ml-2">
                                          {selectedPlan.expectedReturn}%
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-600">Duration:</span>
                                        <span className="font-bold ml-2">
                                          {selectedPlan.duration} months
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="investment-amount">Investment Amount</Label>
                                    <Input
                                      id="investment-amount"
                                      type="number"
                                      placeholder={`Min. ${formatCurrency(selectedPlan.minInvestment)}`}
                                      value={investmentAmount}
                                      onChange={(e) => setInvestmentAmount(e.target.value)}
                                    />
                                  </div>

                                  {investmentAmount && parseFloat(investmentAmount) > 0 && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Expected value after {selectedPlan.duration} months:
                                      </p>
                                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {formatCurrency(
                                          parseFloat(investmentAmount) * (1 + selectedPlan.expectedReturn / 100)
                                        )}
                                      </p>
                                    </div>
                                  )}

                                  <Button
                                    onClick={handleInvest}
                                    disabled={investMutation.isPending || !investmentAmount}
                                    className="w-full"
                                  >
                                    {investMutation.isPending ? 'Processing...' : 'Confirm Investment'}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-investments" className="space-y-6">
                {investmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="h-32 animate-pulse">
                        <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                ) : userInvestments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Start your investment journey by choosing from our available plans.
                      </p>
                      <Button onClick={() => setActiveTab('available')}>
                        Browse Investment Plans
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {userInvestments.map((investment: UserInvestment) => (
                      <Card key={investment.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{investment.planName}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Started {new Date(investment.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                              {investment.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Invested</p>
                              <p className="text-lg font-bold">{formatCurrency(investment.investedAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Current Value</p>
                              <p className="text-lg font-bold">{formatCurrency(investment.currentValue)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Expected Return</p>
                              <p className="text-lg font-bold text-green-600">
                                {investment.expectedReturn.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Actual Return</p>
                              <p className={`text-lg font-bold ${
                                investment.actualReturn >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {investment.actualReturn.toFixed(2)}%
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {new Date(investment.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <Progress 
                              value={calculateProgress(investment.startDate, investment.endDate)} 
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          userInvestments.reduce((sum: number, inv: UserInvestment) => 
                            sum + inv.investedAmount, 0
                          )
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          userInvestments.reduce((sum: number, inv: UserInvestment) => 
                            sum + inv.currentValue, 0
                          )
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {((userInvestments.reduce((sum: number, inv: UserInvestment) => 
                          sum + inv.currentValue, 0
                        ) / Math.max(userInvestments.reduce((sum: number, inv: UserInvestment) => 
                          sum + inv.investedAmount, 0
                        ), 1) - 1) * 100).toFixed(2)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentPlan {
  id: number;
  name: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  expectedReturn: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export default function InvestmentPlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery<InvestmentPlan[]>({
    queryKey: ['/api/investment-plans'],
  });

  const investMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch('/api/investment-plans/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, amount: '1000' }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Investment failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Investment plan activated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/investment-plans'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to activate investment plan',
        variant: 'destructive',
      });
    },
  });

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Investment Plans</h1>
          <p className="text-muted-foreground">Grow your wealth with our curated investment options</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted" />
                <CardContent className="h-48 bg-muted/50" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <Badge variant={getRiskBadgeVariant(plan.riskLevel)}>
                      {plan.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">${plan.minAmount} - ${plan.maxAmount}</div>
                        <div className="text-muted-foreground">Investment Range</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div className="text-sm">
                        <div className="font-medium">{plan.expectedReturn}%</div>
                        <div className="text-muted-foreground">Expected Return</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">{plan.duration}</div>
                        <div className="text-muted-foreground">Duration</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">Secured</div>
                        <div className="text-muted-foreground">Protected</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => investMutation.mutate(plan.id)}
                    disabled={!plan.isActive || investMutation.isPending}
                  >
                    {investMutation.isPending ? 'Processing...' : 'Invest Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
