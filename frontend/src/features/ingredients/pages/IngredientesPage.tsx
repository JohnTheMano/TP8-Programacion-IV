import { useState } from 'react'
import { useAuthStore } from '@/features/auth'
import type { Ingrediente } from '../types/ingrediente'
import IngredienteList from '../components/IngredienteList'
import IngredienteModal from '../components/IngredienteModal'
import { useIngredients } from '../hooks/useIngredients'

export default function IngredientesPage() {
  const isAdmin = useAuthStore((state) => state.user?.roles.includes('admin') ?? false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null)
  const { data: ingredientes = [], isLoading, isError, error, createMutation, updateMutation, deleteMutation } = useIngredients()

  function cerrarModal() { setModalAbierto(false); setIngredienteSeleccionado(null) }
  function guardarIngrediente(datos: Omit<Ingrediente, 'id'>) {
    if (ingredienteSeleccionado) updateMutation.mutate({ id: ingredienteSeleccionado.id, datos }, { onSuccess: cerrarModal })
    else createMutation.mutate(datos, { onSuccess: cerrarModal })
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Ingredientes</h1>
        {isAdmin && (
          <button type="button" onClick={() => { setIngredienteSeleccionado(null); setModalAbierto(true) }} className="rounded bg-blue-600 px-4 py-2 text-white">
            Nuevo ingrediente
          </button>
        )}
      </div>
      {isLoading && <p>Cargando ingredientes...</p>}
      {isError && <p role="alert" className="text-red-600">Error al cargar ingredientes: {error.message}</p>}
      {!isLoading && !isError && (
        <IngredienteList
          ingredientes={ingredientes}
          canManage={isAdmin}
          onEditar={(ingrediente) => { setIngredienteSeleccionado(ingrediente); setModalAbierto(true) }}
          onEliminar={(id) => { if (window.confirm('¿Estás seguro de que querés eliminar este ingrediente?')) deleteMutation.mutate(id) }}
        />
      )}
      {isAdmin && <IngredienteModal abierto={modalAbierto} ingrediente={ingredienteSeleccionado} onCerrar={cerrarModal} onSubmit={guardarIngrediente} guardando={createMutation.isPending || updateMutation.isPending} />}
    </main>
  )
}
