import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { ModerationPage } from '@/pages/admin/ModerationPage'
import { AffiliatePage } from '@/pages/AffiliatePage'
import { BundlesPage } from '@/pages/BundlesPage'
import { CartPage } from '@/pages/CartPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CertificateVerifyPage } from '@/pages/CertificateVerifyPage'
import { CertificatesPage } from '@/pages/CertificatesPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { CourseLearnPage } from '@/pages/CourseLearnPage'
import { GiftCoursePage } from '@/pages/GiftCoursePage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MyLearningPage } from '@/pages/MyLearningPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SubscriptionsPage } from '@/pages/SubscriptionsPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { AnnouncementsPage } from '@/pages/instructor/AnnouncementsPage'
import { CourseFormPage } from '@/pages/instructor/CourseFormPage'
import { CurriculumBuilderPage } from '@/pages/instructor/CurriculumBuilderPage'
import { InstructorAnalyticsPage } from '@/pages/instructor/InstructorAnalyticsPage'
import { InstructorCoursesPage } from '@/pages/instructor/InstructorCoursesPage'
import { InstructorDashboardPage } from '@/pages/instructor/InstructorDashboardPage'
import { InstructorStudentsPage } from '@/pages/instructor/InstructorStudentsPage'
import { QuizBuilderPage } from '@/pages/instructor/QuizBuilderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'courses', element: <CatalogPage /> },
      { path: 'courses/:slug', element: <CourseDetailPage /> },
      { path: 'bundles', element: <BundlesPage /> },
      { path: 'certificates/verify/:code', element: <CertificateVerifyPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'auth/callback', element: <Navigate to="/login" replace /> },
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
          { path: 'orders', element: <OrdersPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'subscriptions', element: <SubscriptionsPage /> },
          { path: 'gift', element: <GiftCoursePage /> },
          { path: 'affiliate', element: <AffiliatePage /> },
        ],
      },
      {
        element: <ProtectedRoute instructor />,
        children: [
          { path: 'instructor/dashboard', element: <InstructorDashboardPage /> },
          { path: 'instructor/analytics', element: <InstructorAnalyticsPage /> },
          { path: 'instructor/students', element: <InstructorStudentsPage /> },
          { path: 'instructor/announcements', element: <AnnouncementsPage /> },
          { path: 'instructor/courses', element: <InstructorCoursesPage /> },
          { path: 'instructor/courses/new', element: <CourseFormPage /> },
          { path: 'instructor/courses/:id/edit', element: <CourseFormPage /> },
          { path: 'instructor/courses/:id/curriculum', element: <CurriculumBuilderPage /> },
          { path: 'instructor/courses/:courseId/lectures/:lectureId/quiz', element: <QuizBuilderPage /> },
        ],
      },
      {
        element: <ProtectedRoute admin />,
        children: [
          { path: 'admin', element: <AdminDashboardPage /> },
          { path: 'admin/moderation', element: <ModerationPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
