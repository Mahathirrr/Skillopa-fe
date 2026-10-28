import type { ReactNode } from 'react'

type Props = {
  variant: 'error' | 'success' | 'info'
  children: ReactNode
}

const styles = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-primary/20 bg-primary/5 text-ink',
}

export function AuthAlert({ variant, children }: Props) {
  return (
    <div className={`mb-4 rounded-lg border px-3 py-2.5 text-sm ${styles[variant]}`} role="alert">
      {children}
    </div>
  )
}
