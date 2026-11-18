import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import type { Ingrediente } from '../types/ingrediente'
import { obtenerIngredientes, crearIngrediente, actualizarIngrediente, eliminarIngrediente } from './ingredienteService'

export function useIngredients() {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const query = useQuery({ queryKey: ['ingredientes'], queryFn: obtenerIngredientes })

  useEffect(() => {
    if (query.isError) showNotification('Error al cargar los ingredientes')
  }, [query.isError, showNotification])

  const createMutation = useMutation({
    mutationFn: crearIngrediente,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); showNotification('Ingrediente creado') },
    onError: () => showNotification('Error al crear el ingrediente'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Omit<Ingrediente, 'id'> }) => actualizarIngrediente(id, datos),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); showNotification('Ingrediente actualizado') },
    onError: () => showNotification('Error al actualizar el ingrediente'),
  })
  const deleteMutation = useMutation({
    mutationFn: eliminarIngrediente,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); showNotification('Ingrediente eliminado') },
    onError: () => showNotification('Error al eliminar el ingrediente'),
  })
  return { ...query, createMutation, updateMutation, deleteMutation }
}
