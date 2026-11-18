
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { darkMode, toggleTheme } = useThemeStore()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-gray-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  const isAdmin = user?.roles.includes('admin') ?? false

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 px-8 py-4 text-white shadow-md">
      <Link to="/categorias" className="text-xl font-bold tracking-wide">
        Food Store
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/categorias" className={linkClass('/categorias')}>
          Categorías
        </Link>

        <Link to="/productos" className={linkClass('/productos')}>
          Productos
        </Link>

        <Link to="/ingredientes" className={linkClass('/ingredientes')}>
          Ingredientes
        </Link>

        {isAdmin && (
          <Link to="/admin/users" className={linkClass('/admin/users')}>
            Usuarios
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-gray-600 px-3 py-2"
          aria-label="Alternar tema"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {user && (
          <>
            <div className="text-right">
              <p className="font-semibold">
                {user.nombre} {user.apellido}
              </p>

              <p className="text-sm text-gray-400">
                {user.roles.join(', ')}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
