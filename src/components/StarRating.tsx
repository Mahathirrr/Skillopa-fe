import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
  variant?: 'compact' | 'stars'
}

const STAR_FILLED = 'fill-[#e59819] text-[#e59819]'
const STAR_EMPTY = 'fill-none text-[#c4c4c4]'

export function StarRating({ rating, count, size = 'sm', className, variant = 'compact' }: Props) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  if (variant === 'stars') {
    const filled = Math.round(Math.min(5, Math.max(0, rating)))
    return (
      <div className={cn('flex gap-0.5', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(iconSize, i < filled ? STAR_FILLED : STAR_EMPTY)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="font-bold text-[#b4690e]">{rating.toFixed(1)}</span>
      <Star className={cn(iconSize, STAR_FILLED)} />
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
