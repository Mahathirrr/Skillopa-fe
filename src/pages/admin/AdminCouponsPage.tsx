import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { CouponInput } from '@/lib/api'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

function formatDiscount(type: string, value: number) {
  return type === 'percent' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')}`
}

export function AdminCouponsPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '10',
    max_uses: '0',
    min_purchase: '0',
    is_active: true,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.listAdminCoupons(token!),
    enabled: !!token,
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const body: CouponInput = {
        code: form.code.trim(),
        description: form.description.trim() || undefined,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_purchase: Number(form.min_purchase) || 0,
        max_uses: Number(form.max_uses) || 0,
        is_active: form.is_active,
      }
      return api.createAdminCoupon(token!, body)
    },
    onSuccess: () => {
      setMsg(t('coupons.created'))
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.updateAdminCoupon(token!, id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteAdminCoupon(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  })

  const coupons = data?.coupons ?? []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('coupons.adminTitle')}</h1>
          <p className="mt-1 text-sm text-muted">{t('coupons.adminHint')}</p>
        </div>
        <Link to="/admin" className="text-sm font-semibold text-primary hover:underline">
          {t('common.back')}
        </Link>
      </div>

      <form
        className="mb-8 rounded border border-border bg-surface p-6"
        onSubmit={(e) => {
          e.preventDefault()
          createMutation.mutate()
        }}
      >
        <h2 className="mb-4 font-bold">{t('coupons.create')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.code')}</span>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="mt-1 w-full rounded border border-border px-3 py-2 uppercase outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.maxUses')}</span>
            <input
              type="number"
              min={0}
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            <span className="mt-1 block text-xs text-muted">{t('coupons.adminMaxUsesHint')}</span>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">{t('coupons.description')}</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.discountType')}</span>
            <select
              value={form.discount_type}
              onChange={(e) =>
                setForm({ ...form, discount_type: e.target.value as 'percent' | 'fixed' })
              }
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            >
              <option value="percent">{t('coupons.typePercent')}</option>
              <option value="fixed">{t('coupons.typeFixed')}</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.discountValue')}</span>
            <input
              required
              type="number"
              min={1}
              max={form.discount_type === 'percent' ? 100 : undefined}
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
          </label>
        </div>
        {msg && <p className="mt-4 text-sm text-muted">{msg}</p>}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 rounded bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {t('coupons.create')}
        </button>
      </form>

      <div className="overflow-x-auto rounded border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-bg">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('coupons.code')}</th>
              <th className="px-4 py-3 font-semibold">{t('coupons.discount')}</th>
              <th className="px-4 py-3 font-semibold">{t('coupons.usage')}</th>
              <th className="px-4 py-3 font-semibold">{t('coupons.scope')}</th>
              <th className="px-4 py-3 font-semibold">{t('coupons.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">{formatDiscount(c.discount_type, c.discount_value)}</td>
                <td className="px-4 py-3">
                  {c.used_count}/{c.max_uses || '∞'}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {c.instructor_id
                    ? t('coupons.scopeInstructor')
                    : c.course_id
                      ? t('coupons.scopeCourse')
                      : t('coupons.scopePlatform')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleMutation.mutate({ id: c.id, is_active: !c.is_active })
                      }
                      className="text-primary hover:underline"
                    >
                      {c.is_active ? t('coupons.deactivate') : t('coupons.activate')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(t('coupons.confirmDelete'))) deleteMutation.mutate(c.id)
                      }}
                      className="text-red-600 hover:underline"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
