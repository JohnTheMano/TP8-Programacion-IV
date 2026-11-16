
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-gray-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-8 py-4 text-white shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        Food Store
      </Link>

      <div className="flex gap-3">
        <Link to="/categorias" className={linkClass('/categorias')}>
            Categorías
        </Link>

        <Link to="/productos" className={linkClass('/productos')}>
            Productos
        </Link>

        
        <Link to="/ingredientes" className={linkClass('/ingredientes')}>
            Ingredientes
        </Link>

      </div>
    </nav>
  )
}

export default Navbar
