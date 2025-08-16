
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { 
  DollarSign, 
  Plus, 
  Minus, 
  Edit3, 
  History, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  walletBalance: string;
  portfolio?: {
    id: string;
    totalValue: string;
    availableCash: string;
  };
}

interface BalanceAdjustment {
  id: string;
  adminId: string;
  targetUserId: string;
  adjustmentType: 'add' | 'remove' | 'set';
  amount: string;
  currency: string;
  reason?: string;
  createdAt: string;
}

export default function AdminBalanceManipulator() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('manipulate');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users with portfolios
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('/api/admin/users'),
    retry: 1,
  });

  // Fetch balance adjustments history
  const { data: adjustments = [], isLoading: adjustmentsLoading } = useQuery({
    queryKey: ['/api/admin/balance-adjustments'],
    queryFn: () => apiRequest('/api/admin/balance-adjustments'),
    retry: 1,
  });

  const selectedUser = users.find((u: User) => u.id === selectedUserId);
  const filteredUsers = users.filter((u: User) => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Balance adjustment mutation
  const balanceAdjustmentMutation = useMutation({
    mutationFn: async (adjustmentData: any) => {
      return await apiRequest('/api/admin/balance-adjustment', {
        method: 'POST',
        body: JSON.stringify(adjustmentData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Balance Adjustment Successful",
        description: `User balance has been ${adjustmentType === 'add' ? 'increased' : adjustmentType === 'remove' ? 'decreased' : 'set'} successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/balance-adjustments'] });
      // Reset form
      setAmount('');
      setReason('');
      setSelectedUserId('');
    },
    onError: (error: any) => {
      toast({
        title: "Adjustment Failed",
        description: error.message || "Unable to adjust user balance. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Bulk balance adjustment mutation
  const bulkAdjustmentMutation = useMutation({
    mutationFn: async (bulkData: any) => {
      const promises = bulkData.userIds.map((userId: string) =>
        apiRequest('/api/admin/balance-adjustment', {
          method: 'POST',
          body: JSON.stringify({
            targetUserId: userId,
            adjustmentType: bulkData.adjustmentType,
            amount: bulkData.amount,
            currency: bulkData.currency,
            reason: bulkData.reason,
          }),
        })
      );
      return await Promise.all(promises);
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Bulk Adjustment Successful",
        description: `${variables.userIds.length} user balances have been adjusted successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/balance-adjustments'] });
    },
  });

  const handleBalanceAdjustment = () => {
    if (!selectedUserId || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select a user and enter an amount.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    balanceAdjustmentMutation.mutate({
      targetUserId: selectedUserId,
      adjustmentType,
      amount,
      currency,
      reason: reason || `${adjustmentType.charAt(0).toUpperCase() + adjustmentType.slice(1)} balance adjustment`,
    });
  };

  const getAdjustmentTypeColor = (type: string) => {
    switch (type) {
      case 'add': return 'bg-green-100 text-green-800 border-green-200';
      case 'remove': return 'bg-red-100 text-red-800 border-red-200';
      case 'set': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(num);
    }
    return `${num.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-orange-800">Admin Balance Manipulator</CardTitle>
              <CardDescription className="text-orange-600">
                Manage user balances with precision and full audit trails
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manipulate" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Manipulate
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Bulk Actions
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Individual Balance Manipulation */}
        <TabsContent value="manipulate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Balance Adjustment</CardTitle>
              <CardDescription>
                Adjust a specific user's balance with detailed tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Search and Selection */}
              <div className="space-y-2">
                <Label htmlFor="userSearch">Search & Select User</Label>
                <Input
                  id="userSearch"
                  placeholder="Search by username, email, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to adjust balance" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredUsers.map((user: User) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium">{user.username}</span>
                            <span className="text-sm text-gray-500 ml-2">{user.email}</span>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {formatAmount(user.portfolio?.totalValue || '0', 'USD')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected User Info */}
              {selectedUser && (
                <Alert className="bg-blue-50 border-blue-200">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="font-medium text-blue-800">
                      {selectedUser.firstName} {selectedUser.lastName} (@{selectedUser.username})
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Current Balance: {formatAmount(selectedUser.portfolio?.totalValue || '0', 'USD')} |
                      Available Cash: {formatAmount(selectedUser.portfolio?.availableCash || '0', 'USD')}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              {/* Adjustment Type */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'add' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('add')}
                  className={`flex items-center gap-2 ${adjustmentType === 'add' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <Plus className="h-4 w-4" />
                  Add Funds
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('remove')}
                  className={`flex items-center gap-2 ${adjustmentType === 'remove' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                >
                  <Minus className="h-4 w-4" />
                  Remove Funds
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'set' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('set')}
                  className={`flex items-center gap-2 ${adjustmentType === 'set' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <Edit3 className="h-4 w-4" />
                  Set Balance
                </Button>
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for this balance adjustment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={handleBalanceAdjustment}
                disabled={balanceAdjustmentMutation.isPending || !selectedUserId || !amount}
                className={`w-full py-3 font-medium transition-colors ${
                  adjustmentType === 'add'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : adjustmentType === 'remove'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {balanceAdjustmentMutation.isPending ? 'Processing...' : 
                 adjustmentType === 'add' ? `Add ${amount ? formatAmount(amount, currency) : 'Funds'}` :
                 adjustmentType === 'remove' ? `Remove ${amount ? formatAmount(amount, currency) : 'Funds'}` :
                 `Set Balance to ${amount ? formatAmount(amount, currency) : '0'}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Actions */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Balance Operations</CardTitle>
              <CardDescription>
                Apply balance adjustments to multiple users simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Bulk operations affect multiple users. Please ensure you've reviewed the selection carefully.
                </AlertDescription>
              </Alert>
              <div className="text-center py-8 text-gray-500">
                Bulk operations feature coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance Adjustment History</CardTitle>
              <CardDescription>
                View all past balance manipulations with full audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adjustmentsLoading ? (
                <div className="text-center py-8">Loading adjustment history...</div>
              ) : adjustments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No balance adjustments found
                </div>
              ) : (
                <div className="space-y-3">
                  {adjustments.map((adjustment: BalanceAdjustment) => {
                    const user = users.find((u: User) => u.id === adjustment.targetUserId);
                    return (
                      <div key={adjustment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <Badge className={getAdjustmentTypeColor(adjustment.adjustmentType)}>
                            {adjustment.adjustmentType.toUpperCase()}
                          </Badge>
                          <div>
                            <div className="font-medium">
                              {user ? `${user.firstName} ${user.lastName} (@${user.username})` : 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {adjustment.reason || 'No reason provided'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatAmount(adjustment.amount, adjustment.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(adjustment.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
