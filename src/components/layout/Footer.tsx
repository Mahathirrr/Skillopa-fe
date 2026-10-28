import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SkillopaLogo } from '@/components/SkillopaLogo'
import { ROUTES } from '@/lib/routes'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="site-footer mt-auto border-t border-dark-muted bg-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <SkillopaLogo className="h-6 w-6" />
            <h3 className="text-sm font-bold uppercase tracking-wide">Skillopa</h3>
          </div>
          <p className="text-sm text-white/70">{t('footer.tagline')}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">{t('footer.explore')}</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/courses" className="hover:text-white">{t('footer.allCourses')}</Link></li>
            <li><Link to="/courses?level=beginner" className="hover:text-white">{t('footer.beginner')}</Link></li>
            <li><Link to="/courses?level=intermediate" className="hover:text-white">{t('footer.intermediate')}</Link></li>
            <li><Link to="/courses?level=advanced" className="hover:text-white">{t('footer.advanced')}</Link></li>
            <li><Link to="/bundles" className="hover:text-white">{t('nav.bundles')}</Link></li>
            <li><Link to="/subscriptions" className="hover:text-white">{t('nav.subscriptions')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">{t('footer.account')}</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/login" className="hover:text-white">{t('nav.login')}</Link></li>
            <li><Link to="/register" className="hover:text-white">{t('nav.signup')}</Link></li>
            <li><Link to="/my-learning" className="hover:text-white">{t('nav.myLearning')}</Link></li>
            <li><Link to="/certificates" className="hover:text-white">{t('nav.certificates')}</Link></li>
            <li><Link to="/affiliate" className="hover:text-white">{t('nav.affiliate')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">{t('footer.teach')}</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/register" className="hover:text-white">{t('footer.becomeInstructor')}</Link></li>
            <li><Link to="/instructor/dashboard" className="hover:text-white">{t('footer.instructorDashboard')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">{t('footer.legal')}</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to={ROUTES.terms} className="hover:text-white">
                {t('footer.termsOfService')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.privacy} className="hover:text-white">
                {t('footer.privacyPolicy')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-muted px-4 py-4 text-center text-xs text-white/50">
        <p>
          &copy; {new Date().getFullYear()} Skillopa. {t('footer.rights')}
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link to={ROUTES.terms} className="hover:text-white/80 hover:underline">
            {t('footer.termsOfService')}
          </Link>
          <span aria-hidden className="text-white/30">
            ·
          </span>
          <Link to={ROUTES.privacy} className="hover:text-white/80 hover:underline">
            {t('footer.privacyPolicy')}
          </Link>
        </p>
      </div>
    </footer>
  )
}
