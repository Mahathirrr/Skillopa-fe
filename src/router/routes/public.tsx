import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { BundlesPage } from '@/pages/BundlesPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CertificateVerifyPage } from '@/pages/CertificateVerifyPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { RegisterPage } from '@/pages/RegisterPage'

export const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'courses', element: <CatalogPage /> },
  { path: 'courses/:slug', element: <CourseDetailPage /> },
  { path: 'bundles', element: <BundlesPage /> },
  { path: 'certificates/verify/:code', element: <CertificateVerifyPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'auth/callback', element: <Navigate to="/login" replace /> },
  { path: 'payment/success', element: <PaymentSuccessPage /> },
]
