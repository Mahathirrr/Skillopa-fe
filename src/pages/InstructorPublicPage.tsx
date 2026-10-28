import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExternalLink, User } from 'lucide-react'

import { CourseCard } from '@/components/CourseCard'
import { InstructorStats } from '@/components/InstructorStats'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api, mediaUrl } from '@/lib/api'

const PAGE_SIZE = 12

export function InstructorPublicPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const [offset, setOffset] = useState(0)
  const [bioExpanded, setBioExpanded] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructor-public', slug],
    queryFn: () => api.getInstructorBySlug(slug!),
    enabled: !!slug,
  })

  const instructor = data?.instructor

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-public-courses', slug, offset],
    queryFn: () => api.listInstructorCourses(slug!, PAGE_SIZE, offset),
    enabled: !!slug && !!instructor,
  })

  useEffect(() => {
    if (error || (!isLoading && !instructor)) {
      let robots = document.querySelector('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, nofollow')
      return
    }
    if (!instructor) return
    const pageTitle = `${instructor.name} | Skillopa`
    const desc =
      instructor.headline ||
      t('instructor.metaDescription', { name: instructor.name, count: instructor.published_courses ?? 0 })
    document.title = pageTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', desc)
  }, [instructor, t, error, isLoading])

  if (isLoading) return <LoadingSpinner />
  if (error || !instructor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t('instructor.notFound')}</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
          {t('nav.explore')}
        </Link>
      </div>
    )
  }

  const courses = coursesData?.courses ?? []
  const total = coursesData?.total ?? 0
  const socialLinks = [
    { href: instructor.website_url, label: 'Website' },
    { href: instructor.linkedin_url, label: 'LinkedIn' },
    { href: instructor.youtube_url, label: 'YouTube' },
    { href: instructor.github_url, label: 'GitHub' },
  ].filter((l) => l.href)

  const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: instructor.name,
      url: `https://skillopa.showcaseproject.my.id/instructor/${instructor.slug ?? slug}`,
      jobTitle: instructor.headline || undefined,
      image: instructor.avatar_url ? mediaUrl(instructor.avatar_url) : undefined,
    })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}

      <header className="mb-10 flex flex-col gap-6 border-b border-border pb-10 md:flex-row">
        {instructor.avatar_url ? (
          <img
            src={mediaUrl(instructor.avatar_url)}
            alt={t('instructor.avatarAlt', { name: instructor.name })}
            className="h-32 w-32 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-32 w-32 items-center justify-center rounded-full bg-bg">
            <User className="h-16 w-16 text-muted" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold">{instructor.name}</h1>
          {instructor.headline && <p className="mt-1 text-lg text-muted">{instructor.headline}</p>}
          <InstructorStats
            className="mt-4"
            publishedCourses={instructor.published_courses ?? 0}
            totalStudents={instructor.total_students}
            totalReviews={instructor.total_reviews}
            averageRating={instructor.average_rating ?? 0}
            showReviews
          />
          {instructor.bio && (
            <div className="mt-4 max-w-3xl text-muted">
              <p className={bioExpanded ? 'whitespace-pre-line' : 'line-clamp-4 whitespace-pre-line'}>
                {instructor.bio}
              </p>
              {instructor.bio.length > 200 && (
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                  onClick={() => setBioExpanded((v) => !v)}
                >
                  {bioExpanded ? t('instructor.showLess') : t('instructor.showMore')}
                </button>
              )}
            </div>
          )}
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-3 text-sm">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {l.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-bold">{t('instructor.publishedCourses')}</h2>
        {coursesLoading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <p className="text-muted">{t('instructor.noCourses')}</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
            {total > offset + PAGE_SIZE && (
              <button
                type="button"
                className="mt-8 rounded border border-border px-6 py-2.5 text-sm font-semibold hover:bg-bg"
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                {t('instructor.loadMore')}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  )
}
