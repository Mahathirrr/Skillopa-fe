import { ApiError, friendlyApiMessage } from '@/lib/api-error'

const raw = import.meta.env.VITE_API_URL as string | undefined
export const API_URL = (
  raw !== undefined && raw !== ''
    ? raw
    : import.meta.env.PROD
      ? '/api'
      : 'http://localhost:8080/api'
).replace(/\/$/, '')

export const API_ORIGIN = API_URL.startsWith('/')
  ? typeof window !== 'undefined'
    ? window.location.origin
    : ''
  : API_URL.replace(/\/api\/?$/, '')

export const UPLOAD_BASE = (
  (import.meta.env.VITE_UPLOAD_URL_BASE as string | undefined) || '/uploads'
).replace(/\/$/, '')

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  formData?: FormData
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (!options.formData) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
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
  locale?: string
  referral_code?: string
  created_at?: string
}

export type InstructorProfile = {
  id: number
  name: string
  avatar_url?: string
  headline?: string
  bio?: string
  total_courses: number
  published_courses?: number
  total_students: number
  average_rating: number
  total_reviews: number
  courses?: Course[]
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
  moderation_status?: 'draft' | 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  total_duration_minutes?: number
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
  file_url?: string
  local_media_path?: string
  duration_seconds: number
  is_preview: boolean
  sort_order: number
  available_at?: string | null
  is_locked?: boolean
  completed?: boolean
  video_position_seconds?: number
}

export type Section = {
  id: number
  course_id: number
  title: string
  sort_order: number
  available_at?: string | null
  lectures?: Lecture[]
}

export type Review = {
  id: number
  user_id: number
  course_id: number
  rating: number
  comment: string
  helpful_count?: number
  instructor_response?: string
  responded_at?: string
  created_at?: string
  user_name?: string
  user_voted_helpful?: boolean
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

export type LectureProgress = {
  lecture_id: number
  completed: boolean
  video_position_seconds: number
}

export type ProgressResponse = {
  enrollment: Enrollment
  completed_lecture_ids?: number[]
  lecture_progress?: LectureProgress[]
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

export type CertificateVerifyResponse = {
  valid: boolean
  certificate?: Certificate
  message?: string
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

export type OrderItem = {
  id: number
  order_id: number
  course_id: number
  price: number
  title?: string
}

export type Order = {
  id: number
  order_number: string
  user_id: number
  subtotal: number
  discount: number
  total: number
  coupon_id?: number | null
  status: string
  created_at?: string
  paid_at?: string | null
  items?: OrderItem[]
}

export type Refund = {
  id: number
  order_id: number
  user_id: number
  amount: number
  reason: string
  status: string
  created_at?: string
  processed_at?: string | null
  order_number?: string
  user_name?: string
}

export type Coupon = {
  id: number
  code: string
  description?: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_purchase: number
  max_uses: number
  used_count: number
  valid_from?: string | null
  valid_until?: string | null
  is_active: boolean
}

export type CouponValidation = {
  valid: boolean
  coupon?: Coupon
  discount_amount: number
  message?: string
}

export type QuizOption = {
  id: number
  question_id: number
  option_text: string
  is_correct?: boolean
  sort_order: number
}

export type QuizQuestion = {
  id: number
  lecture_id: number
  question_text: string
  sort_order: number
  options?: QuizOption[]
}

export type QuizAttempt = {
  id: number
  user_id: number
  lecture_id: number
  score: number
  passed: boolean
  started_at?: string
  completed_at?: string | null
}

export type QuizSubmitResult = {
  attempt: QuizAttempt
  correct_count: number
  total_count: number
}

export type Assignment = {
  id: number
  lecture_id: number
  instructions: string
  max_score: number
  due_days: number
}

export type AssignmentSubmission = {
  id: number
  assignment_id: number
  user_id: number
  content: string
  file_url?: string
  score?: number | null
  feedback?: string
  status: string
  submitted_at?: string
  graded_at?: string | null
  user_name?: string
}

export type CourseQuestion = {
  id: number
  course_id: number
  lecture_id?: number | null
  user_id: number
  title: string
  body: string
  upvotes: number
  created_at?: string
  user_name?: string
  answer_count?: number
  answers?: QuestionAnswer[]
}

export type QuestionAnswer = {
  id: number
  question_id: number
  user_id: number
  body: string
  is_instructor: boolean
  upvotes: number
  created_at?: string
  user_name?: string
}

export type Announcement = {
  id: number
  course_id: number
  instructor_id: number
  title: string
  body: string
  created_at?: string
  course_title?: string
}

export type Notification = {
  id: number
  user_id: number
  type: string
  title: string
  body: string
  link?: string
  read_at?: string | null
  created_at?: string
}

export type Bookmark = {
  id: number
  user_id: number
  lecture_id: number
  timestamp_seconds: number
  note?: string
  created_at?: string
  lecture_title?: string
  course_title?: string
}

export type LectureNote = {
  id: number
  user_id: number
  lecture_id: number
  content: string
  timestamp_seconds: number
  updated_at?: string
}

export type MonthlyStat = {
  month: string
  count: number
}

export type CourseStat = {
  course_id: number
  title: string
  enrollment_count: number
  revenue: number
  rating_avg: number
}

export type InstructorAnalytics = {
  total_courses: number
  published_courses: number
  total_students: number
  total_revenue: number
  average_rating: number
  total_reviews: number
  completion_rate: number
  monthly_enrollments: MonthlyStat[]
  top_courses: CourseStat[]
}

export type AdminStats = {
  total_users: number
  total_instructors: number
  total_courses: number
  total_enrollments: number
  total_revenue: number
  pending_refunds: number
}

export type CourseStudent = {
  user_id: number
  name: string
  email: string
  progress_percent: number
  enrolled_at?: string
  completed_at?: string | null
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
  file_url?: string
  local_media_path?: string
  duration_seconds?: number
  is_preview?: boolean
  sort_order?: number
  available_at?: string | null
}

export type UploadCategory = 'video' | 'document' | 'image' | 'assignment'

export type UploadedFile = {
  id: number
  url: string
  path: string
  original_name: string
  mime_type: string
  size_bytes: number
  category: UploadCategory
}

export type CourseListParams = {
  q?: string
  category_id?: number
  level?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  min_duration?: number
  max_duration?: number
  sort?: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc'
  limit?: number
  offset?: number
}

export type SubscriptionPlan = {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  interval_months: number
  is_active: boolean
}

export type UserSubscription = {
  id: number
  user_id: number
  plan_id: number
  status: 'active' | 'cancelled' | 'expired'
  started_at?: string
  expires_at?: string
  plan?: SubscriptionPlan
}

export type CourseBundle = {
  id: number
  title: string
  slug: string
  description?: string
  price: number
  is_active: boolean
  courses?: Course[]
  course_count?: number
}

export type GiftEnrollment = {
  id: number
  course_id: number
  recipient_email: string
  gift_code: string
  message?: string
  status: 'pending' | 'redeemed' | 'expired'
  course_title?: string
  created_at?: string
}

export type AffiliateStats = {
  referral_code: string
  total_earnings: number
  pending_amount: number
  paid_amount: number
  referral_count: number
}

export type PublicStats = {
  total_courses: number
  total_enrollments: number
  total_instructors: number
  average_rating: number
  featured_reviews: { user_name: string; comment: string; rating: number; course_title?: string }[]
}

export type AffiliateCommission = {
  id: number
  referrer_id: number
  referred_user_id: number
  order_id?: number | null
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at?: string
  paid_at?: string | null
  referred_user_name?: string
}

export type CourseTranslation = {
  id: number
  course_id: number
  locale: string
  title: string
  subtitle?: string
  description?: string
}

export type QuizQuestionInput = {
  question_text: string
  sort_order?: number
  options: { option_text: string; is_correct: boolean; sort_order?: number }[]
}

export function mediaUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`
  return `${UPLOAD_BASE}/${path.replace(/^\//, '')}`
}

export function resolveLectureVideoSrc(lecture: Lecture): string {
  if (lecture.local_media_path) return mediaUrl(lecture.local_media_path)
  if (lecture.video_url?.startsWith('/uploads')) return mediaUrl(lecture.video_url)
  return lecture.video_url ?? ''
}

function buildCourseQuery(params?: CourseListParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.category_id) search.set('category_id', String(params.category_id))
  if (params.level) search.set('level', params.level)
  if (params.min_price != null) search.set('min_price', String(params.min_price))
  if (params.max_price != null) search.set('max_price', String(params.max_price))
  if (params.min_rating != null) search.set('min_rating', String(params.min_rating))
  if (params.min_duration != null) search.set('min_duration', String(params.min_duration))
  if (params.max_duration != null) search.set('max_duration', String(params.max_duration))
  if (params.sort) search.set('sort', params.sort)
  if (params.limit) search.set('limit', String(params.limit))
  if (params.offset) search.set('offset', String(params.offset))
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const api = {
  register(name: string, email: string, password: string, role?: UserRole, referralCode?: string) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: {
        name,
        email,
        password,
        role,
        referral_code: referralCode || undefined,
      },
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

  getInstructorProfile(instructorId: number) {
    return request<{ instructor: InstructorProfile }>(`/instructors/${instructorId}`)
  },

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

  listCourseReviews(courseId: number) {
    return request<{ reviews: Review[] }>(`/courses/${courseId}/reviews`)
  },

  voteReviewHelpful(token: string, reviewId: number) {
    return request<{ review: Review }>(`/reviews/${reviewId}/helpful`, { method: 'POST', token })
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
    return request<ProgressResponse>(`/enrollments/${courseId}/progress`, { token })
  },

  updateProgress(token: string, courseId: number, data: { lecture_id: number }) {
    return request<ProgressResponse>(`/enrollments/${courseId}/progress`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  saveVideoPosition(token: string, courseId: number, lectureId: number, seconds: number) {
    return request<{ message: string }>(`/enrollments/${courseId}/progress/video`, {
      method: 'PUT',
      body: { lecture_id: lectureId, seconds },
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

  listOrders(token: string) {
    return request<{ orders: Order[] }>('/orders', { token })
  },

  getOrder(token: string, orderId: number) {
    return request<{ order: Order }>(`/orders/${orderId}`, { token })
  },

  createOrderCheckout(token: string, courseIds: number[], couponCode?: string) {
    return request<{ order: Order }>('/orders/checkout', {
      method: 'POST',
      body: { course_ids: courseIds, coupon_code: couponCode || undefined },
      token,
    })
  },

  confirmOrder(token: string, orderNumber: string) {
    return request<{ order: Order; enrollments: Enrollment[]; message: string }>(
      `/orders/${orderNumber}/confirm`,
      { method: 'POST', token },
    )
  },

  validateCoupon(token: string, code: string, subtotal: number) {
    return request<CouponValidation>('/coupons/validate', {
      method: 'POST',
      body: { code, subtotal },
      token,
    })
  },

  listRefunds(token: string) {
    return request<{ refunds: Refund[] }>('/refunds', { token })
  },

  requestRefund(token: string, orderId: number, reason: string) {
    return request<{ refund: Refund }>('/refunds', {
      method: 'POST',
      body: { order_id: orderId, reason },
      token,
    })
  },

  getQuiz(token: string, lectureId: number) {
    return request<{ questions: QuizQuestion[] }>(`/lectures/${lectureId}/quiz`, { token })
  },

  submitQuiz(token: string, lectureId: number, answers: { question_id: number; option_id: number }[]) {
    return request<QuizSubmitResult>(`/lectures/${lectureId}/quiz/submit`, {
      method: 'POST',
      body: { answers },
      token,
    })
  },

  getQuizAttempts(token: string, lectureId: number) {
    return request<{ attempts: QuizAttempt[] }>(`/lectures/${lectureId}/quiz/attempts`, { token })
  },

  getAssignment(token: string, lectureId: number) {
    return request<{ assignment: Assignment; submission?: AssignmentSubmission }>(
      `/assignments/lecture/${lectureId}`,
      { token },
    )
  },

  submitAssignment(token: string, assignmentId: number, content: string, fileUrl?: string) {
    return request<{ submission: AssignmentSubmission }>(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: { content, file_url: fileUrl },
      token,
    })
  },

  listCourseQuestions(courseId: number, lectureId?: number, token?: string | null) {
    const search = new URLSearchParams()
    if (lectureId) search.set('lecture_id', String(lectureId))
    const qs = search.toString()
    return request<{ questions: CourseQuestion[] }>(
      `/qa/courses/${courseId}/questions${qs ? `?${qs}` : ''}`,
      { token },
    )
  },

  getCourseQuestion(questionId: number, token?: string | null) {
    return request<{ question: CourseQuestion }>(`/qa/questions/${questionId}`, { token })
  },

  createQuestion(
    token: string,
    courseId: number,
    data: { title: string; body: string; lecture_id?: number },
  ) {
    return request<{ question: CourseQuestion }>(`/qa/questions`, {
      method: 'POST',
      body: { course_id: courseId, ...data },
      token,
    })
  },

  createAnswer(token: string, questionId: number, body: string) {
    return request<{ answer: QuestionAnswer }>(`/qa/questions/${questionId}/answers`, {
      method: 'POST',
      body: { body },
      token,
    })
  },

  upvoteQuestion(token: string, questionId: number) {
    return request<{ question: CourseQuestion }>(`/qa/questions/${questionId}/vote`, {
      method: 'POST',
      body: { vote_type: 'up' },
      token,
    })
  },

  upvoteAnswer(token: string, answerId: number) {
    return request<{ answer: QuestionAnswer }>(`/qa/answers/${answerId}/vote`, {
      method: 'POST',
      body: { vote_type: 'up' },
      token,
    })
  },

  listAnnouncements(token: string, courseId: number) {
    return request<{ announcements: Announcement[] }>(`/announcements/courses/${courseId}`, { token })
  },

  createAnnouncement(token: string, courseId: number, title: string, body: string) {
    return request<{ announcement: Announcement }>(`/announcements`, {
      method: 'POST',
      body: { course_id: courseId, title, body },
      token,
    })
  },

  deleteAnnouncement(token: string, announcementId: number) {
    return request<void>(`/announcements/${announcementId}`, { method: 'DELETE', token })
  },

  listNotifications(token: string) {
    return request<{ notifications: Notification[] }>('/notifications', { token })
  },

  getUnreadNotificationCount(token: string) {
    return request<{ notifications: Notification[] }>('/notifications?unread=true', { token }).then(
      (res) => ({ count: res.notifications?.length ?? 0 }),
    )
  },

  markNotificationRead(token: string, notificationId: number) {
    return request<{ notification: Notification }>(`/notifications/${notificationId}/read`, {
      method: 'POST',
      token,
    })
  },

  markAllNotificationsRead(token: string) {
    return request<{ message: string }>('/notifications/read-all', { method: 'POST', token })
  },

  listBookmarks(token: string, courseId?: number) {
    const qs = courseId ? `?course_id=${courseId}` : ''
    return request<{ bookmarks: Bookmark[] }>(`/bookmarks${qs}`, { token })
  },

  createBookmark(token: string, lectureId: number, timestampSeconds: number, note?: string) {
    return request<{ bookmark: Bookmark }>('/bookmarks', {
      method: 'POST',
      body: { lecture_id: lectureId, timestamp_seconds: timestampSeconds, note },
      token,
    })
  },

  deleteBookmark(token: string, bookmarkId: number) {
    return request<void>(`/bookmarks/${bookmarkId}`, { method: 'DELETE', token })
  },

  getLectureNote(token: string, lectureId: number) {
    return request<{ note: LectureNote | null }>(`/lectures/${lectureId}/notes`, { token })
  },

  saveLectureNote(token: string, lectureId: number, content: string, timestampSeconds?: number) {
    return request<{ note: LectureNote }>(`/lectures/${lectureId}/notes`, {
      method: 'PUT',
      body: { content, timestamp_seconds: timestampSeconds ?? 0 },
      token,
    })
  },

  getInstructorAnalytics(token: string) {
    return request<{ analytics: InstructorAnalytics }>('/instructor/analytics', { token })
  },

  listCourseStudents(token: string, courseId: number) {
    return request<{ students: CourseStudent[] }>(`/courses/${courseId}/students`, { token })
  },

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

  promoteToInstructor(token: string, userId: number) {
    return request<{ user: User }>(`/users/${userId}/promote`, { method: 'POST', token })
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

  verifyCertificate(code: string) {
    return request<CertificateVerifyResponse>(`/certificates/${code}`)
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

  uploadFile(token: string, file: File, category: UploadCategory) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    return request<{ file: UploadedFile }>('/uploads', { method: 'POST', formData, token })
  },

  listSubscriptionPlans() {
    return request<{ plans: SubscriptionPlan[] }>('/subscriptions/plans')
  },

  getMySubscription(token: string) {
    return request<{ subscription: UserSubscription | null }>('/subscriptions/me', { token })
  },

  subscribeToPlan(token: string, planId: number) {
    return request<{ subscription: UserSubscription }>('/subscriptions/subscribe', {
      method: 'POST',
      body: { plan_id: planId },
      token,
    })
  },

  cancelSubscription(token: string) {
    return request<{ message: string }>('/subscriptions/cancel', { method: 'POST', token })
  },

  listBundles() {
    return request<{ bundles: CourseBundle[] }>('/bundles')
  },

  getBundle(id: number) {
    return request<{ bundle: CourseBundle }>(`/bundles/${id}`)
  },

  checkoutBundle(token: string, bundleId: number) {
    return request<{ purchase: { bundle_id: number; enrolled_course_ids: number[] } }>(
      `/bundles/${bundleId}/purchase`,
      { method: 'POST', token },
    )
  },

  createGift(
    token: string,
    data: { course_id: number; recipient_email: string; message?: string },
  ) {
    return request<{ gift: GiftEnrollment }>('/gifts', { method: 'POST', body: data, token })
  },

  redeemGift(token: string, code: string) {
    return request<{ enrollment: Enrollment; message: string }>('/gifts/redeem', {
      method: 'POST',
      body: { code },
      token,
    })
  },

  getGiftPreview(code: string) {
    return request<{ gift: GiftEnrollment }>(`/gifts/${encodeURIComponent(code)}`)
  },

  getReferralCode(token: string) {
    return request<{ referral_code: string }>('/affiliate/code', { token })
  },

  listAffiliateCommissions(token: string) {
    return request<{ commissions: AffiliateCommission[] }>('/affiliate/commissions', { token })
  },

  submitCourseForModeration(token: string, courseId: number) {
    return request<{ course: Course }>(`/courses/${courseId}/submit-review`, {
      method: 'POST',
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

  subscribePush(token: string, data: { endpoint: string; p256dh: string; auth: string }) {
    return request<{ message: string }>('/push/subscribe', { method: 'POST', body: data, token })
  },

  unsubscribePush(token: string, endpoint: string) {
    return request<{ message: string }>('/push/subscribe', {
      method: 'DELETE',
      body: { endpoint },
      token,
    })
  },

  updateInstructorProfile(
    token: string,
    data: { headline?: string; bio?: string; avatar_url?: string },
  ) {
    return request<{ instructor: InstructorProfile }>('/instructor/profile', {
      method: 'PUT',
      body: data,
      token,
    })
  },

  setSectionDripSchedule(token: string, sectionId: number, availableAt: string | null) {
    return request<void>(`/drip/sections/${sectionId}`, {
      method: 'PUT',
      body: { available_at: availableAt },
      token,
    })
  },

  setLectureDripSchedule(token: string, lectureId: number, availableAt: string | null) {
    return request<void>(`/drip/lectures/${lectureId}`, {
      method: 'PUT',
      body: { available_at: availableAt },
      token,
    })
  },

  createQuizQuestion(token: string, lectureId: number, data: QuizQuestionInput) {
    return request<{ question: QuizQuestion }>(`/lectures/${lectureId}/quiz/questions`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateQuizQuestion(token: string, lectureId: number, questionId: number, data: QuizQuestionInput) {
    return request<{ question: QuizQuestion }>(`/lectures/${lectureId}/quiz/questions/${questionId}`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  deleteQuizQuestion(token: string, lectureId: number, questionId: number) {
    return request<void>(`/lectures/${lectureId}/quiz/questions/${questionId}`, {
      method: 'DELETE',
      token,
    })
  },
}
