import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, AdminUsersPage } from '@/features/auth'
import { CategoriasPage } from '@/features/categories'
import { ProductsPage } from '@/features/products'
import { IngredientesPage } from '@/features/ingredients'
import Navbar from '@/shared/components/Navbar'
import UnauthorizedPage from '@/shared/components/UnauthorizedPage'
import ProtectedRoute from './ProtectedRoute'

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/categorias" replace />} />
      <Route path="*" element={<Navigate to="/categorias" replace />} />
    </Routes>
  )
}
