import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { AuthAlert } from '@/components/auth/AuthAlert'
import { AuthTextField } from '@/components/auth/AuthTextField'
import { AuthShell } from '@/components/AuthShell'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { isValidEmail, normalizeEmail } from '@/lib/auth-validation'
import { ApiError } from '@/lib/api-error'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const { data: resetStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['password-reset-status'],
    queryFn: () => api.passwordResetStatus(),
    staleTime: 60_000,
  })

  const emailResetEnabled = resetStatus?.enabled === true

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!emailResetEnabled) {
      setError(t('auth.forgotDisabled'))
      return
    }
    if (!isValidEmail(email)) {
      setError(t('auth.validation.emailInvalid'))
      return
    }
    setLoading(true)
    try {
      await api.requestPasswordReset(normalizeEmail(email))
      setSent(true)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (statusLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <AuthShell
      title={t('auth.forgotTitle')}
      description={t('auth.forgotDescription')}
      subtitle={
        <Link to="/login" className="font-bold text-primary hover:underline">
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {!emailResetEnabled ? (
        <AuthAlert variant="info">{t('auth.forgotDisabled')}</AuthAlert>
      ) : null}
      {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
      {sent ? (
        <AuthAlert variant="success">{t('auth.forgotSuccess')}</AuthAlert>
      ) : emailResetEnabled ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthTextField
            id="forgot-email"
            type="email"
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? t('auth.sendingReset') : t('auth.sendResetLink')}
          </button>
        </form>
      ) : null}
    </AuthShell>
  )
}
