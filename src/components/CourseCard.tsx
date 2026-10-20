import { Heart, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { StarRating } from '@/components/StarRating'
import type { Course } from '@/lib/api'
import { mediaUrl } from '@/lib/api'
import { cn, courseUrl, formatPrice } from '@/lib/utils'

type Props = {
  course: Course
  onAddToCart?: (course: Course) => void
  onToggleWishlist?: (course: Course) => void
  inWishlist?: boolean
  className?: string
}

export function CourseCard({ course, onAddToCart, onToggleWishlist, inWishlist, className }: Props) {
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded border border-border bg-surface shadow-sm transition hover:shadow-md',
        className,
      )}
    >
      <Link to={courseUrl(course.slug)} className="relative block aspect-[16/9] overflow-hidden bg-dark-muted">
        {course.cover_image ? (
          <img
            src={mediaUrl(course.cover_image)}
            alt={course.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white/80">
            <span className="px-4 text-center text-sm font-semibold">{course.title}</span>
          </div>
        )}
        {course.is_free && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-ink">
            Free
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={courseUrl(course.slug)}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink group-hover:text-primary">
            {course.title}
          </h3>
        </Link>
        {course.instructor_name && (
          <p className="text-xs text-muted">{course.instructor_name}</p>
        )}
        <StarRating rating={course.rating_avg || 0} count={course.rating_count} />
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-base font-bold text-ink">
            {formatPrice(course.price, course.is_free)}
          </span>
          <div className="flex gap-1">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(course)}
                className="cursor-pointer rounded p-1.5 text-muted hover:bg-bg hover:text-primary"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('h-4 w-4', inWishlist && 'fill-primary text-primary')} />
              </button>
            )}
            {onAddToCart && !course.is_free && (
              <button
                type="button"
                onClick={() => onAddToCart(course)}
                className="cursor-pointer rounded p-1.5 text-muted hover:bg-bg hover:text-primary"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
