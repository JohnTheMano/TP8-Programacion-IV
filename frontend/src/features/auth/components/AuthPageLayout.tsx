import type { ReactNode } from 'react'

interface AuthPageLayoutProps {
  children: ReactNode
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      {children}
    </div>
  )
}
