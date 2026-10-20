import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { UploadField } from '@/components/UploadField'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function CourseFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [level, setLevel] = useState('beginner')
  const [language, setLanguage] = useState('English')
  const [coverImage, setCoverImage] = useState('')
  const [previewVideo, setPreviewVideo] = useState('')
  const [price, setPrice] = useState('0')
  const [isFree, setIsFree] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [error, setError] = useState('')
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

  useEffect(() => {
    const course = courseData?.course
    if (!course) return
    setTitle(course.title)
    setSubtitle(course.subtitle ?? '')
    setDescription(course.description ?? '')
    setCategoryId(String(course.category_id))
    setLevel(course.level)
    setLanguage(course.language ?? 'English')
    setCoverImage(course.cover_image ?? '')
    setPreviewVideo(course.preview_video_url ?? '')
    setPrice(String(course.price))
    setIsFree(course.is_free)
    setIsPublished(course.is_published ?? false)
  }, [courseData])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        subtitle,
        description,
        category_id: Number(categoryId),
        level,
        language,
        cover_image: coverImage,
        preview_video_url: previewVideo,
        price: Number(price),
        is_free: isFree,
      }
      if (isEdit) {
        return api.updateCourse(token!, Number(id), { ...payload, is_published: isPublished })
      }
      return api.createCourse(token!, payload)
    },
    onSuccess: (res) => {
      navigate(`/instructor/courses/${res.course.id}/curriculum`)
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    },
  })

  const moderationMutation = useMutation({
    mutationFn: () => api.submitCourseForModeration(token!, Number(id)),
    onSuccess: () => {
      setMsg('Course submitted for moderation')
      queryClient.invalidateQueries({ queryKey: ['course-edit', id] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Submission failed'),
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          saveMutation.mutate()
        }}
        className="space-y-5 rounded border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-semibold">Title</label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
        </div>
        <div>
          <label htmlFor="subtitle" className="mb-1 block text-sm font-semibold">Subtitle</label>
          <input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-semibold">Description</label>
          <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-semibold">Category</label>
            <select id="category" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="level" className="mb-1 block text-sm font-semibold">Level</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="language" className="mb-1 block text-sm font-semibold">Language</label>
            <input id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-semibold">Price (USD)</label>
            <input id="price" type="number" min="0" step="0.01" value={price} disabled={isFree}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary disabled:bg-bg" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Cover image</label>
          <div className="flex flex-col gap-2">
            <UploadField
              category="image"
              accept="image/*"
              label="Upload cover image"
              onUploaded={(file) => setCoverImage(file.url ?? '')}
            />
            <input id="cover" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste image URL"
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Preview video</label>
          <div className="flex flex-col gap-2">
            <UploadField
              category="video"
              accept="video/*"
              label="Upload preview video"
              onUploaded={(file) => setPreviewVideo(file.url ?? '')}
            />
            <input id="preview" value={previewVideo} onChange={(e) => setPreviewVideo(e.target.value)}
              placeholder="Or paste video URL"
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary" />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Free course
          </label>
          {isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              Published
            </label>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {msg && <p className="text-sm text-primary">{msg}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saveMutation.isPending}
            className="rounded bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60">
            {saveMutation.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create and build curriculum'}
          </button>
          {isEdit && course?.moderation_status !== 'pending' && (
            <button
              type="button"
              onClick={() => moderationMutation.mutate()}
              disabled={moderationMutation.isPending}
              className="rounded border border-primary px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-60"
            >
              {t('moderation.submitForReview')}
            </button>
          )}
        </div>
      </form>

      {isEdit && (
        <div className="mt-8 rounded border border-border bg-surface p-6">
          <h2 className="mb-4 text-xl font-bold">{t('instructor.translationFields')}</h2>
          {translations.length > 0 && (
            <ul className="mb-4 space-y-1 text-sm text-muted">
              {translations.map((tr) => (
                <li key={tr.id}>{tr.locale}: {tr.title}</li>
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
        </div>
      )}
    </div>
  )
}
