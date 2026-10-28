import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { buttonClass } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; to: string }
  className?: string
  children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action, className, children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-primary">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
      ) : null}
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {children}
      {action ? (
        <Link to={action.to} className={cn(buttonClass('primary', 'md'), 'mt-6')}>
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
