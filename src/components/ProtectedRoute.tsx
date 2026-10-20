import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/stores/auth'

type Props = {
  instructor?: boolean
  admin?: boolean
}

export function ProtectedRoute({ instructor, admin }: Props) {
  const { isAuthenticated, isInstructor, isAdmin } = useAuthStore()
  const location = useLocation()

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
