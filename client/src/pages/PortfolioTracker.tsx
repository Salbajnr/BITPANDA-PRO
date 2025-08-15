
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  DollarSign,
  PieChart,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Holding {
  id: number;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  change24h: number;
  investedAmount: number;
}

interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  holdings: Holding[];
}

export default function PortfolioTracker() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: '',
    price: ''
  });

  const queryClient = useQueryClient();

  const { data: portfolio, isLoading, refetch } = useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await fetch('/api/portfolio', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const addHoldingMutation = useMutation({
    mutationFn: async (holding: { symbol: string; quantity: number; price: number }) => {
      const response = await fetch('/api/portfolio/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(holding)
      });
      if (!response.ok) throw new Error('Failed to add holding');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setIsAddDialogOpen(false);
      setNewHolding({ symbol: '', quantity: '', price: '' });
    }
  });

  const removeHoldingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to remove holding');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  const handleAddHolding = () => {
    if (newHolding.symbol && newHolding.quantity && newHolding.price) {
      addHoldingMutation.mutate({
        symbol: newHolding.symbol.toUpperCase(),
        quantity: parseFloat(newHolding.quantity),
        price: parseFloat(newHolding.price)
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4AA]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Tracker</h1>
            <p className="text-gray-400">Track your cryptocurrency investments in real-time</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm"
              className="border-[#2B2F36] hover:bg-[#1E2329]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00D4AA] hover:bg-[#00B89F] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holding
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#161A1E] border-[#2B2F36] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Holding</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symbol">Cryptocurrency Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="BTC, ETH, ADA..."
                      value={newHolding.symbol}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value }))}
                      className="bg-[#1E2329] border-[#2B2F36] text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.00000001"
                      placeholder="0.0"
                      value={newHolding.quantity}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, quantity: e.target.value }))}
                      className="bg-[#1E2329] border-[#2B2F36] text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Average Buy Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newHolding.price}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, price: e.target.value }))}
                      className="bg-[#1E2329] border-[#2B2F36] text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleAddHolding} 
                    className="w-full bg-[#00D4AA] hover:bg-[#00B89F]"
                    disabled={addHoldingMutation.isPending}
                  >
                    {addHoldingMutation.isPending ? 'Adding...' : 'Add Holding'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolio && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#161A1E] border-[#2B2F36]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(portfolio.totalValue)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#00D4AA]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161A1E] border-[#2B2F36]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Invested</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(portfolio.totalInvested)}
                      </p>
                    </div>
                    <PieChart className="w-8 h-8 text-[#FFB82F]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161A1E] border-[#2B2F36]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total P&L</p>
                      <p className={`text-2xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-[#00D4AA]' : 'text-[#F6465D]'}`}>
                        {formatCurrency(portfolio.totalProfitLoss)}
                      </p>
                    </div>
                    {portfolio.totalProfitLoss >= 0 ? 
                      <TrendingUp className="w-8 h-8 text-[#00D4AA]" /> : 
                      <TrendingDown className="w-8 h-8 text-[#F6465D]" />
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161A1E] border-[#2B2F36]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total P&L %</p>
                      <p className={`text-2xl font-bold ${portfolio.totalProfitLossPercent >= 0 ? 'text-[#00D4AA]' : 'text-[#F6465D]'}`}>
                        {formatPercent(portfolio.totalProfitLossPercent)}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#3B82F6]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Holdings Table */}
            <Card className="bg-[#161A1E] border-[#2B2F36]">
              <CardHeader>
                <CardTitle className="text-white">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.holdings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No holdings found</p>
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-[#00D4AA] hover:bg-[#00B89F]"
                    >
                      Add Your First Holding
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-[#2B2F36]">
                          <th className="text-left py-3 px-2">Asset</th>
                          <th className="text-right py-3 px-2">Quantity</th>
                          <th className="text-right py-3 px-2">Avg Price</th>
                          <th className="text-right py-3 px-2">Current Price</th>
                          <th className="text-right py-3 px-2">Value</th>
                          <th className="text-right py-3 px-2">P&L</th>
                          <th className="text-right py-3 px-2">24h Change</th>
                          <th className="text-right py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.holdings.map((holding) => (
                          <tr key={holding.id} className="border-b border-[#2B2F36]/50 hover:bg-[#1E2329]/50">
                            <td className="py-4 px-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#00D4AA] rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                  {holding.symbol.slice(0, 2)}
                                </div>
                                <span className="font-medium">{holding.symbol}</span>
                              </div>
                            </td>
                            <td className="text-right py-4 px-2">{holding.quantity.toFixed(8)}</td>
                            <td className="text-right py-4 px-2">{formatCurrency(holding.averagePrice)}</td>
                            <td className="text-right py-4 px-2">{formatCurrency(holding.currentPrice)}</td>
                            <td className="text-right py-4 px-2 font-medium">{formatCurrency(holding.currentValue)}</td>
                            <td className={`text-right py-4 px-2 font-medium ${holding.profitLoss >= 0 ? 'text-[#00D4AA]' : 'text-[#F6465D]'}`}>
                              {formatCurrency(holding.profitLoss)}
                              <br />
                              <span className="text-xs">
                                {formatPercent(holding.profitLossPercent)}
                              </span>
                            </td>
                            <td className="text-right py-4 px-2">
                              <Badge 
                                variant={holding.change24h >= 0 ? "default" : "destructive"}
                                className={holding.change24h >= 0 ? 'bg-[#00D4AA] hover:bg-[#00B89F]' : 'bg-[#F6465D] hover:bg-[#F6465D]/80'}
                              >
                                {formatPercent(holding.change24h)}
                              </Badge>
                            </td>
                            <td className="text-right py-4 px-2">
                              <Button
                                onClick={() => removeHoldingMutation.mutate(holding.id)}
                                variant="outline"
                                size="sm"
                                className="border-[#F6465D] text-[#F6465D] hover:bg-[#F6465D] hover:text-white"
                                disabled={removeHoldingMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
