
import type { Ingrediente } from '../types/ingrediente'

const API_URL = 'http://localhost:8000/ingredientes/'

export async function obtenerIngredientes(): Promise<Ingrediente[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Error al obtener ingredientes')
    }

    return response.json()
}

export async function crearIngrediente(
    ingrediente: Omit<Ingrediente, 'id'>
): Promise<Ingrediente> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingrediente),
    })

    if (!response.ok) {
        throw new Error('Error al crear ingrediente')
    }

    return response.json()
}

export async function actualizarIngrediente(
    id: number,
    ingrediente: Omit<Ingrediente, 'id'>
): Promise<Ingrediente> {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingrediente),
    })

    if (!response.ok) {
        throw new Error('Error al actualizar ingrediente')
    }

    return response.json()
}

export async function eliminarIngrediente(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Error al eliminar ingrediente')
    }
}
