import { useMutation, useQuery } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CheckoutPage() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.listCart(token!),
    enabled: !!token,
  })

  const items = data?.cart ?? []
  const total = items.reduce((sum, c) => sum + (c.is_free ? 0 : c.price), 0)

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const results = []
      for (const course of items) {
        if (course.is_free) {
          const res = await api.enrollFree(token!, course.id)
          results.push(res)
        } else {
          const { payment } = await api.checkout(token!, course.id)
          const confirmed = await api.confirmPayment(token!, payment.order_id)
          results.push(confirmed)
        }
      }
      return results
    },
    onSuccess: () => {
      navigate('/payment/success')
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : 'Checkout failed')
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="mb-4 font-bold">Order details</h2>
          <ul className="mb-6 space-y-2">
            {items.map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <span>{c.title}</span>
                <span className="font-semibold">{formatPrice(c.price, c.is_free)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="mb-6 rounded bg-bg p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CreditCard className="h-5 w-5 text-primary" />
              Mock payment
            </div>
            <p className="text-sm text-muted">
              This is a demo checkout. Click confirm to simulate payment and enroll in your courses.
            </p>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Confirm and pay'}
          </button>
        </div>
      )}
    </div>
  )
}
