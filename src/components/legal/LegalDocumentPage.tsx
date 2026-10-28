import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SkillopaLogo } from '@/components/SkillopaLogo'
import type { LegalDocument } from '@/content/legal/types'
import { LEGAL_CONTACT_EMAIL, ROUTES } from '@/lib/routes'

type Props = {
  document: LegalDocument
}

export function LegalDocumentPage({ document }: Props) {
  const { t } = useTranslation()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg">
      <div className="border-b border-border bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to={ROUTES.home} className="inline-flex items-center gap-2 font-semibold text-ink">
            <SkillopaLogo className="h-8 w-8" />
            <span>Skillopa</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to={ROUTES.terms} className="text-muted hover:text-ink">
              {t('legal.navTermsShort')}
            </Link>
            <Link to={ROUTES.privacy} className="text-muted hover:text-ink">
              {t('legal.navPrivacyShort')}
            </Link>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to={ROUTES.home} className="text-sm text-muted hover:text-primary hover:underline">
          {t('legal.backHome')}
        </Link>

        <header className="mt-6 space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{document.title}</h1>
          <p className="text-base leading-relaxed text-muted">{document.description}</p>
          <p className="text-xs text-muted">
            {t('legal.lastUpdated')}: {document.lastUpdated}
          </p>
        </header>

        <article className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                {section.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {section.bullets.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </article>

        <footer className="mt-14 border-t border-border pt-8 text-sm text-muted">
          <p>
            {t('legal.contact')}{' '}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="text-ink underline underline-offset-4 hover:text-primary"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <Link to={ROUTES.terms} className="hover:text-ink hover:underline">
              {t('legal.navTerms')}
            </Link>
            <Link to={ROUTES.privacy} className="hover:text-ink hover:underline">
              {t('legal.navPrivacy')}
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
