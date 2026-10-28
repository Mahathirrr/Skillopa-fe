import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
}

export function AuthTextField({
  label,
  hint,
  error,
  id,
  className,
  wrapperClassName,
  ...inputProps
}: Props) {
  const fieldId = id ?? inputProps.name
  const hintId = hint && fieldId ? `${fieldId}-hint` : undefined
  const errorId = error && fieldId ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('grid gap-1.5', wrapperClassName)}>
      <label htmlFor={fieldId} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70',
          error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary',
          className,
        )}
        {...inputProps}
      />
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
