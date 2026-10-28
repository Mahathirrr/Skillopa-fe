import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuthStore } from '@/stores/auth'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const applyAuthSession = useAuthStore((s) => s.applyAuthSession)
  const completeOAuth = useAuthStore((s) => s.completeOAuth)
  const started = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    async function finish() {
      try {
        const fromCookie = await api.oauthFinish().catch(() => null)
        if (fromCookie?.token && fromCookie.user) {
          const path = applyAuthSession(fromCookie.token, fromCookie.user)
          navigate(path, { replace: true })
          return
        }

        const token = searchParams.get('token')
        if (!token) {
          setFailed(true)
          return
        }
        const path = await completeOAuth(token)
        navigate(path, { replace: true })
      } catch {
        setFailed(true)
      }
    }

    void finish()
  }, [applyAuthSession, completeOAuth, navigate, searchParams])

  if (failed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-4 text-red-600">{t('auth.oauthFailed')}</p>
        <Link to="/login" className="font-bold text-primary hover:underline">
          {t('auth.oauthBackToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
