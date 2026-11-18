
import type { Ingrediente } from '../types/ingrediente'
import axiosInstance from '@/shared/api/api'

const API_URL = '/ingredientes/'
export async function obtenerIngredientes(): Promise<Ingrediente[]> {
    const response = await axiosInstance.get(API_URL)
    return response.data
}

export async function crearIngrediente(
    ingrediente: Omit<Ingrediente, 'id'>
): Promise<Ingrediente> {
    const response = await axiosInstance.post(API_URL, ingrediente)
    return response.data
}

export async function actualizarIngrediente(
    id: number,
    ingrediente: Omit<Ingrediente, 'id'>
): Promise<Ingrediente> {
    const response = await axiosInstance.put(`${API_URL}${id}`, ingrediente)
    return response.data
}

export async function eliminarIngrediente(id: number): Promise<void> {
    await axiosInstance.delete(`${API_URL}${id}`)
}
