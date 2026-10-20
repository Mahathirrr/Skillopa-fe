import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Globe2,
  Palette,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CourseCard } from '@/components/CourseCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { StarRating } from '@/components/StarRating'
import { useLandingSmoothScroll } from '@/hooks/useLandingSmoothScroll'
import { api } from '@/lib/api'
import heroImage from '@/assets/hero.png'

const categoryIcons: Record<string, typeof Code2> = {
  development: Code2,
  business: Briefcase,
  design: Palette,
}

function CourseSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded border border-border bg-surface">
          <div className="aspect-[16/9] bg-border" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 rounded bg-border" />
            <div className="h-3 w-1/2 rounded bg-border" />
            <div className="h-4 w-1/3 rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategorySkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded border border-border bg-border/60" />
      ))}
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  useLandingSmoothScroll()

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: () => api.listCourses({ limit: 8 }),
  })

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
  })

  const {
    data: statsData,
  } = useQuery({
    queryKey: ['public-stats'],
    queryFn: () => api.getPublicStats(),
  })

  const courses = coursesData?.courses ?? []
  const categories = categoriesData?.categories ?? []
  const platformStats = statsData?.stats

  const stats = [
    {
      label: t('home.statsCourses'),
      value: platformStats ? String(platformStats.total_courses) : '—',
    },
    {
      label: t('home.statsStudents'),
      value: platformStats
        ? platformStats.total_enrollments.toLocaleString()
        : '—',
    },
    {
      label: t('home.statsInstructors'),
      value: platformStats ? String(platformStats.total_instructors) : '—',
    },
    {
      label: t('home.statsRating'),
      value: platformStats && platformStats.average_rating > 0
        ? platformStats.average_rating.toFixed(1)
        : '—',
    },
  ]

  const testimonials =
    platformStats?.featured_reviews?.length
      ? platformStats.featured_reviews.map((r) => ({
          name: r.user_name,
          role: r.course_title ?? t('home.featuredTitle'),
          quote: r.comment,
          rating: r.rating,
        }))
      : []

  const steps = [
    { icon: BookOpen, title: t('home.step1Title'), desc: t('home.step1Desc') },
    { icon: PlayCircle, title: t('home.step2Title'), desc: t('home.step2Desc') },
    { icon: Award, title: t('home.step3Title'), desc: t('home.step3Desc') },
  ]

  const features = [
    { icon: Globe2, title: t('home.feature1Title'), desc: t('home.feature1Desc') },
    { icon: Users, title: t('home.feature2Title'), desc: t('home.feature2Desc') },
    { icon: CheckCircle2, title: t('home.feature3Title'), desc: t('home.feature3Desc') },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2 lg:px-6 lg:py-24">
          <div>
            <div className="landing-hero-in mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.heroBadge')}
            </div>
            <h1 className="landing-hero-in landing-hero-in-delay-1 mb-4 text-4xl font-bold leading-tight lg:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="landing-hero-in landing-hero-in-delay-2 mb-8 max-w-lg text-lg text-white/75">
              {t('home.heroSubtitle')}
            </p>
            <div className="landing-hero-in landing-hero-in-delay-3 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark"
              >
                {t('home.exploreCourses')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                {t('home.startFree')}
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              data-parallax="0.1"
              src={heroImage}
              alt={t('home.heroImageAlt')}
              className="landing-hero-in landing-hero-in-delay-2 rounded-lg shadow-2xl will-change-transform"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <ScrollReveal as="section" className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 lg:grid-cols-4 lg:px-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 90} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* Featured courses */}
      <ScrollReveal as="section" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">{t('home.featuredTitle')}</h2>
            <p className="mt-1 text-muted">{t('home.featuredSubtitle')}</p>
          </div>
          <Link to="/courses" className="text-sm font-bold text-primary hover:underline">
            {t('home.viewAll')}
          </Link>
        </div>
        {coursesLoading ? (
          <CourseSkeletonGrid />
        ) : coursesError ? (
          <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
            <p className="mb-4 text-muted">{t('home.coursesError')}</p>
            <button
              type="button"
              onClick={() => refetchCourses()}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
            >
              <RefreshCw className="h-4 w-4" />
              {t('home.retry')}
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted" />
            <p className="font-semibold text-ink">{t('home.noCourses')}</p>
            <p className="mt-1 text-sm text-muted">{t('home.noCoursesHint')}</p>
            <Link
              to="/courses"
              className="mt-4 inline-block rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
            >
              {t('home.browseCatalog')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, i) => (
              <ScrollReveal key={course.id} delay={(i % 4) * 100}>
                <CourseCard course={course} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Categories */}
      <ScrollReveal as="section" className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="mb-2 text-2xl font-bold text-ink">{t('home.categoriesTitle')}</h2>
          <p className="mb-8 text-muted">{t('home.categoriesSubtitle')}</p>
          {categoriesLoading ? (
            <CategorySkeletonGrid />
          ) : categoriesError ? (
            <div className="rounded-lg border border-border bg-bg px-6 py-10 text-center">
              <p className="mb-4 text-muted">{t('home.categoriesError')}</p>
              <button
                type="button"
                onClick={() => refetchCategories()}
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
              >
                <RefreshCw className="h-4 w-4" />
                {t('home.retry')}
              </button>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted">{t('home.noCategories')}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const Icon = categoryIcons[cat.slug] ?? BookOpen
                return (
                  <ScrollReveal key={cat.id} delay={(i % 4) * 80}>
                    <Link
                      to={`/courses?category_id=${cat.id}`}
                      className="flex items-center gap-3 rounded border border-border bg-bg px-5 py-4 font-semibold text-ink transition hover:border-primary hover:bg-white hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      {cat.name}
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* How it works */}
      <ScrollReveal as="section" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink">{t('home.howItWorksTitle')}</h2>
          <p className="mt-2 text-muted">{t('home.howItWorksSubtitle')}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 120}>
              <div className="relative rounded-lg border border-border bg-surface p-6 text-center">
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <step.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-bold text-ink">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* Features */}
      <ScrollReveal as="section" className="bg-dark py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold">{t('home.whyTitle')}</h2>
            <p className="mt-2 text-white/70">{t('home.whySubtitle')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 120}>
                <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <f.icon className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-2 font-bold">{f.title}</h3>
                  <p className="text-sm text-white/70">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Bundles promo */}
      <ScrollReveal as="section" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-ink">{t('home.bundlesTitle')}</h2>
            <p className="mt-2 max-w-lg text-muted">{t('home.bundlesSubtitle')}</p>
          </div>
          <Link
            to="/bundles"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark"
          >
            {t('home.viewBundles')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal as="section" className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-ink">{t('home.testimonialsTitle')}</h2>
            <p className="mt-2 text-muted">{t('home.testimonialsSubtitle')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.length === 0 ? (
              <p className="col-span-full text-center text-muted">{t('home.noTestimonials')}</p>
            ) : (
            testimonials.map((item, i) => (
              <ScrollReveal key={`${item.name}-${item.quote.slice(0, 20)}`} delay={i * 120}>
                <blockquote className="rounded-lg border border-border bg-bg p-6">
                  <StarRating rating={item.rating ?? 5} variant="stars" size="md" className="mb-3" />
                  <p className="mb-4 text-sm leading-relaxed text-ink">&ldquo;{item.quote}&rdquo;</p>
                  <footer>
                    <p className="font-bold text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Instructor CTA */}
      <ScrollReveal as="section" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary-dark p-8 text-white lg:p-12">
          <h2 className="mb-3 text-2xl font-bold lg:text-3xl">{t('home.instructorTitle')}</h2>
          <p className="mb-6 max-w-xl text-white/80">{t('home.instructorSubtitle')}</p>
          <Link
            to="/register"
            className="btn-on-primary inline-block rounded px-6 py-3 text-sm font-bold"
          >
            {t('home.instructorCta')}
          </Link>
        </div>
      </ScrollReveal>
    </div>
  )
}
