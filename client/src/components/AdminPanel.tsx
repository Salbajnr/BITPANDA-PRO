import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Plus, Minus, RotateCcw } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AdminPanelProps {
  users: any[];
}

export default function AdminPanel({ users }: AdminPanelProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [reason, setReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectedUser = users.find(u => u.id === selectedUserId);

  const balanceAdjustmentMutation = useMutation({
    mutationFn: async (adjustmentData: any) => {
      await apiRequest('POST', '/api/admin/simulate-balance', adjustmentData);
    },
    onSuccess: () => {
      toast({
        title: "Balance Adjustment Successful",
        description: `User balance has been ${adjustmentType === 'add' ? 'increased' : adjustmentType === 'remove' ? 'decreased' : 'set'} successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/adjustments'] });
      // Reset form
      setAmount('');
      setReason('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Admin access required",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Adjustment Failed",
        description: "Unable to adjust user balance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBalanceAdjustment = () => {
    if (!selectedUserId || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select a user and enter an amount.",
        variant: "destructive",
      });
      return;
    }

    balanceAdjustmentMutation.mutate({
      targetUserId: selectedUserId,
      adjustmentType,
      amount,
      currency,
      reason: reason || `${adjustmentType.charAt(0).toUpperCase() + adjustmentType.slice(1)} balance adjustment`,
    });
  };

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Balance Simulation Control
            </CardTitle>
            <CardDescription>
              Simulate balance changes for user accounts. Changes appear real to users but are tracked separately.
            </CardDescription>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-full">
            <span className="text-red-600 dark:text-red-400 text-xs font-semibold">ADMIN ONLY</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to modify" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Adjustment Type */}
            <div>
              <Label>Adjustment Type</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'add' ? 'default' : 'outline'}
                  className={`flex-1 ${adjustmentType === 'add' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setAdjustmentType('add')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                  className={`flex-1 ${adjustmentType === 'remove' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setAdjustmentType('remove')}
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'set' ? 'default' : 'outline'}
                  className={`flex-1 ${adjustmentType === 'set' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => setAdjustmentType('set')}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Set
                </Button>
              </div>
            </div>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for balance adjustment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Current User Balance Display */}
          {selectedUser && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Current Balance - {selectedUser.firstName} {selectedUser.lastName}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white dark:bg-slate-700 rounded">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total USD</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    ${selectedUser.portfolio ? parseFloat(selectedUser.portfolio.totalValue).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-700 rounded">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Available Cash</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    ${selectedUser.portfolio ? parseFloat(selectedUser.portfolio.availableCash).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-700 rounded">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Account Status</p>
                  <p className="text-sm font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleBalanceAdjustment}
            disabled={balanceAdjustmentMutation.isPending || !selectedUserId || !amount}
            className={`w-full py-3 font-medium transition-colors ${
              adjustmentType === 'add'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : adjustmentType === 'remove'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {balanceAdjustmentMutation.isPending ? 'Processing...' : 
             adjustmentType === 'add' ? 'Add Funds' :
             adjustmentType === 'remove' ? 'Remove Funds' :
             'Set Balance'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
