import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { lazyPage } from '@/router/lazy'

const AdminDashboardPage = lazyPage(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const ModerationPage = lazyPage(() =>
  import('@/pages/admin/ModerationPage').then((m) => ({ default: m.ModerationPage })),
)
const AdminAuditPage = lazyPage(() =>
  import('@/pages/admin/AdminAuditPage').then((m) => ({ default: m.AdminAuditPage })),
)
const AdminReviewReportsPage = lazyPage(() =>
  import('@/pages/admin/AdminReviewReportsPage').then((m) => ({ default: m.AdminReviewReportsPage })),
)
const AdminCouponsPage = lazyPage(() =>
  import('@/pages/admin/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage })),
)

export const adminRoutes: RouteObject = {
  element: <ProtectedRoute admin />,
  children: [
    { path: 'admin', element: <AdminDashboardPage /> },
    { path: 'admin/moderation', element: <ModerationPage /> },
    { path: 'admin/audit', element: <AdminAuditPage /> },
    { path: 'admin/review-reports', element: <AdminReviewReportsPage /> },
    { path: 'admin/coupons', element: <AdminCouponsPage /> },
  ],
}
