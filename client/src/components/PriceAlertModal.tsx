
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Plus, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: string;
  condition: 'above' | 'below';
  message?: string;
  isActive: boolean;
  createdAt: string;
}

interface PriceAlertModalProps {
  alert?: PriceAlert;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const cryptocurrencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'XLM', name: 'Stellar' },
];

export function PriceAlertModal({ alert, trigger, isOpen, onOpenChange }: PriceAlertModalProps) {
  const [open, setOpen] = useState(isOpen || false);
  const [formData, setFormData] = useState({
    symbol: alert?.symbol || '',
    name: alert?.name || '',
    targetPrice: alert?.targetPrice || '',
    condition: alert?.condition || 'above' as 'above' | 'below',
    message: alert?.message || '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.symbol && !formData.name) {
      const crypto = cryptocurrencies.find(c => c.symbol === formData.symbol);
      if (crypto) {
        setFormData(prev => ({ ...prev, name: crypto.name }));
      }
    }
  }, [formData.symbol]);

  const createAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alertData,
          targetPrice: parseFloat(alertData.targetPrice),
        }),
        credentials: 'include',
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
        description: "Your price alert has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create alert",
        variant: "destructive",
      });
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      const response = await fetch(`/api/alerts/${alert!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alertData,
          targetPrice: parseFloat(alertData.targetPrice),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update alert');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Alert Updated",
        description: "Your price alert has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      targetPrice: '',
      condition: 'above',
      message: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.targetPrice) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parseFloat(formData.targetPrice)) || parseFloat(formData.targetPrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid target price",
        variant: "destructive",
      });
      return;
    }

    if (alert) {
      updateAlertMutation.mutate(formData);
    } else {
      createAlertMutation.mutate(formData);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!newOpen && !alert) {
      resetForm();
    }
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" />
      Create Alert
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            {alert ? 'Edit Price Alert' : 'Create Price Alert'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Cryptocurrency</Label>
              <Select 
                value={formData.symbol} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, symbol: value }))}
                disabled={!!alert} // Can't change symbol for existing alerts
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crypto" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-gray-500">{crypto.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value: 'above' | 'below') => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Above</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="below">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span>Below</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="targetPrice">Target Price (USD)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.000001"
              placeholder="0.00"
              value={formData.targetPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, targetPrice: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Alert Name</Label>
            <Input
              id="name"
              placeholder="e.g., Bitcoin Moon Alert"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Custom notification message..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData.symbol && formData.targetPrice && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Label className="text-sm font-medium">Preview:</Label>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Alert me when <Badge variant="outline">{formData.symbol}</Badge> goes{' '}
                <Badge variant={formData.condition === 'above' ? 'default' : 'destructive'}>
                  {formData.condition}
                </Badge>{' '}
                <Badge variant="secondary">${formData.targetPrice}</Badge>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAlertMutation.isPending || updateAlertMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createAlertMutation.isPending || updateAlertMutation.isPending ? (
                'Saving...'
              ) : alert ? (
                'Update Alert'
              ) : (
                'Create Alert'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
