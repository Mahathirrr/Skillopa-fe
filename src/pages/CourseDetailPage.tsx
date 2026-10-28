import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, Gift, Globe, Play, ShoppingCart, ThumbsUp, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PreviewLecturePlayer } from '@/components/PreviewLecturePlayer'
import { QuestionThread } from '@/components/QuestionThread'
import { StarRating } from '@/components/StarRating'
import { api, mediaUrl, type Lecture } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { formatDuration, formatPrice, learnUrl } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { token, isAuthenticated, user } = useAuthStore()

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null)
  const previewPlayerRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'translations'>('overview')
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', slug, token],
    queryFn: () => api.getCourseBySlug(slug!, token),
    enabled: !!slug,
  })

  const course = data?.course
  const curriculum = data?.curriculum ?? []

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', course?.id],
    queryFn: () => api.listCourseReviews(course!.id),
    enabled: !!course?.id,
  })

  const { data: instructorData } = useQuery({
    queryKey: ['instructor-profile', course?.instructor_id],
    queryFn: () => api.getInstructorProfile(course!.instructor_id),
    enabled: !!course?.instructor_id,
  })

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', course?.id],
    queryFn: () => api.listCourseQuestions(course!.id),
    enabled: !!course?.id,
  })

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.listEnrollments(token!),
    enabled: isAuthenticated && !!token,
  })

  const { data: translationsData } = useQuery({
    queryKey: ['translations', course?.id],
    queryFn: () => api.listCourseTranslations(course!.id),
    enabled: !!course?.id && activeTab === 'translations',
  })

  const reviews = reviewsData?.reviews ?? []
  const instructor = instructorData?.instructor
  const questions = questionsData?.questions ?? []
  const translations = translationsData?.translations ?? []
  const isEnrolled = enrollmentsData?.enrollments?.some((e) => e.course_id === course?.id) ?? false

  const previewLectures = curriculum.flatMap((s) =>
    (s.lectures ?? []).filter((l) => l.is_preview),
  )

  useEffect(() => {
    if (previewLectures.length > 0 && !previewLecture) {
      setPreviewLecture(previewLectures[0]!)
    }
  }, [previewLectures, previewLecture])

  function selectPreview(lecture: Lecture) {
    setPreviewLecture(lecture)
    requestAnimationFrame(() => {
      previewPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const totalLectures = curriculum.reduce((acc, s) => acc + (s.lectures?.length ?? 0), 0)
  const totalDuration = curriculum.reduce(
    (acc, s) => acc + (s.lectures?.reduce((a, l) => a + l.duration_seconds, 0) ?? 0),
    0,
  )

  const enrollMutation = useMutation({
    mutationFn: () => api.enrollFree(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Enrolled successfully')
      navigate(learnUrl(course!.slug))
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Enrollment failed'),
  })

  const cartMutation = useMutation({
    mutationFn: () => api.addToCart(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Added to cart')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Failed to add to cart'),
  })

  const wishlistMutation = useMutation({
    mutationFn: () => api.addToWishlist(token!, course!.id),
    onSuccess: () => {
      setActionMsg('Added to wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Failed to add to wishlist'),
  })

  const reviewMutation = useMutation({
    mutationFn: () => api.createReview(token!, course!.id, reviewRating, reviewComment),
    onSuccess: () => {
      setReviewComment('')
      queryClient.invalidateQueries({ queryKey: ['reviews', course!.id] })
      setActionMsg('Review submitted')
    },
    onError: (e) => setActionMsg(e instanceof ApiError ? e.message : 'Review failed'),
  })

  const helpfulMutation = useMutation({
    mutationFn: (reviewId: number) => api.voteReviewHelpful(token!, reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', course!.id] }),
  })

  const questionMutation = useMutation({
    mutationFn: ({ title, body }: { title: string; body: string }) =>
      api.createQuestion(token!, course!.id, { title, body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions', course!.id] }),
  })

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, rating, comment }: { id: number; rating: number; comment: string }) =>
      api.updateReview(token!, id, rating, comment),
    onSuccess: () => {
      setEditingReviewId(null)
      queryClient.invalidateQueries({ queryKey: ['reviews', course!.id] })
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) => api.deleteReview(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', course!.id] }),
  })

  if (isLoading) return <LoadingSpinner />
  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  function handleEnrollOrBuy() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${slug}` } })
      return
    }
    if (course!.is_free) {
      enrollMutation.mutate()
    } else {
      cartMutation.mutate()
    }
  }

  return (
    <div>
      <section className="bg-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
          <div>
            <p className="mb-2 text-sm text-accent">{course.category_name}</p>
            <h1 className="mb-3 text-3xl font-bold lg:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mb-4 text-lg text-white/80">{course.subtitle}</p>}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
              <StarRating rating={course.rating_avg} count={course.rating_count} />
              <span>{course.enrollment_count?.toLocaleString() ?? 0} students</span>
              {course.instructor_name && (
                <span>Created by {course.instructor_name}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(totalDuration)}
              </span>
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                {totalLectures} lectures
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Globe className="h-4 w-4" />
                {course.level} · {course.language || 'English'}
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="overflow-hidden rounded border border-border bg-surface text-dark shadow-xl">
              {previewLecture ? (
                <PreviewLecturePlayer lecture={previewLecture} title={previewLecture.title} token={token} />
              ) : course.cover_image ? (
                <img src={mediaUrl(course.cover_image)} alt={course.title} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-bg text-muted">Preview unavailable</div>
              )}
              <div className="p-5">
                <p className="mb-4 text-3xl font-bold">{formatPrice(course.price, course.is_free)}</p>
                {isEnrolled ? (
                  <Link
                    to={learnUrl(course.slug)}
                    className="mb-2 block w-full rounded bg-primary py-3 text-center text-sm font-bold text-white hover:bg-primary-dark"
                  >
                    Go to course
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnrollOrBuy}
                    disabled={enrollMutation.isPending || cartMutation.isPending}
                    className="mb-2 w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                  >
                    {course.is_free ? 'Enroll for free' : 'Add to cart'}
                  </button>
                )}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => wishlistMutation.mutate()}
                    className="w-full rounded border border-dark py-3 text-sm font-bold hover:bg-bg"
                  >
                    Add to wishlist
                  </button>
                )}
                {isAuthenticated && !course.is_free && (
                  <Link
                    to={`/gift?course_id=${course.id}`}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-primary py-3 text-sm font-bold text-primary hover:bg-primary/5"
                  >
                    <Gift className="h-4 w-4" />
                    {t('course.giftCourse')}
                  </Link>
                )}
                {actionMsg && <p className="mt-3 text-center text-sm text-primary">{actionMsg}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
        <div className="space-y-10">
          {instructor && (
            <section className="rounded border border-border bg-surface p-6">
              <h2 className="mb-4 text-xl font-bold">Instructor</h2>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg">
                  {instructor.avatar_url ? (
                    <img src={mediaUrl(instructor.avatar_url)} alt={instructor.name} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-muted" />
                  )}
                </div>
                <div>
                  <p className="font-bold">{instructor.name}</p>
                  {instructor.headline && <p className="text-sm text-muted">{instructor.headline}</p>}
                  <div className="mt-2 flex gap-4 text-sm text-muted">
                    <span>{instructor.total_courses ?? 0} courses</span>
                    <span>{(instructor.total_students ?? 0).toLocaleString()} students</span>
                    <span>{(instructor.average_rating ?? 0).toFixed(1)} rating</span>
                  </div>
                  {instructor.bio && <p className="mt-2 text-sm text-muted">{instructor.bio}</p>}
                </div>
              </div>
            </section>
          )}

          <div className="flex gap-4 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-bold ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
            >
              {t('course.overview')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className={`pb-3 text-sm font-bold ${activeTab === 'qa' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
            >
              {questionsLoading
                ? `${t('course.qa')} (…)`
                : t('course.qaCount', { count: questions.length })}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('translations')}
              className={`pb-3 text-sm font-bold ${activeTab === 'translations' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
            >
              {t('course.translations')}
            </button>
          </div>

          {activeTab === 'overview' ? (
            <>
              <section>
                <h2 className="mb-4 text-2xl font-bold">What you will learn</h2>
                <div className="rounded border border-border bg-surface p-6">
                  <p className="whitespace-pre-line text-muted">{course.description || 'No description provided.'}</p>
                </div>
              </section>

              {previewLecture && (
                <section ref={previewPlayerRef} className="scroll-mt-24">
                  <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                    <PreviewLecturePlayer
                      lecture={previewLecture}
                      title={previewLecture.title}
                      token={token}
                    />
                    <div className="border-t border-border px-4 py-3">
                      <p className="font-semibold">{previewLecture.title}</p>
                      <p className="text-sm text-muted">{formatDuration(previewLecture.duration_seconds)}</p>
                    </div>
                  </div>
                </section>
              )}

              {previewLectures.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-bold">Free preview</h2>
                  <div className="space-y-2">
                    {previewLectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        type="button"
                        onClick={() => selectPreview(lecture)}
                        className={`flex w-full items-center justify-between rounded border px-4 py-3 text-left text-sm transition-colors hover:bg-bg ${
                          previewLecture?.id === lecture.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                            : 'border-border bg-surface'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-primary" />
                          {lecture.title}
                          <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-dark">Preview</span>
                        </span>
                        <span className="text-muted">{formatDuration(lecture.duration_seconds)}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="mb-4 text-2xl font-bold">Course content</h2>
                <div className="rounded border border-border bg-surface">
                  <div className="border-b border-border px-4 py-3 text-sm font-semibold">
                    {curriculum.length} sections · {totalLectures} lectures · {formatDuration(totalDuration)} total length
                  </div>
                  {curriculum.map((section) => (
                    <div key={section.id} className="border-b border-border last:border-0">
                      <div className="bg-bg px-4 py-3 font-semibold">{section.title}</div>
                      {section.lectures?.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="flex items-center justify-between border-t border-border px-4 py-2.5 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Play className="h-3.5 w-3.5 text-muted" />
                            {lecture.title}
                            {lecture.is_preview && (
                              <button
                                type="button"
                                onClick={() => selectPreview(lecture)}
                                className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-dark hover:opacity-80"
                              >
                                Preview
                              </button>
                            )}
                          </span>
                          <span className="text-muted">{formatDuration(lecture.duration_seconds)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">Student reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded border border-border bg-surface p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <StarRating rating={r.rating} />
                          <span className="text-sm font-semibold">{r.user_name}</span>
                        </div>
                        <p className="mb-3 text-sm text-muted">{r.comment}</p>
                        {r.instructor_response && (
                          <div className="mb-3 rounded bg-bg p-3 text-sm">
                            <p className="mb-1 font-semibold text-primary">Instructor response</p>
                            <p className="text-muted">{r.instructor_response}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          {isAuthenticated && (
                            <button
                              type="button"
                              onClick={() => helpfulMutation.mutate(r.id)}
                              disabled={helpfulMutation.isPending || r.user_voted_helpful}
                              className={`flex items-center gap-1 text-xs ${
                                r.user_voted_helpful ? 'font-bold text-primary' : 'text-muted hover:text-primary'
                              }`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Helpful ({r.helpful_count ?? 0})
                            </button>
                          )}
                          {isAuthenticated && user?.id === r.user_id && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingReviewId(r.id)
                                  setEditRating(r.rating)
                                  setEditComment(r.comment)
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                {t('course.editReview')}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(t('course.confirmDeleteReview'))) {
                                    deleteReviewMutation.mutate(r.id)
                                  }
                                }}
                                className="text-xs text-red-600 hover:underline"
                              >
                                {t('course.deleteReview')}
                              </button>
                            </>
                          )}
                          {!isAuthenticated && (r.helpful_count ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {r.helpful_count} found helpful
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isAuthenticated && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      reviewMutation.mutate()
                    }}
                    className="mt-6 rounded border border-border bg-surface p-4"
                  >
                    <h3 className="mb-3 font-semibold">Leave a review</h3>
                    <div className="mb-3 flex items-center gap-2">
                      <label htmlFor="rating" className="text-sm">Rating</label>
                      <select
                        id="rating"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="rounded border border-border px-2 py-1"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} stars</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={3}
                      className="mb-3 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={reviewMutation.isPending}
                      className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
                    >
                      Submit review
                    </button>
                  </form>
                )}
                {editingReviewId && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      updateReviewMutation.mutate({
                        id: editingReviewId,
                        rating: editRating,
                        comment: editComment,
                      })
                    }}
                    className="mt-4 rounded border border-primary bg-primary/5 p-4"
                  >
                    <h3 className="mb-3 font-semibold">{t('course.editReview')}</h3>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="mb-3 rounded border border-border px-2 py-1"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} stars</option>
                      ))}
                    </select>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      className="mb-3 w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-bold text-white">
                        {t('course.saveReview')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId(null)}
                        className="rounded border border-border px-4 py-2 text-sm"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            </>
          ) : activeTab === 'qa' ? (
            <section>
              <h2 className="mb-4 text-2xl font-bold">Questions & answers</h2>
              {isAuthenticated && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    questionMutation.mutate({
                      title: fd.get('title') as string,
                      body: fd.get('body') as string,
                    })
                    e.currentTarget.reset()
                  }}
                  className="mb-6 rounded border border-border bg-surface p-4"
                >
                  <input
                    name="title"
                    placeholder="Question title"
                    required
                    className="mb-2 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <textarea
                    name="body"
                    placeholder="Your question..."
                    rows={3}
                    required
                    className="mb-3 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={questionMutation.isPending}
                    className="rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
                  >
                    Ask question
                  </button>
                </form>
              )}
              {questions.length === 0 ? (
                <p className="text-muted">No questions yet. Be the first to ask!</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <QuestionThread key={q.id} question={q} token={token} isAuthenticated={isAuthenticated} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              <h2 className="mb-4 text-2xl font-bold">{t('course.translations')}</h2>
              {translations.length === 0 ? (
                <p className="text-muted">No translations available for this course.</p>
              ) : (
                <div className="space-y-4">
                  {translations.map((tr) => (
                    <div key={tr.id} className="rounded border border-border bg-surface p-4">
                      <p className="mb-1 text-xs font-bold uppercase text-primary">{tr.locale}</p>
                      <h3 className="font-bold">{tr.title}</h3>
                      {tr.subtitle && <p className="text-sm text-muted">{tr.subtitle}</p>}
                      {tr.description && (
                        <p className="mt-2 whitespace-pre-line text-sm text-muted">{tr.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="lg:hidden">
          <div className="sticky top-20 rounded border border-border bg-surface p-5 shadow-sm">
            <p className="mb-4 text-2xl font-bold">{formatPrice(course.price, course.is_free)}</p>
            {isEnrolled ? (
              <Link
                to={learnUrl(course.slug)}
                className="mb-2 block w-full rounded bg-primary py-3 text-center text-sm font-bold text-white"
              >
                Go to course
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleEnrollOrBuy}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded bg-primary py-3 text-sm font-bold text-white"
              >
                {course.is_free ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Enroll for free
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
