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
<<<<<<< Updated upstream
import { apiRequest } from '@/lib/api';
=======
import { adminApi, apiRequest } from '@/lib/api';
>>>>>>> Stashed changes
import { 
  DollarSign, 
  Plus, 
  Minus, 
  Edit3, 
  History, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  User as UserIcon,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown
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

interface UserBalance {
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  balance: {
    availableCash: number;
    totalValue: number;
  };
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

  const [searchUserId, setLocalSearchUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserBalance | null>(null);

  // Fetch users with portfolios
<<<<<<< Updated upstream
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('/api/admin/users'),
=======
  const { data: users = [], isLoading: usersLoading } = useQuery<User[], Error>({
    queryKey: ['admin-users'],
    queryFn: async () => {
        const { data, error } = await adminApi.getUsers();
        if (error) {
            throw new Error(String(error))
        }
        return data;
    },
>>>>>>> Stashed changes
    retry: 1,
  });

  // Fetch balance adjustments history
<<<<<<< Updated upstream
  const { data: adjustments = [], isLoading: adjustmentsLoading } = useQuery({
    queryKey: ['/api/admin/balance-adjustments'],
    queryFn: () => apiRequest('/api/admin/balance-adjustments'),
=======
  const { data: adjustments = [], isLoading: adjustmentsLoading } = useQuery<BalanceAdjustment[], Error>({
    queryKey: ['admin-adjustments'],
    queryFn: async () => {
        const { data, error } = await adminApi.getAdjustments();
        if (error) {
            throw new Error(String(error))
        }
        return data;
    },
>>>>>>> Stashed changes
    retry: 1,
  });

  // Search for user balance
  const searchUserMutation = useMutation<UserBalance, Error, string>({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/deposits/admin/user-balance/${userId}`);
    },
    onSuccess: (data) => {
      setSelectedUser(data);
      toast({
        title: "User Found",
        description: `Found user: ${data.user.username}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "User not found or error fetching user data",
        variant: "destructive",
      });
      setSelectedUser(null);
    },
  });

  // Balance manipulation mutation
  const manipulateBalanceMutation = useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      return apiRequest('/api/deposits/admin/manipulate-balance', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Balance updated successfully",
      });
      // Refresh user data
      if (selectedUser) {
        searchUserMutation.mutate(selectedUser.user.id);
      }
      // Reset form
      setAmount('');
      setReason('');
      setCurrency('USD');
      setAdjustmentType('add');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update balance",
        variant: "destructive",
      });
    },
  });

  const handleSearchUser = () => {
    if (!searchUserId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user ID or email",
        variant: "destructive",
      });
      return;
    }
    searchUserMutation.mutate(searchUserId.trim());
  };

  const handleManipulateBalance = () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for this adjustment",
        variant: "destructive",
      });
      return;
    }

    manipulateBalanceMutation.mutate({
      userId: selectedUser.user.id,
      adjustmentType,
      amount,
      currency,
      reason: reason.trim(),
    });
  };

  const selectedUserForIndividualAdjustment = users.find((u: User) => u.id === selectedUserId);
  const filteredUsers = users.filter((u: User) => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Balance adjustment mutation
  const balanceAdjustmentMutation = useMutation<any, Error, any>({
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
      setCurrency('USD');
      setAdjustmentType('add');
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
  const bulkAdjustmentMutation = useMutation<any, Error, any>({
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

  const handleIndividualBalanceAdjustment = () => {
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
    if (isNaN(num)) return 'N/A';
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

        {/* Individual Balance Manipulation (using original structure) */}
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
              {selectedUserForIndividualAdjustment && (
                <Alert className="bg-blue-50 border-blue-200">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="font-medium text-blue-800">
                      {selectedUserForIndividualAdjustment.firstName} {selectedUserForIndividualAdjustment.lastName} (@{selectedUserForIndividualAdjustment.username})
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Current Balance: {formatAmount(selectedUserForIndividualAdjustment.portfolio?.totalValue || '0', 'USD')} |
                      Available Cash: {formatAmount(selectedUserForIndividualAdjustment.portfolio?.availableCash || '0', 'USD')}
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
                onClick={handleIndividualBalanceAdjustment}
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
              {usersLoading ? ( // Using usersLoading as a proxy for initial data fetch for history
                <div className="text-center py-8">Loading history...</div>
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

      {/* Admin Balance Manipulation (newly added component structure) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Search className="h-5 w-5" />
            Search User for Direct Manipulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="userId">User ID or Email</Label>
              <Input
                id="userId"
                value={searchUserId}
                onChange={(e) => setLocalSearchUserId(e.target.value)}
                placeholder="Enter user ID or email address"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearchUser}
                disabled={searchUserMutation.isPending}
                className="mb-0"
              >
                {searchUserMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected User Info for Direct Manipulation */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-500">User Details</Label>
                  <div className="mt-1">
                    <p className="font-semibold">{selectedUser.user.firstName} {selectedUser.user.lastName}</p>
                    <p className="text-sm text-gray-600">@{selectedUser.user.username}</p>
                    <p className="text-sm text-gray-600">{selectedUser.user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedUser.user.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-500">Current Balance</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Available Cash</span>
                      <span className="text-lg font-bold text-green-600">
                        ${selectedUser.balance.availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">Total Value</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${selectedUser.balance.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Manipulation (Direct) */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Settings className="h-5 w-5" />
              Balance Manipulation
              <Badge variant="destructive" className="ml-2">Admin Only</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adjustmentType">Adjustment Type</Label>
                  <Select value={adjustmentType} onValueChange={(value: any) => setAdjustmentType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Add to Balance
                        </div>
                      </SelectItem>
                      <SelectItem value="remove">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Remove from Balance
                        </div>
                      </SelectItem>
                      <SelectItem value="set">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          Set Balance
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason (Required)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for balance adjustment..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Warning</h4>
                <p className="text-sm text-red-700">
                  This action will directly modify the user's balance without their knowledge or consent. 
                  This should only be used for legitimate administrative purposes. All actions are logged.
                </p>
              </div>

              <Button
                onClick={handleManipulateBalance}
                disabled={manipulateBalanceMutation.isPending || !amount || !reason.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {manipulateBalanceMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                {adjustmentType === 'add' && 'Add to Balance'}
                {adjustmentType === 'remove' && 'Remove from Balance'}
                {adjustmentType === 'set' && 'Set Balance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
