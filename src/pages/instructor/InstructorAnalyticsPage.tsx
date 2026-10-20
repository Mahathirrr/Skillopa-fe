import { useQuery } from '@tanstack/react-query'
import { BarChart3, BookOpen, DollarSign, Star, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded border border-border bg-surface p-5">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  )
}

export function InstructorAnalyticsPage() {
  const { token } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-analytics'],
    queryFn: () => api.getInstructorAnalytics(token!),
    enabled: !!token,
  })

  const analytics = data?.analytics

  if (isLoading) return <LoadingSpinner />

  if (!analytics) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <p className="text-muted">Unable to load analytics.</p>
      </div>
    )
  }

  const maxEnrollment = Math.max(...analytics.monthly_enrollments.map((m) => m.count), 1)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted">Track your course performance</p>
        </div>
        <Link
          to="/instructor/dashboard"
          className="text-sm text-primary hover:underline"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={BookOpen} label="Courses" value={analytics.total_courses} sub={`${analytics.published_courses} published`} />
        <StatCard icon={Users} label="Students" value={analytics.total_students.toLocaleString()} />
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(analytics.total_revenue)} />
        <StatCard icon={Star} label="Avg rating" value={analytics.average_rating.toFixed(1)} sub={`${analytics.total_reviews} reviews`} />
        <StatCard icon={TrendingUp} label="Completion" value={`${Math.round(analytics.completion_rate)}%`} />
        <StatCard icon={BarChart3} label="Reviews" value={analytics.total_reviews} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded border border-border bg-surface p-6">
          <h2 className="mb-6 text-xl font-bold">Monthly enrollments</h2>
          {analytics.monthly_enrollments.length === 0 ? (
            <p className="text-muted">No enrollment data yet.</p>
          ) : (
            <div className="flex items-end gap-2" style={{ height: 200 }}>
              {analytics.monthly_enrollments.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold">{m.count}</span>
                  <div
                    className="w-full rounded-t bg-primary transition-all"
                    style={{ height: `${(m.count / maxEnrollment) * 160}px`, minHeight: m.count > 0 ? 4 : 0 }}
                  />
                  <span className="text-xs text-muted">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded border border-border bg-surface p-6">
          <h2 className="mb-6 text-xl font-bold">Top courses</h2>
          {analytics.top_courses.length === 0 ? (
            <p className="text-muted">No course data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted">
                  <tr>
                    <th className="pb-3 font-semibold">Course</th>
                    <th className="pb-3 font-semibold">Students</th>
                    <th className="pb-3 font-semibold">Revenue</th>
                    <th className="pb-3 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.top_courses.map((c) => (
                    <tr key={c.course_id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{c.title}</td>
                      <td className="py-3">{c.enrollment_count}</td>
                      <td className="py-3">{formatPrice(c.revenue)}</td>
                      <td className="py-3">{c.rating_avg.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
