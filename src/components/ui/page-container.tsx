import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageContainerProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className, narrow }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 py-8 lg:px-6', narrow ? 'max-w-3xl' : 'max-w-7xl', className)}>
      {children}
    </div>
  )
}

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
