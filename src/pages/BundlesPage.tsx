import { useMutation, useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import type { Course, CourseBundle } from '@/api/types'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

function bundleCourseCount(bundle: CourseBundle): number {
  return bundle.course_count ?? bundle.courses?.length ?? 0
}

function retailTotal(courses: Course[]): number {
  return courses.reduce((sum, c) => sum + (c.is_free ? 0 : c.price), 0)
}

export function BundlesPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [msg, setMsg] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn: () => api.listBundles(),
  })

  const checkoutMutation = useMutation({
    mutationFn: (bundleId: number) => api.checkoutBundle(token!, bundleId),
    onSuccess: () => navigate('/my-learning'),
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const bundles = useMemo(() => {
    const list = data?.bundles ?? []
    return [...list].sort((a, b) => bundleCourseCount(b) - bundleCourseCount(a))
  }, [data?.bundles])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      <div className="mb-8 max-w-3xl">
        <Package className="mb-3 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">{t('bundles.title')}</h1>
        <p className="mt-1 text-muted">{t('bundles.subtitle')}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t('bundles.about')}</p>
      </div>

      {msg && <p className="mb-4 text-sm text-red-600">{msg}</p>}

      {bundles.length === 0 ? (
        <p className="text-muted">{t('bundles.empty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => {
            const courses = bundle.courses ?? []
            const count = bundleCourseCount(bundle)
            const totalRetail = retailTotal(courses)
            const savings = totalRetail > bundle.price ? totalRetail - bundle.price : 0
            const isFree = bundle.price <= 0
            const canFreeCheckout = isFree && count > 0

            return (
              <article
                key={bundle.id}
                className="flex min-w-0 flex-col rounded border border-border bg-surface p-6"
              >
                <h2 className="mb-2 text-xl font-bold">{bundle.title}</h2>
                {bundle.description && <p className="mb-4 text-sm text-muted">{bundle.description}</p>}

                <p className="mb-1 text-2xl font-bold text-primary">{formatPrice(bundle.price)}</p>
                {totalRetail > 0 && !isFree && (
                  <p className="mb-1 text-sm text-muted">
                    {t('bundles.retailTotal', { total: formatPrice(totalRetail) })}
                  </p>
                )}
                {savings > 0 && (
                  <p className="mb-2 text-sm font-medium text-emerald-700">
                    {t('bundles.youSave', { amount: formatPrice(savings) })}
                  </p>
                )}

                <p className="mb-3 text-sm font-medium text-ink">
                  {t('bundles.coursesIncluded', { count })}
                </p>

                {count === 0 ? (
                  <p className="mb-4 text-sm text-amber-700">{t('bundles.emptyCourses')}</p>
                ) : (
                  <ul className="mb-4 space-y-2 border-t border-border pt-3 text-sm">
                    {courses.map((c) => (
                      <li key={c.id} className="flex min-w-0 items-start justify-between gap-2">
                        <Link
                          to={`/courses/${c.slug}`}
                          className="min-w-0 flex-1 text-primary hover:underline"
                        >
                          {c.title}
                        </Link>
                        <span className="shrink-0 text-muted">
                          {formatPrice(c.price, c.is_free)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {!isFree && count > 0 && (
                  <p className="mb-3 text-xs text-muted">{t('bundles.paidCheckoutHint')}</p>
                )}

                <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                  {canFreeCheckout ? (
                    <button
                      type="button"
                      onClick={() => (token ? checkoutMutation.mutate(bundle.id) : navigate('/login'))}
                      disabled={checkoutMutation.isPending}
                      className="flex-1 rounded bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                      {token ? t('bundles.freeEnroll') : t('bundles.loginToBuy')}
                    </button>
                  ) : !isFree && count > 0 ? (
                    <button
                      type="button"
                      onClick={() => (token ? navigate('/checkout') : navigate('/login'))}
                      className="flex-1 rounded bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
                    >
                      {token ? t('bundles.buyBundle') : t('bundles.loginToBuy')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex-1 rounded bg-primary py-2.5 text-sm font-bold text-white opacity-50"
                    >
                      {t('bundles.unavailable')}
                    </button>
                  )}
                  {courses[0] && (
                    <Link
                      to={`/courses/${courses[0].slug}`}
                      className="flex-1 rounded border border-border py-2.5 text-center text-sm font-semibold hover:bg-bg"
                    >
                      {t('bundles.browseCourse')}
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
