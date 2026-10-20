import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { ModerationPage } from '@/pages/admin/ModerationPage'

export const adminRoutes: RouteObject = {
  element: <ProtectedRoute admin />,
  children: [
    { path: 'admin', element: <AdminDashboardPage /> },
    { path: 'admin/moderation', element: <ModerationPage /> },
  ],
}
