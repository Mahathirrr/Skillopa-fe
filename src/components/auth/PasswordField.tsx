import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { passwordChecks } from '@/lib/auth-validation'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  labelAction?: ReactNode
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  showStrength?: boolean
  error?: string
  id?: string
}

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  showStrength = false,
  error,
  id: idProp,
  labelAction,
}: Props) {
  const { t } = useTranslation()
  const autoId = useId()
  const id = idProp ?? autoId
  const [visible, setVisible] = useState(false)
  const checks = showStrength ? passwordChecks(value) : []

  return (
    <div className="grid gap-1.5">
      {label || labelAction ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <label htmlFor={id} className="text-sm font-semibold text-ink">
              {label}
            </label>
          ) : (
            <span />
          )}
          {labelAction}
        </div>
      ) : null}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={showStrength ? `${id}-rules` : undefined}
          className={cn(
            'w-full rounded-lg border bg-surface py-2.5 pl-3 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-muted/70',
            error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary',
          )}
          placeholder={t('auth.passwordPlaceholder')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-bg hover:text-ink"
          aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && value.length > 0 ? (
        <ul id={`${id}-rules`} className="grid gap-0.5 text-xs text-muted">
          {checks.map((c) => (
            <li key={c.id} className={c.ok ? 'text-emerald-700' : undefined}>
              {c.ok ? '✓' : '○'} {t(`auth.passwordRule.${c.id}`)}
            </li>
          ))}
        </ul>
      ) : showStrength ? (
        <p className="text-xs text-muted">{t('auth.passwordHint')}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
