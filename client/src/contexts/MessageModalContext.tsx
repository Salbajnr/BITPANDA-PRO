"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { MessageModal, useMessageModal } from '@/components/ui/message-modal'

interface MessageModalContextType {
  showMessage: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const MessageModalContext = createContext<MessageModalContextType | undefined>(undefined);

export function MessageModalProvider({ children }: { children: ReactNode }) {
  const { showMessage, messageState } = useMessageModal();

  return (
    <MessageModalContext.Provider value={{ showMessage }}>
      {children}
      <MessageModal {...messageState} />
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