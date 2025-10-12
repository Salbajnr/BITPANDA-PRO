
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface WithdrawalConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawal: {
    amount: string;
    currency: string;
    method: string;
    destination: string;
    fees: string;
    netAmount: string;
  } | null;
  onConfirm: (code: string) => void;
  isConfirming?: boolean;
}

export default function WithdrawalConfirmationDialog({
  open,
  onOpenChange,
  withdrawal,
  onConfirm,
  isConfirming = false,
}: WithdrawalConfirmationDialogProps) {
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleConfirm = () => {
    onConfirm(confirmationCode);
    setConfirmationCode('');
  };

  if (!withdrawal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Withdrawal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Please review your withdrawal details carefully. This action cannot be undone.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold">{withdrawal.amount} {withdrawal.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
              <span className="font-semibold">{withdrawal.method.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Destination:</span>
              <span className="font-semibold text-xs truncate max-w-xs">{withdrawal.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fees:</span>
              <span className="font-semibold text-red-600">{withdrawal.fees} {withdrawal.currency}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold">You will receive:</span>
              <span className="font-bold text-green-600">{withdrawal.netAmount} {withdrawal.currency}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmation-code">
              Enter confirmation code (sent to your email)
            </Label>
            <Input
              id="confirmation-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              maxLength={6}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={confirmationCode.length !== 6 || isConfirming}
            className="bg-green-600 hover:bg-green-700"
          >
            {isConfirming ? (
              "Confirming..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Withdrawal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
