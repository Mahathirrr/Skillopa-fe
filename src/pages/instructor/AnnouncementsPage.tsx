import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Megaphone, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function AnnouncementsPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [msg, setMsg] = useState('')

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.listInstructorCourses(token!),
    enabled: !!token,
  })

  const courses = coursesData?.courses ?? []
  const courseId = selectedCourseId ?? courses[0]?.id ?? null

  const { data: announcementsData, isLoading: announcementsLoading } = useQuery({
    queryKey: ['announcements', courseId],
    queryFn: () => api.listAnnouncements(token!, courseId!),
    enabled: !!token && !!courseId,
  })

  const createMutation = useMutation({
    mutationFn: () => api.createAnnouncement(token!, courseId!, title, body),
    onSuccess: () => {
      setTitle('')
      setBody('')
      setShowForm(false)
      setMsg('Announcement posted')
      queryClient.invalidateQueries({ queryKey: ['announcements', courseId] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Failed to post'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteAnnouncement(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', courseId] })
    },
  })

  const announcements = announcementsData?.announcements ?? []

  if (coursesLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted">Send updates to your students</p>
        </div>
        <Link to="/instructor/dashboard" className="text-sm text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Megaphone className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-muted">Create a course first.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <label htmlFor="ann-course" className="mb-2 block text-sm font-semibold">Course</label>
              <select
                id="ann-course"
                value={courseId ?? ''}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              New announcement
            </button>
          </div>

          {msg && <p className="mb-4 text-sm text-primary">{msg}</p>}

          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate()
              }}
              className="mb-6 rounded border border-border bg-surface p-4"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="mb-3 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Message to students..."
                rows={4}
                required
                className="mb-3 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded border border-border px-4 py-2 text-sm hover:bg-bg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {announcementsLoading ? (
            <LoadingSpinner />
          ) : announcements.length === 0 ? (
            <p className="text-muted">No announcements for this course.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.id} className="rounded border border-border bg-surface p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-bold">{a.title}</h3>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(a.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded p-1 text-muted hover:bg-bg hover:text-red-600"
                      aria-label="Delete announcement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-2 whitespace-pre-line text-sm text-muted">{a.body}</p>
                  <p className="text-xs text-muted">
                    {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
