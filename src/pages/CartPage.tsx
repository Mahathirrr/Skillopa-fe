import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { courseUrl, formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CartPage() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.listCart(token!),
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: (courseId: number) => api.removeFromCart(token!, courseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const items = data?.cart ?? []
  const total = items.reduce((sum, c) => sum + (c.is_free ? 0 : c.price), 0)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">Shopping cart</h1>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((course) => (
              <div
                key={course.id}
                className="flex gap-4 rounded border border-border bg-surface p-4"
              >
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="h-20 w-32 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded bg-bg text-xs text-muted">
                    No image
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <Link
                    to={courseUrl(course.slug)}
                    className="font-bold hover:text-primary"
                  >
                    {course.title}
                  </Link>
                  <p className="text-sm text-muted">{course.instructor_name}</p>
                  <p className="mt-auto font-bold">{formatPrice(course.price, course.is_free)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(course.id)}
                  className="self-start rounded p-2 text-muted hover:bg-bg hover:text-red-600"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded border border-border bg-surface p-5">
            <h2 className="mb-4 text-lg font-bold">Order summary</h2>
            <div className="mb-4 flex justify-between text-sm">
              <span>Subtotal ({items.length} courses)</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
