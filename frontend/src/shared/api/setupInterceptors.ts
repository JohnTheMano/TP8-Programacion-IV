import axiosInstance from './api'
import { useAuthStore } from '@/features/auth'
import { useNotificationStore } from '@/store/notificationStore'

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthRequest = url.includes('/auth/token') || url.includes('/auth/me')

    if (status === 401 && !isAuthRequest) {
      useAuthStore.getState().clearSession()
    }

    if (status === 403) {
      useNotificationStore.getState().showNotification('Acceso denegado')
    }

    return Promise.reject(error)
  },
)
