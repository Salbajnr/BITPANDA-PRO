
import { useGlobalMessageModal } from '@/contexts/MessageModalContext'
import { createMessageService } from '@/services/messageService'

export function useAppMessages() {
  const modalFunctions = useGlobalMessageModal()
  const messageService = createMessageService(modalFunctions)

  return {
    ...modalFunctions,
    ...messageService
  }
}
