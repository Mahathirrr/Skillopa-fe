import { request } from '@/api/client'
import type {
  AdminStats,
  Course,
  Refund,
  User,
} from '@/api/types'

export const adminApi = {
  getAdminStats(token: string) {
    return request<{ stats: AdminStats }>('/admin/stats', { token })
  },

  listAdminUsers(token: string, params?: { q?: string; role?: string; limit?: number; offset?: number }) {
    const search = new URLSearchParams()
    if (params?.q) search.set('q', params.q)
    if (params?.role) search.set('role', params.role)
    if (params?.limit) search.set('limit', String(params.limit))
    if (params?.offset) search.set('offset', String(params.offset))
    const qs = search.toString()
    return request<{ users: User[] }>(`/admin/users${qs ? `?${qs}` : ''}`, { token })
  },

  listAdminRefunds(token: string) {
    return request<{ refunds: Refund[] }>('/admin/refunds', { token })
  },

  processRefund(token: string, refundId: number, status: 'approved' | 'rejected') {
    return request<{ refund: Refund }>(`/admin/refunds/${refundId}`, {
      method: 'PUT',
      body: { status },
      token,
    })
  },

  listPendingModeration(token: string) {
    return request<{ courses: Course[] }>('/admin/moderation/pending', { token })
  },

  approveCourseModeration(token: string, courseId: number) {
    return request<{ course: Course }>(`/admin/moderation/${courseId}/approve`, {
      method: 'POST',
      token,
    })
  },

  rejectCourseModeration(token: string, courseId: number, reason: string) {
    return request<{ course: Course }>(`/admin/moderation/${courseId}/reject`, {
      method: 'POST',
      body: { reason },
      token,
    })
  },
}
