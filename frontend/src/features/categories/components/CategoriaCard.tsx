import type { Categoria } from '../types/categoria'

type CategoriaCardProps = {
    categoria: Categoria
    canManage: boolean
    onEditar: (categoria: Categoria) => void
    onEliminar: (id: number) => void
}

export default function CategoriaCard({
    categoria,
    canManage,
    onEditar,
    onEliminar,
}: CategoriaCardProps) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-slate-800">
                        {categoria.nombre}
                    </h2>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {categoria.descripcion}
                    </p>
                </div>

                {canManage && (
                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button"
                            onClick={() => onEditar(categoria)}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            onClick={() => onEliminar(categoria.id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </article>
    )
}