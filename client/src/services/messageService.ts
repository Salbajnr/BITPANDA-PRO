export interface MessageServiceType {
  showApiError: (error: any) => void;
  showSuccessMessage: (message: string) => void;
  showValidationErrors: (errors: string[]) => void;
  confirmDeletion: (itemName: string, onConfirm: () => void) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface ModalFunctions {
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      onCancel?: () => void;
    }
  ) => void;
}

export function createMessageService(modalFunctions: ModalFunctions): MessageServiceType {
  return {
    showApiError: (error: any) => {
      const errorMessage = error?.message || error?.error || 'An unexpected error occurred';
      modalFunctions.showError('Error', errorMessage);
    },

    showSuccessMessage: (message: string) => {
      modalFunctions.showSuccess('Success', message);
    },

    showValidationErrors: (errors: string[]) => {
      const errorMessage = errors.join('\n');
      modalFunctions.showError('Validation Error', errorMessage);
    },

    confirmDeletion: (itemName: string, onConfirm: () => void) => {
      modalFunctions.showConfirmation(
        'Confirm Deletion',
        `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
        onConfirm,
        {
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      );
    },

    showInfo: (title: string, message: string) => {
      modalFunctions.showInfo(title, message);
    },

    showWarning: (title: string, message: string) => {
      modalFunctions.showWarning(title, message);
    }
  };
}