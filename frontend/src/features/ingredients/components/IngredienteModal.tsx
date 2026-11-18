
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Ingrediente } from '../types/ingrediente'

interface IngredienteModalProps {
    abierto: boolean
    ingrediente: Ingrediente | null
    onCerrar: () => void
    onSubmit: (datos: Omit<Ingrediente, 'id'>) => void
    guardando: boolean
}

export default function IngredienteModal({
    abierto,
    ingrediente,
    onCerrar,
    onSubmit,
    guardando,
}: IngredienteModalProps) {

    const form = useForm({
        defaultValues: {
            nombre: '',
        },
        onSubmit: async ({ value }) => {
            onSubmit({
                nombre: value.nombre.trim(),
            })
        },
    })

    useEffect(() => {
        if (abierto) {
            form.reset({
                nombre: ingrediente?.nombre ?? '',
            })
        }
    }, [abierto, ingrediente])

    if (!abierto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <h2 className="mb-5 text-xl font-bold text-gray-800">
                    {ingrediente ? 'Editar ingrediente' : 'Nuevo ingrediente'}
                </h2>

                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="nombre"
                        validators={{
                            onChange: ({ value }) =>
                                value.trim().length === 0
                                    ? 'El nombre es obligatorio'
                                    : undefined,
                        }}
                    >
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="nombre-ingrediente"
                                    className="mb-1 block font-medium text-gray-700"
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre-ingrediente"
                                    value={field.state.value}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                />

                                {field.state.meta.errors.map((error) => (
                                    <p key={String(error)} className="text-sm text-red-600">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCerrar}
                            disabled={guardando}
                            className="rounded border px-4 py-2"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={guardando}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {guardando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
