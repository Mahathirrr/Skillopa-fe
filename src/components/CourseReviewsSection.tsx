import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StarRating } from '@/components/StarRating'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import type { Review, ReviewListMeta } from '@/api/types'
import { cn } from '@/lib/utils'

type Props = {
  courseId: number
  token: string | null
  isAuthenticated: boolean
  canReview: boolean
  currentUserId?: number
  minProgressHint?: number
  enrollmentProgress?: number
}

export function CourseReviewsSection({
  courseId,
  token,
  isAuthenticated,
  canReview,
  currentUserId,
  minProgressHint = 20,
  enrollmentProgress = 0,
}: Props) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [sort, setSort] = useState<'newest' | 'helpful'>('newest')
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [cursor, setCursor] = useState<string | undefined>()
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')
  const [reportId, setReportId] = useState<number | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [msg, setMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', courseId, sort, starFilter, cursor],
    queryFn: () =>
      api.listCourseReviews(courseId, {
        sort,
        rating: starFilter ?? undefined,
        cursor,
        token,
      }),
  })

  const meta: ReviewListMeta | undefined = data?.meta
  const reviews: Review[] = data?.reviews ?? []

  const reviewMutation = useMutation({
    mutationFn: () => api.createReview(token!, courseId, reviewRating, reviewComment),
    onSuccess: () => {
      setReviewComment('')
      setCursor(undefined)
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
      setMsg(t('course.reviewSubmitted'))
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('course.reviewFailed')),
  })

  const updateMutation = useMutation({
    mutationFn: () => api.updateReview(token!, editingId!, editRating, editComment),
    onSuccess: () => {
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteReview(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  })

  const helpfulMutation = useMutation({
    mutationFn: (reviewId: number) => api.voteReviewHelpful(token!, reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', courseId] }),
  })

  const reportMutation = useMutation({
    mutationFn: () => api.reportReview(token!, reportId!, reportReason),
    onSuccess: () => {
      setReportId(null)
      setReportReason('')
      setMsg(t('course.reviewReported'))
    },
  })

  const total = meta?.rating_count ?? 0
  const stars = [
    { n: 5, c: meta?.rating_star_5 ?? 0 },
    { n: 4, c: meta?.rating_star_4 ?? 0 },
    { n: 3, c: meta?.rating_star_3 ?? 0 },
    { n: 2, c: meta?.rating_star_2 ?? 0 },
    { n: 1, c: meta?.rating_star_1 ?? 0 },
  ]

  return (
    <section data-testid="course-reviews-section">
      <h2 className="mb-4 text-2xl font-bold">{t('course.reviewsTitle')}</h2>

      {total === 0 ? (
        <p className="text-muted">{t('course.noReviewsYet')}</p>
      ) : (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start">
          <div>
            <StarRating rating={meta?.rating_avg ?? 0} count={total} size="md" showEmpty={false} />
          </div>
          <div className="flex-1 space-y-1">
            {stars.map(({ n, c }) => {
              const pct = total > 0 ? Math.round((c / total) * 100) : 0
              return (
                <button
                  key={n}
                  type="button"
                  className={cn(
                    'flex w-full max-w-md items-center gap-2 text-left text-sm hover:opacity-80',
                    starFilter === n && 'font-semibold text-primary',
                  )}
                  onClick={() => {
                    setCursor(undefined)
                    setStarFilter(starFilter === n ? null : n)
                  }}
                >
                  <span className="w-12">{n} ★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded bg-bg">
                    <span className="block h-full bg-[#e59819]" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-10 text-muted">{c}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={cn('rounded border px-3 py-1 text-sm', sort === 'newest' && 'border-primary text-primary')}
          onClick={() => {
            setSort('newest')
            setCursor(undefined)
          }}
        >
          {t('course.reviewsSortNewest')}
        </button>
        <button
          type="button"
          className={cn('rounded border px-3 py-1 text-sm', sort === 'helpful' && 'border-primary text-primary')}
          onClick={() => {
            setSort('helpful')
            setCursor(undefined)
          }}
        >
          {t('course.reviewsSortHelpful')}
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted">{t('common.loading')}</p>
      ) : reviews.length === 0 && total > 0 ? (
        <p className="text-muted">{t('course.noReviewsFilter')}</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StarRating rating={r.rating} variant="stars" />
                <span className="font-semibold">{r.user_name}</span>
                {r.verified_purchaser && (
                  <span className="rounded bg-bg px-2 py-0.5 text-xs text-muted">{t('course.verifiedBuyer')}</span>
                )}
                {r.edited && <span className="text-xs text-muted">{t('course.reviewEdited')}</span>}
              </div>
              {r.comment && <p className="mt-2 whitespace-pre-line text-sm">{r.comment}</p>}
              {r.instructor_response && (
                <div className="mt-3 rounded bg-bg p-3 text-sm">
                  <p className="text-xs font-semibold text-primary">{t('course.instructorReply')}</p>
                  <p className="mt-1 whitespace-pre-line">{r.instructor_response}</p>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                <span>{r.helpful_count ?? 0} {t('course.helpfulVotes')}</span>
                {isAuthenticated && token && !r.user_voted_helpful && (
                  <button type="button" className="text-primary hover:underline" onClick={() => helpfulMutation.mutate(r.id)}>
                    {t('course.markHelpful')}
                  </button>
                )}
                {isAuthenticated && token && r.user_id !== currentUserId && (
                  <button type="button" className="text-primary hover:underline" onClick={() => setReportId(r.id)}>
                    {t('course.reportReview')}
                  </button>
                )}
                {isAuthenticated && token && currentUserId === r.user_id && (
                  <>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => {
                        setEditingId(r.id)
                        setEditRating(r.rating)
                        setEditComment(r.comment)
                      }}
                    >
                      {t('course.editReview')}
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        if (confirm(t('course.confirmDeleteReview'))) deleteMutation.mutate(r.id)
                      }}
                    >
                      {t('course.deleteReview')}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {data?.meta?.next_cursor && (
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary hover:underline"
          onClick={() => setCursor(data.meta.next_cursor)}
        >
          {t('common.loadMore')}
        </button>
      )}

      {reportId && isAuthenticated && token && (
        <form
          className="mt-4 rounded border border-border p-4"
          onSubmit={(e) => {
            e.preventDefault()
            reportMutation.mutate()
          }}
        >
          <p className="mb-2 font-semibold">{t('course.reportReview')}</p>
          <textarea
            required
            className="w-full rounded border border-border bg-bg p-2 text-sm"
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="rounded bg-primary px-3 py-1 text-sm text-white">
              {t('common.submit')}
            </button>
            <button type="button" className="text-sm text-muted" onClick={() => setReportId(null)}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {editingId && isAuthenticated && token && (
        <form
          className="mt-4 rounded border border-primary bg-primary/5 p-4"
          onSubmit={(e) => {
            e.preventDefault()
            updateMutation.mutate()
          }}
        >
          <h3 className="mb-2 font-semibold">{t('course.editReview')}</h3>
          <select
            className="mb-2 rounded border border-border bg-bg px-2 py-1 text-sm"
            value={editRating}
            onChange={(e) => setEditRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <textarea
            className="mb-2 w-full rounded border border-border bg-bg p-2 text-sm"
            rows={3}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded bg-primary px-3 py-1 text-sm text-white">
              {t('course.saveReview')}
            </button>
            <button type="button" className="text-sm text-muted" onClick={() => setEditingId(null)}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {isAuthenticated && token && canReview && (
        <form
          className="mt-6 rounded border border-border p-4"
          onSubmit={(e) => {
            e.preventDefault()
            reviewMutation.mutate()
          }}
        >
          <h3 className="mb-3 font-semibold">{t('course.leaveReview')}</h3>
          <label className="mb-2 block text-sm">
            {t('course.rating')}
            <select
              className="ml-2 rounded border border-border bg-bg px-2 py-1"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <textarea
            className="w-full rounded border border-border bg-bg p-2 text-sm"
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder={t('course.reviewPlaceholder')}
          />
          <button type="submit" disabled={reviewMutation.isPending} className="mt-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
            {t('course.submitReview')}
          </button>
        </form>
      )}

      {isAuthenticated && token && !canReview && enrollmentProgress < minProgressHint && (
        <p className="mt-4 text-sm text-muted">
          {t('course.reviewProgressRequired', { percent: minProgressHint })}
        </p>
      )}

      {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}
    </section>
  )
}
