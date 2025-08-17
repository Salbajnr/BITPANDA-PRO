import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from 'date-fns';

interface Deposit {
  id: string;
  amount: string;
  currency: string;
  assetType: 'crypto' | 'metal';
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  proofImageUrl?: string;
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

export default function Deposits() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [assetType, setAssetType] = useState<'crypto' | 'metal'>('crypto');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDeposits();
    }
  }, [isAuthenticated]);

  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/deposits/my-deposits');
      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large", 
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setProofFile(file);
    }
  };

  const uploadProof = async () => {
    if (!proofFile) return null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('proof', proofFile);
      
      const response = await fetch('/api/deposits/upload-proof', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.proofImageUrl;
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload proof of payment",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentMethod) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload proof if provided
      let proofImageUrl = null;
      if (proofFile) {
        proofImageUrl = await uploadProof();
        if (!proofImageUrl) return; // Upload failed
      }

      const response = await fetch('/api/deposits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          assetType,
          paymentMethod,
          proofImageUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deposit');
      }

      const data = await response.json();
      
      toast({
        title: "Deposit request submitted",
        description: "Your deposit request has been submitted for review",
      });

      // Reset form
      setAmount('');
      setPaymentMethod('');
      setProofFile(null);
      
      // Refresh deposits
      fetchDeposits();
    } catch (error) {
      console.error('Error creating deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-slate-600 mb-4">Please log in to access the deposits page.</p>
            <Button>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Deposits</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Add funds to your account with proof of payment verification
        </p>
      </div>

      <Tabs defaultValue="new-deposit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-deposit" data-testid="tab-new-deposit">New Deposit</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">Deposit History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-deposit">
          <Card>
            <CardHeader>
              <CardTitle>Submit New Deposit</CardTitle>
              <CardDescription>
                Upload proof of payment to add funds to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="asset-type">Asset Type</Label>
                    <Select value={assetType} onValueChange={(value: 'crypto' | 'metal') => setAssetType(value)}>
                      <SelectTrigger data-testid="select-asset-type">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="metal">Precious Metals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                      <SelectTrigger data-testid="select-payment-method">
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

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      data-testid="input-amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proof">Proof of Payment (Optional)</Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="mt-4">
                        <label htmlFor="proof-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                            {proofFile ? proofFile.name : 'Upload proof of payment'}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            PNG, JPG up to 5MB
                          </span>
                        </label>
                        <input
                          id="proof-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          data-testid="input-proof-upload"
                        />
                      </div>
                      {proofFile && (
                        <div className="mt-2 flex items-center justify-center">
                          <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">File ready to upload</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitting || uploading}
                  data-testid="button-submit-deposit"
                >
                  {submitting ? 'Submitting...' : uploading ? 'Uploading...' : 'Submit Deposit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Deposit History</CardTitle>
              <CardDescription>
                Track your deposit requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : deposits.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No deposits found. Submit your first deposit request above.
                </div>
              ) : (
                <div className="space-y-4" data-testid="deposits-list">
                  {deposits.map((deposit) => (
                    <div key={deposit.id} className="border rounded-lg p-4" data-testid={`deposit-${deposit.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{deposit.currency} {deposit.amount}</span>
                            <Badge variant={deposit.assetType === 'crypto' ? 'default' : 'secondary'}>
                              {deposit.assetType === 'crypto' ? 'CRYPTO' : 'METAL'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 capitalize">
                            {deposit.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deposit.status)}
                          {getStatusBadge(deposit.status)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-500 mb-2">
                        Submitted {formatDistanceToNow(new Date(deposit.createdAt))} ago
                        {deposit.approvedAt && (
                          <span className="ml-2">
                            • Approved {formatDistanceToNow(new Date(deposit.approvedAt))} ago
                          </span>
                        )}
                      </div>

                      {deposit.proofImageUrl && (
                        <div className="mb-2">
                          <a 
                            href={deposit.proofImageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            data-testid={`proof-link-${deposit.id}`}
                          >
                            View Proof of Payment →
                          </a>
                        </div>
                      )}

                      {deposit.rejectionReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mt-2">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Rejection Reason:</strong> {deposit.rejectionReason}
                          </p>
                        </div>
                      )}

                      {deposit.adminNotes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 mt-2">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Admin Notes:</strong> {deposit.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}