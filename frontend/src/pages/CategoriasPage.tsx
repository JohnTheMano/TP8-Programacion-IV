import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Categoria } from '../types/categoria'
import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from '../services/categoria'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'

function CategoriasPage() {
    const queryClient = useQueryClient()

    const [modalAbierto, setModalAbierto] = useState(false)
    const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null)

    const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    } = useQuery({
    queryKey: ['categorias'],
    queryFn: obtenerCategorias,
    })

    const crearMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categorias'] })
        cerrarModal()
    },
    })

    const actualizarMutation = useMutation({
    mutationFn: ({
        id,
        datos,
    }: {
        id: number
        datos: Omit<Categoria, 'id'>
    }) => actualizarCategoria(id, datos),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categorias'] })
        cerrarModal()
    },
    })

    const eliminarMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
    })

    function cerrarModal() {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
    }

    function abrirCrear() {
    setCategoriaSeleccionada(null)
    setModalAbierto(true)
    }

    function abrirEditar(categoria: Categoria) {
    setCategoriaSeleccionada(categoria)
    setModalAbierto(true)
    }

    function guardarCategoria(datos: Omit<Categoria, 'id'>) {
    if (categoriaSeleccionada) {
        actualizarMutation.mutate({
        id: categoriaSeleccionada.id,
        datos,
        })
    } else {
        crearMutation.mutate(datos)
    }
    }

    function eliminar(id: number) {
    const confirmar = window.confirm(
        '¿Estás seguro de que querés eliminar esta categoría?',
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
            Categorías
        </h1>

        <button
            type="button"
            onClick={abrirCrear}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            Nueva categoría
        </button>
        </div>

        {isLoading && (
        <p className="py-6 text-gray-600">Cargando categorías...</p>
        )}

        {isError && (
        <p role="alert" className="py-6 text-red-600">
            Error al cargar las categorías: {error.message}
        </p>
        )}

        {errorMutacion && (
        <p role="alert" className="mb-4 text-red-600">
            Error al guardar los cambios: {errorMutacion.message}
        </p>
        )}

        {!isLoading && !isError && (
        <CategoriaList
            categorias={categorias}
            onEditar={abrirEditar}
            onEliminar={eliminar}
        />
        )}

        <CategoriaModal
        abierto={modalAbierto}
        categoria={categoriaSeleccionada}
        onCerrar={cerrarModal}
        onSubmit={guardarCategoria}
        guardando={guardando}
        />
    </main>
    )
}

export default CategoriasPage