import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
  variant?: 'compact' | 'stars'
  /** When false and count is 0, render nothing (no fake stars). */
  showEmpty?: boolean
}

const STAR_FILLED = 'fill-[#e59819] text-[#e59819]'
const STAR_EMPTY = 'fill-none text-[#c4c4c4]'

function HalfStar({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <Star className={cn(className, STAR_EMPTY)} />
      <Star className={cn(className, STAR_FILLED, 'absolute inset-0 clip-half')} style={{ clipPath: 'inset(0 50% 0 0)' }} />
    </span>
  )
}

export function StarRating({
  rating,
  count,
  size = 'sm',
  className,
  variant = 'compact',
  showEmpty = true,
}: Props) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  if (count !== undefined && count <= 0 && !showEmpty) {
    return null
  }

  if (variant === 'stars') {
    const clamped = Math.min(5, Math.max(0, rating))
    return (
      <div className={cn('flex gap-0.5', className)} aria-label={`Rating ${clamped} of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1
          if (clamped >= starIndex) {
            return <Star key={i} className={cn(iconSize, STAR_FILLED)} />
          }
          if (clamped >= starIndex - 0.5) {
            return <HalfStar key={i} className={iconSize} />
          }
          return <Star key={i} className={cn(iconSize, STAR_EMPTY)} />
        })}
      </div>
    )
  }

  if (count !== undefined && count <= 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="font-bold text-[#b4690e]">{rating.toFixed(1)}</span>
      <Star className={cn(iconSize, STAR_FILLED)} />
      {count !== undefined && count > 0 && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
