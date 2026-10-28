import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { lazyPage } from '@/router/lazy'

const CourseLearnPage = lazyPage(() =>
  import('@/pages/CourseLearnPage').then((m) => ({ default: m.CourseLearnPage })),
)
const CartPage = lazyPage(() => import('@/pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazyPage(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const WishlistPage = lazyPage(() => import('@/pages/WishlistPage').then((m) => ({ default: m.WishlistPage })))
const MyLearningPage = lazyPage(() =>
  import('@/pages/MyLearningPage').then((m) => ({ default: m.MyLearningPage })),
)
const ProfilePage = lazyPage(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const CertificatesPage = lazyPage(() =>
  import('@/pages/CertificatesPage').then((m) => ({ default: m.CertificatesPage })),
)
const OrdersPage = lazyPage(() => import('@/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })))
const NotificationsPage = lazyPage(() =>
  import('@/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
)
const SubscriptionsPage = lazyPage(() =>
  import('@/pages/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage })),
)
const GiftCoursePage = lazyPage(() => import('@/pages/GiftCoursePage').then((m) => ({ default: m.GiftCoursePage })))
const AffiliatePage = lazyPage(() => import('@/pages/AffiliatePage').then((m) => ({ default: m.AffiliatePage })))

export const studentRoutes: RouteObject = {
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
}
