import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthAlert } from '@/components/auth/AuthAlert'
import { AuthDivider } from '@/components/auth/AuthDivider'
import { AuthTextField } from '@/components/auth/AuthTextField'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthShell } from '@/components/AuthShell'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import {
  AUTH_MIN_NAME_LENGTH,
  isRegisterFormValid,
  isValidEmail,
  normalizeEmail,
} from '@/lib/auth-validation'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/stores/auth'

export function RegisterPage() {
  const { register, loading, error } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const refCode = searchParams.get('ref') ?? ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [localError, setLocalError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')

    if (name.trim().length < AUTH_MIN_NAME_LENGTH) {
      setLocalError(t('auth.validation.nameTooShort'))
      return
    }
    if (!isValidEmail(email)) {
      setLocalError(t('auth.validation.emailInvalid'))
      return
    }
    if (password !== confirmPassword) {
      setLocalError(t('auth.validation.passwordMismatch'))
      return
    }
    if (!acceptTerms) {
      setLocalError(t('auth.validation.acceptTerms'))
      return
    }
    if (!isRegisterFormValid({ name, email, password, confirmPassword, acceptTerms })) {
      setLocalError(t('auth.validation.formIncomplete'))
      return
    }

    try {
      const path = await register(name.trim(), normalizeEmail(email), password, 'student', refCode || undefined)
      navigate(path)
    } catch {
      /* error from store */
    }
  }

  return (
    <AuthShell
      title={t('auth.registerTitle')}
      description={t('auth.registerDescription')}
      subtitle={
        <>
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            {t('auth.loginLink')}
          </Link>
        </>
      }
    >
      {refCode ? (
        <AuthAlert variant="info">
          {t('auth.referralApplied')}: <strong>{refCode}</strong>
        </AuthAlert>
      ) : null}

      {(error || localError) && <AuthAlert variant="error">{error || localError}</AuthAlert>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthTextField
          id="name"
          name="name"
          label={t('auth.fullName')}
          placeholder={t('auth.namePlaceholder')}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint={t('auth.nameHint')}
        />
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="register-password"
          label={t('auth.password')}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          showStrength
        />
        <PasswordField
          id="register-confirm"
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          error={
            confirmPassword.length > 0 && password !== confirmPassword
              ? t('auth.validation.passwordMismatch')
              : undefined
          }
        />

        <label className="flex cursor-pointer items-start gap-2 text-sm leading-snug text-muted">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 rounded border-border"
            required
          />
          <span>
            {t('auth.acceptTermsPrefix')}{' '}
            <Link
              to={ROUTES.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline underline-offset-4 hover:text-primary"
            >
              {t('legal.navTerms')}
            </Link>{' '}
            {t('auth.acceptTermsAnd')}{' '}
            <Link
              to={ROUTES.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline underline-offset-4 hover:text-primary"
            >
              {t('legal.navPrivacy')}
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? t('auth.creatingAccount') : t('auth.signUpButton')}
        </button>
      </form>

      <div className="mt-5 space-y-3">
        <AuthDivider label={t('auth.orContinueWith')} />
        <GoogleSignInButton referralCode={refCode || undefined} />
      </div>
    </AuthShell>
  )
}
