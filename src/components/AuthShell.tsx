import type { ReactNode } from 'react'

import { SkillopaLogo } from '@/components/SkillopaLogo'

type AuthShellProps = {
  title: string
  subtitle: ReactNode
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <SkillopaLogo className="h-11 w-11" />
          <span className="text-lg font-bold text-ink">Skillopa</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-ink">{title}</h1>
        <p className="mb-6 text-sm text-muted">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}
