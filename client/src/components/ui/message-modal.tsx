
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

export type MessageType = "success" | "error" | "warning" | "info" | "confirmation"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  type: MessageType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCloseButton?: boolean
  className?: string
}

const messageConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    bgColor: "bg-green-100 dark:bg-green-900/40"
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    bgColor: "bg-red-100 dark:bg-red-900/40"
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    bgColor: "bg-amber-100 dark:bg-amber-900/40"
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    bgColor: "bg-blue-100 dark:bg-blue-900/40"
  },
  confirmation: {
    icon: AlertCircle,
    iconColor: "text-orange-600 dark:text-orange-400",
    titleColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    bgColor: "bg-orange-100 dark:bg-orange-900/40"
  }
}

export function MessageModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCloseButton = true,
  className
}: MessageModalProps) {
  const config = messageConfig[type]
  const IconComponent = config.icon

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  const isConfirmationModal = type === "confirmation" && onConfirm

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md max-w-sm w-full mx-4",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        "shadow-xl backdrop-blur-sm opacity-100",
        className
      )}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 opacity-80 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="sr-only">Close</span>
          </button>
        )}
        
        <DialogHeader className="space-y-4 pb-4">
          <div className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2",
            config.bgColor,
            config.borderColor
          )}>
            <IconComponent className={cn("h-7 w-7", config.iconColor)} />
          </div>
          
          <DialogTitle className={cn(
            "text-center text-xl font-semibold leading-6",
            config.titleColor
          )}>
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-300 leading-5 px-2">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center pt-4">
          {isConfirmationModal ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-28 h-10 font-medium"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className="w-full sm:w-28 h-10 font-medium"
                variant={type === "error" ? "destructive" : "default"}
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConfirm}
              className="w-full sm:w-28 h-10 font-medium"
              variant={type === "error" ? "destructive" : "default"}
            >
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easier usage
export function useMessageModal() {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean
    type: MessageType
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: ""
  })

  const showMessage = React.useCallback((
    type: MessageType,
    title: string,
    message: string,
    options?: {
      confirmText?: string
      cancelText?: string
      onConfirm?: () => void
      onCancel?: () => void
    }
  ) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      ...options
    })
  }, [])

  const closeModal = React.useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const showSuccess = React.useCallback((title: string, message: string) => {
    showMessage("success", title, message)
  }, [showMessage])

  const showError = React.useCallback((title: string, message: string) => {
    showMessage("error", title, message)
  }, [showMessage])

  const showWarning = React.useCallback((title: string, message: string) => {
    showMessage("warning", title, message)
  }, [showMessage])

  const showInfo = React.useCallback((title: string, message: string) => {
    showMessage("info", title, message)
  }, [showMessage])

  const showConfirmation = React.useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string
      cancelText?: string
      onCancel?: () => void
    }
  ) => {
    showMessage("confirmation", title, message, {
      onConfirm,
      ...options
    })
  }, [showMessage])

  return {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    MessageModalComponent: () => (
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
    )
  }
}
