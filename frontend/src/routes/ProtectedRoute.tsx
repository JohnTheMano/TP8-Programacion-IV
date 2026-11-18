
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth"

interface ProtectedRouteProps {
    allowedRoles?: string[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user)
    const status = useAuthStore((state) => state.status)

    if (status === 'checking') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg font-semibold">
                    Verificando sesión...
                </p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (
        allowedRoles &&
        !allowedRoles.some((role) => user.roles.includes(role))
    ) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
