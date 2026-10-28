import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-sm disabled:opacity-50',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-background disabled:opacity-50',
  ghost: 'text-foreground hover:bg-background disabled:opacity-50',
  danger: 'bg-error text-white hover:opacity-90 disabled:opacity-50',
} as const

const sizes = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-6 text-base',
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-fast ease-standard',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  )
}

export function buttonClass(
  variant: keyof typeof variants = 'primary',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-fast ease-standard',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    variants[variant],
    sizes[size],
    className,
  )
}
