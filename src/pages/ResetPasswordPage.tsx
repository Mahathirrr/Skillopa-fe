import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthAlert } from '@/components/auth/AuthAlert'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthShell } from '@/components/AuthShell'
import { api } from '@/lib/api'
import { isPasswordValidForBackend } from '@/lib/auth-validation'
import { ApiError } from '@/lib/api-error'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!token) {
      setError(t('auth.resetMissingToken'))
      return
    }
    if (!isPasswordValidForBackend(password)) {
      setError(t('auth.validation.passwordTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.validation.passwordMismatch'))
      return
    }
    setLoading(true)
    try {
      await api.confirmPasswordReset(token, password)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2500)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('auth.resetFailed'))
    } finally {
      setLoading(false)
    }
  }

  if (!token && !done) {
    return (
      <AuthShell
        title={t('auth.resetTitle')}
        subtitle={
          <Link to="/forgot-password" className="font-bold text-primary hover:underline">
            {t('auth.requestNewLink')}
          </Link>
        }
      >
        <AuthAlert variant="error">{t('auth.resetMissingToken')}</AuthAlert>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title={t('auth.resetTitle')}
      description={t('auth.resetDescription')}
      subtitle={
        <Link to="/login" className="font-bold text-primary hover:underline">
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
      {done ? (
        <AuthAlert variant="success">{t('auth.resetSuccess')}</AuthAlert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <PasswordField
            id="reset-password"
            label={t('auth.newPassword')}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            showStrength
          />
          <PasswordField
            id="reset-confirm"
            label={t('auth.confirmPassword')}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? t('auth.updatingPassword') : t('auth.updatePassword')}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
