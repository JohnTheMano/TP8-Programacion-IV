
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Producto } from '../types/producto'
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} from '../services/producto'
import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'

function ProductsPage() {
    const queryClient = useQueryClient()

    const [modalAbierto, setModalAbierto] = useState(false)
    const [productoSeleccionado, setProductoSeleccionado] =
        useState<Producto | null>(null)

    const {
        data: productos = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['productos'],
        queryFn: obtenerProductos,
    })

    const crearMutation = useMutation({
        mutationFn: crearProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] })
            cerrarModal()
        },
    })

    const actualizarMutation = useMutation({
        mutationFn: ({
            id,
            datos,
        }: {
            id: number
            datos: Omit<Producto, 'id'>
        }) => actualizarProducto(id, datos),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] })
            cerrarModal()
        },
    })

    const eliminarMutation = useMutation({
        mutationFn: eliminarProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos'] })
        },
    })

    function cerrarModal() {
        setModalAbierto(false)
        setProductoSeleccionado(null)
    }

    function abrirCrear() {
        setProductoSeleccionado(null)
        setModalAbierto(true)
    }

    function abrirEditar(producto: Producto) {
        setProductoSeleccionado(producto)
        setModalAbierto(true)
    }

    function guardarProducto(datos: Omit<Producto, 'id'>) {
        if (productoSeleccionado) {
            actualizarMutation.mutate({
                id: productoSeleccionado.id,
                datos,
            })
        } else {
            crearMutation.mutate(datos)
        }
    }

    function eliminar(id: number) {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar este producto?',
        )

        if (confirmar) {
            eliminarMutation.mutate(id)
        }
    }

    const guardando =
        crearMutation.isPending || actualizarMutation.isPending

    const errorMutacion =
        crearMutation.error ||
        actualizarMutation.error ||
        eliminarMutation.error

    return (
        <main className="mx-auto max-w-6xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-blue-600">
                    Productos
                </h1>

                <button
                    type="button"
                    onClick={abrirCrear}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Nuevo producto
                </button>
            </div>

            {isLoading && (
                <p className="py-6 text-gray-600">
                    Cargando productos...
                </p>
            )}

            {isError && (
                <p role="alert" className="py-6 text-red-600">
                    Error al cargar productos: {error.message}
                </p>
            )}

            {errorMutacion && (
                <p role="alert" className="mb-4 text-red-600">
                    Error al guardar los cambios: {errorMutacion.message}
                </p>
            )}

            {!isLoading && !isError && (
                <ProductoList
                    productos={productos}
                    onEditar={abrirEditar}
                    onEliminar={eliminar}
                />
            )}

            <ProductoModal
                abierto={modalAbierto}
                producto={productoSeleccionado}
                onCerrar={cerrarModal}
                onSubmit={guardarProducto}
                guardando={guardando}
            />
        </main>
    )
}

export default ProductsPage
