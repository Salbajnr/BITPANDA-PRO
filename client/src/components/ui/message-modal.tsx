
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
    iconColor: "text-green-500",
    titleColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-500",
    titleColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
    bgColor: "bg-red-50 dark:bg-red-950/20"
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  confirmation: {
    icon: AlertCircle,
    iconColor: "text-orange-500",
    titleColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
    bgColor: "bg-orange-50 dark:bg-orange-950/20"
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
      <DialogContent className={cn("sm:max-w-md", className)}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        
        <DialogHeader className="space-y-4">
          <div className={cn(
            "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
            config.bgColor
          )}>
            <IconComponent className={cn("h-6 w-6", config.iconColor)} />
          </div>
          
          <DialogTitle className={cn(
            "text-center text-lg font-semibold",
            config.titleColor
          )}>
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          {isConfirmationModal ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className="w-full sm:w-auto"
                variant={type === "error" ? "destructive" : "default"}
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConfirm}
              className="w-full sm:w-auto"
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
