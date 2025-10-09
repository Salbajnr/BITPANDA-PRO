
"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useMessageModal } from '@/components/ui/message-modal'

interface MessageModalContextType {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void
}

const MessageModalContext = createContext<MessageModalContextType | undefined>(undefined)

export const useMessageModalContext = () => {
  const context = useContext(MessageModalContext)
  if (!context) {
    throw new Error('useMessageModalContext must be used within MessageModalProvider')
  }
  return context
}

interface MessageModalProviderProps {
  children: ReactNode
}

export function MessageModalProvider({ children }: MessageModalProviderProps) {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showConfirmation,
    modal 
  } = useMessageModal();

  return (
    <MessageModalContext.Provider value={{ 
      showSuccess, 
      showError,
      showWarning,
      showInfo,
      showConfirmation
    }}>
      {children}
      {modal}
    </MessageModalContext.Provider>
  )
}
