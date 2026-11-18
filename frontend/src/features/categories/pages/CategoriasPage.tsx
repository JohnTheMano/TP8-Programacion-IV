import { useState } from 'react'
import type { Categoria } from '../types/categoria'
import { useAuthStore } from '@/features/auth'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'
import { useCategories } from '../hooks/useCategories'

export default function CategoriasPage() {
  const isAdmin = useAuthStore((state) => state.user?.roles.includes('admin') ?? false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)
  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useCategories()

  function cerrarModal() {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
  }

  function guardarCategoria(datos: Omit<Categoria, 'id'>) {
    if (categoriaSeleccionada) {
      updateMutation.mutate({ id: categoriaSeleccionada.id, datos }, { onSuccess: cerrarModal })
    } else {
      createMutation.mutate(datos, { onSuccess: cerrarModal })
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Categorías</h1>
        {isAdmin && (
          <button type="button" onClick={() => { setCategoriaSeleccionada(null); setModalAbierto(true) }}
            className="rounded bg-blue-600 px-4 py-2 text-white">
            Nueva categoría
          </button>
        )}
      </div>
      {isLoading && <p>Cargando categorías...</p>}
      {isError && <p role="alert" className="text-red-600">Error al cargar las categorías: {error.message}</p>}
      {!isLoading && !isError && (
        <CategoriaList
          categorias={categorias}
          canManage={isAdmin}
          onEditar={(categoria) => { setCategoriaSeleccionada(categoria); setModalAbierto(true) }}
          onEliminar={(id) => {
            if (window.confirm('¿Estás seguro de que querés eliminar esta categoría?')) {
              deleteMutation.mutate(id)
            }
          }}
        />
      )}
      {isAdmin && (
        <CategoriaModal
          abierto={modalAbierto}
          categoria={categoriaSeleccionada}
          onCerrar={cerrarModal}
          onSubmit={guardarCategoria}
          guardando={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </main>
  )
}
