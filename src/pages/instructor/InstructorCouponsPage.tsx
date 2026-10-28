import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { CouponInput } from '@/lib/api'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

function formatDiscount(type: string, value: number) {
  return type === 'percent' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')}`
}

export function InstructorCouponsPage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '10',
    max_uses: '50',
    valid_until: '',
    course_id: '',
  })

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.listInstructorCourses(token!),
    enabled: !!token,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-coupons'],
    queryFn: () => api.listInstructorCoupons(token!),
    enabled: !!token,
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const until = form.valid_until ? new Date(form.valid_until).toISOString() : undefined
      const body: CouponInput = {
        code: form.code.trim(),
        description: form.description.trim() || undefined,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_uses: Number(form.max_uses),
        valid_until: until,
        is_active: true,
        course_id: form.course_id ? Number(form.course_id) : null,
      }
      return api.createInstructorCoupon(token!, body)
    },
    onSuccess: () => {
      setMsg(t('coupons.created'))
      setForm({
        code: '',
        description: '',
        discount_type: 'percent',
        discount_value: '10',
        max_uses: '50',
        valid_until: '',
        course_id: '',
      })
      queryClient.invalidateQueries({ queryKey: ['instructor-coupons'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const paidCourses = (coursesData?.courses ?? []).filter((c) => !c.is_free)
  const coupons = data?.coupons ?? []

  if (isLoading || coursesLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('coupons.instructorTitle')}</h1>
          <p className="mt-1 text-sm text-muted">{t('coupons.instructorPolicy')}</p>
        </div>
        <Link to="/instructor/dashboard" className="text-sm font-semibold text-primary hover:underline">
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
        <div className="mb-4 flex items-center gap-2 font-semibold">
          <Tag className="h-4 w-4 text-primary" />
          {t('coupons.create')}
        </div>
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
              required
              type="number"
              min={1}
              max={500}
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
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
              max={form.discount_type === 'percent' ? 50 : undefined}
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            {form.discount_type === 'percent' && (
              <span className="mt-1 block text-xs text-muted">{t('coupons.instructorMaxPercent')}</span>
            )}
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.validUntil')}</span>
            <input
              required
              type="datetime-local"
              value={form.valid_until}
              onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">{t('coupons.courseScope')}</span>
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="mt-1 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            >
              <option value="">{t('coupons.allMyPaidCourses')}</option>
              {paidCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
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

      <h2 className="mb-3 text-lg font-bold">{t('coupons.yourCoupons')}</h2>
      {coupons.length === 0 ? (
        <p className="text-muted">{t('coupons.empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('coupons.code')}</th>
                <th className="px-4 py-3 font-semibold">{t('coupons.discount')}</th>
                <th className="px-4 py-3 font-semibold">{t('coupons.usage')}</th>
                <th className="px-4 py-3 font-semibold">{t('coupons.status')}</th>
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
                  <td className="px-4 py-3">
                    {c.is_active ? t('coupons.active') : t('coupons.inactive')}
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
