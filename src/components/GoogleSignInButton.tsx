import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { api } from '@/lib/api'

type Props = {
  referralCode?: string
}

export function GoogleSignInButton({ referralCode }: Props) {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['google-oauth-status'],
    queryFn: () => api.googleAuthStatus(),
    staleTime: 60_000,
  })

  const enabled = data?.enabled === true

  function handleClick() {
    if (!enabled) return
    window.location.href = api.googleAuthStartUrl(referralCode)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || !enabled}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface py-3 text-sm font-semibold hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
    >
      <GoogleIcon />
      {t('auth.oauthGoogle')}
    </button>
  )
}
