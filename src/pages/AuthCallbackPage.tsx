import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuthStore } from '@/stores/auth'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const completeOAuth = useAuthStore((s) => s.completeOAuth)
  const token = searchParams.get('token')
  const started = useRef(false)
  const [failed, setFailed] = useState(!token)

  useEffect(() => {
    if (!token || started.current) return
    started.current = true
    completeOAuth(token)
      .then((path) => navigate(path, { replace: true }))
      .catch(() => setFailed(true))
  }, [token, completeOAuth, navigate])

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
