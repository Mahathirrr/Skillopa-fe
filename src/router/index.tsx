import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CartPage } from '@/pages/CartPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CertificatesPage } from '@/pages/CertificatesPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { CourseLearnPage } from '@/pages/CourseLearnPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MyLearningPage } from '@/pages/MyLearningPage'
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { CourseFormPage } from '@/pages/instructor/CourseFormPage'
import { CurriculumBuilderPage } from '@/pages/instructor/CurriculumBuilderPage'
import { InstructorCoursesPage } from '@/pages/instructor/InstructorCoursesPage'
import { InstructorDashboardPage } from '@/pages/instructor/InstructorDashboardPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'courses', element: <CatalogPage /> },
      { path: 'courses/:slug', element: <CourseDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'payment/success', element: <PaymentSuccessPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'learn/:slug', element: <CourseLearnPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'my-learning', element: <MyLearningPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'certificates', element: <CertificatesPage /> },
        ],
      },
      {
        element: <ProtectedRoute instructor />,
        children: [
          { path: 'instructor/dashboard', element: <InstructorDashboardPage /> },
          { path: 'instructor/courses', element: <InstructorCoursesPage /> },
          { path: 'instructor/courses/new', element: <CourseFormPage /> },
          { path: 'instructor/courses/:id/edit', element: <CourseFormPage /> },
          { path: 'instructor/courses/:id/curriculum', element: <CurriculumBuilderPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
