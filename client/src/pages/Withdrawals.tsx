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
import { WithdrawalConfirmationDialog } from "@/components/WithdrawalConfirmationDialog";

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