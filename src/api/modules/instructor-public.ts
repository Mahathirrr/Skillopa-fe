import { request } from '@/api/client'
import type { Course, InstructorProfile } from '@/api/types'

export const instructorPublicApi = {
  getInstructorBySlug(slug: string) {
    return request<{ instructor: InstructorProfile }>(`/instructors/slug/${encodeURIComponent(slug)}`)
  },

  listInstructorCourses(slug: string, limit = 24, offset = 0) {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString()
    return request<{ courses: Course[]; total: number }>(
      `/instructors/slug/${encodeURIComponent(slug)}/courses?${qs}`,
    )
  },

  updateInstructorPublicProfile(
    token: string,
    data: {
      name?: string
      headline?: string
      bio?: string
      avatar_url?: string
      website_url?: string
      linkedin_url?: string
      youtube_url?: string
      github_url?: string
    },
  ) {
    return request<{ user: unknown }>('/instructor/public-profile', { method: 'PUT', body: data, token })
  },

  getInstructorProfileCompleteness(token: string) {
    return request<{ percent: number; missing: string[] }>('/instructor/profile-completeness', { token })
  },
}
