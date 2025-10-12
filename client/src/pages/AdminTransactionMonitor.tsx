
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Activity, Search, Filter, Eye, AlertTriangle, CheckCircle, 
  XCircle, Clock, DollarSign, TrendingUp, TrendingDown,
  Download, RefreshCw, Ban, Unlock, RotateCcw, FileText,
  User, Calendar, Hash, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Transaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'transfer';
  symbol?: string;
  amount: string;
  price?: string;
  total: string;
  fees: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'suspended';
  createdAt: string;
  updatedAt: string;
  username?: string;
  email?: string;
  ipAddress?: string;
  notes?: string;
  flagged?: boolean;
  riskScore?: number;
}

interface TransactionStats {
  totalVolume: number;
  totalTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  suspiciousTransactions: number;
  dailyVolume: number;
  topTradingPairs: Array<{
    symbol: string;
    volume: number;
    count: number;
  }>;
}

export default function AdminTransactionMonitor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);

  // Fetch transaction statistics
  const { data: stats } = useQuery<TransactionStats>({
    queryKey: ['/api/admin/transactions/stats', dateRange],
    queryFn: () => apiRequest('GET', `/api/admin/transactions/stats?range=${dateRange}`),
    refetchInterval: 30000,
  });

  // Fetch transactions with filters
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: [
      '/api/admin/transactions',
      currentPage,
      searchTerm,
      typeFilter,
      statusFilter,
      showSuspiciousOnly
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(showSuspiciousOnly && { suspicious: 'true' })
      });
      return apiRequest('GET', `/api/admin/transactions?${params}`);
    },
    refetchInterval: 10000,
  });

  // Flag transaction mutation
  const flagTransactionMutation = useMutation({
    mutationFn: ({ id, flagged, notes }: { id: string; flagged: boolean; notes?: string }) =>
      apiRequest('POST', `/api/admin/transactions/${id}/flag`, { flagged, notes }),
    onSuccess: () => {
      toast({
        title: "Transaction Updated",
        description: "Transaction flag status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
    },
  });

  // Suspend transaction mutation
  const suspendTransactionMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiRequest('POST', `/api/admin/transactions/${id}/suspend`, { reason }),
    onSuccess: () => {
      toast({
        title: "Transaction Suspended",
        description: "Transaction has been suspended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
    },
  });

  // Reverse transaction mutation
  const reverseTransactionMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiRequest('POST', `/api/admin/transactions/${id}/reverse`, { reason }),
    onSuccess: () => {
      toast({
        title: "Transaction Reversed",
        description: "Transaction has been reversed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
      suspended: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'sell': return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'deposit': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'withdrawal': return <TrendingDown className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskBadge = (score?: number) => {
    if (!score) return null;
    
    if (score >= 80) {
      return <Badge variant="destructive" className="ml-2">High Risk</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800 ml-2">Medium Risk</Badge>;
    } else if (score >= 30) {
      return <Badge variant="outline" className="ml-2">Low Risk</Badge>;
    }
    return null;
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const handleFlagTransaction = (transaction: Transaction) => {
    flagTransactionMutation.mutate({
      id: transaction.id,
      flagged: !transaction.flagged,
      notes: adminNotes || `Transaction ${transaction.flagged ? 'unflagged' : 'flagged'} by admin`
    });
  };

  const transactions = transactionsData?.transactions || [];
  const pagination = transactionsData?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transaction Monitor
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor and manage all platform transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              const data = transactions.map((t: Transaction) => ({
                id: t.id,
                user: t.username,
                type: t.type,
                symbol: t.symbol,
                amount: t.amount,
                total: t.total,
                status: t.status,
                date: new Date(t.createdAt).toLocaleString()
              }));
              
              const csv = [
                Object.keys(data[0]).join(','),
                ...data.map((row: any) => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'transactions.csv';
              a.click();
            }}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] })}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Volume</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume.toString())}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Suspicious</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspiciousTransactions}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="search"
                      placeholder="User, transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="type-filter">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant={showSuspiciousOnly ? "default" : "outline"}
                    onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
                    className="w-full"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {showSuspiciousOnly ? 'Show All' : 'Suspicious Only'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction: Transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{transaction.username}</span>
                            {transaction.flagged && (
                              <Badge variant="destructive" className="text-xs">Flagged</Badge>
                            )}
                            {getRiskBadge(transaction.riskScore)}
                          </div>
                          <p className="text-sm text-slate-500">
                            {transaction.type.toUpperCase()} • {transaction.symbol || 'N/A'} • {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(transaction.total)}</p>
                          <p className="text-sm text-slate-500">
                            {transaction.amount} {transaction.symbol || 'USD'}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions ({pagination.total || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(transaction.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transaction.username}</span>
                          <span className="text-sm text-slate-500">({transaction.email})</span>
                          {transaction.flagged && (
                            <Badge variant="destructive" className="text-xs">Flagged</Badge>
                          )}
                          {getRiskBadge(transaction.riskScore)}
                        </div>
                        <p className="text-sm text-slate-500">
                          ID: {transaction.id} • {transaction.type.toUpperCase()} • {transaction.symbol || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.createdAt).toLocaleString()} • IP: {transaction.ipAddress || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(transaction.total)}</p>
                        <p className="text-sm text-slate-500">
                          {transaction.amount} {transaction.symbol || 'USD'}
                        </p>
                        {transaction.fees && parseFloat(transaction.fees) > 0 && (
                          <p className="text-xs text-slate-400">
                            Fee: {formatCurrency(transaction.fees)}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(transaction.status)}
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFlagTransaction(transaction)}
                          className={transaction.flagged ? 'bg-red-50 border-red-200' : ''}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Transaction ID</Label>
                                    <p className="font-mono text-sm">{selectedTransaction.id}</p>
                                  </div>
                                  <div>
                                    <Label>User</Label>
                                    <p>{selectedTransaction.username} ({selectedTransaction.email})</p>
                                  </div>
                                  <div>
                                    <Label>Type</Label>
                                    <p className="capitalize">{selectedTransaction.type}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div>{getStatusBadge(selectedTransaction.status)}</div>
                                  </div>
                                  <div>
                                    <Label>Amount</Label>
                                    <p>{selectedTransaction.amount} {selectedTransaction.symbol}</p>
                                  </div>
                                  <div>
                                    <Label>Total Value</Label>
                                    <p className="font-bold">{formatCurrency(selectedTransaction.total)}</p>
                                  </div>
                                  <div>
                                    <Label>Fees</Label>
                                    <p>{formatCurrency(selectedTransaction.fees || '0')}</p>
                                  </div>
                                  <div>
                                    <Label>Created</Label>
                                    <p>{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                                  </div>
                                </div>
                                
                                {selectedTransaction.notes && (
                                  <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm bg-slate-50 p-2 rounded">{selectedTransaction.notes}</p>
                                  </div>
                                )}
                                
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add admin notes..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                  />
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                  {selectedTransaction.status === 'completed' && (
                                    <Button
                                      variant="destructive"
                                      onClick={() => reverseTransactionMutation.mutate({
                                        id: selectedTransaction.id,
                                        reason: adminNotes || 'Admin reversal'
                                      })}
                                    >
                                      <RotateCcw className="h-4 w-4 mr-2" />
                                      Reverse Transaction
                                    </Button>
                                  )}
                                  
                                  {selectedTransaction.status !== 'suspended' && (
                                    <Button
                                      variant="outline"
                                      onClick={() => suspendTransactionMutation.mutate({
                                        id: selectedTransaction.id,
                                        reason: adminNotes || 'Admin suspension'
                                      })}
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Suspend
                                    </Button>
                                  )}
                                  
                                  <Button
                                    onClick={() => handleFlagTransaction(selectedTransaction)}
                                    className={selectedTransaction.flagged ? 'bg-red-600 hover:bg-red-700' : ''}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    {selectedTransaction.flagged ? 'Unflag' : 'Flag'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-slate-600">
                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.total)} of {pagination.total} results
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Trading Pairs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topTradingPairs?.map((pair, index) => (
                    <div key={pair.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-800">{index + 1}</span>
                        </div>
                        <span className="font-medium">{pair.symbol}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(pair.volume.toString())}</p>
                        <p className="text-sm text-slate-500">{pair.count} trades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Completed</span>
                    </div>
                    <span className="font-medium">{((stats?.totalTransactions || 0) - (stats?.pendingTransactions || 0) - (stats?.failedTransactions || 0))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Pending</span>
                    </div>
                    <span className="font-medium">{stats?.pendingTransactions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Failed</span>
                    </div>
                    <span className="font-medium">{stats?.failedTransactions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Suspicious</span>
                    </div>
                    <span className="font-medium">{stats?.suspiciousTransactions || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, DollarSign, TrendingUp, Users, 
  RefreshCw, Search, Filter, Download
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorState } from "@/components/ErrorState";

interface Transaction {
  id: string;
  userId: string;
  type: string;
  symbol: string;
  amount: string;
  price: string;
  total: string;
  status: string;
  createdAt: string;
  username?: string;
  email?: string;
}

export default function AdminTransactionMonitor() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/transactions', page, typeFilter, statusFilter, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      });
      return apiRequest('GET', `/api/admin/transactions?${params}`);
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/transactions/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/transactions/stats'),
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "outline"
    };
    return <Badge variant={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingCard count={4} height="h-24" />
        </div>
        <LoadingCard count={1} height="h-96" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load transactions" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transaction Monitor
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor and analyze all platform transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Volume</p>
                  <p className="text-2xl font-bold">${stats.totalVolume || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">24h Volume</p>
                  <p className="text-2xl font-bold">${stats.volume24h || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.transactions?.map((tx: Transaction) => (
              <div key={tx.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{tx.username || 'Unknown User'}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{tx.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">{tx.type.toUpperCase()} {tx.symbol}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {tx.amount} @ ${tx.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-bold">${tx.total}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
