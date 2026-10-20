import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainLayout } from '@/components/layout/MainLayout'
import { adminRoutes } from '@/router/routes/admin'
import { instructorRoutes } from '@/router/routes/instructor'
import { publicRoutes } from '@/router/routes/public'
import { studentRoutes } from '@/router/routes/student'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      studentRoutes,
      instructorRoutes,
      adminRoutes,
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
