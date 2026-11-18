import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import type { Categoria } from '../types/categoria'
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from './categoriaService'

export function useCategories() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const query = useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias })

  useEffect(() => {
    if (query.isError) showNotification('Error al cargar las categorías')
  }, [query.isError, showNotification])

  const createMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría creada')
    },
    onError: () => showNotification('Error al crear la categoría'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Omit<Categoria, 'id'> }) =>
      actualizarCategoria(id, datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría actualizada')
    },
    onError: () => showNotification('Error al actualizar la categoría'),
  })

  const deleteMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría eliminada')
    },
    onError: () => showNotification('Error al eliminar la categoría'),
  })

  return { ...query, createMutation, updateMutation, deleteMutation }
}
