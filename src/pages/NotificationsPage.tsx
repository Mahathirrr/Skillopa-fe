import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Notification } from '@/lib/api'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: number) => void
}) {
  const isUnread = !notification.read_at
  const content = (
    <div
      className={`rounded border border-border p-4 transition ${
        isUnread ? 'bg-primary/5 border-primary/20' : 'bg-surface'
      }`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className={`text-sm ${isUnread ? 'font-bold' : 'font-semibold'}`}>{notification.title}</h3>
        {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
      </div>
      <p className="mb-2 text-sm text-muted">{notification.body}</p>
      <p className="text-xs text-muted">
        {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
      </p>
    </div>
  )

  if (notification.link) {
    return (
      <Link
        to={notification.link}
        onClick={() => isUnread && onRead(notification.id)}
        className="block hover:opacity-90"
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => isUnread && onRead(notification.id)}
      className="block w-full text-left"
    >
      {content}
    </button>
  )
}

export function NotificationsPage() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.listNotifications(token!),
    enabled: !!token,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: number) => api.markNotificationRead(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: () => api.markAllNotificationsRead(token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  const notifications = data?.notifications ?? []
  const unreadCount = notifications.filter((n) => !n.read_at).length

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-semibold hover:bg-bg disabled:opacity-60"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Bell className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={(id) => markReadMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
