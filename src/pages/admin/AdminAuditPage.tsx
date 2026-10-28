import { useQuery } from '@tanstack/react-query'
import { Download, ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { EMPTY_DISPLAY } from '@/lib/empty-display'
import { useAuthStore } from '@/stores/auth'

export function AdminAuditPage() {
  const { token } = useAuthStore()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => api.listAuditLogs(token!, { limit: 100 }),
    enabled: !!token,
  })

  async function exportOrders() {
    if (!token) return
    const blob = await api.downloadOrdersCsv(token)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skillopa-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-sm text-muted hover:text-foreground">
            ← Admin
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <ScrollText className="h-7 w-7" />
            Audit log
          </h1>
        </div>
        <button
          type="button"
          onClick={() => void exportOrders()}
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Download className="h-4 w-4" />
          Export orders CSV
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-destructive">Gagal memuat audit log.</p>}
      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Aksi</th>
                <th className="p-3">Entitas</th>
                <th className="p-3">Actor</th>
                <th className="p-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {(data?.events ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted">
                    Belum ada event audit.
                  </td>
                </tr>
              ) : (
                data?.events.map((ev) => (
                  <tr key={ev.id} className="border-t border-border">
                    <td className="p-3 whitespace-nowrap">{new Date(ev.created_at).toLocaleString()}</td>
                    <td className="p-3 font-mono text-xs">{ev.action}</td>
                    <td className="p-3">
                      {ev.entity_type}
                      {ev.entity_id ? `#${ev.entity_id}` : ''}
                    </td>
                    <td className="p-3">{ev.actor_user_id ?? EMPTY_DISPLAY}</td>
                    <td className="p-3 text-muted">{ev.ip ?? EMPTY_DISPLAY}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
