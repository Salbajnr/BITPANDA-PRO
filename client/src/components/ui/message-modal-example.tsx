
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMessageModal } from "@/components/ui/message-modal"

export function MessageModalExample() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    MessageModalComponent
  } = useMessageModal()

  const handleSuccess = () => {
    showSuccess(
      "Transaction Successful",
      "Your cryptocurrency purchase has been completed successfully."
    )
  }

  const handleError = () => {
    showError(
      "Transaction Failed",
      "Unable to process your transaction. Please check your balance and try again."
    )
  }

  const handleWarning = () => {
    showWarning(
      "Market Volatility Warning",
      "High volatility detected in the market. Please trade with caution."
    )
  }

  const handleInfo = () => {
    showInfo(
      "System Maintenance",
      "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM UTC."
    )
  }

  const handleConfirmation = () => {
    showConfirmation(
      "Confirm Withdrawal",
      "Are you sure you want to withdraw $10,000? This action cannot be undone.",
      () => {
        console.log("Withdrawal confirmed")
        showSuccess("Withdrawal Initiated", "Your withdrawal request has been submitted.")
      },
      {
        confirmText: "Withdraw",
        cancelText: "Cancel"
      }
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Message Modal Examples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Button onClick={handleSuccess} variant="default">
            Success Modal
          </Button>
          <Button onClick={handleError} variant="destructive">
            Error Modal
          </Button>
          <Button onClick={handleWarning} variant="outline">
            Warning Modal
          </Button>
          <Button onClick={handleInfo} variant="secondary">
            Info Modal
          </Button>
          <Button onClick={handleConfirmation} variant="outline">
            Confirmation Modal
          </Button>
        </div>
        
        <MessageModalComponent />
      </CardContent>
    </Card>
  )
}
