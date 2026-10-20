import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AffiliatePage } from '@/pages/AffiliatePage'
import { CartPage } from '@/pages/CartPage'
import { CertificatesPage } from '@/pages/CertificatesPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CourseLearnPage } from '@/pages/CourseLearnPage'
import { GiftCoursePage } from '@/pages/GiftCoursePage'
import { MyLearningPage } from '@/pages/MyLearningPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SubscriptionsPage } from '@/pages/SubscriptionsPage'
import { WishlistPage } from '@/pages/WishlistPage'

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
