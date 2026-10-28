import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuthStore } from '@/stores/auth'

type Props = {
  instructor?: boolean
  admin?: boolean
}

export function ProtectedRoute({ instructor, admin }: Props) {
  const { isAuthenticated, isInstructor, isAdmin, authHydrated } = useAuthStore()
  const location = useLocation()

  if (!authHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (admin && !isAdmin) {
    return <Navigate to="/my-learning" replace />
  }

  if (instructor && !isInstructor) {
    return <Navigate to="/my-learning" replace />
  }

  return <Outlet />
}
