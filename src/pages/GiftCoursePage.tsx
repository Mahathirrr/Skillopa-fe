import { useMutation, useQuery } from '@tanstack/react-query'
import { Gift } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function GiftCoursePage() {
  const { t } = useTranslation()
  const { token } = useAuthStore()
  const [params, setParams] = useSearchParams()
  const courseIdParam = params.get('course_id') ?? ''

  const [selectedCourseId, setSelectedCourseId] = useState(courseIdParam)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [giftCode, setGiftCode] = useState('')
  const [msg, setMsg] = useState('')

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'gift-picker'],
    queryFn: () => api.listCourses({ limit: 50 }),
  })

  const activeCourseId = selectedCourseId || courseIdParam

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['course-gift', activeCourseId],
    queryFn: () => api.getCourse(Number(activeCourseId)),
    enabled: !!activeCourseId,
  })

  const sendMutation = useMutation({
    mutationFn: () =>
      api.createGift(token!, {
        course_id: Number(activeCourseId),
        recipient_email: recipientEmail,
        message: message || undefined,
      }),
    onSuccess: (res) => {
      setMsg(`${t('gift.success')} Code: ${res.gift.gift_code}`)
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  const redeemMutation = useMutation({
    mutationFn: () => api.redeemGift(token!, giftCode.trim()),
    onSuccess: () => setMsg('Gift redeemed! Check My Learning.'),
    onError: (e) => setMsg(e instanceof ApiError ? e.message : t('common.error')),
  })

  if (coursesLoading) return <LoadingSpinner />

  const courses = coursesData?.courses ?? []
  const course = courseData?.course

  function handleCourseChange(id: string) {
    setSelectedCourseId(id)
    if (id) setParams({ course_id: id })
    else setParams({})
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-6">
      <div className="mb-6 text-center">
        <Gift className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">{t('gift.title')}</h1>
        <p className="mt-1 text-muted">{t('gift.subtitle')}</p>
      </div>

      {msg && <p className="mb-4 text-center text-sm text-primary">{msg}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!activeCourseId) return
          sendMutation.mutate()
        }}
        className="mb-8 space-y-4 rounded border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="course" className="mb-1 block text-sm font-semibold">
            Select course
          </label>
          <select
            id="course"
            value={activeCourseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            required
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">Choose a course...</option>
            {courses.filter((c) => !c.is_free).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {courseLoading && activeCourseId ? (
          <LoadingSpinner />
        ) : course ? (
          <p className="rounded bg-bg p-3 text-center text-sm font-semibold">{course.title}</p>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            {t('gift.recipientEmail')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-semibold">
            {t('gift.message')}
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={!activeCourseId || sendMutation.isPending}
          className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {t('gift.sendGift')}
        </button>
      </form>

      <div className="rounded border border-border bg-surface p-6">
        <h2 className="mb-3 font-bold">Redeem a gift</h2>
        <div className="flex gap-2">
          <input
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
            placeholder="Gift code"
            className="flex-1 rounded border border-border px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => redeemMutation.mutate()}
            disabled={!giftCode.trim() || redeemMutation.isPending}
            className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  )
}
