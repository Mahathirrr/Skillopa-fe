import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function InstructorCoursesPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.listInstructorCourses(token!),
    enabled: !!token,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteCourse(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instructor-courses'] }),
  })

  const courses = data?.courses ?? []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My courses</h1>
        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          New course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <p className="text-muted">No courses yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-muted">
                  {course.is_published ? 'Published' : 'Draft'} · {formatPrice(course.price, course.is_free)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/instructor/courses/${course.id}/edit`}
                  className="rounded border border-border px-3 py-1.5 text-sm font-semibold hover:bg-bg"
                >
                  Edit
                </Link>
                <Link
                  to={`/instructor/courses/${course.id}/curriculum`}
                  className="rounded border border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  Curriculum
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this course?')) deleteMutation.mutate(course.id)
                  }}
                  className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete course"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
