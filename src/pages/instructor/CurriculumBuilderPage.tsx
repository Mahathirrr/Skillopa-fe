import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function CurriculumBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const [sectionTitle, setSectionTitle] = useState('')
  const [lectureForms, setLectureForms] = useState<Record<number, {
    title: string
    video_url: string
    duration_seconds: string
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
      const form = lectureForms[sectionId] ?? { title: '', video_url: '', duration_seconds: '0' }
      return api.createLecture(token!, courseId, sectionId, {
        title: form.title,
        content_type: 'video',
        video_url: form.video_url,
        duration_seconds: Number(form.duration_seconds) || 0,
        sort_order: sortOrder,
      })
    },
    onSuccess: (_, { sectionId }) => {
      setLectureForms((prev) => ({ ...prev, [sectionId]: { title: '', video_url: '', duration_seconds: '0' } }))
      invalidate()
    },
  })

  const deleteLectureMutation = useMutation({
    mutationFn: ({ sectionId, lectureId }: { sectionId: number; lectureId: number }) =>
      api.deleteLecture(token!, courseId, sectionId, lectureId),
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
          const form = lectureForms[section.id] ?? { title: '', video_url: '', duration_seconds: '0' }
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
                  <div key={lecture.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span>{lecture.title}</span>
                    <button
                      type="button"
                      onClick={() => deleteLectureMutation.mutate({ sectionId: section.id, lectureId: lecture.id })}
                      className="text-muted hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <p className="mb-2 text-sm font-semibold">Add lecture</p>
                <div className="grid gap-2 sm:grid-cols-3">
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
                  <input
                    placeholder="Video URL"
                    value={form.video_url}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, video_url: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Duration (seconds)"
                    type="number"
                    value={form.duration_seconds}
                    onChange={(e) =>
                      setLectureForms((prev) => ({
                        ...prev,
                        [section.id]: { ...form, duration_seconds: e.target.value },
                      }))
                    }
                    className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
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
