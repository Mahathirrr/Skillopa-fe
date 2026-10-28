import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthShell } from '@/components/AuthShell'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
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
  const [localError, setLocalError] = useState('')
  const oauthFailed = searchParams.get('oauth_error') === '1'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')
    try {
      const path = await login(email, password)
      navigate(from !== '/login' ? from : path)
    } catch {
      setLocalError(t('auth.invalidCredentials'))
    }
  }

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={
        <>
          {t('auth.newToSkillopa')}{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            {t('auth.signUpLink')}
          </Link>
        </>
      }
    >
      {(error || localError || oauthFailed) && (
        <p className="mb-4 text-sm text-red-600">
          {error || localError || (oauthFailed ? t('auth.oauthFailed') : '')}
        </p>
      )}

      <div className="mb-4 space-y-3">
        <GoogleSignInButton />
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          <span>{t('auth.orEmail')}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold">
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? t('auth.signingIn') : t('auth.loginButton')}
        </button>
      </form>
    </AuthShell>
  )
}
