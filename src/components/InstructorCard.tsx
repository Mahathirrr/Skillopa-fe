import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User } from 'lucide-react'

import { InstructorStats } from '@/components/InstructorStats'
import type { InstructorProfile } from '@/api/types'
import { mediaUrl } from '@/lib/api'

type Props = {
  instructor: InstructorProfile
  variant?: 'compact' | 'full'
}

export function InstructorCard({ instructor, variant = 'full' }: Props) {
  const { t } = useTranslation()
  const [bioExpanded, setBioExpanded] = useState(false)
  const profileHref = instructor.slug ? `/instructor/${instructor.slug}` : null
  const published = instructor.published_courses ?? instructor.total_courses ?? 0

  const nameEl = profileHref ? (
    <Link
      to={profileHref}
      className="text-lg font-bold text-dark hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {instructor.name}
    </Link>
  ) : (
    <p className="text-lg font-bold text-dark">{instructor.name}</p>
  )

  const avatarInner = instructor.avatar_url ? (
    <img
      src={mediaUrl(instructor.avatar_url)}
      alt={t('instructor.avatarAlt', { name: instructor.name })}
      className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/15"
    />
  ) : (
    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bg ring-2 ring-border">
      <User className="h-10 w-10 text-muted" aria-hidden />
    </span>
  )

  return (
    <section className="rounded-lg border border-border bg-surface p-6 shadow-sm" aria-labelledby="instructor-heading">
      <h2 id="instructor-heading" className="mb-4 text-xl font-bold text-dark">
        {t('instructor.cardTitle')}
      </h2>
      <div className="flex gap-5 rounded-lg bg-bg/60 p-4">
        {profileHref ? (
          <Link
            to={profileHref}
            className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {avatarInner}
          </Link>
        ) : (
          <div className="shrink-0">{avatarInner}</div>
        )}
        <div className="min-w-0 flex-1">
          {nameEl}
          {instructor.headline && <p className="mt-0.5 text-sm font-medium text-muted">{instructor.headline}</p>}
          <InstructorStats
            className="mt-3"
            publishedCourses={published}
            totalStudents={instructor.total_students ?? 0}
            totalReviews={instructor.total_reviews ?? 0}
            averageRating={instructor.average_rating ?? 0}
          />
          {instructor.bio && variant === 'full' && (
            <div className="mt-3 text-sm leading-relaxed text-muted">
              <p className={bioExpanded ? 'whitespace-pre-line' : 'line-clamp-3 whitespace-pre-line'}>
                {instructor.bio}
              </p>
              {instructor.bio.length > 120 &&
                (profileHref && !bioExpanded ? (
                  <Link
                    to={profileHref}
                    className="mt-1 inline-block text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t('instructor.showMore')}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="mt-1 text-sm font-semibold text-primary hover:underline"
                    onClick={() => setBioExpanded((v) => !v)}
                  >
                    {bioExpanded ? t('instructor.showLess') : t('instructor.showMore')}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
