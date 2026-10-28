import { BookOpen, MessageSquare, Star, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
  publishedCourses: number
  totalStudents: number
  totalReviews?: number
  averageRating?: number
  showReviews?: boolean
  className?: string
}

export function InstructorStats({
  publishedCourses,
  totalStudents,
  totalReviews = 0,
  averageRating = 0,
  showReviews = false,
  className = '',
}: Props) {
  const { t } = useTranslation()
  const hasRating = totalReviews > 0 && averageRating > 0

  const itemClass =
    'inline-flex items-center gap-1.5 rounded-full bg-bg px-3 py-1.5 text-sm text-dark ring-1 ring-border/80'

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      <li className={itemClass}>
        <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span>{t('instructor.statCourses', { count: publishedCourses })}</span>
      </li>
      <li className={itemClass}>
        <Users className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span>{t('instructor.statStudents', { count: totalStudents })}</span>
      </li>
      {showReviews && (
        <li className={itemClass}>
          <MessageSquare className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>{t('instructor.statReviews', { count: totalReviews })}</span>
        </li>
      )}
      <li className={itemClass}>
        <Star
          className={`h-4 w-4 shrink-0 ${hasRating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
          aria-hidden
        />
        <span>
          {hasRating
            ? t('instructor.statRating', { rating: averageRating.toFixed(1) })
            : t('instructor.noRating')}
        </span>
      </li>
    </ul>
  )
}
