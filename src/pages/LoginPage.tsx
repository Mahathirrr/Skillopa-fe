import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthAlert } from '@/components/auth/AuthAlert'
import { AuthDivider } from '@/components/auth/AuthDivider'
import { AuthTextField } from '@/components/auth/AuthTextField'
import { DemoAccountPanel } from '@/components/auth/DemoAccountPanel'
import { PasswordField } from '@/components/auth/PasswordField'
import { AuthShell } from '@/components/AuthShell'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { showDemoLoginPanel } from '@/lib/feature-flags'
import { isValidEmail, normalizeEmail } from '@/lib/auth-validation'
import { useAuthStore } from '@/stores/auth'

export function LoginPage() {
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const from = (location.state as { from?: string } | null)?.from ?? '/my-learning'
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [localError, setLocalError] = useState('')
  const oauthFailed = searchParams.get('oauth_error') === '1'

  function validate() {
    const next: typeof fieldErrors = {}
    if (!email.trim()) next.email = t('auth.validation.emailRequired')
    else if (!isValidEmail(email)) next.email = t('auth.validation.emailInvalid')
    if (!password) next.password = t('auth.validation.passwordRequired')
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')
    if (!validate()) return
    try {
      const path = await login(normalizeEmail(email), password)
      navigate(from !== '/login' ? from : path)
    } catch {
      setLocalError(t('auth.invalidCredentials'))
    }
  }

  const bannerError = error || localError || (oauthFailed ? t('auth.oauthFailed') : '')

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      description={t('auth.loginDescription')}
      subtitle={
        <>
          {t('auth.newToSkillopa')}{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            {t('auth.signUpLink')}
          </Link>
        </>
      }
    >
      {bannerError ? <AuthAlert variant="error">{bannerError}</AuthAlert> : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <PasswordField
          id="login-password"
          label={t('auth.password')}
          labelAction={
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              {t('auth.forgotPasswordLink')}
            </Link>
          }
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? t('auth.signingIn') : t('auth.loginButton')}
        </button>
      </form>

      <div className="mt-5 space-y-3">
        <AuthDivider label={t('auth.orContinueWith')} />
        <GoogleSignInButton />
      </div>

      {showDemoLoginPanel ? (
        <DemoAccountPanel
          onPick={(demoEmail, demoPassword) => {
            setEmail(demoEmail)
            setPassword(demoPassword)
            setFieldErrors({})
          }}
        />
      ) : null}
    </AuthShell>
  )
}
