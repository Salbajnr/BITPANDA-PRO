
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PriceAlertModal from './PriceAlertModal';

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: string;
  alertType: 'above' | 'below';
  isActive: boolean;
  isTriggered: boolean;
  createdAt: string;
}

export default function PriceAlertsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery<PriceAlert[]>({
    queryKey: ['/api/alerts/list'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/list');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ alertId, updates }: { alertId: string; updates: any }) => {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update alert');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/list'] });
      toast({
        title: "Alert Updated",
        description: "Alert settings have been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete alert');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/list'] });
      toast({
        title: "Alert Deleted",
        description: "Price alert has been removed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleAlert = (alertId: string, currentState: boolean) => {
    updateAlertMutation.mutate({
      alertId,
      updates: { isActive: !currentState },
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      deleteAlertMutation.mutate(alertId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alerts ({alerts.length})
          </CardTitle>
          <PriceAlertModal onSuccess={() => queryClient.invalidateQueries({ queryKey: ['/api/alerts/list'] })} />
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-4">No price alerts set</div>
            <PriceAlertModal onSuccess={() => queryClient.invalidateQueries({ queryKey: ['/api/alerts/list'] })} />
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {alert.alertType === 'above' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <div className="font-medium">{alert.symbol}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {alert.alertType === 'above' ? 'Above' : 'Below'} ${parseFloat(alert.targetPrice).toFixed(2)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {alert.isTriggered && (
                      <Badge variant="destructive">Triggered</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={() => handleToggleAlert(alert.id, alert.isActive)}
                    disabled={updateAlertMutation.isPending}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={deleteAlertMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
