import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HelpCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { UploadField } from '@/components/UploadField'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [sectionTitle, setSectionTitle] = useState('')
  const [bulkLinks, setBulkLinks] = useState<Record<number, string>>({})
  const [lectureForms, setLectureForms] = useState<Record<number, {
    title: string
    video_url: string
    file_url: string
    local_media_path: string
    duration_seconds: string
    content_type: string
    available_at: string
  }>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => api.getCourse(courseId),
    enabled: !!id,
  })

  const course = data?.course
  const curriculum = data?.curriculum ?? []

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['course', id] })

  const addSectionMutation = useMutation({
    mutationFn: () =>
      api.createSection(token!, courseId, { title: sectionTitle, sort_order: curriculum.length }),
    onSuccess: () => {
      setSectionTitle('')
      invalidate()
    },
  })

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: number) => api.deleteSection(token!, courseId, sectionId),
    onSuccess: invalidate,
  })

  const addLectureMutation = useMutation({
    mutationFn: ({ sectionId, sortOrder }: { sectionId: number; sortOrder: number }) => {
      const form = lectureForms[sectionId] ?? {
        title: '',
        video_url: '',
        file_url: '',
        local_media_path: '',
        duration_seconds: '0',
        content_type: 'video',
        available_at: '',
      }
      return api.createLecture(token!, courseId, sectionId, {
        title: form.title,
        content_type: form.content_type,
        video_url: form.video_url || undefined,
        file_url: form.file_url || undefined,
        local_media_path: form.local_media_path || undefined,
        duration_seconds: Number(form.duration_seconds) || 0,
        sort_order: sortOrder,
        available_at: form.available_at || null,
      })
    },
    onSuccess: (_, { sectionId }) => {
      setLectureForms((prev) => ({
        ...prev,
        [sectionId]: {
          title: '',
          video_url: '',
          file_url: '',
          local_media_path: '',
          duration_seconds: '0',
          content_type: 'video',
          available_at: '',
        },
      }))
      invalidate()
    },
  })

  const deleteLectureMutation = useMutation({
    mutationFn: ({ sectionId, lectureId }: { sectionId: number; lectureId: number }) =>
      api.deleteLecture(token!, courseId, sectionId, lectureId),
    onSuccess: invalidate,
  })

  const bulkYouTubeMutation = useMutation({
    mutationFn: ({ sectionId, links }: { sectionId: number; links: string }) =>
      api.bulkCreateYouTubeLectures(token!, courseId, sectionId, links),
    onSuccess: (_, { sectionId }) => {
      setBulkLinks((prev) => ({ ...prev, [sectionId]: '' }))
      invalidate()
    },
  })

  const dripMutation = useMutation({
    mutationFn: ({
      lectureId,
      availableAt,
    }: {
      sectionId: number
      lectureId: number
      availableAt: string | null
    }) => api.setLectureDripSchedule(token!, lectureId, availableAt),
    onSuccess: invalidate,
  })

  if (isLoading) return <LoadingSpinner />
  if (!course) return <p className="p-8 text-center">Course not found</p>

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <Link to="/instructor/courses" className="text-sm text-primary hover:underline">
          Back to courses
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Curriculum builder</h1>
        <p className="text-muted">{course.title}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          addSectionMutation.mutate()
        }}
        className="mb-8 flex gap-2"
      >
        <input
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="New section title"
          required
          className="flex-1 rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={addSectionMutation.isPending}
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      </form>

      <div className="space-y-6">
        {curriculum.map((section) => {
          const form = lectureForms[section.id] ?? {
            title: '',
            video_url: '',
            file_url: '',
            local_media_path: '',
            duration_seconds: '0',
            content_type: 'video',
            available_at: '',
          }
          return (
            <div key={section.id} className="rounded border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-3">
                <h3 className="font-bold">{section.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this section and all lectures?')) {
                      deleteSectionMutation.mutate(section.id)
                    }
                  }}
                  className="rounded p-1 text-muted hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="divide-y divide-border">
                {section.lectures?.map((lecture) => (
                  <div key={lecture.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      {lecture.youtube_thumbnail_url ? (
                        <img
                          src={lecture.youtube_thumbnail_url}
                          alt=""
                          className="h-10 w-[4.5rem] shrink-0 rounded object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="flex-1">{lecture.title}</span>
                      {lecture.video_availability && (
                        <span
                          className={`text-xs font-semibold ${
                            lecture.video_availability === 'ok'
                              ? 'text-green-600'
                              : lecture.video_availability === 'problem'
                                ? 'text-red-600'
                                : 'text-muted'
                          }`}
                        >
                          {lecture.video_availability === 'ok'
                            ? 'OK'
                            : lecture.video_availability === 'problem'
                              ? 'Bermasalah'
                              : 'Belum diverifikasi'}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        {lecture.content_type === 'quiz' && (
                          <Link
                            to={`/instructor/courses/${courseId}/lectures/${lecture.id}/quiz`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                            {t('instructor.manageQuiz')}
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteLectureMutation.mutate({ sectionId: section.id, lectureId: lecture.id })}
                          className="text-muted hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="datetime-local"
                        defaultValue={lecture.available_at?.slice(0, 16) ?? ''}
                        onChange={(e) =>
                          dripMutation.mutate({
                            sectionId: section.id,
                            lectureId: lecture.id,
                            availableAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                          })
                        }
                        className="rounded border border-border px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <span className="text-xs text-muted">{t('instructor.dripSchedule')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <p className="mb-2 text-sm font-semibold">Add lecture</p>
                <div className="mb-2 grid gap-2 sm:grid-cols-2">
                  <input
                    placeholder="Lecture title"
                    value={form.title}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, title: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <select
                    value={form.content_type}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, content_type: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                  <input
                    placeholder="Link YouTube (watch, youtu.be, shorts, embed…)"
                    value={form.video_url}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, video_url: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
                  />
                  <p className="text-xs text-muted sm:col-span-2">
                    Hanya ID YouTube yang disimpan. Durasi diisi otomatis dari pemutar saat preview/disimpan, atau saat pertama kali diputar.
                  </p>
                  <textarea
                    placeholder="Tempel banyak link YouTube (satu per baris) untuk membuat banyak lecture sekaligus"
                    value={bulkLinks[section.id] ?? ''}
                    onChange={(e) =>
                      setBulkLinks((prev) => ({ ...prev, [section.id]: e.target.value }))
                    }
                    rows={4}
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
                  />
                  <button
                    type="button"
                    disabled={!bulkLinks[section.id]?.trim() || bulkYouTubeMutation.isPending}
                    onClick={() =>
                      bulkYouTubeMutation.mutate({
                        sectionId: section.id,
                        links: bulkLinks[section.id] ?? '',
                      })
                    }
                    className="rounded border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50 sm:col-span-2"
                  >
                    Buat lecture dari link (bulk)
                  </button>
                  <input
                    type="datetime-local"
                    value={form.available_at}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, available_at: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <UploadField
                    category="video"
                    accept="video/*"
                    label={t('instructor.uploadVideo')}
                    onUploaded={(file) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: {
                          ...form,
                          local_media_path: file.path,
                          video_url: file.url,
                        },
                      }))
                    }
                  />
                  <UploadField
                    category="document"
                    accept=".pdf,.doc,.docx"
                    label={t('instructor.uploadDocument')}
                    onUploaded={(file) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, file_url: file.url },
                      }))
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addLectureMutation.mutate({
                      sectionId: section.id,
                      sortOrder: section.lectures?.length ?? 0,
                    })
                  }
                  disabled={!form.title || addLectureMutation.isPending}
                  className="mt-2 rounded border border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
                >
                  Add lecture
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {curriculum.length === 0 && (
        <p className="text-center text-muted">Add your first section to start building the curriculum.</p>
      )}
    </div>
  )
}
