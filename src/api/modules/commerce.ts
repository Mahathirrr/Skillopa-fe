import { request } from '@/api/client'
import type {
  CartItem,
  CouponValidation,
  CourseBundle,
  Enrollment,
  GiftEnrollment,
  Order,
  Payment,
  Refund,
  SubscriptionPlan,
  UserSubscription,
  WishlistItem,
} from '@/api/types'

export const commerceApi = {
  listCart(token: string) {
    return request<{ cart: CartItem[] }>('/cart', { token })
  },

  addToCart(token: string, courseId: number) {
    return request<{ message: string }>('/cart', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  removeFromCart(token: string, courseId: number) {
    return request<void>(`/cart/${courseId}`, { method: 'DELETE', token })
  },

  listWishlist(token: string) {
    return request<{ wishlist: WishlistItem[] }>('/wishlist', { token })
  },

  addToWishlist(token: string, courseId: number) {
    return request<{ message: string }>('/wishlist', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  removeFromWishlist(token: string, courseId: number) {
    return request<void>(`/wishlist/${courseId}`, { method: 'DELETE', token })
  },

  checkout(token: string, courseId: number) {
    return request<{ payment: Payment }>('/payments/checkout', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  confirmPayment(token: string, orderId: string) {
    return request<{ enrollment: Enrollment; message: string }>(`/payments/${orderId}/confirm`, {
      method: 'POST',
      token,
    })
  },

  listOrders(token: string) {
    return request<{ orders: Order[] }>('/orders', { token })
  },

  getOrder(token: string, orderId: number) {
    return request<{ order: Order }>(`/orders/${orderId}`, { token })
  },

  createOrderCheckout(token: string, courseIds: number[], couponCode?: string) {
    return request<{ order: Order }>('/orders/checkout', {
      method: 'POST',
      body: { course_ids: courseIds, coupon_code: couponCode || undefined },
      token,
    })
  },

  confirmOrder(token: string, orderId: number) {
    return request<{ order: Order; enrollments?: Enrollment[]; message?: string }>(
      `/orders/${orderId}/confirm`,
      { method: 'POST', token },
    )
  },

  validateCoupon(token: string, code: string, subtotal: number) {
    return request<CouponValidation>('/coupons/validate', {
      method: 'POST',
      body: { code, subtotal },
      token,
    })
  },

  listRefunds(token: string) {
    return request<{ refunds: Refund[] }>('/refunds', { token })
  },

  requestRefund(token: string, orderId: number, reason: string) {
    return request<{ refund: Refund }>('/refunds', {
      method: 'POST',
      body: { order_id: orderId, reason },
      token,
    })
  },

  listSubscriptionPlans() {
    return request<{ plans: SubscriptionPlan[] }>('/subscriptions/plans')
  },

  getMySubscription(token: string) {
    return request<{ subscription: UserSubscription | null }>('/subscriptions/me', { token })
  },

  subscribeToPlan(token: string, planId: number) {
    return request<{ subscription: UserSubscription }>('/subscriptions/subscribe', {
      method: 'POST',
      body: { plan_id: planId },
      token,
    })
  },

  cancelSubscription(token: string) {
    return request<{ message: string }>('/subscriptions/cancel', { method: 'POST', token })
  },

  listBundles() {
    return request<{ bundles: CourseBundle[] }>('/bundles')
  },

  getBundle(id: number) {
    return request<{ bundle: CourseBundle }>(`/bundles/${id}`)
  },

  checkoutBundle(token: string, bundleId: number) {
    return request<{ purchase: { bundle_id: number; enrolled_course_ids: number[] } }>(
      `/bundles/${bundleId}/purchase`,
      { method: 'POST', token },
    )
  },

  createGift(
    token: string,
    data: { course_id: number; recipient_email: string; message?: string },
  ) {
    return request<{ gift: GiftEnrollment }>('/gifts', { method: 'POST', body: data, token })
  },

  redeemGift(token: string, code: string) {
    return request<{ enrollment: Enrollment; message: string }>('/gifts/redeem', {
      method: 'POST',
      body: { code },
      token,
    })
  },

  getGiftPreview(code: string) {
    return request<{ gift: GiftEnrollment }>(`/gifts/${encodeURIComponent(code)}`)
  },
}
