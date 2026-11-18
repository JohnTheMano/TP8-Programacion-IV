
import { create } from 'zustand'
import axiosInstance from '@/shared/api/api'
import type { UsuarioAuth, AuthStoreState } from '../types/auth.types'

interface AuthStore extends AuthStoreState {
    clearSession: () => void
}

const AUTH_URL = '/api/v1/auth'

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    status: 'checking',
    login: async (email, password) => {
        const params = new URLSearchParams()
        params.append('username', email)
        params.append('password', password)
        params.append('grant_type', 'password')

        await axiosInstance.post(`${AUTH_URL}/token`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        const response = await axiosInstance.get<UsuarioAuth>(`${AUTH_URL}/me`)
        set({ user: response.data, status: 'authenticated' })
    },
    logout: async () => {
        try {
            await axiosInstance.post(`${AUTH_URL}/logout`)
        } finally {
            set({ user: null, status: 'unauthenticated' })
        }
    },
    checkSession: async () => {
        set({ status: 'checking' })
        try {
            const response = await axiosInstance.get<UsuarioAuth>(`${AUTH_URL}/me`)
            set({ user: response.data, status: 'authenticated' })
        } catch {
            set({ user: null, status: 'unauthenticated' })
        }
    },
    clearSession: () => set({ user: null, status: 'unauthenticated' }),
}))
