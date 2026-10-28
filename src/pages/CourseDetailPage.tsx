import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, Gift, Globe, Play, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PreviewLecturePlayer } from '@/components/PreviewLecturePlayer'
import { CourseReviewsSection } from '@/components/CourseReviewsSection'
import { InstructorCard } from '@/components/InstructorCard'
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

  const [actionMsg, setActionMsg] = useState('')
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null)
  const previewPlayerRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'translations'>('overview')
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', slug, token],
    queryFn: () => api.getCourseBySlug(slug!, token),
    enabled: !!slug,
  })

  const course = data?.course
  const curriculum = data?.curriculum ?? []

  const { data: instructorData } = useQuery({
    queryKey: ['instructor-profile', course?.instructor_id],
    queryFn: () => api.getInstructorProfile(course!.instructor_id),
    enabled: !!course?.instructor_id,
  })

  const { data: questionCountData } = useQuery({
    queryKey: ['questions-count', course?.id],
    queryFn: () => api.countCourseQuestions(course!.id),
    enabled: !!course?.id,
  })

  const { data: questionsData } = useQuery({
    queryKey: ['questions', course?.id],
    queryFn: () => api.listCourseQuestions(course!.id, undefined, token),
    enabled: !!course?.id && isAuthenticated && !!token && activeTab === 'qa',
  })

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.listEnrollments(token!),
    enabled: isAuthenticated && !!token,
  })

  const { data: translationsData } = useQuery({
    queryKey: ['translations', course?.id],
    queryFn: () => api.listCourseTranslations(course!.id),
    enabled: !!course?.id,
  })

  const instructor = instructorData?.instructor
  const questions = questionsData?.questions ?? []
  const translations = translationsData?.translations ?? []
  const questionCount = questionCountData?.count ?? 0
  const hasTranslations = translations.length > 0
  const enrollment = enrollmentsData?.enrollments?.find((e) => e.course_id === course?.id)
  const isEnrolled = !!enrollment
  const enrollmentProgress = enrollment?.progress_percent ?? 0
  const canReview =
    isEnrolled &&
    isAuthenticated &&
    user?.id !== course?.instructor_id &&
    enrollmentProgress >= 20

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

  const questionMutation = useMutation({
    mutationFn: ({ title, body }: { title: string; body: string }) =>
      api.createQuestion(token!, course!.id, { title, body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions', course!.id] }),
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

  const jsonLd =
    course && course.rating_count > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: course.rating_avg.toFixed(1),
            ratingCount: course.rating_count,
            bestRating: 5,
            worstRating: 1,
          },
        })
      : null

  return (
    <div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <section className="bg-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
          <div>
            <p className="mb-2 text-sm text-accent">{course.category_name}</p>
            <h1 className="mb-3 text-3xl font-bold lg:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mb-4 text-lg text-white/80">{course.subtitle}</p>}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
              {course.rating_count > 0 ? (
                <StarRating rating={course.rating_avg} count={course.rating_count} showEmpty={false} />
              ) : (
                <span className="text-white/70">{t('course.noReviewsYet')}</span>
              )}
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
          {instructor && <InstructorCard instructor={instructor} />}

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
              {t('course.qaCount', { count: questionCount })}
            </button>
            {hasTranslations && (
              <button
                type="button"
                onClick={() => setActiveTab('translations')}
                className={`pb-3 text-sm font-bold ${activeTab === 'translations' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
              >
                {t('course.translations')}
              </button>
            )}
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

              {course && (
                <CourseReviewsSection
                  courseId={course.id}
                  token={token}
                  isAuthenticated={isAuthenticated}
                  canReview={canReview}
                  currentUserId={user?.id}
                  enrollmentProgress={enrollmentProgress}
                />
              )}
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
              {!isAuthenticated && (
                <p className="mb-4 text-sm text-muted">Masuk dan daftar kursus untuk melihat diskusi Q&amp;A.</p>
              )}
              {isAuthenticated && questions.length === 0 ? (
                <p className="text-muted">Belum ada pertanyaan.</p>
              ) : isAuthenticated ? (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <QuestionThread key={q.id} question={q} token={token} isAuthenticated={isAuthenticated} />
                  ))}
                </div>
              ) : null}
            </section>
          ) : (
            <section>
              <h2 className="mb-2 text-2xl font-bold">{t('course.translations')}</h2>
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
