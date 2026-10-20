import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Shield, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function ModerationPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [msg, setMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['moderation-pending'],
    queryFn: () => api.listPendingModeration(token!),
    enabled: !!token,
  })

  const approveMutation = useMutation({
    mutationFn: (courseId: number) => api.approveCourseModeration(token!, courseId),
    onSuccess: () => {
      setMsg('Course approved')
      queryClient.invalidateQueries({ queryKey: ['moderation-pending'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ courseId, reason: r }: { courseId: number; reason: string }) =>
      api.rejectCourseModeration(token!, courseId, r),
    onSuccess: () => {
      setRejectId(null)
      setReason('')
      setMsg('Course rejected')
      queryClient.invalidateQueries({ queryKey: ['moderation-pending'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  if (isLoading) return <LoadingSpinner />

  const courses = data?.courses ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Shield className="mb-2 h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('moderation.title')}</h1>
          <p className="text-muted">{t('moderation.subtitle')}</p>
        </div>
        <Link to="/admin" className="text-sm text-primary hover:underline">
          {t('common.back')} to admin
        </Link>
      </div>

      {msg && <p className="mb-4 text-sm text-primary">{msg}</p>}

      {courses.length === 0 ? (
        <p className="text-muted">{t('moderation.noPending')}</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="rounded border border-border bg-surface p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold">{course.title}</h2>
                  <p className="text-sm text-muted">
                    {course.instructor_name} · {formatPrice(course.price, course.is_free)}
                  </p>
                </div>
                <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold capitalize text-dark">
                  {course.moderation_status ?? 'pending'}
                </span>
              </div>
              {course.description && (
                <p className="mb-4 line-clamp-2 text-sm text-muted">{course.description}</p>
              )}

              {rejectId === course.id ? (
                <div className="space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t('moderation.rejectionReason')}
                    rows={2}
                    className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        rejectMutation.mutate({ courseId: course.id, reason: reason || 'Rejected' })
                      }
                      disabled={rejectMutation.isPending}
                      className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Confirm reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectId(null)}
                      className="rounded border border-border px-3 py-1.5 text-xs font-semibold hover:bg-bg"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(course.id)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {t('moderation.approve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectId(course.id)}
                    className="inline-flex items-center gap-1 rounded border border-border px-3 py-1.5 text-xs font-bold hover:bg-bg"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t('moderation.reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
