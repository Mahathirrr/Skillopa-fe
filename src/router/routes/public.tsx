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
const CertificateViewPage = lazyPage(() =>
  import('@/pages/CertificateViewPage').then((m) => ({ default: m.CertificateViewPage })),
)
const LoginPage = lazyPage(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazyPage(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AuthCallbackPage = lazyPage(() =>
  import('@/pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })),
)
const ForgotPasswordPage = lazyPage(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazyPage(() =>
  import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const PaymentSuccessPage = lazyPage(() =>
  import('@/pages/PaymentSuccessPage').then((m) => ({ default: m.PaymentSuccessPage })),
)
const TermsOfServicePage = lazyPage(() =>
  import('@/pages/legal/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage })),
)
const PrivacyPolicyPage = lazyPage(() =>
  import('@/pages/legal/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)

export const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'courses', element: <CatalogPage /> },
  { path: 'courses/:slug', element: <CourseDetailPage /> },
  { path: 'bundles', element: <BundlesPage /> },
  { path: 'certificates/view/:code', element: <CertificateViewPage /> },
  { path: 'certificates/verify/:code', element: <CertificateVerifyPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'auth/callback', element: <AuthCallbackPage /> },
  { path: 'payment/success', element: <PaymentSuccessPage /> },
  { path: 'legal/syarat-layanan', element: <TermsOfServicePage /> },
  { path: 'legal/kebijakan-privasi', element: <PrivacyPolicyPage /> },
]
