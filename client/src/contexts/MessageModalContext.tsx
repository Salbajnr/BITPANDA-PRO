"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { MessageModal, useMessageModal } from '@/components/ui/message-modal'

interface MessageModalContextType {
  showMessage: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const MessageModalContext = createContext<MessageModalContextType | undefined>(undefined);

export function MessageModalProvider({ children }: { children: ReactNode }) {
  const {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo
  } = useMessageModal();

  const showMessage = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    switch (type) {
      case 'success':
        showSuccess(title, message);
        break;
      case 'error':
        showError(title, message);
        break;
      case 'warning':
        showWarning(title, message);
        break;
      case 'info':
      default:
        showInfo(title, message);
        break;
    }
  };

  return (
    <MessageModalContext.Provider value={{ showMessage }}>
      {children}
      <MessageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
      />
    </MessageModalContext.Provider>
  );
}

export function useGlobalMessageModal() {
  const context = useContext(MessageModalContext);
  if (!context) {
    throw new Error('useGlobalMessageModal must be used within MessageModalProvider');
  }
  return context;
}