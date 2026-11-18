
import type { Producto } from '../types/producto'
import axiosInstance from '@/shared/api/api'

const API_URL = '/productos/'

export async function obtenerProductos(): Promise<Producto[]> {
    const response = await axiosInstance.get(API_URL)
    return response.data
}

export async function crearProducto(
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await axiosInstance.post(API_URL, producto)
    return response.data
}

export async function actualizarProducto(
    id: number,
    producto: Omit<Producto, 'id'>
): Promise<Producto> {
    const response = await axiosInstance.put(`${API_URL}${id}`, producto)
    return response.data
}

export async function eliminarProducto(id: number): Promise<void> {
    await axiosInstance.delete(`${API_URL}${id}`)
}
