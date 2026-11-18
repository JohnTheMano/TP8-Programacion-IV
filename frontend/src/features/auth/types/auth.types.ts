
export interface UsuarioAuth {
    id: number
    nombre: string
    apellido: string
    email: string
    roles: string[]
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    nombre: string
    apellido: string
    email: string
    celular?: string | null
    password: string
}

export interface AuthStoreState {
    user: UsuarioAuth | null
    status: 'checking' | 'authenticated' | 'unauthenticated'
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkSession: () => Promise<void>
}
