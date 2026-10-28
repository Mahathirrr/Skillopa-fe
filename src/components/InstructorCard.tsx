import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User } from 'lucide-react'

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
  const hasRating = (instructor.total_reviews ?? 0) > 0 && (instructor.average_rating ?? 0) > 0
  const published = instructor.published_courses ?? instructor.total_courses ?? 0

  const nameEl = profileHref ? (
    <Link to={profileHref} className="font-bold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      {instructor.name}
    </Link>
  ) : (
    <p className="font-bold">{instructor.name}</p>
  )

  return (
    <section className="rounded border border-border bg-surface p-6" aria-labelledby="instructor-heading">
      <h2 id="instructor-heading" className="mb-4 text-xl font-bold">
        {t('instructor.cardTitle')}
      </h2>
      <div className="flex gap-4">
        {profileHref ? (
          <Link
            to={profileHref}
            className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {instructor.avatar_url ? (
              <img
                src={mediaUrl(instructor.avatar_url)}
                alt={t('instructor.avatarAlt', { name: instructor.name })}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bg">
                <User className="h-8 w-8 text-muted" aria-hidden />
              </span>
            )}
          </Link>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg">
            {instructor.avatar_url ? (
              <img src={mediaUrl(instructor.avatar_url)} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-muted" />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {nameEl}
          {instructor.headline && <p className="text-sm text-muted">{instructor.headline}</p>}
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li>{t('instructor.statCourses', { count: published })}</li>
            <li>{t('instructor.statStudents', { count: instructor.total_students ?? 0 })}</li>
            <li>
              {hasRating
                ? t('instructor.statRating', { rating: (instructor.average_rating ?? 0).toFixed(1) })
                : t('instructor.noRating')}
            </li>
          </ul>
          {instructor.bio && variant === 'full' && (
            <div className="mt-2 text-sm text-muted">
              <p className={bioExpanded ? 'whitespace-pre-line' : 'line-clamp-3 whitespace-pre-line'}>{instructor.bio}</p>
              {instructor.bio.length > 120 && (
                <button
                  type="button"
                  className="mt-1 text-sm font-semibold text-primary hover:underline"
                  onClick={() => setBioExpanded((v) => !v)}
                >
                  {bioExpanded ? t('instructor.showLess') : t('instructor.showMore')}
                </button>
              )}
            </div>
          )}
          {profileHref && (
            <Link
              to={profileHref}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('instructor.viewFullProfile')}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
