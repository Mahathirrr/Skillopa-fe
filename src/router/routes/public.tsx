import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { lazyPage } from '@/router/lazy'

const HomePage = lazyPage(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const CatalogPage = lazyPage(() => import('@/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })))
const CourseDetailPage = lazyPage(() =>
  import('@/pages/CourseDetailPage').then((m) => ({ default: m.CourseDetailPage })),
)
const BundlesPage = lazyPage(() => import('@/pages/BundlesPage').then((m) => ({ default: m.BundlesPage })))
const CertificateVerifyPage = lazyPage(() =>
  import('@/pages/CertificateVerifyPage').then((m) => ({ default: m.CertificateVerifyPage })),
)
const LoginPage = lazyPage(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazyPage(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const PaymentSuccessPage = lazyPage(() =>
  import('@/pages/PaymentSuccessPage').then((m) => ({ default: m.PaymentSuccessPage })),
)

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
