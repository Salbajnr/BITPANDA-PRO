import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { getCryptoLogo } from "@/components/CryptoLogos";
import {
  ArrowUpRight, ArrowDownLeft, Search, Filter, Download,
  Calendar, TrendingUp, TrendingDown, Activity, Clock,
  RefreshCw, FileText, DollarSign, Coins, CheckCircle,
  AlertCircle, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  symbol: string;
  amount: string;
  price: string;
  total: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export default function TransactionHistory() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  // Fetch transaction history
  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: () => api.get('/transactions'),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Filter transactions based on search and filters
  const filteredTransactions = transactions?.filter((transaction: Transaction) => {
    const matchesSearch = 
      transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case '7d':
          matchesDate = daysDiff <= 7;
          break;
        case '30d':
          matchesDate = daysDiff <= 30;
          break;
        case '90d':
          matchesDate = daysDiff <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(8);
  };

  const formatCurrency = (value: string) => {
    return `$${parseFloat(value).toLocaleString()}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'sell':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-green-600';
      case 'sell':
        return 'text-red-600';
      case 'deposit':
        return 'text-blue-600';
      case 'withdrawal':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const exportTransactions = () => {
    if (!filteredTransactions) return;
    
    const csvContent = [
      ['Date', 'Type', 'Symbol', 'Amount', 'Price', 'Total', 'Status'],
      ...filteredTransactions.map((tx: Transaction) => [
        formatDate(tx.createdAt),
        tx.type.toUpperCase(),
        tx.symbol,
        tx.amount,
        tx.price,
        tx.total,
        tx.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border border-gray-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-black mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">
                Please login to view your transaction history
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-green-500 hover:bg-green-600">
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Transaction History</h1>
          <p className="text-xl text-gray-600">
            Complete record of all your trading activities and transactions
          </p>
        </div>

        {/* Filters */}
        <Card className="border border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy Orders</SelectItem>
                  <SelectItem value="sell">Sell Orders</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  onClick={exportTransactions}
                  variant="outline"
                  className="border-gray-300 hover:border-green-500"
                  disabled={!filteredTransactions?.length}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-gray-600">Loading transaction history...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-semibold text-black mb-2">Error Loading Transactions</h3>
              <p className="text-gray-600 mb-4">
                Unable to load your transaction history. Please try again.
              </p>
              <Button onClick={() => refetch()} className="bg-green-500 hover:bg-green-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : !filteredTransactions?.length ? (
          <Card className="border border-gray-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-black mb-2">No Transactions Found</h3>
              <p className="text-gray-600 mb-6">
                {transactions?.length ? 
                  "No transactions match your current filters." :
                  "You haven't made any transactions yet. Start trading to see your history here."
                }
              </p>
              {!transactions?.length && (
                <Button onClick={() => navigate('/trading')} className="bg-green-500 hover:bg-green-600">
                  Start Trading
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction: Transaction) => (
              <Card key={transaction.id} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Transaction Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <img 
                          src={getCryptoLogo(transaction.symbol)} 
                          alt={transaction.symbol}
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-semibold text-lg ${getTypeColor(transaction.type)}`}>
                              {transaction.type.toUpperCase()}
                            </span>
                            <span className="font-medium text-black">{transaction.symbol}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Amount</div>
                          <div className="font-medium text-black">
                            {formatAmount(transaction.amount)} {transaction.symbol}
                          </div>
                        </div>
                        
                        {transaction.price && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Price</div>
                            <div className="font-medium text-black">
                              {formatCurrency(transaction.price)}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total</div>
                          <div className="font-bold text-black text-lg">
                            {formatCurrency(transaction.total)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and ID */}
                    <div className="text-right">
                      <div className="mb-2">
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        ID: {transaction.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredTransactions?.length > 0 && (
          <Card className="border border-gray-200 mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">
                    {filteredTransactions.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Transactions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredTransactions.filter((tx: Transaction) => tx.type === 'buy').length}
                  </div>
                  <div className="text-sm text-gray-500">Buy Orders</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredTransactions.filter((tx: Transaction) => tx.type === 'sell').length}
                  </div>
                  <div className="text-sm text-gray-500">Sell Orders</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(
                      filteredTransactions
                        .reduce((sum: number, tx: Transaction) => sum + parseFloat(tx.total), 0)
                        .toString()
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Total Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}