import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HelpCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { UploadField } from '@/components/UploadField'
import { api } from '@/lib/api'
import { partsToPayload, type SegmentPart } from '@/lib/youtube-time'
import { useAuthStore } from '@/stores/auth'

export function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [sectionTitle, setSectionTitle] = useState('')
  const [bulkLinks, setBulkLinks] = useState<Record<number, string>>({})
  const [segmentUrl, setSegmentUrl] = useState<Record<number, string>>({})
  const [segmentParts, setSegmentParts] = useState<Record<number, SegmentPart[]>>({})
  const [segmentPreview, setSegmentPreview] = useState<Record<number, boolean>>({})
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

  const segmentsMutation = useMutation({
    mutationFn: ({
      sectionId,
      youtube_url,
      parts,
      is_preview,
    }: {
      sectionId: number
      youtube_url: string
      parts: { title: string; start_seconds: number; end_seconds: number }[]
      is_preview: boolean
    }) => api.createYouTubeSegments(token!, courseId, sectionId, { youtube_url, parts, is_preview }),
    onSuccess: (_, { sectionId }) => {
      setSegmentUrl((p) => ({ ...p, [sectionId]: '' }))
      setSegmentParts((p) => ({ ...p, [sectionId]: [] }))
      invalidate()
    },
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
                    placeholder="Bulk link (satu per baris). Potong otomatis: URL 0:00-15:30 Judul bagian"
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

                  <div className="mt-4 rounded border border-dashed border-primary/40 bg-primary/5 p-3 sm:col-span-2">
                    <p className="mb-2 text-sm font-bold text-primary">Potong satu video panjang → banyak lecture</p>
                    <p className="mb-3 text-xs text-muted">
                      Satu link (mis. playlist Programmer Zaman Now), lalu tentukan part: judul + mulai/selesai (mm:ss atau h:mm:ss).
                      Semua part pakai video ID yang sama; pemutar mulai/berhenti di waktu yang kamu set.
                    </p>
                    <input
                      placeholder="Link YouTube sumber (satu video panjang)"
                      value={segmentUrl[section.id] ?? ''}
                      onChange={(e) => setSegmentUrl((p) => ({ ...p, [section.id]: e.target.value }))}
                      className="mb-2 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {(segmentParts[section.id]?.length ? segmentParts[section.id] : [{ title: '', start: '0:00', end: '' }]).map(
                      (part, idx) => (
                        <div key={idx} className="mb-2 grid gap-2 sm:grid-cols-[1fr_5rem_5rem_auto]">
                          <input
                            placeholder={`Judul part ${idx + 1}`}
                            value={part.title}
                            onChange={(e) => {
                              const base = segmentParts[section.id]?.length
                                ? [...segmentParts[section.id]!]
                                : [{ title: '', start: '0:00', end: '' }]
                              base[idx] = { ...base[idx]!, title: e.target.value }
                              setSegmentParts((p) => ({ ...p, [section.id]: base }))
                            }}
                            className="rounded border border-border px-2 py-1.5 text-sm"
                          />
                          <input
                            placeholder="Mulai"
                            value={part.start}
                            onChange={(e) => {
                              const base = [...(segmentParts[section.id] ?? [{ title: '', start: '0:00', end: '' }])]
                              base[idx] = { ...base[idx]!, start: e.target.value }
                              setSegmentParts((p) => ({ ...p, [section.id]: base }))
                            }}
                            className="rounded border border-border px-2 py-1.5 text-sm"
                          />
                          <input
                            placeholder="Selesai"
                            value={part.end}
                            onChange={(e) => {
                              const base = [...(segmentParts[section.id] ?? [{ title: '', start: '0:00', end: '' }])]
                              base[idx] = { ...base[idx]!, end: e.target.value }
                              setSegmentParts((p) => ({ ...p, [section.id]: base }))
                            }}
                            className="rounded border border-border px-2 py-1.5 text-sm"
                          />
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => {
                              const base = [...(segmentParts[section.id] ?? [])]
                              base.splice(idx, 1)
                              setSegmentParts((p) => ({ ...p, [section.id]: base }))
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      ),
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary"
                        onClick={() => {
                          const prev = segmentParts[section.id] ?? [{ title: '', start: '0:00', end: '' }]
                          const last = prev[prev.length - 1]
                          const nextStart = last?.end?.trim() ? last.end : last?.start ?? '0:00'
                          setSegmentParts((p) => ({
                            ...p,
                            [section.id]: [...prev, { title: '', start: nextStart, end: '' }],
                          }))
                        }}
                      >
                        + Tambah part
                      </button>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={segmentPreview[section.id] ?? false}
                          onChange={(e) =>
                            setSegmentPreview((p) => ({ ...p, [section.id]: e.target.checked }))
                          }
                        />
                        Tandai sebagai preview gratis
                      </label>
                      <button
                        type="button"
                        disabled={segmentsMutation.isPending || !(segmentUrl[section.id]?.trim())}
                        onClick={() => {
                          const parts = partsToPayload(
                            segmentParts[section.id]?.length
                              ? segmentParts[section.id]!
                              : [{ title: 'Part 1', start: '0:00', end: '' }],
                          ).filter((p) => p.title)
                          if (parts.length === 0) return
                          segmentsMutation.mutate({
                            sectionId: section.id,
                            youtube_url: segmentUrl[section.id]!,
                            parts,
                            is_preview: segmentPreview[section.id] ?? false,
                          })
                        }}
                        className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                      >
                        Buat {segmentParts[section.id]?.length || 1} lecture dari part
                      </button>
                    </div>
                  </div>

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
