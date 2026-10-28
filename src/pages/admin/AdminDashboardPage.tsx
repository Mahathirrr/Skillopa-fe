import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Check, DollarSign, GraduationCap, Shield, Users, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Refund, User } from '@/lib/api'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div className="rounded border border-border bg-surface p-5">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export function AdminDashboardPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [userSearch, setUserSearch] = useState('')
  const [msg, setMsg] = useState('')

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.getAdminStats(token!),
    enabled: !!token,
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', userSearch],
    queryFn: () => api.listAdminUsers(token!, { q: userSearch || undefined, limit: 50 }),
    enabled: !!token,
  })

  const { data: refundsData, isLoading: refundsLoading } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: () => api.listAdminRefunds(token!),
    enabled: !!token,
  })

  const processRefundMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'approved' | 'rejected' }) =>
      api.processRefund(token!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-refunds'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Action failed'),
  })

  const promoteMutation = useMutation({
    mutationFn: (userId: number) => api.promoteToInstructor(token!, userId),
    onSuccess: () => {
      setMsg('User promoted to instructor')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: (e) => setMsg(e instanceof ApiError ? e.message : 'Promotion failed'),
  })

  const stats = statsData?.stats
  const users = usersData?.users ?? []
  const refunds = refundsData?.refunds ?? []
  const pendingRefunds = refunds.filter((r) => r.status === 'pending')

  if (statsLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Admin panel</h1>
          <p className="text-muted">Platform overview and management</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
          >
            <Shield className="h-4 w-4" />
            Course moderation
          </Link>
          <Link
            to="/admin/audit"
            className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium hover:bg-muted/30"
          >
            Audit & export
          </Link>
        </div>
      </div>

      {msg && <p className="mb-4 text-sm text-primary">{msg}</p>}

      {stats && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Users} label="Total users" value={stats.total_users.toLocaleString()} />
          <StatCard icon={GraduationCap} label="Instructors" value={stats.total_instructors} />
          <StatCard icon={BookOpen} label="Courses" value={stats.total_courses} />
          <StatCard icon={Users} label="Enrollments" value={stats.total_enrollments.toLocaleString()} />
          <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.total_revenue)} />
          <StatCard icon={DollarSign} label="Pending refunds" value={stats.pending_refunds} />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold">Users</h2>
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search users..."
            className="mb-4 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
          />
          {usersLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto rounded border border-border bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-bg">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: User) => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      <td className="px-4 py-3">
                        {u.role === 'student' && (
                          <button
                            type="button"
                            onClick={() => promoteMutation.mutate(u.id)}
                            disabled={promoteMutation.isPending}
                            className="text-xs text-primary hover:underline disabled:opacity-60"
                          >
                            Promote to instructor
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Refund requests</h2>
          {refundsLoading ? (
            <LoadingSpinner />
          ) : pendingRefunds.length === 0 ? (
            <p className="text-muted">No pending refund requests.</p>
          ) : (
            <div className="space-y-4">
              {pendingRefunds.map((r: Refund) => (
                <div key={r.id} className="rounded border border-border bg-surface p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">Order #{r.order_number ?? r.order_id}</span>
                    <span className="font-bold">{formatPrice(r.amount)}</span>
                  </div>
                  <p className="mb-3 text-sm text-muted">{r.reason}</p>
                  <p className="mb-3 text-xs text-muted">
                    {r.user_name} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => processRefundMutation.mutate({ id: r.id, status: 'approved' })}
                      disabled={processRefundMutation.isPending}
                      className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => processRefundMutation.mutate({ id: r.id, status: 'rejected' })}
                      disabled={processRefundMutation.isPending}
                      className="flex items-center gap-1 rounded border border-border px-3 py-1.5 text-xs font-bold hover:bg-bg disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
