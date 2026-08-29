import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/stores/auth'

type Props = {
  instructor?: boolean
}

export function ProtectedRoute({ instructor }: Props) {
  const { isAuthenticated, isInstructor } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (instructor && !isInstructor) {
    return <Navigate to="/my-learning" replace />
  }

  return <Outlet />
}
