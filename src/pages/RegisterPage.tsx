import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthShell } from '@/components/AuthShell'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const path = await register(name, email, password, 'student', refCode || undefined)
      navigate(path)
    } catch {
      /* error shown from store */
    }
  }

  return (
    <AuthShell
      title={t('auth.registerTitle')}
      subtitle={
        <>
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            {t('auth.loginLink')}
          </Link>
        </>
      }
    >
      {refCode && (
        <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          {t('auth.referralApplied')}: <strong>{refCode}</strong>
        </p>
      )}

      <div className="mb-4 space-y-3">
        <GoogleSignInButton referralCode={refCode || undefined} />
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          <span>{t('auth.orEmail')}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold">
            {t('auth.fullName')}
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? t('auth.creatingAccount') : t('auth.signUpButton')}
        </button>
      </form>
    </AuthShell>
  )
}
