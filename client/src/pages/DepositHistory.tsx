
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, FileText, Hash } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Deposit {
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
}

export default function DepositHistory() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/deposits/my-deposits', {
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
        description: "Failed to load deposit history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-green-500/10 text-green-400 border-green-500/20';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading deposit history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Deposit History</h1>
          <Button onClick={fetchDeposits} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {deposits.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No deposits found. Make your first deposit to get started!</p>
              <Button className="mt-4" onClick={() => window.location.href = '/deposit'}>
                Make a Deposit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {deposits.map((deposit) => (
              <Card key={deposit.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <span>{deposit.depositAmount} {deposit.cryptocurrency}</span>
                      <Badge variant="secondary">{deposit.paymentMethod}</Badge>
                    </CardTitle>
                    <Badge className={getStatusColor(deposit.status)}>
                      {deposit.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Deposit Address</p>
                        <code className="text-xs text-green-400 bg-slate-900 p-2 rounded block break-all">
                          {deposit.depositAddress}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Submitted</p>
                        <p className="text-white">{formatDate(deposit.createdAt)}</p>
                      </div>
                      {deposit.status === 'rejected' && deposit.rejectionReason && (
                        <div>
                          <p className="text-sm text-gray-400">Rejection Reason</p>
                          <p className="text-red-400">{deposit.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Proof of Payment</p>
                        <div className="flex items-center space-x-2">
                          {deposit.proofType === 'file' ? (
                            <FileText className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Hash className="h-4 w-4 text-purple-400" />
                          )}
                          <span className="text-sm">
                            {deposit.proofType === 'file' ? 'File Upload' : 'Transaction Hash'}
                          </span>
                          {deposit.proofType === 'hash' && (
                            <code className="text-xs text-purple-400 bg-slate-900 p-1 rounded">
                              {deposit.proofOfPayment.substring(0, 20)}...
                            </code>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Last Updated</p>
                        <p className="text-white">{formatDate(deposit.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {deposit.status === 'pending' && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-400">
                        🔄 Your deposit is being reviewed. You'll receive a notification once processed.
                      </p>
                    </div>
                  )}
                  
                  {deposit.status === 'approved' && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-400">
                        ✅ Deposit approved! Funds have been added to your wallet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
