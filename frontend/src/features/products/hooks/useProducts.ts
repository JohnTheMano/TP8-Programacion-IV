import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import type { Producto } from '../types/producto'
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from './productoService'

export function useProducts() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const query = useQuery({ queryKey: ['productos'], queryFn: obtenerProductos })

  useEffect(() => {
    if (query.isError) showNotification('Error al cargar los productos')
  }, [query.isError, showNotification])

  const createMutation = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto creado') },
    onError: () => showNotification('Error al crear el producto'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Omit<Producto, 'id'> }) => actualizarProducto(id, datos),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto actualizado') },
    onError: () => showNotification('Error al actualizar el producto'),
  })
  const deleteMutation = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['productos'] }); showNotification('Producto eliminado') },
    onError: () => showNotification('Error al eliminar el producto'),
  })

  return { ...query, createMutation, updateMutation, deleteMutation }
}
