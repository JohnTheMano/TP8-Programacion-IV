
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Categoria } from '../types/categoria'

interface CategoriaModalProps {
    abierto: boolean
    categoria: Categoria | null
    onCerrar: () => void
    onSubmit: (datos: Omit<Categoria, 'id'>) => void
    guardando: boolean
}

export default function CategoriaModal({
    abierto,
    categoria,
    onCerrar,
    onSubmit,
    guardando,
}: CategoriaModalProps) {

    const form = useForm({
        defaultValues: {
            nombre: '',
            descripcion: '',
        },
        onSubmit: async ({ value }) => {
            onSubmit({
                nombre: value.nombre.trim(),
                descripcion: value.descripcion.trim(),
            })
        },
    })

    useEffect(() => {
        if (abierto) {
            form.reset({
                nombre: categoria?.nombre ?? '',
                descripcion: categoria?.descripcion ?? '',
            })
        }
    }, [abierto, categoria])

    if (!abierto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <h2
                    id="titulo-modal"
                    className="mb-5 text-xl font-bold text-gray-800"
                >
                    {categoria ? 'Editar categoría' : 'Nueva categoría'}
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
                                    htmlFor="nombre"
                                    className="mb-1 block font-medium text-gray-700"
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
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

                    <form.Field name="descripcion">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="descripcion"
                                    className="mb-1 block font-medium text-gray-700"
                                >
                                    Descripción
                                </label>

                                <textarea
                                    id="descripcion"
                                    value={field.state.value}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                />
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCerrar}
                            disabled={guardando}
                            className="rounded border border-gray-300 px-4 py-2"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={guardando}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {guardando
                                ? 'Guardando...'
                                : categoria
                                    ? 'Guardar cambios'
                                    : 'Crear categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
