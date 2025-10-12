
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  PiggyBank, Calendar, TrendingUp, DollarSign, Target, 
  Plus, Pause, Play, Settings, ArrowRight, CheckCircle,
  Clock, Repeat, Zap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface SavingsPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  interestRate: number;
  compounding: 'monthly' | 'quarterly' | 'annually';
  minDuration: number;
  maxDuration: number;
  category: string;
  features: string[];
  isActive: boolean;
}

interface UserSavingsPlan {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  frequency: string;
  nextDeposit: string;
  startDate: string;
  endDate: string;
  totalSaved: number;
  interestEarned: number;
  status: 'active' | 'paused' | 'completed';
  autoDeposit: boolean;
}

export default function SavingsPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
  const [planConfig, setPlanConfig] = useState({
    amount: '',
    frequency: 'monthly',
    duration: '12',
    autoDeposit: true
  });
  const [activeTab, setActiveTab] = useState('available');

  // Fetch available savings plans
  const { data: savingsPlans = [], isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['/api/savings-plans'],
    queryFn: async () => {
      const response = await fetch('/api/savings-plans', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch savings plans');
      return response.json();
    },
    retry: 3,
    staleTime: 30000
  });

  // Fetch user's savings plans
  const { data: userSavings = [], isLoading: savingsLoading } = useQuery({
    queryKey: ['/api/savings-plans/my-plans'],
    queryFn: async () => {
      const response = await fetch('/api/savings-plans/my-plans', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user savings');
      return response.json();
    },
    enabled: !!user
  });

  // Create savings plan mutation
  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/savings-plans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create savings plan');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Savings Plan Created",
        description: "Your savings plan has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/savings-plans/my-plans'] });
      setSelectedPlan(null);
      setPlanConfig({ amount: '', frequency: 'monthly', duration: '12', autoDeposit: true });
    },
    onError: (error: any) => {
      toast({
        title: "Plan Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle plan status mutation
  const togglePlanMutation = useMutation({
    mutationFn: async ({ planId, action }: { planId: string; action: 'pause' | 'resume' }) => {
      const response = await fetch(`/api/savings-plans/${planId}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to ${action} savings plan`);
      return response.json();
    },
    onSuccess: (_, { action }) => {
      toast({
        title: "Plan Updated",
        description: `Savings plan ${action}d successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/savings-plans/my-plans'] });
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProjectedSavings = (amount: number, frequency: string, duration: number, rate: number) => {
    const monthlyAmount = frequency === 'monthly' ? amount : 
                         frequency === 'weekly' ? amount * 4.33 : 
                         amount * 30.44;
    
    const monthlyRate = rate / 100 / 12;
    const months = duration;
    
    // Compound interest formula for regular deposits
    const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    return futureValue;
  };

  const handleCreatePlan = () => {
    if (!selectedPlan || !planConfig.amount) return;
    
    const amount = parseFloat(planConfig.amount);
    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ${formatCurrency(selectedPlan.minAmount)} and ${formatCurrency(selectedPlan.maxAmount)}`,
        variant: "destructive",
      });
      return;
    }

    createPlanMutation.mutate({
      planId: selectedPlan.id,
      amount,
      frequency: planConfig.frequency,
      duration: parseInt(planConfig.duration),
      autoDeposit: planConfig.autoDeposit
    });
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
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
                Savings Plans
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Build your wealth with automated saving strategies
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="available">Available Plans</TabsTrigger>
                <TabsTrigger value="my-plans">My Savings</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
                {plansError ? (
                  <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                        Failed to Load Savings Plans
                      </h3>
                      <p className="text-red-600 dark:text-red-400 mb-4">
                        {plansError?.message || 'An error occurred while loading savings plans'}
                      </p>
                      <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/savings-plans'] })}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                ) : plansLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-80 animate-pulse">
                        <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                ) : savingsPlans.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PiggyBank className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Savings Plans Available</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Check back later for new savings opportunities.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savingsPlans.map((plan: SavingsPlan) => (
                      <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <PiggyBank className="h-5 w-5" />
                              {plan.name}
                            </CardTitle>
                            <Badge variant="outline">
                              {plan.interestRate}% APY
                            </Badge>
                          </div>
                          <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Min Amount</p>
                              <p className="text-lg font-bold">{formatCurrency(plan.minAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Max Amount</p>
                              <p className="text-lg font-bold">{formatCurrency(plan.maxAmount)}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Frequency</p>
                              <p className="font-medium">{getFrequencyLabel(plan.frequency)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Compounding</p>
                              <p className="font-medium capitalize">{plan.compounding}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                            <p className="font-medium">
                              {plan.minDuration} - {plan.maxDuration} months
                            </p>
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

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="w-full" 
                                onClick={() => setSelectedPlan(plan)}
                              >
                                Start Saving
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Set Up {selectedPlan?.name}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedPlan && (
                                <div className="space-y-4">
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-center">
                                      <p className="text-sm text-slate-600">Interest Rate</p>
                                      <p className="text-2xl font-bold text-green-600">
                                        {selectedPlan.interestRate}% APY
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="amount">Amount per {planConfig.frequency}</Label>
                                    <Input
                                      id="amount"
                                      type="number"
                                      placeholder={`Min. ${formatCurrency(selectedPlan.minAmount)}`}
                                      value={planConfig.amount}
                                      onChange={(e) => setPlanConfig({...planConfig, amount: e.target.value})}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="frequency">Frequency</Label>
                                    <Select 
                                      value={planConfig.frequency} 
                                      onValueChange={(value) => setPlanConfig({...planConfig, frequency: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="duration">Duration (months)</Label>
                                    <Select 
                                      value={planConfig.duration} 
                                      onValueChange={(value) => setPlanConfig({...planConfig, duration: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="6">6 months</SelectItem>
                                        <SelectItem value="12">1 year</SelectItem>
                                        <SelectItem value="24">2 years</SelectItem>
                                        <SelectItem value="36">3 years</SelectItem>
                                        <SelectItem value="60">5 years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="auto-deposit">Auto Deposit</Label>
                                    <Switch
                                      id="auto-deposit"
                                      checked={planConfig.autoDeposit}
                                      onCheckedChange={(checked) => 
                                        setPlanConfig({...planConfig, autoDeposit: checked})
                                      }
                                    />
                                  </div>

                                  {planConfig.amount && parseFloat(planConfig.amount) > 0 && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Projected savings after {planConfig.duration} months:
                                      </p>
                                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {formatCurrency(
                                          calculateProjectedSavings(
                                            parseFloat(planConfig.amount),
                                            planConfig.frequency,
                                            parseInt(planConfig.duration),
                                            selectedPlan.interestRate
                                          )
                                        )}
                                      </p>
                                    </div>
                                  )}

                                  <Button
                                    onClick={handleCreatePlan}
                                    disabled={createPlanMutation.isPending || !planConfig.amount}
                                    className="w-full"
                                  >
                                    {createPlanMutation.isPending ? 'Creating...' : 'Create Savings Plan'}
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

              <TabsContent value="my-plans" className="space-y-6">
                {savingsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="h-32 animate-pulse">
                        <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                ) : userSavings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <PiggyBank className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">No Savings Plans Yet</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Start your savings journey with our automated plans.
                      </p>
                      <Button onClick={() => setActiveTab('available')}>
                        Browse Savings Plans
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {userSavings.map((saving: UserSavingsPlan) => (
                      <Card key={saving.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <PiggyBank className="h-5 w-5" />
                                {saving.planName}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Started {new Date(saving.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={saving.status === 'active' ? 'default' : 'secondary'}>
                                {saving.status.toUpperCase()}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePlanMutation.mutate({
                                  planId: saving.id,
                                  action: saving.status === 'active' ? 'pause' : 'resume'
                                })}
                                disabled={togglePlanMutation.isPending}
                              >
                                {saving.status === 'active' ? 
                                  <Pause className="h-4 w-4" /> : 
                                  <Play className="h-4 w-4" />
                                }
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {getFrequencyLabel(saving.frequency)} Amount
                              </p>
                              <p className="text-lg font-bold">{formatCurrency(saving.amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Total Saved</p>
                              <p className="text-lg font-bold">{formatCurrency(saving.totalSaved)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Interest Earned</p>
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(saving.interestEarned)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Next Deposit</p>
                              <p className="text-lg font-bold">
                                {new Date(saving.nextDeposit).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Repeat className="h-4 w-4" />
                              <span>Auto Deposit: {saving.autoDeposit ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Ends: {new Date(saving.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="statistics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          userSavings.reduce((sum: number, saving: UserSavingsPlan) => 
                            sum + saving.totalSaved, 0
                          )
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          userSavings.reduce((sum: number, saving: UserSavingsPlan) => 
                            sum + saving.interestEarned, 0
                          )
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {userSavings.filter((saving: UserSavingsPlan) => 
                          saving.status === 'active'
                        ).length}
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
