// API response and request types

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
  preview_youtube_thumbnail_url?: string
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
  has_youtube?: boolean
  youtube_title?: string
  youtube_thumbnail_url?: string
  video_availability?: 'ok' | 'problem' | 'unverified'
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

export type AuditEvent = {
  id: number
  actor_user_id?: number | null
  action: string
  entity_type: string
  entity_id?: string
  meta?: Record<string, unknown>
  ip?: string
  created_at: string
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
  preview_youtube_thumbnail_url?: string
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
