
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PriceAlertModal from './PriceAlertModal';
import { getCryptoLogo } from './CryptoLogos';

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

function PriceAlertsList() {
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      return response.json();
    },
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle alert');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert Updated",
        description: "Alert status has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete alert');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert Deleted",
        description: "Your price alert has been deleted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete alert",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num < 0.01) return `$${num.toFixed(6)}`;
    if (num < 1) return `$${num.toFixed(4)}`;
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Price Alerts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your cryptocurrency price notifications
          </p>
        </div>
        <PriceAlertModal />
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Price Alerts Yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first price alert to get notified when your favorite cryptocurrencies reach your target prices.
            </p>
            <PriceAlertModal 
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Alert
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert: PriceAlert) => (
            <Card key={alert.id} className={`transition-all ${alert.isActive ? 'border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700 opacity-60'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={getCryptoLogo(alert.symbol)}
                      alt={alert.symbol}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {alert.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.symbol.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Alert when price goes</span>
                        {alert.condition === 'above' ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>above</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600">
                            <TrendingDown className="h-3 w-3" />
                            <span>below</span>
                          </div>
                        )}
                        <Badge variant={alert.condition === 'above' ? 'default' : 'destructive'}>
                          {formatPrice(alert.targetPrice)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created {formatDate(alert.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      {alert.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlertMutation.mutate(alert.id)}
                        disabled={toggleAlertMutation.isPending}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAlert(alert)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {alert.message && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Message:</span> {alert.message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingAlert && (
        <PriceAlertModal
          alert={editingAlert}
          isOpen={!!editingAlert}
          onOpenChange={(open) => !open && setEditingAlert(null)}
        />
      )}
    </div>
  );
}

export default PriceAlertsList;
