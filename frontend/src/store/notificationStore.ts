import { create } from 'zustand'

interface NotificationStore {
  message: string
  visible: boolean
  showNotification: (message: string) => void
  hideNotification: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  message: '',
  visible: false,
  showNotification: (message) => set({ message, visible: true }),
  hideNotification: () => set({ visible: false }),
}))
