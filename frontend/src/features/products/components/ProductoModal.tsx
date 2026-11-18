
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Producto } from '../types/producto'

interface ProductoModalProps {
    abierto: boolean
    producto: Producto | null
    onCerrar: () => void
    onSubmit: (datos: Omit<Producto, 'id'>) => void
    guardando: boolean
}

export default function ProductoModal({
    abierto,
    producto,
    onCerrar,
    onSubmit,
    guardando,
}: ProductoModalProps) {

    const form = useForm({
        defaultValues: {
            nombre: '',
            descripcion: '',
            precio_base: 0,
            imagenes_url: [] as string[],
            disponible: true,
        },
        onSubmit: async ({ value }) => {
            onSubmit(value)
        },
    })

    useEffect(() => {
        if (abierto) {
            form.reset({
                nombre: producto?.nombre ?? '',
                descripcion: producto?.descripcion ?? '',
                precio_base: producto?.precio_base ?? 0,
                imagenes_url: producto?.imagenes_url ?? [],
                disponible: producto?.disponible ?? true,
            })
        }
    }, [abierto, producto])

    if (!abierto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            >
                <h2 className="mb-5 text-xl font-bold text-gray-800">
                    {producto ? 'Editar producto' : 'Nuevo producto'}
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
                                <label className="mb-1 block font-medium">
                                    Nombre
                                </label>
                                <input
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
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
                                <label className="mb-1 block font-medium">
                                    Descripción
                                </label>
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    rows={3}
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="precio_base"
                        validators={{
                            onChange: ({ value }) =>
                                value < 0 ? 'El precio no puede ser negativo' : undefined,
                        }}
                    >
                        {(field) => (
                            <div>
                                <label className="mb-1 block font-medium">
                                    Precio base
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(Number(e.target.value))
                                    }
                                    className="w-full rounded border px-3 py-2"
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={String(error)} className="text-sm text-red-600">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="imagenes_url">
                        {(field) => (
                            <div>
                                <label className="mb-1 block font-medium">
                                    URL de imagen
                                </label>
                                <input
                                    value={field.state.value[0] ?? ''}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value ? [e.target.value] : []
                                        )
                                    }
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="disponible">
                        {(field) => (
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.checked)}
                                />
                                Disponible
                            </label>
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
