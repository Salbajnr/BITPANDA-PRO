
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, Clock, CheckCircle, XCircle, DollarSign, 
  Building, CreditCard, Smartphone, Wallet, RefreshCw,
  User, Calendar, MessageCircle, AlertTriangle, Info, Eye
} from "lucide-react";

interface Withdrawal {
  id: string;
  userId: string;
  paymentMethod: string;
  amount: string;
  currency: string;
  destinationAddress: string;
  destinationDetails?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  user?: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function AdminWithdrawalManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch all withdrawals
  const { data: withdrawals, isLoading, refetch } = useQuery({
    queryKey: ['/api/withdrawals/all'],
    queryFn: () => api.get('/withdrawals/all'),
  });

  // Update withdrawal status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      return api.patch(`/withdrawals/${id}/status`, {
        status,
        adminNotes: notes
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Withdrawal ${variables.status} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/all'] });
      setIsDetailsModalOpen(false);
      setSelectedWithdrawal(null);
      setAdminNotes('');
      setProcessingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update withdrawal status.",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    if (!selectedWithdrawal) return;

    if (status === 'rejected' && !adminNotes.trim()) {
      toast({
        title: "Admin Notes Required",
        description: "Please provide a reason for rejecting this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(selectedWithdrawal.id);
    updateStatusMutation.mutate({
      id: selectedWithdrawal.id,
      status,
      notes: adminNotes
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
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
        return <Send className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredWithdrawals = withdrawals?.filter((withdrawal: Withdrawal) => {
    if (statusFilter === 'all') return true;
    return withdrawal.status === statusFilter;
  }) || [];

  const pendingCount = withdrawals?.filter((w: Withdrawal) => w.status === 'pending')?.length || 0;
  const totalAmount = withdrawals?.reduce((sum: number, w: Withdrawal) => 
    w.status === 'approved' ? sum + parseFloat(w.amount) : sum, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Withdrawal Management
              </h1>
              <p className="text-gray-400">
                Review and process user withdrawal requests
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{pendingCount}</p>
                  <p className="text-sm text-gray-400">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {withdrawals?.filter((w: Withdrawal) => w.status === 'approved')?.length || 0}
                  </p>
                  <p className="text-sm text-gray-400">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount.toString())}</p>
                  <p className="text-sm text-gray-400">Total Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawals List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white">
                Withdrawal Requests
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Label htmlFor="status-filter" className="text-gray-300">Filter:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
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
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-400">Loading withdrawal requests...</p>
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No Withdrawals Found</h3>
                <p className="text-gray-400">
                  {statusFilter === 'all' ? "No withdrawal requests yet." : `No ${statusFilter} withdrawals.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWithdrawals.map((withdrawal: Withdrawal) => (
                  <div key={withdrawal.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getPaymentMethodIcon(withdrawal.paymentMethod)}
                        <div>
                          <div className="font-medium text-white">
                            {formatCurrency(withdrawal.amount)} {withdrawal.currency}
                          </div>
                          <div className="text-sm text-gray-400">
                            {withdrawal.user?.username} • {withdrawal.paymentMethod.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(withdrawal.status)}
                        <div className="text-sm text-gray-400">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal);
                            setAdminNotes(withdrawal.adminNotes || '');
                            setIsDetailsModalOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Withdrawal Request Details</DialogTitle>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Username:</span>
                      <p className="text-white">{selectedWithdrawal.user?.username}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p className="text-white">{selectedWithdrawal.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Withdrawal Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <p className="text-white font-medium">
                        {formatCurrency(selectedWithdrawal.amount)} {selectedWithdrawal.currency}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Method:</span>
                      <p className="text-white">{selectedWithdrawal.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Destination:</span>
                      <p className="text-white break-all">{selectedWithdrawal.destinationAddress}</p>
                    </div>
                    {selectedWithdrawal.destinationDetails && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Details:</span>
                        <p className="text-white">{selectedWithdrawal.destinationDetails}</p>
                      </div>
                    )}
                    {selectedWithdrawal.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-400">User Notes:</span>
                        <p className="text-white">{selectedWithdrawal.notes}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <p className="text-white">
                        {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="admin-notes" className="text-white">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this withdrawal..."
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                {selectedWithdrawal.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600">
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={processingId === selectedWithdrawal.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingId === selectedWithdrawal.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Withdrawal
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={processingId === selectedWithdrawal.id}
                      variant="destructive"
                    >
                      {processingId === selectedWithdrawal.id ? 'Rejecting...' : 'Reject Withdrawal'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
