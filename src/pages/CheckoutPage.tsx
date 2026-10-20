import { useMutation, useQuery } from '@tanstack/react-query'
import { Package, Tag } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CheckoutPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [selectedBundleId, setSelectedBundleId] = useState('')

  const { data: bundlesData } = useQuery({
    queryKey: ['bundles'],
    queryFn: () => api.listBundles(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.listCart(token!),
    enabled: !!token,
  })

  const items = data?.cart ?? []
  const bundles = (bundlesData?.bundles ?? []).filter((b) => b.price <= 0)
  const paidCourses = items.filter((c) => !c.is_free)
  const freeCourses = items.filter((c) => c.is_free)
  const subtotal = paidCourses.reduce((sum, c) => sum + c.price, 0)
  const discount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, subtotal - discount)

  const validateCouponMutation = useMutation({
    mutationFn: () => api.validateCoupon(token!, couponCode.trim(), subtotal),
    onSuccess: (res) => {
      if (res.valid && res.coupon) {
        setAppliedCoupon({ code: res.coupon.code, discount: res.discount_amount })
        setCouponMsg(`-${formatPrice(res.discount_amount)}`)
        setError('')
      } else {
        setAppliedCoupon(null)
        setCouponMsg(res.message ?? 'Invalid coupon')
      }
    },
    onError: (e) => {
      setAppliedCoupon(null)
      setCouponMsg(e instanceof ApiError ? e.message : t('common.error'))
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (paidCourses.length > 0) {
        throw new ApiError(t('checkout.paymentNotAvailable'), 501)
      }
      for (const course of freeCourses) {
        await api.enrollFree(token!, course.id)
      }
    },
    onSuccess: () => {
      navigate('/my-learning')
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : t('common.error'))
    },
  })

  const bundleCheckoutMutation = useMutation({
    mutationFn: () => api.checkoutBundle(token!, Number(selectedBundleId)),
    onSuccess: () => navigate('/my-learning'),
    onError: (e) => setError(e instanceof ApiError ? e.message : t('common.error')),
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">{t('checkout.title')}</h1>

      {items.length === 0 ? (
        <p className="text-muted">{t('checkout.emptyCart')}</p>
      ) : (
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="mb-4 font-bold">{t('checkout.orderDetails')}</h2>
          <ul className="mb-6 space-y-2">
            {items.map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <span>{c.title}</span>
                <span className="font-semibold">{formatPrice(c.price, c.is_free)}</span>
              </li>
            ))}
          </ul>

          {paidCourses.length > 0 && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {t('checkout.paymentNotAvailable')}
            </p>
          )}

          {subtotal > 0 && (
            <div className="mb-4 rounded border border-border p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Tag className="h-4 w-4 text-primary" />
                {t('checkout.couponCode')}
              </div>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="flex-1 rounded border border-border px-3 py-2 text-sm uppercase outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => validateCouponMutation.mutate()}
                  disabled={!couponCode.trim() || validateCouponMutation.isPending}
                  className="rounded bg-dark px-4 py-2 text-sm font-bold text-white hover:bg-dark-muted disabled:opacity-60"
                >
                  {t('checkout.applyCoupon')}
                </button>
              </div>
              {couponMsg && (
                <p className={`mt-2 text-sm ${appliedCoupon ? 'text-green-600' : 'text-muted'}`}>{couponMsg}</p>
              )}
            </div>
          )}

          {subtotal > 0 && (
            <>
              <div className="mb-2 flex justify-between text-sm text-muted">
                <span>{t('checkout.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="mb-2 flex justify-between text-sm text-green-600">
                  <span>{t('checkout.discount')}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="mb-6 flex justify-between border-t border-border pt-4 text-lg font-bold">
                <span>{t('checkout.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </>
          )}

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {bundles.length > 0 && (
            <div className="mb-6 rounded border border-border p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Package className="h-4 w-4 text-primary" />
                {t('checkout.bundleOption')}
              </div>
              <select
                value={selectedBundleId}
                onChange={(e) => setSelectedBundleId(e.target.value)}
                className="mb-3 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">{t('checkout.selectBundle')}</option>
                {bundles.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => bundleCheckoutMutation.mutate()}
                disabled={!selectedBundleId || bundleCheckoutMutation.isPending}
                className="w-full rounded border border-primary py-2 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-60"
              >
                {t('checkout.enrollBundle')}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending || freeCourses.length === 0}
            className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {checkoutMutation.isPending ? t('checkout.processing') : t('checkout.confirmFreeEnroll')}
          </button>
        </div>
      )}
    </div>
  )
}
