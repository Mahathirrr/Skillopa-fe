import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { UploadField } from '@/components/UploadField'
import { api, type Category, type Course } from '@/lib/api'
import { ApiError } from '@/lib/api-error'

type Props = {
  mode: 'create' | 'edit'
  courseId?: number
  initial: Course | null
  categories: Category[]
  token: string
  moderationStatus?: string
  onModerationSubmitted?: () => void
  onMessage: (msg: string) => void
}

export function InstructorCourseDetailsForm({
  mode,
  courseId,
  initial,
  categories,
  token,
  moderationStatus,
  onModerationSubmitted,
  onMessage,
}: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEdit = mode === 'edit'

  const [title, setTitle] = useState(initial?.title ?? '')
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [categoryId, setCategoryId] = useState(initial ? String(initial.category_id) : '')
  const [level, setLevel] = useState(initial?.level ?? 'beginner')
  const [language, setLanguage] = useState(initial?.language ?? 'English')
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? '')
  const [previewVideo, setPreviewVideo] = useState(initial?.preview_video_url ?? '')
  const [price, setPrice] = useState(initial ? String(initial.price) : '0')
  const [isFree, setIsFree] = useState(initial?.is_free ?? false)
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false)
  const [error, setError] = useState('')

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
      if (isEdit && courseId) {
        return api.updateCourse(token, courseId, { ...payload, is_published: isPublished })
      }
      return api.createCourse(token, payload)
    },
    onSuccess: (res) => {
      navigate(`/instructor/courses/${res.course.id}/curriculum`)
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    },
  })

  const moderationMutation = useMutation({
    mutationFn: () => api.submitCourseForModeration(token, courseId!),
    onSuccess: () => {
      onMessage('Course submitted for moderation')
      onModerationSubmitted?.()
    },
    onError: (e) => onMessage(e instanceof ApiError ? e.message : 'Submission failed'),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        saveMutation.mutate()
      }}
      className="space-y-5 rounded border border-border bg-surface p-6"
    >
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-semibold">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="subtitle" className="mb-1 block text-sm font-semibold">
          Subtitle
        </label>
        <input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-semibold">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-semibold">
            Category
          </label>
          <select
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="mb-1 block text-sm font-semibold">
            Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="language" className="mb-1 block text-sm font-semibold">
            Language
          </label>
          <input
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-semibold">
            Price (USD)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            disabled={isFree}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary disabled:bg-bg"
          />
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
          <input
            id="cover"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Or paste image URL"
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
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
          <input
            id="preview"
            value={previewVideo}
            onChange={(e) => setPreviewVideo(e.target.value)}
            placeholder="Or paste video URL"
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
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
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {saveMutation.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create and build curriculum'}
        </button>
        {isEdit && moderationStatus !== 'pending' && courseId && (
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
  )
}
