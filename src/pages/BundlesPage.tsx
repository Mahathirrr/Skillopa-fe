import { useMutation, useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

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

  if (isLoading) return <LoadingSpinner />

  const bundles = data?.bundles ?? []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <Package className="mb-3 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">{t('bundles.title')}</h1>
        <p className="mt-1 text-muted">{t('bundles.subtitle')}</p>
      </div>

      {msg && <p className="mb-4 text-sm text-red-600">{msg}</p>}

      {bundles.length === 0 ? (
        <p className="text-muted">{t('bundles.empty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="rounded border border-border bg-surface p-6">
              <h2 className="mb-2 text-xl font-bold">{bundle.title}</h2>
              {bundle.description && <p className="mb-4 text-sm text-muted">{bundle.description}</p>}
              <p className="mb-2 text-2xl font-bold text-primary">{formatPrice(bundle.price)}</p>
              <p className="mb-4 text-sm text-muted">
                {t('bundles.coursesIncluded', {
                  count: bundle.course_count ?? bundle.courses?.length ?? 0,
                })}
              </p>
              {bundle.courses && bundle.courses.length > 0 && (
                <ul className="mb-4 space-y-1 text-sm text-muted">
                  {bundle.courses.map((c) => (
                    <li key={c.id}>
                      <Link to={`/courses/${c.slug}`} className="text-primary hover:underline">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => (token ? checkoutMutation.mutate(bundle.id) : navigate('/login'))}
                disabled={checkoutMutation.isPending || bundle.price > 0}
                title={bundle.price > 0 ? t('checkout.paymentNotAvailable') : undefined}
                className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {token ? t('bundles.checkout') : t('nav.login')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
