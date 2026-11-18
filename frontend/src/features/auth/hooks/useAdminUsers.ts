import axios from 'axios'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/shared/api/api'
import { useNotificationStore } from '@/store/notificationStore'

interface AdminUser {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  roles: string[]
  activo: boolean
}

interface SetUserActiveVariables {
  userId: number
  active: boolean
}

const ADMIN_USERS_QUERY_KEY = ['admin-users']

export function useAdminUsers() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const query = useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await axiosInstance.get<AdminUser[]>('/api/v1/admin/usuarios')
      return response.data
    },
  })

  useEffect(() => {
    if (query.isError) showNotification('Error al cargar los usuarios')
  }, [query.isError, showNotification])

  const activeMutation = useMutation({
    mutationFn: async ({ userId, active }: SetUserActiveVariables) => {
      await axiosInstance.post(
        `/api/v1/admin/usuarios/${userId}/${active ? 'activar' : 'desactivar'}`,
      )
    },
    onSuccess: (_data, { active }) => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY })
      showNotification(active ? 'Usuario activado' : 'Usuario desactivado')
    },
    onError: (error) => {
      const isForbidden = axios.isAxiosError(error) && error.response?.status === 403
      showNotification(isForbidden ? 'Acceso denegado' : 'No se pudo actualizar el usuario')
    },
  })

  return {
    ...query,
    setUserActive: (userId: number, active: boolean) =>
      activeMutation.mutate({ userId, active }),
    isUpdating: activeMutation.isPending,
  }
}
