import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Lecture, Section } from '@/lib/api'
import { api } from '@/lib/api'
import { formatDuration } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => api.getCourseBySlug(slug!),
    enabled: !!slug,
  })

  const course = data?.course
  const curriculum = data?.curriculum ?? []

  const allLectures = useMemo(
    () => curriculum.flatMap((s) => s.lectures ?? []),
    [curriculum],
  )

  const { data: progressData } = useQuery({
    queryKey: ['progress', course?.id],
    queryFn: () => api.getProgress(token!, course!.id),
    enabled: !!token && !!course?.id,
  })

  const progress = progressData?.enrollment?.progress_percent ?? 0

  const completeMutation = useMutation({
    mutationFn: (lectureId: number) => api.updateProgress(token!, course!.id, lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', course!.id] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })

  if (isLoading) return <LoadingSpinner />
  if (error || !course) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/my-learning" className="mt-4 inline-block text-primary hover:underline">
          Back to My Learning
        </Link>
      </div>
    )
  }

  const current = activeLecture ?? allLectures[0] ?? null

  function toggleSection(id: number) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectLecture(lecture: Lecture) {
    setActiveLecture(lecture)
  }

  function handleMarkComplete() {
    if (!current || !token) return
    completeMutation.mutate(current.id)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
      <div className="flex flex-1 flex-col bg-dark">
        <div className="border-b border-dark-muted px-4 py-3 text-white">
          <Link to={`/courses/${course.slug}`} className="text-sm text-white/70 hover:text-white">
            {course.title}
          </Link>
          {current && (
            <h1 className="mt-1 text-lg font-semibold">{current.title}</h1>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center bg-black">
          {current?.video_url ? (
            <iframe
              src={current.video_url}
              title={current.title}
              className="aspect-video w-full max-w-5xl"
              allowFullScreen
            />
          ) : current?.text_content ? (
            <div className="max-w-3xl p-8 text-white">
              <p className="whitespace-pre-line">{current.text_content}</p>
            </div>
          ) : (
            <p className="text-white/60">Select a lecture to begin</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-dark-muted bg-dark-muted px-4 py-3 text-white">
          <div className="text-sm">
            Progress: <span className="font-bold text-accent">{Math.round(progress)}%</span>
          </div>
          {current && (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={completeMutation.isPending}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold hover:bg-primary-dark disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as complete
            </button>
          )}
        </div>
      </div>

      <aside className="w-full border-l border-border bg-surface lg:w-96">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-bold">Course content</h2>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
          {curriculum.map((section: Section) => {
            const open = expandedSections.has(section.id) || expandedSections.size === 0
            return (
              <div key={section.id} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold hover:bg-bg"
                >
                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {section.title}
                </button>
                {open &&
                  section.lectures?.map((lecture) => (
                    <button
                      key={lecture.id}
                      type="button"
                      onClick={() => selectLecture(lecture)}
                      className={`flex w-full items-center gap-2 border-t border-border px-4 py-2.5 pl-8 text-left text-sm hover:bg-bg ${
                        current?.id === lecture.id ? 'bg-primary/5 font-semibold text-primary' : ''
                      }`}
                    >
                      <Play className="h-3.5 w-3.5 shrink-0 text-muted" />
                      <span className="flex-1 truncate">{lecture.title}</span>
                      <span className="shrink-0 text-xs text-muted">
                        {formatDuration(lecture.duration_seconds)}
                      </span>
                    </button>
                  ))}
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
