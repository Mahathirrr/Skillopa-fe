import { request } from '@/api/client'
import { buildCourseQuery } from '@/api/query'
import type {
  Category,
  Course,
  CourseDetailResponse,
  CourseListParams,
  CourseTranslation,
  PublicStats,
  Review,
  ReviewListResponse,
} from '@/api/types'

export const catalogApi = {
  listCourses(params?: CourseListParams) {
    const qs = buildCourseQuery(params)
    return request<{ courses: Course[] }>(`/courses${qs}`)
  },

  listCoursesFiltered(params?: CourseListParams) {
    const qs = buildCourseQuery(params)
    return request<{ courses: Course[] }>(`/courses${qs}`)
  },

  searchCourses(q: string, limit = 20, offset = 0) {
    const search = new URLSearchParams({ q, limit: String(limit), offset: String(offset) })
    return request<{ courses: Course[] }>(`/courses/search?${search}`)
  },

  listCategories() {
    return request<{ categories: Category[] }>('/courses/categories')
  },

  getPublicStats() {
    return request<{ stats: PublicStats }>('/stats')
  },

  async getCourseBySlug(slug: string, token?: string | null): Promise<CourseDetailResponse> {
    return request<CourseDetailResponse>(`/courses/${encodeURIComponent(slug)}`, { token })
  },

  getCourse(id: number, token?: string | null) {
    return request<CourseDetailResponse>(`/courses/${id}`, { token })
  },

  listCourseReviews(
    courseId: number,
    opts?: { sort?: string; rating?: number; cursor?: string; limit?: number; token?: string | null },
  ) {
    const qs = new URLSearchParams()
    if (opts?.sort) qs.set('sort', opts.sort)
    if (opts?.rating) qs.set('rating', String(opts.rating))
    if (opts?.cursor) qs.set('cursor', opts.cursor)
    if (opts?.limit) qs.set('limit', String(opts.limit))
    const q = qs.toString()
    return request<ReviewListResponse>(`/courses/${courseId}/reviews${q ? `?${q}` : ''}`, { token: opts?.token })
  },

  reportReview(token: string, reviewId: number, reason: string) {
    return request<{ message: string }>(`/reviews/${reviewId}/report`, {
      method: 'POST',
      body: { reason },
      token,
    })
  },

  voteReviewHelpful(token: string, reviewId: number) {
    return request<{ review: Review }>(`/reviews/${reviewId}/helpful`, { method: 'POST', token })
  },

  createReview(token: string, courseId: number, rating: number, comment: string) {
    return request<{ review: Review }>('/reviews', {
      method: 'POST',
      body: { course_id: courseId, rating, comment },
      token,
    })
  },

  updateReview(token: string, reviewId: number, rating: number, comment: string) {
    return request<{ review: Review }>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: { rating, comment },
      token,
    })
  },

  deleteReview(token: string, reviewId: number) {
    return request<void>(`/reviews/${reviewId}`, { method: 'DELETE', token })
  },

  listCourseTranslations(courseId: number) {
    return request<{ translations: CourseTranslation[] }>(`/courses/${courseId}/translations`)
  },

  upsertCourseTranslation(
    token: string,
    courseId: number,
    locale: string,
    data: { title: string; subtitle?: string; description?: string },
  ) {
    return request<{ translation: CourseTranslation }>(`/courses/${courseId}/translations/${locale}`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  deleteCourseTranslation(token: string, courseId: number, locale: string) {
    return request<void>(`/courses/${courseId}/translations/${locale}`, {
      method: 'DELETE',
      token,
    })
  },
}
