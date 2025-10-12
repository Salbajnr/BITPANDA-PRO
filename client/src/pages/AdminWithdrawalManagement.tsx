
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { 
  DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, 
  CreditCard, Building, Smartphone, RefreshCw, Eye, 
  MessageSquare, UserCheck, FileText, Calendar, Filter,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

interface Withdrawal {
  id: string;
  userId: string;
  withdrawalMethod: string;
  amount: string;
  currency: string;
  destinationAddress: string;
  destinationDetails?: any;
  status: 'pending' | 'pending_confirmation' | 'under_review' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  adminNotes?: string;
  fees: string;
  netAmount: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch all withdrawals
  const { data: withdrawals = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/withdrawals/all'],
    queryFn: async () => {
      const response = await api.get('/withdrawals/all');
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Fetch withdrawal statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/withdrawals/stats'],
    queryFn: async () => {
      const response = await api.get('/withdrawals/stats');
      return response.data || {};
    },
  });

  // Approve withdrawal mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      const response = await api.post(`/withdrawals/${id}/approve`, { adminNotes });
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Approved",
        description: "The withdrawal has been approved and is now processing.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/stats'] });
      setIsDetailsModalOpen(false);
      setAdminNotes('');
      setProcessingId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve withdrawal",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  // Reject withdrawal mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, adminNotes, rejectionReason }: { id: string; adminNotes: string; rejectionReason: string }) => {
      const response = await api.post(`/withdrawals/${id}/reject`, { adminNotes, rejectionReason });
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Rejected",
        description: "The withdrawal has been rejected and funds returned to user.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/stats'] });
      setIsDetailsModalOpen(false);
      setAdminNotes('');
      setRejectionReason('');
      setProcessingId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject withdrawal",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  // Complete withdrawal mutation
  const completeMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      const response = await api.post(`/withdrawals/${id}/complete`, { adminNotes });
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Completed",
        description: "The withdrawal has been marked as completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/stats'] });
      setIsDetailsModalOpen(false);
      setAdminNotes('');
      setProcessingId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete withdrawal",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      pending_confirmation: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: AlertTriangle },
      under_review: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Eye },
      approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: RefreshCw },
      completed: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: XCircle },
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
      case 'bank_transfer': return Building;
      case 'crypto_wallet': return DollarSign;
      case 'paypal': return CreditCard;
      case 'mobile_money': return Smartphone;
      default: return DollarSign;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const handleApprove = (withdrawal: Withdrawal) => {
    if (!adminNotes.trim()) {
      toast({
        title: "Admin Notes Required",
        description: "Please provide admin notes before approving the withdrawal.",
        variant: "destructive",
      });
      return;
    }
    setProcessingId(withdrawal.id);
    approveMutation.mutate({ id: withdrawal.id, adminNotes });
  };

  const handleReject = (withdrawal: Withdrawal) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting the withdrawal.",
        variant: "destructive",
      });
      return;
    }
    setProcessingId(withdrawal.id);
    rejectMutation.mutate({ 
      id: withdrawal.id, 
      adminNotes: adminNotes || `Rejected: ${rejectionReason}`,
      rejectionReason 
    });
  };

  const handleComplete = (withdrawal: Withdrawal) => {
    setProcessingId(withdrawal.id);
    completeMutation.mutate({ 
      id: withdrawal.id, 
      adminNotes: adminNotes || "Withdrawal completed successfully" 
    });
  };

  const openDetailsModal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setAdminNotes(withdrawal.adminNotes || '');
    setRejectionReason('');
    setIsDetailsModalOpen(true);
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal: Withdrawal) => {
    if (statusFilter === 'all') return true;
    return withdrawal.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Withdrawal Management
              </h1>
              <p className="text-xl text-gray-600">
                Review and manage user withdrawal requests
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
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Total Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalWithdrawals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingWithdrawals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.approvedWithdrawals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalVolume?.toString() || '0')}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Withdrawals List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                Withdrawal Requests
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Label htmlFor="status-filter">Filter by status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Withdrawals</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending_confirmation">Pending Confirmation</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <LoadingCard count={5} height="h-32" />
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Withdrawals Found"
                description={
                  statusFilter === 'all' 
                    ? "No withdrawal requests have been submitted yet." 
                    : `No ${statusFilter.replace('_', ' ')} withdrawals found.`
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredWithdrawals.map((withdrawal: Withdrawal) => {
                  const MethodIcon = getMethodIcon(withdrawal.withdrawalMethod);
                  return (
                    <div key={withdrawal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <MethodIcon className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {formatCurrency(withdrawal.amount)} {withdrawal.currency}
                            </div>
                            <div className="text-sm text-gray-600">
                              {withdrawal.user?.username} ({withdrawal.user?.email})
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(withdrawal.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailsModal(withdrawal)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Method:</span>
                          <p className="text-gray-600">{withdrawal.withdrawalMethod.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Fees:</span>
                          <p className="text-gray-600">{formatCurrency(withdrawal.fees)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Net Amount:</span>
                          <p className="text-gray-600">{formatCurrency(withdrawal.netAmount)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Requested:</span>
                          <p className="text-gray-600">{new Date(withdrawal.requestedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {withdrawal.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border">
                          <div className="text-sm font-medium text-blue-800">Admin Notes:</div>
                          <div className="text-sm text-blue-700">{withdrawal.adminNotes}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Withdrawal Details</DialogTitle>
            </DialogHeader>
            
            {selectedWithdrawal && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">User:</span>
                    <p className="text-white font-medium">
                      {selectedWithdrawal.user?.firstName} {selectedWithdrawal.user?.lastName}
                    </p>
                    <p className="text-gray-300 text-sm">{selectedWithdrawal.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <p className="text-white font-medium text-lg">
                      {formatCurrency(selectedWithdrawal.amount)} {selectedWithdrawal.currency}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Method:</span>
                    <p className="text-white">{selectedWithdrawal.withdrawalMethod.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Destination:</span>
                    <p className="text-white truncate">{selectedWithdrawal.destinationAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Fees:</span>
                    <p className="text-white">{formatCurrency(selectedWithdrawal.fees)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Net Amount:</span>
                    <p className="text-white font-medium">{formatCurrency(selectedWithdrawal.netAmount)}</p>
                  </div>
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

                {selectedWithdrawal.destinationDetails && (
                  <div>
                    <span className="text-gray-400">Destination Details:</span>
                    <pre className="text-white text-sm bg-gray-800 p-3 rounded mt-2">
                      {JSON.stringify(selectedWithdrawal.destinationDetails, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                      id="adminNotes"
                      placeholder="Enter admin notes..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  {selectedWithdrawal.status === 'under_review' && (
                    <div>
                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="rejectionReason"
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  {selectedWithdrawal.status === 'under_review' && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedWithdrawal)}
                        disabled={processingId === selectedWithdrawal.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === selectedWithdrawal.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve Withdrawal
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedWithdrawal)}
                        disabled={processingId === selectedWithdrawal.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {processingId === selectedWithdrawal.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Reject Withdrawal
                      </Button>
                    </>
                  )}

                  {selectedWithdrawal.status === 'processing' && (
                    <Button
                      onClick={() => handleComplete(selectedWithdrawal)}
                      disabled={processingId === selectedWithdrawal.id}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {processingId === selectedWithdrawal.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Mark as Completed
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
