import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { CertificateDisplay } from '@/components/CertificateDisplay'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'

export function CertificateVerifyPage() {
  const { code } = useParams<{ code: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['certificate-verify', code],
    queryFn: () => api.verifyCertificate(code!),
    enabled: !!code,
    retry: false,
  })

  if (isLoading) return <LoadingSpinner />

  const cert = data?.certificate
  const valid = data?.valid !== false && cert

  const viewHref =
    typeof window !== 'undefined'
      ? `${window.location.origin}/certificates/view/${cert?.certificate_code ?? code}`
      : undefined

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-bg to-white px-4 py-12 lg:px-6">
      {valid && cert ? (
        <>
          <div className="mx-auto mb-6 flex max-w-[920px] items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-green-800">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">Sertifikat asli · diterbitkan oleh Skillopa</p>
          </div>
          <CertificateDisplay cert={cert} verifyHref={viewHref} />
          <div className="mx-auto mt-6 max-w-[920px] text-center">
            <Link
              to={`/certificates/view/${cert.certificate_code}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Buka di layar penuh · unduh PDF · bagikan
            </Link>
          </div>
        </>
      ) : (
        <div className="rounded border border-border bg-surface p-8 text-center shadow-sm">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Sertifikat tidak ditemukan</h1>
          <p className="mb-6 text-muted">
            {data?.message ?? (error ? 'Tidak dapat memverifikasi sertifikat.' : 'Kode sertifikat tidak valid.')}
          </p>
          {code && <p className="mb-4 font-mono text-sm text-muted">Code: {code}</p>}
          <Link to="/" className="inline-block text-primary hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      )}
    </div>
  )
}
