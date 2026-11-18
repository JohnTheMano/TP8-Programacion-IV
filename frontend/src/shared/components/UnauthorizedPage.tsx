
import { Link } from "react-router-dom"

function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="mb-3 text-4xl font-bold text-red-600">
                Acceso denegado
            </h1>

            <p className="mb-6 text-gray-600">
                No tenés permisos para acceder a esta sección.
            </p>

            <Link
                to="/categorias"
                className="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
            >
                Volver al catálogo
            </Link>
        </div>
    )
}

export default UnauthorizedPage
