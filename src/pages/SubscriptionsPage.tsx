import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Crown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function SubscriptionsPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [msg, setMsg] = useState('')

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => api.listSubscriptionPlans(),
  })

  const { data: subData } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => api.getMySubscription(token!),
    enabled: !!token,
  })

  const subscribeMutation = useMutation({
    mutationFn: (planId: number) => api.subscribeToPlan(token!, planId),
    onSuccess: () => {
      setMsg('Subscription activated')
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const cancelMutation = useMutation({
    mutationFn: () => api.cancelSubscription(token!),
    onSuccess: () => {
      setMsg('Subscription cancelled')
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  if (isLoading) return <LoadingSpinner />

  const plans = plansData?.plans ?? []
  const subscription = subData?.subscription

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="mb-8 text-center">
        <Crown className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">{t('subscriptions.title')}</h1>
        <p className="mt-1 text-muted">{t('subscriptions.subtitle')}</p>
      </div>

      {msg && <p className="mb-4 text-center text-sm text-primary">{msg}</p>}

      {subscription && (
        <div className="mb-8 rounded border border-primary bg-primary/5 p-6">
          <h2 className="mb-2 font-bold">{t('subscriptions.currentPlan')}</h2>
          <p className="text-lg font-semibold">{subscription.plan?.name ?? `Plan #${subscription.plan_id}`}</p>
          <p className="text-sm capitalize text-muted">
            {t(`subscriptions.${subscription.status}`)} ·{' '}
            {subscription.expires_at &&
              t('subscriptions.expires', { date: new Date(subscription.expires_at).toLocaleDateString() })}
          </p>
          {subscription.status === 'active' && (
            <button
              type="button"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="mt-4 rounded border border-border px-4 py-2 text-sm font-semibold hover:bg-bg disabled:opacity-60"
            >
              {t('subscriptions.cancel')}
            </button>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded border border-border bg-surface p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
            <p className="mb-4 text-3xl font-bold text-primary">{formatPrice(plan.price)}</p>
            {plan.description && <p className="mb-4 text-sm text-muted">{plan.description}</p>}
            <p className="mb-4 text-xs text-muted">
              Billed every {plan.interval_months} month{plan.interval_months > 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={() => subscribeMutation.mutate(plan.id)}
              disabled={
                subscribeMutation.isPending || subscription?.status === 'active' || plan.price > 0
              }
              title={plan.price > 0 ? t('checkout.paymentNotAvailable') : undefined}
              className="flex w-full items-center justify-center gap-2 rounded bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              {plan.price > 0 ? t('checkout.paymentNotAvailable') : t('subscriptions.subscribe')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
