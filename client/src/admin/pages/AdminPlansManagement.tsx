
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiRequest } from '@/admin/lib/adminApiClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, TrendingUp, PiggyBank, DollarSign, Users } from 'lucide-react';

export default function AdminPlansManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('investment-templates');
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch investment plan templates
  const { data: investmentTemplates = [] } = useQuery({
    queryKey: ['/admin/plans/investment-plans/templates'],
    queryFn: () => adminApiRequest('GET', '/plans/investment-plans/templates'),
  });

  // Fetch savings plan templates
  const { data: savingsTemplates = [] } = useQuery({
    queryKey: ['/admin/plans/savings-plans/templates'],
    queryFn: () => adminApiRequest('GET', '/plans/savings-plans/templates'),
  });

  // Fetch user investment plans
  const { data: userInvestmentPlans = [] } = useQuery({
    queryKey: ['/admin/plans/investment-plans/users'],
    queryFn: () => adminApiRequest('GET', '/plans/investment-plans/users'),
  });

  // Fetch user savings plans
  const { data: userSavingsPlans = [] } = useQuery({
    queryKey: ['/admin/plans/savings-plans/users'],
    queryFn: () => adminApiRequest('GET', '/plans/savings-plans/users'),
  });

  // Create/Update investment plan mutation
  const saveInvestmentPlanMutation = useMutation({
    mutationFn: (data: any) => {
      if (data.id && editingPlan) {
        return adminApiRequest('PUT', `/plans/investment-plans/templates/${data.id}`, data);
      }
      return adminApiRequest('POST', '/plans/investment-plans/templates', data);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Investment plan saved successfully' });
      queryClient.invalidateQueries({ queryKey: ['/admin/plans/investment-plans/templates'] });
      setIsDialogOpen(false);
      setEditingPlan(null);
    },
  });

  // Create/Update savings plan mutation
  const saveSavingsPlanMutation = useMutation({
    mutationFn: (data: any) => {
      if (data.id && editingPlan) {
        return adminApiRequest('PUT', `/plans/savings-plans/templates/${data.id}`, data);
      }
      return adminApiRequest('POST', '/plans/savings-plans/templates', data);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Savings plan saved successfully' });
      queryClient.invalidateQueries({ queryKey: ['/admin/plans/savings-plans/templates'] });
      setIsDialogOpen(false);
      setEditingPlan(null);
    },
  });

  // Update user investment returns mutation
  const updateReturnsM = useMutation({
    mutationFn: ({ planId, data }: any) => 
      adminApiRequest('PUT', `/plans/investment-plans/users/${planId}/returns`, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Returns updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/admin/plans/investment-plans/users'] });
    },
  });

  // Update user savings interest mutation
  const updateInterestMutation = useMutation({
    mutationFn: ({ planId, data }: any) => 
      adminApiRequest('PUT', `/plans/savings-plans/users/${planId}/interest`, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Interest updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/admin/plans/savings-plans/users'] });
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plans Management</h1>
          <p className="text-slate-600">Manage investment and savings plans</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="investment-templates">Investment Templates</TabsTrigger>
          <TabsTrigger value="savings-templates">Savings Templates</TabsTrigger>
          <TabsTrigger value="user-investments">User Investments</TabsTrigger>
          <TabsTrigger value="user-savings">User Savings</TabsTrigger>
        </TabsList>

        {/* Investment Templates */}
        <TabsContent value="investment-templates" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPlan(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Investment Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Edit' : 'Create'} Investment Plan
                  </DialogTitle>
                </DialogHeader>
                <InvestmentPlanForm 
                  plan={editingPlan}
                  onSubmit={(data) => saveInvestmentPlanMutation.mutate(data)}
                  isPending={saveInvestmentPlanMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentTemplates.map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Min Investment:</span>
                      <span className="font-semibold">${plan.minInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return:</span>
                      <span className="font-semibold text-green-600">{plan.expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">{plan.duration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <Badge variant="outline">{plan.riskLevel}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Savings Templates */}
        <TabsContent value="savings-templates" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditingPlan(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Savings Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsTemplates.map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount Range:</span>
                      <span className="font-semibold">${plan.minAmount} - ${plan.maxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-semibold text-green-600">{plan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="font-semibold capitalize">{plan.frequency}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Investments */}
        <TabsContent value="user-investments" className="space-y-4">
          <div className="space-y-4">
            {userInvestmentPlans.map((plan: any) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{plan.planName}</h3>
                      <p className="text-sm text-slate-500">User ID: {plan.userId}</p>
                    </div>
                    <Badge>{plan.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Invested Amount</p>
                      <p className="font-semibold">${parseFloat(plan.amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Value</p>
                      <Input 
                        type="number"
                        defaultValue={plan.currentValue}
                        onBlur={(e) => {
                          const currentValue = parseFloat(e.target.value);
                          const invested = parseFloat(plan.amount);
                          const actualReturn = ((currentValue - invested) / invested * 100).toFixed(2);
                          updateReturnsM.mutate({ 
                            planId: plan.id, 
                            data: { currentValue: currentValue.toString(), actualReturn }
                          });
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Actual Return</p>
                      <p className="font-semibold text-green-600">{plan.actualReturn}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Savings */}
        <TabsContent value="user-savings" className="space-y-4">
          <div className="space-y-4">
            {userSavingsPlans.map((plan: any) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{plan.planName}</h3>
                      <p className="text-sm text-slate-500">User ID: {plan.userId}</p>
                    </div>
                    <Badge>{plan.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Amount per Period</p>
                      <p className="font-semibold">${parseFloat(plan.amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Saved</p>
                      <Input 
                        type="number"
                        defaultValue={plan.totalSaved}
                        onBlur={(e) => {
                          updateInterestMutation.mutate({ 
                            planId: plan.id, 
                            data: { 
                              totalSaved: e.target.value,
                              interestEarned: plan.interestEarned
                            }
                          });
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Interest Earned</p>
                      <Input 
                        type="number"
                        defaultValue={plan.interestEarned}
                        onBlur={(e) => {
                          updateInterestMutation.mutate({ 
                            planId: plan.id, 
                            data: { 
                              totalSaved: plan.totalSaved,
                              interestEarned: e.target.value
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InvestmentPlanForm({ plan, onSubmit, isPending }: any) {
  const [formData, setFormData] = useState(plan || {
    name: '',
    description: '',
    minInvestment: 100,
    expectedReturn: 10,
    duration: 12,
    riskLevel: 'medium',
    category: '',
    features: [],
    isActive: true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div>
        <Label>Plan Name</Label>
        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Investment ($)</Label>
          <Input type="number" value={formData.minInvestment} onChange={(e) => setFormData({...formData, minInvestment: parseFloat(e.target.value)})} />
        </div>
        <div>
          <Label>Expected Return (%)</Label>
          <Input type="number" step="0.1" value={formData.expectedReturn} onChange={(e) => setFormData({...formData, expectedReturn: parseFloat(e.target.value)})} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Duration (months)</Label>
          <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} />
        </div>
        <div>
          <Label>Risk Level</Label>
          <Select value={formData.riskLevel} onValueChange={(v) => setFormData({...formData, riskLevel: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({...formData, isActive: c})} />
        <Label>Active</Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving...' : 'Save Plan'}
      </Button>
    </form>
  );
}
