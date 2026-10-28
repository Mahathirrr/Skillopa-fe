import { useQuery } from '@tanstack/react-query'
import { Copy, Link2, Share2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function AffiliatePage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const [copied, setCopied] = useState(false)

  const { data: codeData, isLoading: codeLoading } = useQuery({
    queryKey: ['affiliate-code'],
    queryFn: () => api.getReferralCode(token!),
    enabled: !!token,
  })

  const { data: commissionsData, isLoading: commLoading } = useQuery({
    queryKey: ['affiliate-commissions'],
    queryFn: () => api.listAffiliateCommissions(token!),
    enabled: !!token,
  })

  const commissions = useMemo(
    () => commissionsData?.commissions ?? [],
    [commissionsData],
  )

  const stats = useMemo(() => {
    const paid = commissions.filter((c) => c.status === 'paid')
    const pending = commissions.filter((c) => c.status === 'pending')
    return {
      referral_code: codeData?.referral_code ?? '',
      total_earnings: commissions.reduce((s, c) => s + c.amount, 0),
      pending_amount: pending.reduce((s, c) => s + c.amount, 0),
      paid_amount: paid.reduce((s, c) => s + c.amount, 0),
      referral_count: new Set(commissions.map((c) => c.referred_user_id)).size,
    }
  }, [codeData, commissions])

  if (codeLoading || commLoading) return <LoadingSpinner />

  const referralLink = stats.referral_code
    ? `${window.location.origin}/register?ref=${encodeURIComponent(stats.referral_code)}`
    : ''

  function copyLink() {
    if (!referralLink) return
    void navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <Share2 className="mb-3 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">{t('affiliate.title')}</h1>
        <p className="mt-1 text-muted">{t('affiliate.subtitle')}</p>
      </div>

      {stats.referral_code ? (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-border bg-surface p-4">
              <p className="text-sm text-muted">{t('affiliate.totalEarnings')}</p>
              <p className="text-2xl font-bold">{formatPrice(stats.total_earnings)}</p>
            </div>
            <div className="rounded border border-border bg-surface p-4">
              <p className="text-sm text-muted">{t('affiliate.pending')}</p>
              <p className="text-2xl font-bold">{formatPrice(stats.pending_amount)}</p>
            </div>
            <div className="rounded border border-border bg-surface p-4">
              <p className="text-sm text-muted">{t('affiliate.paid')}</p>
              <p className="text-2xl font-bold">{formatPrice(stats.paid_amount)}</p>
            </div>
            <div className="rounded border border-border bg-surface p-4">
              <p className="text-sm text-muted">{t('affiliate.referrals')}</p>
              <p className="text-2xl font-bold">{stats.referral_count}</p>
            </div>
          </div>

          <div className="mb-8 rounded border border-border bg-surface p-6">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Link2 className="h-4 w-4 text-primary" />
              {t('affiliate.referralLink')}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                value={referralLink}
                className="flex-1 rounded border border-border bg-bg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
              >
                <Copy className="h-4 w-4" />
                {copied ? t('affiliate.copied') : t('affiliate.copy')}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              {t('affiliate.codeLabel')}: <strong>{stats.referral_code}</strong>
            </p>
          </div>
        </>
      ) : (
        <p className="text-muted">{t('common.error')}</p>
      )}

      <h2 className="mb-4 text-xl font-bold">{t('affiliate.commissionsTitle')}</h2>
      {commissions.length === 0 ? (
        <p className="text-muted">{t('affiliate.noCommissions')}</p>
      ) : (
        <div className="overflow-x-auto rounded border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('affiliate.colUser')}</th>
                <th className="px-4 py-3 font-semibold">{t('affiliate.colAmount')}</th>
                <th className="px-4 py-3 font-semibold">{t('affiliate.colStatus')}</th>
                <th className="px-4 py-3 font-semibold">{t('affiliate.colDate')}</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{c.referred_user_name ?? `#${c.referred_user_id}`}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(c.amount)}</td>
                  <td className="px-4 py-3 capitalize">{c.status}</td>
                  <td className="px-4 py-3 text-muted">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
