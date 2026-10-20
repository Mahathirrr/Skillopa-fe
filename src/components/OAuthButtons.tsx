import { useTranslation } from 'react-i18next'

import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

type OAuthButtonsProps = {
  referralCode?: string
  className?: string
}

function oauthHref(base: string, referralCode?: string) {
  if (!referralCode) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}referral_code=${encodeURIComponent(referralCode)}`
}

export function OAuthButtons({ referralCode, className }: OAuthButtonsProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('grid gap-2.5', className)}>
      <a
        href={oauthHref(api.googleOAuthUrl(), referralCode)}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-bg"
      >
        <GoogleIcon />
        <span>{t('auth.oauthGoogle')}</span>
      </a>
      <a
        href={oauthHref(api.githubOAuthUrl(), referralCode)}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#24292f] bg-[#24292f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b1f23]"
      >
        <GitHubIcon />
        <span>{t('auth.oauthGithub')}</span>
      </a>
    </div>
  )
}

export function AuthDivider() {
  const { t } = useTranslation()

  return (
    <div className="relative my-5 text-center text-xs text-muted">
      <span className="relative z-10 bg-surface px-3">{t('auth.orEmail')}</span>
      <div className="absolute inset-x-0 top-1/2 border-t border-border" />
    </div>
  )
}
