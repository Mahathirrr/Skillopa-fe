import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/ui/empty-state'
import { PageContainer, PageHeader } from '@/components/ui/page-container'
import { api, mediaUrl, type Enrollment } from '@/lib/api'
import { formatPrice, learnUrl } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

type Filter = 'all' | 'free' | 'paid'

function enrollmentAccess(enrollment: Enrollment): 'free' | 'paid' | 'unknown' {
  if (enrollment.course) {
    return enrollment.course.is_free ? 'free' : 'paid'
  }
  return 'unknown'
}

export function MyLearningPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const [filter, setFilter] = useState<Filter>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.listEnrollments(token!),
    enabled: !!token,
  })

  const enrollments = data?.enrollments ?? []

  const filtered = useMemo(() => {
    if (filter === 'all') return enrollments
    return enrollments.filter((e) => enrollmentAccess(e) === filter)
  }, [enrollments, filter])

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted">{t('common.error')}</p>
      </div>
    )
  }

  return (
    <PageContainer>
      <PageHeader title={t('myLearning.title')} description={t('myLearning.subtitle')} />

      {enrollments.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted">{t('myLearning.count', { count: enrollments.length })}</p>
          <div className="flex gap-2" role="tablist" aria-label={t('myLearning.title')}>
            {(['all', 'free', 'paid'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  filter === key
                    ? 'bg-primary text-white'
                    : 'bg-bg text-muted ring-1 ring-border hover:text-dark'
                }`}
              >
                {t(`myLearning.filter${key === 'all' ? 'All' : key === 'free' ? 'Free' : 'Paid'}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={t('myLearning.emptyTitle')}
          description={t('myLearning.emptyHint')}
          action={{ label: t('home.exploreCourses'), to: '/courses' }}
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted">{t('myLearning.noFilterResults')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((enrollment) => {
            const course = enrollment.course
            const access = enrollmentAccess(enrollment)
            const title = course?.title ?? t('myLearning.courseFallback', { id: enrollment.course_id })
            const href = course?.slug ? learnUrl(course.slug) : '/courses'

            return (
              <Link
                key={enrollment.id}
                to={href}
                className="group overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition hover:shadow-md"
              >
                {course?.cover_image ? (
                  <img
                    src={mediaUrl(course.cover_image)}
                    alt=""
                    className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-bg px-4 text-center text-sm text-muted">
                    {title}
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {access === 'free' && (
                      <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-dark">
                        {t('myLearning.badgeFree')}
                      </span>
                    )}
                    {access === 'paid' && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {t('myLearning.badgePaid')}
                        {course && !course.is_free && (
                          <span className="ml-1 font-normal text-muted">{formatPrice(course.price, false)}</span>
                        )}
                      </span>
                    )}
                    {enrollment.completed_at && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                        {t('myLearning.completed')}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-bold group-hover:text-primary">{title}</h3>
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{t('myLearning.progress')}</span>
                    <span>{Math.round(enrollment.progress_percent)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, enrollment.progress_percent)}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
