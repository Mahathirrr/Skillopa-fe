import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CourseCard } from '@/components/CourseCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function WishlistPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.listWishlist(token!),
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: (courseId: number) => api.removeFromWishlist(token!, courseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const items = data?.wishlist ?? []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">Wishlist</h1>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">Your wishlist is empty</p>
          <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((course) => (
            <div key={course.id} className="relative">
              <CourseCard course={course} inWishlist />
              <button
                type="button"
                onClick={() => removeMutation.mutate(course.id)}
                className="absolute right-2 top-2 rounded bg-white/90 p-1.5 text-muted shadow hover:text-red-600"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
