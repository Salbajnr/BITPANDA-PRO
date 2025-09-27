
interface MessageService {
  showTradeSuccess: (asset: string, amount: number, type: 'buy' | 'sell') => void
  showTradeError: (error: string) => void
  showDepositSuccess: (amount: number, currency: string) => void
  showWithdrawalConfirmation: (amount: number, currency: string, onConfirm: () => void) => void
  showKycRequired: () => void
  showInsufficientBalance: () => void
  showMaintenanceNotice: () => void
}

export function createMessageService(modalFunctions: {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  showConfirmation: (title: string, message: string, onConfirm: () => void, options?: any) => void
}): MessageService {
  const { showSuccess, showError, showWarning, showInfo, showConfirmation } = modalFunctions

  return {
    showTradeSuccess: (asset: string, amount: number, type: 'buy' | 'sell') => {
      showSuccess(
        'Trade Executed Successfully',
        `Your ${type} order for ${amount} ${asset} has been completed.`
      )
    },

    showTradeError: (error: string) => {
      showError(
        'Trade Failed',
        `Your trade could not be completed: ${error}. Please try again.`
      )
    },

    showDepositSuccess: (amount: number, currency: string) => {
      showSuccess(
        'Deposit Successful',
        `${amount} ${currency} has been successfully added to your account.`
      )
    },

    showWithdrawalConfirmation: (amount: number, currency: string, onConfirm: () => void) => {
      showConfirmation(
        'Confirm Withdrawal',
        `Are you sure you want to withdraw ${amount} ${currency}? This action cannot be undone.`,
        onConfirm,
        {
          confirmText: 'Withdraw',
          cancelText: 'Cancel'
        }
      )
    },

    showKycRequired: () => {
      showWarning(
        'KYC Verification Required',
        'Please complete your identity verification to access this feature.'
      )
    },

    showInsufficientBalance: () => {
      showError(
        'Insufficient Balance',
        'You do not have enough funds to complete this transaction.'
      )
    },

    showMaintenanceNotice: () => {
      showInfo(
        'System Maintenance',
        'This feature is temporarily unavailable due to scheduled maintenance.'
      )
    }
  }
}
