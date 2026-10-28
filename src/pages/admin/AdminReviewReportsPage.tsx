import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Flag } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function AdminReviewReportsPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-review-reports'],
    queryFn: () => api.listReviewReports(token!),
    enabled: !!token,
  })

  const hideMutation = useMutation({
    mutationFn: (reviewId: number) => api.adminHideReview(token!, reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-review-reports'] }),
  })

  const restoreMutation = useMutation({
    mutationFn: (reviewId: number) => api.adminRestoreReview(token!, reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-review-reports'] }),
  })

  const reports = data?.reports ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin" className="text-sm text-muted hover:text-foreground">
        ← Admin
      </Link>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
        <Flag className="h-7 w-7" />
        Laporan ulasan
      </h1>
      <p className="mt-1 text-sm text-muted">Data langsung dari antrean laporan di database.</p>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="mt-4 text-destructive">Gagal memuat laporan.</p>}
      {!isLoading && !isError && reports.length === 0 && (
        <p className="mt-6 text-muted">Tidak ada laporan pending.</p>
      )}
      {!isLoading && !isError && reports.length > 0 && (
        <ul className="mt-6 space-y-4">
          {reports.map((r) => (
            <li key={r.id} className="rounded border border-border bg-surface p-4 text-sm">
              <p className="font-semibold">{r.course_title}</p>
              <p className="mt-1 text-muted">Review #{r.review_id} · {r.reporter_name}</p>
              <p className="mt-2 whitespace-pre-line">{r.reason}</p>
              {r.review_comment && (
                <p className="mt-2 rounded bg-bg p-2 text-muted">"{r.review_comment}"</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded bg-destructive px-3 py-1 text-xs font-semibold text-white"
                  onClick={() => hideMutation.mutate(r.review_id)}
                  disabled={hideMutation.isPending}
                >
                  Sembunyikan ulasan
                </button>
                <button
                  type="button"
                  className="rounded border border-border px-3 py-1 text-xs"
                  onClick={() => restoreMutation.mutate(r.review_id)}
                  disabled={restoreMutation.isPending}
                >
                  Pulihkan ulasan
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
