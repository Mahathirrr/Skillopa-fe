import { useQuery } from '@tanstack/react-query'
import { BookOpen, DollarSign, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function InstructorDashboardPage() {
  const { token, user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.listInstructorCourses(token!),
    enabled: !!token,
  })

  const courses = data?.courses ?? []
  const published = courses.filter((c) => c.is_published).length
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollment_count ?? 0), 0)
  const revenue = courses.reduce((sum, c) => sum + (c.is_free ? 0 : c.price * (c.enrollment_count ?? 0)), 0)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor dashboard</h1>
          <p className="text-muted">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Create course
        </Link>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Total courses</span>
          </div>
          <p className="text-3xl font-bold">{courses.length}</p>
          <p className="text-xs text-muted">{published} published</p>
        </div>
        <div className="rounded border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <Users className="h-5 w-5" />
            <span className="text-sm">Total students</span>
          </div>
          <p className="text-3xl font-bold">{totalStudents.toLocaleString()}</p>
        </div>
        <div className="rounded border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-muted">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Est. revenue</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice(revenue)}</p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Recent courses</h2>
      {courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-12 text-center">
          <p className="text-muted">You have not created any courses yet.</p>
          <Link to="/instructor/courses/new" className="mt-4 inline-block text-primary hover:underline">
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.slice(0, 5).map((course) => (
                <tr key={course.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{course.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        course.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-accent text-dark'
                      }`}
                    >
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{course.enrollment_count ?? 0}</td>
                  <td className="px-4 py-3">{formatPrice(course.price, course.is_free)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/instructor/courses/${course.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
