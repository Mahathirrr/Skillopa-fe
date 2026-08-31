import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { learnUrl } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function MyLearningPage() {
  const { token } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.listEnrollments(token!),
    enabled: !!token,
  })

  const enrollments = data?.enrollments ?? []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-2 text-3xl font-bold">My learning</h1>
      <p className="mb-8 text-muted">Pick up where you left off</p>

      {enrollments.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">No enrolled courses yet</p>
          <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
            Start learning
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course
            if (!course) return null
            return (
              <Link
                key={enrollment.id}
                to={learnUrl(course.slug)}
                className="group overflow-hidden rounded border border-border bg-surface shadow-sm transition hover:shadow-md"
              >
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="aspect-video w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-bg text-sm text-muted">
                    {course.title}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="mb-2 font-bold group-hover:text-primary">{course.title}</h3>
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>Progress</span>
                    <span>{Math.round(enrollment.progress_percent)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${enrollment.progress_percent}%` }}
                    />
                  </div>
                  {enrollment.completed_at && (
                    <span className="mt-2 inline-block rounded bg-accent px-2 py-0.5 text-xs font-bold text-dark">
                      Completed
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
