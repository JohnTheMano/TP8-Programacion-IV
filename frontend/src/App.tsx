
import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth'
import AppRouter from '@/routes/AppRouter'
import Toast from '@/shared/components/Toast'

function App() {
  const checkSession = useAuthStore((state) => state.checkSession)
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}

export default App
