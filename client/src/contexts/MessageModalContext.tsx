
"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useMessageModal, MessageType } from '@/components/ui/message-modal'

interface MessageModalContextType {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string
      cancelText?: string
      onCancel?: () => void
    }
  ) => void
}

const MessageModalContext = createContext<MessageModalContextType | undefined>(undefined)

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
    MessageModalComponent
  } = useMessageModal()

  const contextValue: MessageModalContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation
  }

  return (
    <MessageModalContext.Provider value={contextValue}>
      {children}
      <MessageModalComponent />
    </MessageModalContext.Provider>
  )
}

export function useGlobalMessageModal() {
  const context = useContext(MessageModalContext)
  if (context === undefined) {
    throw new Error('useGlobalMessageModal must be used within a MessageModalProvider')
  }
  return context
}
