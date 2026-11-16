import type { Categoria } from '../types/categoria'

const API_URL = 'http://localhost:8000/categorias/'

export async function obtenerCategorias(): Promise<Categoria[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Error al obtener categorías')
    return response.json()
}

export async function crearCategoria(
    categoria: Omit<Categoria, 'id'>
): Promise<Categoria> {
    const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
    })
    if (!response.ok) throw new Error('Error al crear categoría')
    return response.json()
}

export async function actualizarCategoria(
    id: number,
    categoria: Omit<Categoria, 'id'>
): Promise<Categoria> {
    const response = await fetch(`${API_URL}${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
    })
    if (!response.ok) throw new Error('Error al actualizar categoría')
    return response.json()
}

export async function eliminarCategoria(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${id}`, {
    method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar categoría')
}