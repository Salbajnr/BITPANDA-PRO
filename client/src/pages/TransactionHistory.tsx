import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpIcon, ArrowDownIcon, SearchIcon, FilterIcon,
  CalendarIcon, DollarSignIcon, CreditCardIcon
} from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  amount: string;
  price: string;
  total: string;
  fees: string;
  status: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
    enabled: !!user,
  });

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || tx.type === filterType;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = txDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = txDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = txDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const totalVolume = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.total), 0);
  const totalFees = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.fees), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transaction History
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and manage your trading transactions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-transactions"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "buy" | "sell")}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              data-testid="select-transaction-type"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy Orders</option>
              <option value="sell">Sell Orders</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "week" | "month")}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              data-testid="select-date-filter"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <Button 
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setDateFilter("all");
              }}
              variant="outline"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <CreditCardIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Try adjusting your filters or make your first trade</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'buy' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {transaction.type === 'buy' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {transaction.symbol.toUpperCase()}
                        </span>
                        <Badge variant={transaction.type === 'buy' ? 'default' : 'secondary'}>
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {parseFloat(transaction.amount).toLocaleString()} {transaction.symbol.toUpperCase()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      @ ${parseFloat(transaction.price).toLocaleString()}
                    </div>
                    <div className="text-lg font-bold">
                      ${parseFloat(transaction.total).toLocaleString()}
                    </div>
                    {parseFloat(transaction.fees) > 0 && (
                      <div className="text-xs text-slate-400">
                        Fee: ${parseFloat(transaction.fees).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}