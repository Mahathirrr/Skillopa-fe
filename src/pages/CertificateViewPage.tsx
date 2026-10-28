import { useQuery } from '@tanstack/react-query'
import { Check, Copy, Download, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { CertificateDisplay } from '@/components/CertificateDisplay'
import { buildShareChannels, ShareBrandIconRow } from '@/components/ShareBrandIcons'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { copyText } from '@/lib/copy-text'
import { downloadCertificatePdf } from '@/lib/download-certificate-pdf'

export function CertificateViewPage() {
  const { code } = useParams<{ code: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const sheetRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['certificate-view', code],
    queryFn: () => api.verifyCertificate(code!),
    enabled: !!code,
    retry: false,
  })

  const cert = data?.certificate
  const valid = data?.valid !== false && cert

  const pageUrl =
    typeof window !== 'undefined' && code
      ? `${window.location.origin}/certificates/view/${code}`
      : ''

  const shareMessage =
    cert?.user_name && cert?.course_title
      ? `${cert.user_name} menyelesaikan kursus "${cert.course_title}" di Skillopa.`
      : ''
  const shareChannels =
    pageUrl && cert?.course_title
      ? buildShareChannels(pageUrl, shareMessage, cert.course_title)
      : []

  async function copyLink() {
    if (!pageUrl) return
    const ok = await copyText(pageUrl)
    setCopied(ok)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function handleDownloadPdf() {
    const el = sheetRef.current
    if (!el || !cert) return
    setDownloading(true)
    setDownloadError(null)
    try {
      const slug = (cert.course_title ?? 'sertifikat').replace(/\s+/g, '-').toLowerCase()
      await downloadCertificatePdf(el, `skillopa-${slug}.pdf`)
    } catch (err) {
      console.error('certificate pdf export failed', err)
      setDownloadError('Gagal membuat PDF. Coba lagi sebentar.')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    if (!valid || !cert || searchParams.get('unduh') !== '1') return
    const next = new URLSearchParams(searchParams)
    next.delete('unduh')
    setSearchParams(next, { replace: true })
    const timer = window.setTimeout(() => {
      void handleDownloadPdf()
    }, 800)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- autodownload once from ?unduh=1
  }, [valid, cert?.certificate_code, searchParams])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#1c1d1f] via-[#2d2f31] to-[#1c1d1f] px-4 py-10 lg:px-8">
      {!valid || !cert ? (
        <div className="mx-auto max-w-lg rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-sm">
          <h1 className="text-xl font-bold">Sertifikat tidak ditemukan</h1>
          <p className="mt-2 text-sm text-white/70">
            {error ? 'Gagal memuat sertifikat.' : 'Kode sertifikat tidak valid.'}
          </p>
          {code ? <p className="mt-4 font-mono text-xs text-white/50">{code}</p> : null}
          <Link to="/" className="mt-6 inline-block text-accent hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      ) : (
        <>
          <div className="certificate-chrome mx-auto mb-6 max-w-[920px] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white/80">Sertifikat resmi Skillopa</p>
                <p className="text-xs text-white/50">PDF unduhan sama persis dengan tampilan di bawah</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Tersalin' : 'Salin link'}
                </button>
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void handleDownloadPdf()}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-70"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? 'Menyiapkan…' : 'Unduh PDF'}
                </button>
              </div>
            </div>

            {shareChannels.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Bagikan</span>
                <ShareBrandIconRow channels={shareChannels} variant="dark" compact />
              </div>
            ) : null}

            {downloadError ? (
              <p className="text-center text-sm text-red-300">{downloadError}</p>
            ) : null}
          </div>

          <CertificateDisplay ref={sheetRef} cert={cert} verifyHref={pageUrl} />

          <p className="certificate-chrome mx-auto mt-6 max-w-[920px] text-center text-xs text-white/45">
            <Link to={`/certificates/verify/${cert.certificate_code}`} className="hover:text-white/70">
              Halaman verifikasi publik
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
