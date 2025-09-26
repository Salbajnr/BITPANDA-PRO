import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import {
  Upload, FileText, DollarSign, Clock, CheckCircle, XCircle,
  AlertTriangle, CreditCard, Building, Smartphone, 
  ExternalLink, Eye, Calendar, Filter, RefreshCw,
  Banknote, Coins, TrendingUp, Info
} from "lucide-react";

interface Deposit {
  id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  proof_uploads?: ProofUpload[];
}

interface ProofUpload {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
}

export default function Deposits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewDepositOpen, setIsNewDepositOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    payment_method: '',
    amount: '',
    currency: 'USD',
    notes: ''
  });

  // Fetch user deposits
  const { data: deposits, isLoading, refetch } = useQuery({
    queryKey: ['/api/deposits'],
    queryFn: () => api.get('/deposits').then(res => res.data || []),
  });

  // Create deposit mutation
  const createDepositMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return api.post('/deposits', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Deposit Submitted",
        description: "Your deposit request has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/deposits'] });
      setIsNewDepositOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit deposit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      payment_method: '',
      amount: '',
      currency: 'USD',
      notes: ''
    });
    setSelectedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_method || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Proof Required",
        description: "Please upload proof of payment before submitting.",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('payment_method', formData.payment_method);
    submitData.append('amount', formData.amount);
    submitData.append('currency', formData.currency);
    submitData.append('notes', formData.notes);
    
    selectedFiles.forEach((file, index) => {
      submitData.append(`proof_files`, file);
    });

    createDepositMutation.mutate(submitData);
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
      case 'binance':
        return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'bybit':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'crypto_com':
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case 'bank_transfer':
        return <Building className="w-5 h-5 text-gray-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDeposits = deposits?.filter((deposit: Deposit) => {
    if (statusFilter === 'all') return true;
    return deposit.status === statusFilter;
  }) || [];

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
                Deposit Funds
              </h1>
              <p className="text-xl text-gray-600">
                Add funds to your account via external crypto platforms
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsNewDepositOpen(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                New Deposit
              </Button>
            </div>
          </div>
        </div>

        {/* Supported Platforms Info */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">
              Supported Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Coins className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-medium text-black">Binance</div>
                  <div className="text-sm text-gray-600">Major crypto exchange</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="font-medium text-black">Bybit</div>
                  <div className="text-sm text-gray-600">Derivatives platform</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <Smartphone className="w-8 h-8 text-indigo-500" />
                <div>
                  <div className="font-medium text-black">Crypto.com</div>
                  <div className="text-sm text-gray-600">Mobile-first exchange</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Building className="w-8 h-8 text-gray-600" />
                <div>
                  <div className="font-medium text-black">Bank Transfer</div>
                  <div className="text-sm text-gray-600">Traditional banking</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Deposit Form */}
        {isNewDepositOpen && (
          <Card className="border border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">
                Submit New Deposit Request
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
                      <SelectTrigger className="border-gray-300 focus:border-green-500">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="binance">Binance</SelectItem>
                        <SelectItem value="bybit">Bybit</SelectItem>
                        <SelectItem value="crypto_com">Crypto.com</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500">
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
                    <Label htmlFor="proof_files">Proof of Payment *</Label>
                    <div className="mt-1">
                      <Input
                        id="proof_files"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="border-gray-300 focus:border-green-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload screenshots or receipts (JPG, PNG, PDF)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional notes about your deposit..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div>
                    <Label>Selected Files</Label>
                    <div className="mt-2 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{file.name}</span>
                          <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsNewDepositOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={createDepositMutation.isPending}
                  >
                    {createDepositMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Deposits List */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-black">
                Your Deposit History
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
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
                <p className="text-gray-600">Loading deposits...</p>
              </div>
            ) : filteredDeposits.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-black mb-2">No Deposits Found</h3>
                <p className="text-gray-600 mb-4">
                  {statusFilter === 'all' 
                    ? "You haven't made any deposits yet." 
                    : `No ${statusFilter} deposits found.`}
                </p>
                <Button 
                  onClick={() => setIsNewDepositOpen(true)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Create Your First Deposit
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeposits.map((deposit: Deposit) => (
                  <div key={deposit.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getPaymentMethodIcon(deposit.payment_method)}
                        <div>
                          <div className="font-medium text-black">
                            {formatCurrency(deposit.amount)} {deposit.currency}
                          </div>
                          <div className="text-sm text-gray-600">
                            via {deposit.payment_method.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(deposit.status)}
                        <div className="text-sm text-gray-500">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {deposit.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-black">Admin Notes:</div>
                            <div className="text-sm text-gray-600">{deposit.admin_notes}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {deposit.proof_uploads && deposit.proof_uploads.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-black mb-2">Proof Files:</div>
                        <div className="flex space-x-2">
                          {deposit.proof_uploads.map((file: ProofUpload) => (
                            <div key={file.id} className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              <FileText className="w-3 h-3" />
                              <span>{file.file_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}