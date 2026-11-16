
import type { Producto } from '../types/producto'

const API_URL = 'http://localhost:8000/productos/'

export async function obtenerProductos(): Promise<Producto[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Error al obtener productos')
    }

    return response.json()
}

export async function crearProducto(
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
    })

    if (!response.ok) {
        throw new Error('Error al crear producto')
    }

    return response.json()
}

export async function actualizarProducto(
    id: number,
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
    })

    if (!response.ok) {
        throw new Error('Error al actualizar producto')
    }

    return response.json()
}

export async function eliminarProducto(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Error al eliminar producto')
    }
}
