import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonClass } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <PageContainer narrow className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('errors.notFoundCode')}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">{t('errors.notFoundTitle')}</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">{t('errors.notFoundBody')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClass('primary', 'md')}>
          {t('errors.backHome')}
        </Link>
        <Link to="/courses" className={buttonClass('secondary', 'md')}>
          {t('nav.explore')}
        </Link>
      </div>
    </PageContainer>
  )
}
