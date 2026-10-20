import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function InstructorStudentsPage() {
  const { token } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const courseId = Number(searchParams.get('courseId') ?? 0)

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.listInstructorCourses(token!),
    enabled: !!token,
  })

  const courses = coursesData?.courses ?? []
  const selectedCourseId = courseId || courses[0]?.id

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['course-students', selectedCourseId],
    queryFn: () => api.listCourseStudents(token!, selectedCourseId!),
    enabled: !!token && !!selectedCourseId,
  })

  const students = studentsData?.students ?? []
  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  if (coursesLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted">View enrolled students per course</p>
        </div>
        <Link to="/instructor/dashboard" className="text-sm text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-muted">Create a course first to see students.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="course-select" className="mb-2 block text-sm font-semibold">
              Select course
            </label>
            <select
              id="course-select"
              value={selectedCourseId ?? ''}
              onChange={(e) => setSearchParams({ courseId: e.target.value })}
              className="w-full max-w-md rounded border border-border px-3 py-2 outline-none focus:border-primary"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {studentsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="rounded border border-border bg-surface">
              <div className="border-b border-border px-4 py-3">
                <p className="font-semibold">
                  {selectedCourse?.title} — {students.length} student{students.length !== 1 ? 's' : ''}
                </p>
              </div>
              {students.length === 0 ? (
                <p className="px-4 py-8 text-center text-muted">No students enrolled yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-bg">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Progress</th>
                        <th className="px-4 py-3 font-semibold">Enrolled</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.user_id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-muted">{s.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-bg">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${s.progress_percent}%` }}
                                />
                              </div>
                              <span className="text-xs">{Math.round(s.progress_percent)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3">
                            {s.completed_at ? (
                              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="rounded bg-bg px-2 py-0.5 text-xs text-muted">In progress</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
