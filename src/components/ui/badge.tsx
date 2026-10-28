import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const tones = {
  brand: 'bg-brand-soft text-primary',
  neutral: 'bg-background text-muted border border-border',
  success: 'bg-success/10 text-success',
  free: 'bg-brand-soft text-primary font-bold',
} as const

type BadgeProps = {
  tone?: keyof typeof tones
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
