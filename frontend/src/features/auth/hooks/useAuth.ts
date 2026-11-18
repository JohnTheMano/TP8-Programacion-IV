import axios from 'axios'
import axiosInstance from '@/shared/api/api'
import { useAuthStore } from '../store/authStore'
import type { RegisterData } from '../types/auth.types'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const loginWithStore = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const checkSession = useAuthStore((state) => state.checkSession)

  const login = async (email: string, password: string) => {
    try {
      await loginWithStore(email, password)
    } catch (error: unknown) {
      const detail = axios.isAxiosError<{ detail?: string }>(error)
        ? error.response?.data?.detail
        : undefined
      throw new Error(
        detail ?? 'No se pudo iniciar sesión. Verificá tus credenciales.',
        { cause: error },
      )
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await axiosInstance.post('/api/v1/auth/register', data)
    } catch (error: unknown) {
      const detail = axios.isAxiosError<{ detail?: string }>(error)
        ? error.response?.data?.detail
        : undefined
      throw new Error(detail ?? 'No se pudo completar el registro.', { cause: error })
    }
  }

  return { user, status, login, logout, checkSession, register }
}
