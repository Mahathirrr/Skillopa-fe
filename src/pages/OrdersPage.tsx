import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Package, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Order } from '@/lib/api'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
    partial_refund: 'bg-orange-100 text-orange-800',
  }
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold capitalize ${colors[status] ?? 'bg-bg text-muted'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function OrderCard({ order, onRefund }: { order: Order; onRefund: (orderId: number) => void }) {
  const canRefund = order.status === 'paid'

  return (
    <div className="rounded border border-border bg-surface p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted">Order #{order.order_number}</p>
          <p className="text-xs text-muted">
            {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul className="mb-4 space-y-2 border-b border-border pb-4">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>{item.title ?? `Course #${item.course_id}`}</span>
            <span className="font-semibold">{formatPrice(item.price)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          {order.discount > 0 && (
            <span className="mr-3 text-muted line-through">{formatPrice(order.subtotal)}</span>
          )}
          <span className="text-lg font-bold">{formatPrice(order.total)}</span>
        </div>
        {canRefund && (
          <button
            type="button"
            onClick={() => onRefund(order.id)}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-sm hover:bg-bg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Request refund
          </button>
        )}
      </div>
    </div>
  )
}

export function OrdersPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [refundOrderId, setRefundOrderId] = useState<number | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [msg, setMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.listOrders(token!),
    enabled: !!token,
  })

  const refundMutation = useMutation({
    mutationFn: () => api.requestRefund(token!, refundOrderId!, refundReason),
    onSuccess: () => {
      setMsg('Refund request submitted')
      setRefundOrderId(null)
      setRefundReason('')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['refunds'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Refund request failed'),
  })

  const orders = data?.orders ?? []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="mb-2 text-3xl font-bold">Order history</h1>
      <p className="mb-8 text-muted">View past purchases and request refunds</p>

      {msg && <p className="mb-4 text-sm text-primary">{msg}</p>}

      {orders.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">No orders yet</p>
          <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onRefund={setRefundOrderId} />
          ))}
        </div>
      )}

      {refundOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded border border-border bg-surface p-6">
            <h2 className="mb-4 text-xl font-bold">Request refund</h2>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Why are you requesting a refund?"
              rows={4}
              className="mb-4 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refundMutation.mutate()}
                disabled={!refundReason.trim() || refundMutation.isPending}
                className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setRefundOrderId(null)}
                className="rounded border border-border px-4 py-2 text-sm hover:bg-bg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
