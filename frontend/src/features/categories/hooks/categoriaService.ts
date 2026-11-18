
import type { Categoria } from '../types/categoria'
import axiosInstance from '@/shared/api/api'

const API_URL = '/categorias/'

export async function obtenerCategorias(): Promise<Categoria[]> {
    const response = await axiosInstance.get(API_URL)
    return response.data
}

export async function crearCategoria(
    categoria: Omit<Categoria, 'id'>
): Promise<Categoria> {
    const response = await axiosInstance.post(API_URL, categoria)
    return response.data
}

export async function actualizarCategoria(
    id: number,
    categoria: Omit<Categoria, 'id'>
): Promise<Categoria> {
    const response = await axiosInstance.put(`${API_URL}${id}`, categoria)
    return response.data
}

export async function eliminarCategoria(id: number): Promise<void> {
    await axiosInstance.delete(`${API_URL}${id}`)
}
