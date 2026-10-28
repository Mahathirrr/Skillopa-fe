import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { PageContainer } from '@/components/ui/page-container'
import { cn } from '@/lib/utils'

export type DashboardNavItem = {
  to: string
  label: string
  end?: boolean
}

type DashboardShellProps = {
  title: string
  description?: string
  nav: DashboardNavItem[]
  children: ReactNode
  actions?: ReactNode
}

export function DashboardShell({ title, description, nav, children, actions }: DashboardShellProps) {
  const { pathname } = useLocation()

  return (
    <PageContainer className="pb-16">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {actions}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav
          aria-label="Dashboard"
          className="flex shrink-0 flex-row gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 lg:w-56 lg:flex-col lg:overflow-visible"
        >
          {nav.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-brand-soft text-primary' : 'text-muted hover:bg-background hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageContainer>
  )
}
