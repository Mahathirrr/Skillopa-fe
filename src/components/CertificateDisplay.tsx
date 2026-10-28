import { forwardRef } from 'react'

import type { Certificate } from '@/api/types'
import { SkillopaLogo } from '@/components/SkillopaLogo'
import { CertificateQr } from '@/components/CertificateQr'
import { CertificateSeal } from '@/components/CertificateSeal'

function formatTotalHours(minutes?: number) {
  if (!minutes || minutes <= 0) return null
  return `${(minutes / 60).toFixed(1)} total hours`
}

function completionDate(cert: Certificate) {
  const raw = cert.completed_at ?? cert.issued_at
  return new Date(raw).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type Props = {
  cert: Certificate
  verifyHref?: string
  className?: string
}

export const CertificateDisplay = forwardRef<HTMLElement, Props>(function CertificateDisplay(
  { cert, verifyHref, className },
  ref,
) {
  const hours = formatTotalHours(cert.total_duration_minutes)
  const verifyPath = verifyHref
    ? (() => {
        try {
          const u = new URL(verifyHref)
          return `${u.host}${u.pathname}`
        } catch {
          return verifyHref
        }
      })()
    : null

  return (
    <article
      ref={ref}
      data-certificate-sheet
      className={`certificate-document relative mx-auto w-full max-w-[920px] overflow-hidden bg-[#fafafa] shadow-[0_12px_48px_rgba(0,0,0,0.18)] print:overflow-visible ${className ?? ''}`}
      style={{ aspectRatio: '297 / 210', width: '100%', maxWidth: '920px' }}
    >
      {/* Bingkai luar */}
      <div className="absolute inset-3 border border-[#5624d0]/25 bg-white sm:inset-4">
        <div className="absolute inset-2 border border-[#5624d0]/12" aria-hidden />

        {/* Watermark: ukuran tetap (bukan fill box), supaya PDF = web dan tidak mendominasi */}
        <div
          data-certificate-watermark
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          aria-hidden
        >
          <SkillopaLogo
            className="certificate-document__watermark h-auto w-[min(34%,260px)] max-h-[38%] object-contain opacity-[0.045]"
            alt=""
          />
        </div>

        {/* Sudut dekoratif */}
        <svg className="absolute left-3 top-3 h-8 w-8 text-[#5624d0]/35" viewBox="0 0 32 32" aria-hidden>
          <path fill="none" stroke="currentColor" strokeWidth="1.2" d="M2 14V2h12" />
        </svg>
        <svg className="absolute right-3 top-3 h-8 w-8 scale-x-[-1] text-[#5624d0]/35" viewBox="0 0 32 32" aria-hidden>
          <path fill="none" stroke="currentColor" strokeWidth="1.2" d="M2 14V2h12" />
        </svg>
        <svg className="absolute bottom-3 left-3 h-8 w-8 scale-y-[-1] text-[#5624d0]/35" viewBox="0 0 32 32" aria-hidden>
          <path fill="none" stroke="currentColor" strokeWidth="1.2" d="M2 14V2h12" />
        </svg>
        <svg
          className="absolute bottom-3 right-3 h-8 w-8 scale-[-1] text-[#5624d0]/35"
          viewBox="0 0 32 32"
          aria-hidden
        >
          <path fill="none" stroke="currentColor" strokeWidth="1.2" d="M2 14V2h12" />
        </svg>

        <div className="relative z-10 flex h-full min-h-0 flex-col px-6 py-5 sm:px-10 sm:py-7">
          <header className="flex items-start justify-between gap-4 overflow-visible border-b border-border pb-4 pt-0.5">
            <div className="flex items-center gap-2.5 overflow-visible" data-certificate-header-logo>
              <SkillopaLogo className="box-content h-9 w-9 shrink-0 p-0.5 object-contain sm:h-10 sm:w-10" />
              <div className="leading-none">
                <span className="text-lg font-extrabold tracking-tight text-[#5624d0] sm:text-xl">skillopa</span>
              </div>
            </div>
            <div className="text-right text-[10px] leading-snug text-muted sm:text-[11px]">
              <p className="font-semibold uppercase tracking-wider text-ink-muted">Certificate ID</p>
              <p className="font-mono text-xs font-semibold text-ink sm:text-sm">{cert.certificate_code}</p>
              {verifyPath ? (
                <p className="mt-1.5 max-w-[200px] text-[10px]">
                  {verifyHref ? (
                    <a href={verifyHref} className="text-primary hover:underline">
                      {verifyPath}
                    </a>
                  ) : (
                    verifyPath
                  )}
                </p>
              ) : null}
            </div>
          </header>

          <div className="flex flex-1 flex-col pt-5 sm:pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted">
              Certificate of completion
            </p>

            <h1 className="certificate-document__course mt-2 line-clamp-3 text-xl font-extrabold leading-tight text-ink sm:text-2xl lg:text-[1.65rem]">
              {cert.course_title}
            </h1>

            {cert.instructor_name ? (
              <p className="mt-3 text-[13px] text-muted sm:text-sm">
                Instructors{' '}
                <span className="font-bold text-ink">{cert.instructor_name}</span>
              </p>
            ) : null}

            <div className="mt-5 flex-1">
              <p className="text-[13px] text-muted">This is to certify that</p>
              <p className="certificate-document__name mt-1 text-[1.65rem] font-bold text-ink sm:text-[2rem]">
                {cert.user_name}
              </p>
            </div>

            <div className="cert-sheet-footer mt-4 grid grid-cols-1 gap-6 border-t border-border pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div className="space-y-3 text-[12px] sm:text-[13px]">
                <p className="text-muted">
                  <span className="font-semibold text-ink-muted">Date</span>{' '}
                  {completionDate(cert)}
                </p>
                {hours ? (
                  <p className="text-muted">
                    <span className="font-semibold text-ink-muted">Length</span> {hours}
                  </p>
                ) : null}
              </div>

              <div className="flex items-end justify-center gap-3 sm:flex-col sm:gap-2">
                {verifyHref ? <CertificateQr value={verifyHref} size={64} /> : null}
                <CertificateSeal className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" code={cert.certificate_code} />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 sm:gap-4 sm:text-right">
                {cert.instructor_name ? (
                  <div>
                    <div className="mb-1 border-b border-ink/30 pb-0.5 font-serif text-sm italic text-ink">
                      {cert.instructor_name.split(',')[0]?.trim() ?? cert.instructor_name}
                    </div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Course instructor</p>
                  </div>
                ) : null}
                <div className={cert.instructor_name ? '' : 'sm:col-span-2'}>
                  <div className="mb-1 border-b border-ink/30 pb-0.5 font-serif text-sm italic text-ink">
                    Skillopa
                  </div>
                  <p className="text-[10px] uppercase tracking-wide text-muted">Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})
