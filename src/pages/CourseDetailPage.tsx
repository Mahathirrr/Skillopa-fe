import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, Globe, Play, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { StarRating } from '@/components/StarRating'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatDuration, formatPrice, learnUrl } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { token, isAuthenticated } = useAuthStore()

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => api.getCourseBySlug(slug!),
    enabled: !!slug,
  })

  const course = data?.course
  const curriculum = data?.curriculum ?? []

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', course?.id],
    queryFn: () => api.listCourseReviews(course!.id),
    enabled: !!course?.id,
  })

  const reviews = reviewsData?.reviews ?? []

  const totalLectures = curriculum.reduce((acc, s) => acc + (s.lectures?.length ?? 0), 0)
  const totalDuration = curriculum.reduce(
    (acc, s) => acc + (s.lectures?.reduce((a, l) => a + l.duration_seconds, 0) ?? 0),
    0,
  )

  const enrollMutation = useMutation({
    mutationFn: () => api.enrollFree(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Enrolled successfully')
      navigate(learnUrl(course!.slug))
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Enrollment failed'),
  })

  const cartMutation = useMutation({
    mutationFn: () => api.addToCart(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Added to cart')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Failed to add to cart'),
  })

  const wishlistMutation = useMutation({
    mutationFn: () => api.addToWishlist(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Added to wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Failed to add to wishlist'),
  })

  const reviewMutation = useMutation({
    mutationFn: () => api.createReview(token!, course!.id, reviewRating, reviewComment),
    onSuccess: () => {
      setReviewComment('')
      queryClient.invalidateQueries({ queryKey: ['reviews', course!.id] })
      setActionMsg('Review submitted')
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Review failed'),
  })

  if (isLoading) return <LoadingSpinner />
  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  function handleEnrollOrBuy() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${slug}` } })
      return
    }
    if (course!.is_free) {
      enrollMutation.mutate()
    } else {
      cartMutation.mutate()
    }
  }

  return (
    <div>
      <section className="bg-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
          <div>
            <p className="mb-2 text-sm text-accent">{course.category_name}</p>
            <h1 className="mb-3 text-3xl font-bold lg:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mb-4 text-lg text-white/80">{course.subtitle}</p>}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
              <StarRating rating={course.rating_avg} count={course.rating_count} />
              <span>{course.enrollment_count?.toLocaleString() ?? 0} students</span>
              {course.instructor_name && <span>Created by {course.instructor_name}</span>}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(totalDuration)}
              </span>
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                {totalLectures} lectures
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Globe className="h-4 w-4" />
                {course.level} · {course.language || 'English'}
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="overflow-hidden rounded border border-border bg-surface text-dark shadow-xl">
              {course.preview_video_url ? (
                <iframe
                  src={course.preview_video_url}
                  title="Course preview"
                  className="aspect-video w-full"
                  allowFullScreen
                />
              ) : course.cover_image ? (
                <img src={course.cover_image} alt={course.title} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-bg text-muted">Preview unavailable</div>
              )}
              <div className="p-5">
                <p className="mb-4 text-3xl font-bold">{formatPrice(course.price, course.is_free)}</p>
                <button
                  type="button"
                  onClick={handleEnrollOrBuy}
                  disabled={enrollMutation.isPending || cartMutation.isPending}
                  className="mb-2 w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {course.is_free ? 'Enroll for free' : 'Add to cart'}
                </button>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => wishlistMutation.mutate()}
                    className="w-full rounded border border-dark py-3 text-sm font-bold hover:bg-bg"
                  >
                    Add to wishlist
                  </button>
                )}
                {actionMsg && <p className="mt-3 text-center text-sm text-primary">{actionMsg}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-2xl font-bold">What you will learn</h2>
            <div className="rounded border border-border bg-surface p-6">
              <p className="whitespace-pre-line text-muted">{course.description || 'No description provided.'}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Course content</h2>
            <div className="rounded border border-border bg-surface">
              <div className="border-b border-border px-4 py-3 text-sm font-semibold">
                {curriculum.length} sections · {totalLectures} lectures · {formatDuration(totalDuration)} total length
              </div>
              {curriculum.map((section) => (
                <div key={section.id} className="border-b border-border last:border-0">
                  <div className="bg-bg px-4 py-3 font-semibold">{section.title}</div>
                  {section.lectures?.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="flex items-center justify-between border-t border-border px-4 py-2.5 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Play className="h-3.5 w-3.5 text-muted" />
                        {lecture.title}
                        {lecture.is_preview && (
                          <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-dark">Preview</span>
                        )}
                      </span>
                      <span className="text-muted">{formatDuration(lecture.duration_seconds)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Student reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded border border-border bg-surface p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <StarRating rating={r.rating} />
                      <span className="text-sm font-semibold">{r.user_name}</span>
                    </div>
                    <p className="text-sm text-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {isAuthenticated && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  reviewMutation.mutate()
                }}
                className="mt-6 rounded border border-border bg-surface p-4"
              >
                <h3 className="mb-3 font-semibold">Leave a review</h3>
                <div className="mb-3 flex items-center gap-2">
                  <label htmlFor="rating" className="text-sm">Rating</label>
                  <select
                    id="rating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="rounded border border-border px-2 py-1"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} stars</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="mb-3 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
                >
                  Submit review
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className="lg:hidden">
          <div className="sticky top-20 rounded border border-border bg-surface p-5 shadow-sm">
            <p className="mb-4 text-2xl font-bold">{formatPrice(course.price, course.is_free)}</p>
            <button
              type="button"
              onClick={handleEnrollOrBuy}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded bg-primary py-3 text-sm font-bold text-white"
            >
              {course.is_free ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Enroll for free
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </>
              )}
            </button>
            {isAuthenticated && (
              <Link
                to={learnUrl(course.slug)}
                className="block w-full rounded border border-dark py-3 text-center text-sm font-bold"
              >
                Go to course
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
