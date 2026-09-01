import { ApiError, friendlyApiMessage } from '@/lib/api-error'

const raw = import.meta.env.VITE_API_URL as string | undefined
export const API_URL = (
  raw !== undefined && raw !== ''
    ? raw
    : import.meta.env.PROD
      ? '/api'
      : 'http://localhost:8080/api'
).replace(/\/$/, '')

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  if (!res.ok) {
    const msg =
      typeof data.error === 'string'
        ? data.error
        : typeof data.message === 'string'
          ? data.message
          : ''
    throw new ApiError(friendlyApiMessage(res.status, msg), res.status)
  }
  return data as T
}

export type UserRole = 'student' | 'instructor' | 'admin'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  avatar_url?: string
  headline?: string
  bio?: string
  created_at?: string
}

export type AuthResponse = {
  token: string
  user: User
}

export type Category = {
  id: number
  name: string
  slug: string
  parent_id?: number | null
}

export type Course = {
  id: number
  title: string
  subtitle?: string
  slug: string
  description?: string
  category_id: number
  instructor_id: number
  level: string
  language?: string
  cover_image?: string
  preview_video_url?: string
  price: number
  is_free: boolean
  is_published?: boolean
  rating_avg: number
  rating_count: number
  enrollment_count?: number
  instructor_name?: string
  category_name?: string
  created_at?: string
}

export type Lecture = {
  id: number
  section_id: number
  title: string
  content_type: string
  video_url?: string
  text_content?: string
  duration_seconds: number
  is_preview: boolean
  sort_order: number
  completed?: boolean
}

export type Section = {
  id: number
  course_id: number
  title: string
  sort_order: number
  lectures?: Lecture[]
}

export type Review = {
  id: number
  user_id: number
  course_id: number
  rating: number
  comment: string
  created_at?: string
  user_name?: string
}

export type Enrollment = {
  id: number
  user_id: number
  course_id: number
  progress_percent: number
  completed_at?: string | null
  enrolled_at?: string
  course?: Course
}

export type Certificate = {
  id: number
  user_id: number
  course_id: number
  certificate_code: string
  issued_at: string
  course_title?: string
  user_name?: string
}

export type Payment = {
  id: number
  order_id: string
  user_id: number
  course_id: number
  amount: number
  currency: string
  status: string
  created_at?: string
  paid_at?: string | null
}

export type CartItem = Course
export type WishlistItem = Course

export type CourseDetailResponse = {
  course: Course
  curriculum: Section[]
}

export type CreateCourseInput = {
  title: string
  subtitle?: string
  description?: string
  category_id: number
  level: string
  language?: string
  cover_image?: string
  preview_video_url?: string
  price?: number
  is_free?: boolean
}

export type UpdateCourseInput = Partial<{
  title: string
  subtitle: string
  description: string
  category_id: number
  level: string
  language: string
  cover_image: string
  preview_video_url: string
  price: number
  is_free: boolean
  is_published: boolean
}>

export type CreateSectionInput = {
  title: string
  sort_order?: number
}

export type CreateLectureInput = {
  title: string
  content_type: string
  video_url?: string
  text_content?: string
  duration_seconds?: number
  is_preview?: boolean
  sort_order?: number
}

export const api = {
  register(name: string, email: string, password: string, role?: UserRole) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    })
  },

  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  me(token: string) {
    return request<{ user: User }>('/auth/me', { token })
  },

  getProfile(token: string) {
    return request<{ user: User }>('/users/me', { token })
  },

  updateProfile(
    token: string,
    data: { name: string; avatar_url?: string; headline?: string; bio?: string },
  ) {
    return request<{ user: User }>('/users/me', { method: 'PUT', body: data, token })
  },

  listCourses(params?: { q?: string; category_id?: number; level?: string; limit?: number; offset?: number }) {
    const search = new URLSearchParams()
    if (params?.q) search.set('q', params.q)
    if (params?.category_id) search.set('category_id', String(params.category_id))
    if (params?.level) search.set('level', params.level)
    if (params?.limit) search.set('limit', String(params.limit))
    if (params?.offset) search.set('offset', String(params.offset))
    const qs = search.toString()
    return request<{ courses: Course[] }>(`/courses${qs ? `?${qs}` : ''}`)
  },

  searchCourses(q: string, limit = 20, offset = 0) {
    const search = new URLSearchParams({ q, limit: String(limit), offset: String(offset) })
    return request<{ courses: Course[] }>(`/courses/search?${search}`)
  },

  listCategories() {
    return request<{ categories: Category[] }>('/courses/categories')
  },

  async getCourseBySlug(slug: string): Promise<CourseDetailResponse> {
    const numericId = Number(slug)
    if (!Number.isNaN(numericId) && numericId > 0) {
      return request<CourseDetailResponse>(`/courses/${numericId}`)
    }
    const { courses } = await request<{ courses: Course[] }>('/courses?limit=200')
    const match = courses.find((c) => c.slug === slug)
    if (!match) throw new ApiError('Course not found', 404)
    return request<CourseDetailResponse>(`/courses/${match.id}`)
  },

  getCourse(id: number) {
    return request<CourseDetailResponse>(`/courses/${id}`)
  },

  listCourseReviews(courseId: number) {
    return request<{ reviews: Review[] }>(`/courses/${courseId}/reviews`)
  },

  listInstructorCourses(token: string) {
    return request<{ courses: Course[] }>('/courses/instructor/me', { token })
  },

  createCourse(token: string, data: CreateCourseInput) {
    return request<{ course: Course }>('/courses', { method: 'POST', body: data, token })
  },

  updateCourse(token: string, id: number, data: UpdateCourseInput) {
    return request<{ course: Course }>(`/courses/${id}`, { method: 'PUT', body: data, token })
  },

  deleteCourse(token: string, id: number) {
    return request<void>(`/courses/${id}`, { method: 'DELETE', token })
  },

  createSection(token: string, courseId: number, data: CreateSectionInput) {
    return request<{ section: Section }>(`/courses/${courseId}/sections`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateSection(token: string, courseId: number, sectionId: number, data: CreateSectionInput) {
    return request<{ section: Section }>(`/courses/${courseId}/sections/${sectionId}`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  deleteSection(token: string, courseId: number, sectionId: number) {
    return request<void>(`/courses/${courseId}/sections/${sectionId}`, { method: 'DELETE', token })
  },

  createLecture(token: string, courseId: number, sectionId: number, data: CreateLectureInput) {
    return request<{ lecture: Lecture }>(`/courses/${courseId}/sections/${sectionId}/lectures`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateLecture(
    token: string,
    courseId: number,
    sectionId: number,
    lectureId: number,
    data: CreateLectureInput,
  ) {
    return request<{ lecture: Lecture }>(
      `/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
      { method: 'PUT', body: data, token },
    )
  },

  deleteLecture(token: string, courseId: number, sectionId: number, lectureId: number) {
    return request<void>(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`, {
      method: 'DELETE',
      token,
    })
  },

  listEnrollments(token: string) {
    return request<{ enrollments: Enrollment[] }>('/enrollments', { token })
  },

  enrollFree(token: string, courseId: number) {
    return request<{ enrollment: Enrollment }>(`/enrollments/${courseId}`, { method: 'POST', token })
  },

  getProgress(token: string, courseId: number) {
    return request<{ enrollment: Enrollment }>(`/enrollments/${courseId}/progress`, { token })
  },

  updateProgress(token: string, courseId: number, lectureId: number) {
    return request<{ enrollment: Enrollment }>(`/enrollments/${courseId}/progress`, {
      method: 'PUT',
      body: { lecture_id: lectureId },
      token,
    })
  },

  listCart(token: string) {
    return request<{ cart: CartItem[] }>('/cart', { token })
  },

  addToCart(token: string, courseId: number) {
    return request<{ message: string }>('/cart', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  removeFromCart(token: string, courseId: number) {
    return request<void>(`/cart/${courseId}`, { method: 'DELETE', token })
  },

  listWishlist(token: string) {
    return request<{ wishlist: WishlistItem[] }>('/wishlist', { token })
  },

  addToWishlist(token: string, courseId: number) {
    return request<{ message: string }>('/wishlist', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  removeFromWishlist(token: string, courseId: number) {
    return request<void>(`/wishlist/${courseId}`, { method: 'DELETE', token })
  },

  checkout(token: string, courseId: number) {
    return request<{ payment: Payment }>('/payments/checkout', {
      method: 'POST',
      body: { course_id: courseId },
      token,
    })
  },

  confirmPayment(token: string, orderId: string) {
    return request<{ enrollment: Enrollment; message: string }>(`/payments/${orderId}/confirm`, {
      method: 'POST',
      token,
    })
  },

  createReview(token: string, courseId: number, rating: number, comment: string) {
    return request<{ review: Review }>('/reviews', {
      method: 'POST',
      body: { course_id: courseId, rating, comment },
      token,
    })
  },

  listCertificates(token: string) {
    return request<{ certificates: Certificate[] }>('/certificates', { token })
  },

  certificateDownloadUrl(code: string, token: string) {
    return `${API_URL}/certificates/${code}/download?token=${encodeURIComponent(token)}`
  },

  async downloadCertificate(code: string, token: string) {
    const res = await fetch(`${API_URL}/certificates/${code}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = typeof data.error === 'string' ? data.error : 'Download failed'
      throw new ApiError(msg, res.status)
    }
    return res.blob()
  },
}
