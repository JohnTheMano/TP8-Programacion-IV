import { useState } from 'react'
import { useAuthStore } from '@/features/auth'
import type { Producto } from '../types/producto'
import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'
import { useProducts } from '../hooks/useProducts'

export default function ProductsPage() {
  const isAdmin = useAuthStore((state) => state.user?.roles.includes('admin') ?? false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const { data: productos = [], isLoading, isError, error, createMutation, updateMutation, deleteMutation } = useProducts()

  function cerrarModal() { setModalAbierto(false); setProductoSeleccionado(null) }
  function guardarProducto(datos: Omit<Producto, 'id'>) {
    if (productoSeleccionado) updateMutation.mutate({ id: productoSeleccionado.id, datos }, { onSuccess: cerrarModal })
    else createMutation.mutate(datos, { onSuccess: cerrarModal })
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Productos</h1>
        {isAdmin && (
          <button type="button" onClick={() => { setProductoSeleccionado(null); setModalAbierto(true) }} className="rounded bg-blue-600 px-4 py-2 text-white">
            Nuevo producto
          </button>
        )}
      </div>
      {isLoading && <p>Cargando productos...</p>}
      {isError && <p role="alert" className="text-red-600">Error al cargar productos: {error.message}</p>}
      {!isLoading && !isError && (
        <ProductoList
          productos={productos}
          canManage={isAdmin}
          onEditar={(producto) => { setProductoSeleccionado(producto); setModalAbierto(true) }}
          onEliminar={(id) => { if (window.confirm('¿Estás seguro de que querés eliminar este producto?')) deleteMutation.mutate(id) }}
        />
      )}
      {isAdmin && <ProductoModal abierto={modalAbierto} producto={productoSeleccionado} onCerrar={cerrarModal} onSubmit={guardarProducto} guardando={createMutation.isPending || updateMutation.isPending} />}
    </main>
  )
}
