
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Eye, Check, X, FileText, Hash, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Deposit {
  deposit: {
    id: string;
    paymentMethod: string;
    cryptocurrency: string;
    depositAmount: string;
    depositAddress: string;
    proofOfPayment: string;
    proofType: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function AdminDepositManagement() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string>('');
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchDeposits();
  }, [user]);

  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/deposits/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      } else {
        throw new Error('Failed to fetch deposits');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load deposits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string) => {
    setProcessingId(depositId);
    try {
      const response = await fetch(`/api/deposits/admin/${depositId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deposit approved successfully",
        });
        fetchDeposits();
      } else {
        throw new Error('Failed to approve deposit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve deposit",
        variant: "destructive",
      });
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async () => {
    if (!selectedDeposit || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(selectedDeposit.deposit.id);
    try {
      const response = await fetch(`/api/deposits/admin/${selectedDeposit.deposit.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          action: 'reject',
          rejectionReason: rejectionReason.trim(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deposit rejected successfully",
        });
        setShowRejectDialog(false);
        setRejectionReason('');
        setSelectedDeposit(null);
        fetchDeposits();
      } else {
        throw new Error('Failed to reject deposit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject deposit",
        variant: "destructive",
      });
    } finally {
      setProcessingId('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingDeposits = deposits.filter(d => d.deposit.status === 'pending');
  const processedDeposits = deposits.filter(d => d.deposit.status !== 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Deposit Management</h1>
          <Button onClick={fetchDeposits} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400">{pendingDeposits.length}</h3>
                <p className="text-gray-400">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-400">
                  {processedDeposits.filter(d => d.deposit.status === 'approved').length}
                </h3>
                <p className="text-gray-400">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-400">
                  {processedDeposits.filter(d => d.deposit.status === 'rejected').length}
                </h3>
                <p className="text-gray-400">Rejected</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400">{deposits.length}</h3>
                <p className="text-gray-400">Total Deposits</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deposits */}
        {pendingDeposits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Pending Review ({pendingDeposits.length})</h2>
            <div className="space-y-4">
              {pendingDeposits.map((item) => (
                <Card key={item.deposit.id} className="bg-slate-800 border-yellow-500/20">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">User</p>
                          <p className="text-white font-semibold">{item.user.name}</p>
                          <p className="text-gray-300 text-sm">{item.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Amount</p>
                          <p className="text-white text-lg font-bold">
                            {item.deposit.depositAmount} {item.deposit.cryptocurrency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Payment Method</p>
                          <Badge variant="secondary">{item.deposit.paymentMethod}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Deposit Address</p>
                          <code className="text-xs text-green-400 bg-slate-900 p-2 rounded block break-all">
                            {item.deposit.depositAddress}
                          </code>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Proof Type</p>
                          <div className="flex items-center space-x-2">
                            {item.deposit.proofType === 'file' ? (
                              <FileText className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Hash className="h-4 w-4 text-purple-400" />
                            )}
                            <span className="text-sm">
                              {item.deposit.proofType === 'file' ? 'File Upload' : 'Transaction Hash'}
                            </span>
                          </div>
                          {item.deposit.proofType === 'hash' && (
                            <code className="text-xs text-purple-400 bg-slate-900 p-2 rounded block break-all">
                              {item.deposit.proofOfPayment}
                            </code>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Submitted</p>
                          <p className="text-white">{formatDate(item.deposit.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        {item.deposit.proofType === 'file' && (
                          <Button variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Proof File
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleApprove(item.deposit.id)}
                          disabled={processingId === item.deposit.id}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {processingId === item.deposit.id ? 'Approving...' : 'Approve'}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedDeposit(item);
                            setShowRejectDialog(true);
                          }}
                          disabled={processingId === item.deposit.id}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Processed Deposits */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Processed Deposits ({processedDeposits.length})</h2>
          {processedDeposits.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">No processed deposits yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processedDeposits.map((item) => (
                <Card key={item.deposit.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-white">{item.user.name}</p>
                          <p className="text-sm text-gray-400">{item.user.email}</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">
                            {item.deposit.depositAmount} {item.deposit.cryptocurrency}
                          </p>
                          <p className="text-sm text-gray-400">{formatDate(item.deposit.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{item.deposit.paymentMethod}</Badge>
                        <Badge className={getStatusColor(item.deposit.status)}>
                          {item.deposit.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    {item.deposit.status === 'rejected' && item.deposit.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">
                          <strong>Rejection Reason:</strong> {item.deposit.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Reject Deposit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Please provide a reason for rejecting this deposit:
                </p>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                    setSelectedDeposit(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processingId === selectedDeposit?.deposit.id}
                  className="flex-1"
                >
                  {processingId === selectedDeposit?.deposit.id ? 'Rejecting...' : 'Reject Deposit'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
