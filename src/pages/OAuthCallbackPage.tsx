import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SkillopaLogo } from '@/components/SkillopaLogo'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { t } = useTranslation()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = params.get('token')

    async function finish() {
      try {
        if (token) {
          localStorage.setItem('skillopa_token', token)
          const res = await api.me(token)
          setUser(res.user)
          useAuthStore.setState({
            token,
            user: res.user,
            isAuthenticated: true,
            isInstructor: res.user.role === 'instructor' || res.user.role === 'admin',
            isAdmin: res.user.role === 'admin',
          })
          navigate(res.user.role === 'instructor' || res.user.role === 'admin' ? '/instructor/dashboard' : '/my-learning', { replace: true })
          return
        }

        setError(t('auth.oauthMissing'))
      } catch (e) {
        setError(e instanceof ApiError ? e.message : t('auth.oauthFailed'))
      }
    }

    void finish()
  }, [params, navigate, setUser, t])

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <SkillopaLogo className="mb-4 h-12 w-12" />
        <p className="mb-4 text-red-600">{error}</p>
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t('auth.oauthBackToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <SkillopaLogo className="h-12 w-12" />
      <p className="text-sm text-muted">{t('auth.completingLogin')}</p>
      <LoadingSpinner />
    </div>
  )
}
