
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import {
  DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, 
  CreditCard, Building, Smartphone, RefreshCw, Banknote, 
  Send, Eye, Calendar, Filter, Info, ArrowRight, Wallet
} from "lucide-react";

interface Withdrawal {
  id: string;
  payment_method: string;
  amount: number;
  currency: string;
  destination_address: string;
  destination_details?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export default function Withdrawals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewWithdrawalOpen, setIsNewWithdrawalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    payment_method: '',
    amount: '',
    currency: 'USD',
    destination_address: '',
    destination_details: '',
    notes: ''
  });

  // Fetch user withdrawals
  const { data: withdrawals, isLoading, refetch } = useQuery({
    queryKey: ['/api/withdrawals'],
    queryFn: () => api.get('/withdrawals'),
  });

  // Fetch user portfolio for available balance
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: () => api.get('/portfolio'),
  });

  // Create withdrawal mutation
  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/withdrawals/request', data);
    },
    onSuccess: (response) => {
      toast({
        title: "Withdrawal Request Created",
        description: response.data?.message || "Please check your email to confirm the withdrawal.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      setIsNewWithdrawalOpen(false);
      setIsConfirmModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
      setIsConfirmModalOpen(false);
    },
  });

  const resetForm = () => {
    setFormData({
      payment_method: '',
      amount: '',
      currency: 'USD',
      destination_address: '',
      destination_details: '',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_method || !formData.amount || !formData.destination_address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = parseFloat(portfolio?.availableCash || '0');
    const requestedAmount = parseFloat(formData.amount);

    if (requestedAmount > availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough available balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    if (requestedAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation modal
    setIsConfirmModalOpen(true);
  };

  const confirmWithdrawal = () => {
    createWithdrawalMutation.mutate({
      withdrawalMethod: formData.payment_method,
      amount: formData.amount,
      currency: formData.currency,
      destinationAddress: formData.destination_address,
      destinationDetails: formData.destination_details ? { details: formData.destination_details } : undefined,
      notes: formData.notes
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'approved': 'bg-green-100 text-green-800 border-green-300',
      'rejected': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'crypto_wallet':
        return <Wallet className="w-5 h-5 text-orange-500" />;
      case 'paypal':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'mobile_money':
        return <Smartphone className="w-5 h-5 text-green-500" />;
      default:
        return <Banknote className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredWithdrawals = withdrawals?.filter((withdrawal: Withdrawal) => {
    if (statusFilter === 'all') return true;
    return withdrawal.status === statusFilter;
  }) || [];

  const availableBalance = parseFloat(portfolio?.availableCash || '0');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">
                Withdraw Funds
              </h1>
              <p className="text-xl text-gray-600">
                Withdraw your funds to external accounts
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsNewWithdrawalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                New Withdrawal
              </Button>
            </div>
          </div>
        </div>

        {/* Available Balance Card */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(availableBalance)}
            </div>
            <p className="text-gray-600 mt-2">Available for withdrawal</p>
          </CardContent>
        </Card>

        {/* New Withdrawal Form */}
        {isNewWithdrawalOpen && (
          <Card className="border border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">
                Create New Withdrawal Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="payment_method">Payment Method *</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer (1.5% fee)</SelectItem>
                        <SelectItem value="crypto_wallet">Crypto Wallet (0.5% fee)</SelectItem>
                        <SelectItem value="paypal">PayPal (2.5% fee)</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money (2.0% fee)</SelectItem>
                        <SelectItem value="other">Other Method (2.0% fee)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {formatCurrency(availableBalance)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination_address">Destination Address *</Label>
                    <Input
                      id="destination_address"
                      placeholder="Account number, wallet address, etc."
                      value={formData.destination_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination_address: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="destination_details">Destination Details</Label>
                  <Textarea
                    id="destination_details"
                    placeholder="Bank name, routing number, additional instructions..."
                    value={formData.destination_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination_details: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional notes about your withdrawal..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsNewWithdrawalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Request Withdrawal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Withdrawals List */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-black">
                Your Withdrawal History
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Label htmlFor="status-filter">Filter by status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading withdrawals...</p>
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-black mb-2">No Withdrawals Found</h3>
                <p className="text-gray-600 mb-4">
                  {statusFilter === 'all' 
                    ? "You haven't made any withdrawals yet." 
                    : `No ${statusFilter} withdrawals found.`}
                </p>
                <Button 
                  onClick={() => setIsNewWithdrawalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Withdrawal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWithdrawals.map((withdrawal: Withdrawal) => (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        {getPaymentMethodIcon(withdrawal.payment_method)}
                        <div>
                          <div className="font-medium text-black">
                            {formatCurrency(withdrawal.amount)} {withdrawal.currency}
                          </div>
                          <div className="text-sm text-gray-600">
                            via {withdrawal.payment_method.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(withdrawal.status)}
                        <div className="text-sm text-gray-500">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Destination:</span>
                        <p className="text-gray-600">{withdrawal.destination_address}</p>
                      </div>
                      {withdrawal.destination_details && (
                        <div>
                          <span className="font-medium text-gray-700">Details:</span>
                          <p className="text-gray-600">{withdrawal.destination_details}</p>
                        </div>
                      )}
                    </div>

                    {withdrawal.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-black">Admin Notes:</div>
                            <div className="text-sm text-gray-600">{withdrawal.admin_notes}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Transaction Under Review
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <p className="text-lg font-medium mb-2">
                Your withdrawal request is being submitted
              </p>
              <p className="text-gray-600 mb-6">
                Transaction is under review, please wait. You will be notified once the withdrawal has been processed by our team.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-blue-800">
                  <strong>Amount:</strong> {formatCurrency(parseFloat(formData.amount || '0'))} {formData.currency}
                </div>
                <div className="text-sm text-blue-800">
                  <strong>Method:</strong> {formData.payment_method.replace('_', ' ')}
                </div>
                <div className="text-sm text-blue-800">
                  <strong>Destination:</strong> {formData.destination_address}
                </div>
              </div>
              <div className="flex space-x-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfirmModalOpen(false)}
                  disabled={createWithdrawalMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmWithdrawal}
                  disabled={createWithdrawalMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createWithdrawalMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Confirm Withdrawal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { ArrowDownLeft, Clock, CheckCircle, XCircle, AlertTriangle, CreditCard, Wallet, Building2, DollarSign } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Withdrawal {
  id: string;
  amount: string;
  currency: string;
  withdrawalMethod: string;
  destinationAddress: string;
  status: string;
  requestedAt: string;
  completedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  fees: string;
  netAmount: string;
}

interface WithdrawalLimits {
  dailyLimit: string;
  monthlyLimit: string;
  dailyUsed: string;
  monthlyUsed: string;
}

export default function Withdrawals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState('');
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    withdrawalMethod: '',
    destinationAddress: '',
    notes: ''
  });

  // Fetch withdrawals
  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['/api/withdrawals'],
    queryFn: () => api.get('/api/withdrawals').then(res => res.data),
    enabled: !!user,
  });

  // Fetch withdrawal limits
  const { data: limits } = useQuery({
    queryKey: ['/api/withdrawals/limits'],
    queryFn: () => api.get('/api/withdrawals/limits').then(res => res.data),
    enabled: !!user,
  });

  // Fetch portfolio for balance
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: () => api.get('/api/portfolio').then(res => res.data),
    enabled: !!user,
  });

  // Calculate fees mutation
  const feesMutation = useMutation({
    mutationFn: (data: { amount: string; method: string }) =>
      api.post('/api/withdrawals/calculate-fees', data),
    onSuccess: (response) => {
      console.log('Fees calculated:', response.data);
    }
  });

  // Create withdrawal mutation
  const createWithdrawalMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/withdrawals/request', data),
    onSuccess: (response) => {
      toast({
        title: "Withdrawal Request Submitted",
        description: response.data?.message || "Please check your email to confirm the withdrawal.",
      });
      setShowModal(true);
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create withdrawal request",
        variant: "destructive",
      });
    }
  });

  // Confirm withdrawal mutation
  const confirmMutation = useMutation({
    mutationFn: (token: string) => api.post('/api/withdrawals/confirm', { token }),
    onSuccess: () => {
      toast({
        title: "Withdrawal Confirmed",
        description: "Your withdrawal is now under review.",
      });
      setShowModal(false);
      setConfirmationToken('');
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to confirm withdrawal",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalData.amount || !withdrawalData.withdrawalMethod || !withdrawalData.destinationAddress) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createWithdrawalMutation.mutate({
      amount: withdrawalData.amount,
      withdrawalMethod: withdrawalData.withdrawalMethod,
      destinationAddress: withdrawalData.destinationAddress,
      destinationDetails: { notes: withdrawalData.notes }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: AlertTriangle },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      processing: { color: 'bg-purple-100 text-purple-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{status.replace('_', ' ').toUpperCase()}</span>
      </Badge>
    );
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return Building2;
      case 'crypto_wallet': return Wallet;
      case 'paypal': return CreditCard;
      default: return DollarSign;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Withdrawals</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Withdraw funds from your account
              </p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-green-600" />
          </div>

          {/* Balance & Limits Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${portfolio?.availableCash || '0.00'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Daily Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  ${limits?.dailyUsed || '0'} / ${limits?.dailyLimit || '10,000'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((parseFloat(limits?.dailyUsed || '0') / parseFloat(limits?.dailyLimit || '10000')) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Monthly Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  ${limits?.monthlyUsed || '0'} / ${limits?.monthlyLimit || '50,000'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((parseFloat(limits?.monthlyUsed || '0') / parseFloat(limits?.monthlyLimit || '50000')) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Withdrawal Method</Label>
                    <Select 
                      value={withdrawalData.withdrawalMethod} 
                      onValueChange={(value) => setWithdrawalData({...withdrawalData, withdrawalMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="crypto_wallet">Crypto Wallet</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Address</Label>
                  <Input
                    id="destination"
                    placeholder="Bank account, wallet address, email, etc."
                    value={withdrawalData.destinationAddress}
                    onChange={(e) => setWithdrawalData({...withdrawalData, destinationAddress: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional information"
                    value={withdrawalData.notes}
                    onChange={(e) => setWithdrawalData({...withdrawalData, notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createWithdrawalMutation.isPending}
                >
                  {createWithdrawalMutation.isPending ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalsLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  No withdrawals found
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal: Withdrawal) => {
                    const MethodIcon = getMethodIcon(withdrawal.withdrawalMethod);
                    return (
                      <div key={withdrawal.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MethodIcon className="w-5 h-5 text-slate-600" />
                            <div>
                              <div className="font-medium">${withdrawal.amount}</div>
                              <div className="text-sm text-slate-600">
                                {new Date(withdrawal.requestedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(withdrawal.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-600">Method</div>
                            <div className="font-medium">
                              {withdrawal.withdrawalMethod.replace('_', ' ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600">Destination</div>
                            <div className="font-medium truncate">
                              {withdrawal.destinationAddress}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600">Fees</div>
                            <div className="font-medium">${withdrawal.fees}</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Net Amount</div>
                            <div className="font-medium">${withdrawal.netAmount}</div>
                          </div>
                        </div>

                        {withdrawal.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <div className="text-sm font-medium text-red-800">
                              Rejection Reason:
                            </div>
                            <div className="text-sm text-red-700">
                              {withdrawal.rejectionReason}
                            </div>
                          </div>
                        )}

                        {withdrawal.adminNotes && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <div className="text-sm font-medium text-blue-800">
                              Admin Notes:
                            </div>
                            <div className="text-sm text-blue-700">
                              {withdrawal.adminNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Please enter the confirmation code sent to your email to complete the withdrawal request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Confirmation Code</Label>
              <Input
                id="token"
                placeholder="Enter confirmation code"
                value={confirmationToken}
                onChange={(e) => setConfirmationToken(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => confirmMutation.mutate(confirmationToken)}
                disabled={!confirmationToken || confirmMutation.isPending}
                className="flex-1"
              >
                {confirmMutation.isPending ? 'Confirming...' : 'Confirm'}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
