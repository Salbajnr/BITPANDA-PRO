
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriceAlertModalProps {
  symbol?: string;
  currentPrice?: number;
  onSuccess?: () => void;
}

export default function PriceAlertModal({ symbol: initialSymbol, currentPrice, onSuccess }: PriceAlertModalProps) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState(initialSymbol || '');
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAlertMutation = useMutation({
    mutationFn: async (data: { symbol: string; targetPrice: string; alertType: 'above' | 'below' }) => {
      const response = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create alert');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Alert Created",
        description: `Price alert set for ${symbol} at $${targetPrice}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/list'] });
      setOpen(false);
      setSymbol('');
      setTargetPrice('');
      setAlertType('above');
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol || !targetPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    createAlertMutation.mutate({
      symbol: symbol.toUpperCase(),
      targetPrice: price.toString(),
      alertType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          {initialSymbol ? 'Set Alert' : 'Create Alert'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Cryptocurrency</Label>
            <Input
              id="symbol"
              placeholder="e.g., BTC, ETH, ADA"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              disabled={!!initialSymbol}
            />
            {currentPrice && (
              <div className="text-sm text-muted-foreground">
                Current price: ${currentPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetPrice">Target Price ($)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alertType">Alert Type</Label>
            <Select value={alertType} onValueChange={(value: 'above' | 'below') => setAlertType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price goes above target</SelectItem>
                <SelectItem value="below">Price goes below target</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createAlertMutation.isPending}
            >
              {createAlertMutation.isPending ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
