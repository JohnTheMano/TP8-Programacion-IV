
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Ingrediente } from '../types/ingrediente'
import {
    obtenerIngredientes,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
} from '../services/ingrediente'
import IngredienteList from '../components/IngredienteList'
import IngredienteModal from '../components/IngredienteModal'

function IngredientesPage() {
    const queryClient = useQueryClient()

    const [modalAbierto, setModalAbierto] = useState(false)
    const [ingredienteSeleccionado, setIngredienteSeleccionado] =
        useState<Ingrediente | null>(null)

    const {
        data: ingredientes = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['ingredientes'],
        queryFn: obtenerIngredientes,
    })

    const crearMutation = useMutation({
        mutationFn: crearIngrediente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
            cerrarModal()
        },
    })

    const actualizarMutation = useMutation({
        mutationFn: ({
            id,
            datos,
        }: {
            id: number
            datos: Omit<Ingrediente, 'id'>
        }) => actualizarIngrediente(id, datos),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
            cerrarModal()
        },
    })

    const eliminarMutation = useMutation({
        mutationFn: eliminarIngrediente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
        },
    })

    function cerrarModal() {
        setModalAbierto(false)
        setIngredienteSeleccionado(null)
    }

    function abrirCrear() {
        setIngredienteSeleccionado(null)
        setModalAbierto(true)
    }

    function abrirEditar(ingrediente: Ingrediente) {
        setIngredienteSeleccionado(ingrediente)
        setModalAbierto(true)
    }

    function guardarIngrediente(datos: Omit<Ingrediente, 'id'>) {
        if (ingredienteSeleccionado) {
            actualizarMutation.mutate({
                id: ingredienteSeleccionado.id,
                datos,
            })
        } else {
            crearMutation.mutate(datos)
        }
    }

    function eliminar(id: number) {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar este ingrediente?',
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
                    Ingredientes
                </h1>

                <button
                    type="button"
                    onClick={abrirCrear}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Nuevo ingrediente
                </button>
            </div>

            {isLoading && (
                <p className="py-6 text-gray-600">
                    Cargando ingredientes...
                </p>
            )}

            {isError && (
                <p role="alert" className="py-6 text-red-600">
                    Error al cargar ingredientes: {error.message}
                </p>
            )}

            {errorMutacion && (
                <p role="alert" className="mb-4 text-red-600">
                    Error al guardar los cambios: {errorMutacion.message}
                </p>
            )}

            {!isLoading && !isError && (
                <IngredienteList
                    ingredientes={ingredientes}
                    onEditar={abrirEditar}
                    onEliminar={eliminar}
                />
            )}

            <IngredienteModal
                abierto={modalAbierto}
                ingrediente={ingredienteSeleccionado}
                onCerrar={cerrarModal}
                onSubmit={guardarIngrediente}
                guardando={guardando}
            />
        </main>
    )
}

export default IngredientesPage
