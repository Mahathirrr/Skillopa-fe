import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarRating({ rating, count, size = 'sm', className }: Props) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="font-bold text-[#b4690e]">{rating.toFixed(1)}</span>
      <Star className={cn(iconSize, 'fill-[#e59819] text-[#e59819]')} />
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
