import { useAdminUsers } from '../hooks/useAdminUsers'

export default function AdminUsersPage() {
  const {
    data: users = [],
    isPending,
    isError,
    setUserActive,
    isUpdating,
  } = useAdminUsers()

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Administración de usuarios</h1>
      {isPending ? (
        <p>Cargando usuarios...</p>
      ) : isError ? (
        <p role="alert" className="text-red-600">Error al cargar los usuarios.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Usuario</th>
                <th className="p-3">Email</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.nombre} {user.apellido}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.roles.join(', ')}</td>
                  <td className="p-3">{user.activo ? 'Activo' : 'Inactivo'}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => setUserActive(user.id, !user.activo)}
                      className="rounded border px-3 py-2 disabled:opacity-50"
                    >
                      {user.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
