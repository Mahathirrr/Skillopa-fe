import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { InstructorCourseDetailsForm } from '@/pages/instructor/InstructorCourseDetailsForm'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function CourseFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [msg, setMsg] = useState('')
  const [trLocale, setTrLocale] = useState('id')
  const [trTitle, setTrTitle] = useState('')
  const [trSubtitle, setTrSubtitle] = useState('')
  const [trDescription, setTrDescription] = useState('')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
  })

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course-edit', id],
    queryFn: () => api.getCourse(Number(id)),
    enabled: isEdit && !!id,
  })

  const { data: translationsData } = useQuery({
    queryKey: ['course-translations', id],
    queryFn: () => api.listCourseTranslations(Number(id)),
    enabled: isEdit && !!id,
  })

  const translationMutation = useMutation({
    mutationFn: () =>
      api.upsertCourseTranslation(token!, Number(id), trLocale, {
        title: trTitle,
        subtitle: trSubtitle,
        description: trDescription,
      }),
    onSuccess: () => {
      setMsg('Translation saved')
      queryClient.invalidateQueries({ queryKey: ['course-translations', id] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Translation failed'),
  })

  if (isEdit && isLoading) return <LoadingSpinner />

  const categories = categoriesData?.categories ?? []
  const course = courseData?.course
  const translations = translationsData?.translations ?? []

  if (isEdit && !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
        <p className="text-muted">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <Link to="/instructor/courses" className="text-sm text-primary hover:underline">
          Back to courses
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{isEdit ? 'Edit course' : 'Create course'}</h1>
        {course?.moderation_status && (
          <p className="mt-1 text-sm capitalize text-muted">
            {t('moderation.status')}: {course.moderation_status}
          </p>
        )}
      </div>

      {token && (
        <InstructorCourseDetailsForm
          key={isEdit ? String(course!.id) : 'create'}
          mode={isEdit ? 'edit' : 'create'}
          courseId={course?.id}
          initial={isEdit ? course! : null}
          categories={categories}
          token={token}
          moderationStatus={course?.moderation_status}
          onModerationSubmitted={() => queryClient.invalidateQueries({ queryKey: ['course-edit', id] })}
          onMessage={setMsg}
        />
      )}

      {msg && !isEdit && <p className="mt-2 text-sm text-primary">{msg}</p>}

      {isEdit && course && (
        <div className="mt-8 rounded border border-border bg-surface p-6">
          <h2 className="mb-4 text-xl font-bold">{t('instructor.translationFields')}</h2>
          {translations.length > 0 && (
            <ul className="mb-4 space-y-1 text-sm text-muted">
              {translations.map((tr) => (
                <li key={tr.id}>
                  {tr.locale}: {tr.title}
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-3">
            <select
              value={trLocale}
              onChange={(e) => setTrLocale(e.target.value)}
              className="rounded border border-border px-3 py-2 outline-none focus:border-primary"
            >
              <option value="id">Indonesian (id)</option>
              <option value="en">English (en)</option>
            </select>
            <input
              placeholder="Translated title"
              value={trTitle}
              onChange={(e) => setTrTitle(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            <input
              placeholder="Translated subtitle"
              value={trSubtitle}
              onChange={(e) => setTrSubtitle(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            <textarea
              placeholder="Translated description"
              rows={4}
              value={trDescription}
              onChange={(e) => setTrDescription(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => translationMutation.mutate()}
              disabled={!trTitle || translationMutation.isPending}
              className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              Save translation
            </button>
          </div>
          {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}
        </div>
      )}
    </div>
  )
}
