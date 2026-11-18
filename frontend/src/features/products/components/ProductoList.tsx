
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    createColumnHelper,
} from '@tanstack/react-table'
import type { Producto } from '../types/producto'

interface ProductoListProps {
    productos: Producto[]
    canManage: boolean
    onEditar: (producto: Producto) => void
    onEliminar: (id: number) => void
}

const columnHelper = createColumnHelper<Producto>()

export default function ProductoList({
    productos,
    canManage,
    onEditar,
    onEliminar,
}: ProductoListProps) {

    const columns = [
        columnHelper.accessor('nombre', {
            header: 'Nombre',
        }),
        columnHelper.accessor('descripcion', {
            header: 'Descripción',
        }),
        columnHelper.accessor('precio_base', {
            header: 'Precio',
            cell: (info) => `$${info.getValue().toFixed(2)}`,
        }),
        columnHelper.accessor('disponible', {
            header: 'Disponible',
            cell: (info) => info.getValue() ? 'Sí' : 'No',
        }),
        ...(canManage ? [columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEditar(row.original)}
                        className="rounded border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => onEliminar(row.original.id)}
                        className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                    >
                        Eliminar
                    </button>
                </div>
            ),
        })] : []),
    ]

    const table = useReactTable({
        data: productos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (productos.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No hay productos registrados.
            </p>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-3">
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: ' ▲',
                                                desc: ' ▼',
                                            }[header.column.getIsSorted() as string] ?? ''}
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-t">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-between border-t p-4">
                <button
                    type="button"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded border px-3 py-2 disabled:opacity-40"
                >
                    Anterior
                </button>

                <span>
                    Página {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
                </span>

                <button
                    type="button"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded border px-3 py-2 disabled:opacity-40"
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}
