import { useQuery } from '@tanstack/react-query'
import { Award, CheckCircle, XCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

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

  const valid = data?.valid && data.certificate

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
      <div className="rounded border border-border bg-surface p-8 text-center shadow-sm">
        {valid && data.certificate ? (
          <>
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h1 className="mb-2 text-2xl font-bold text-green-800">Certificate verified</h1>
            <p className="mb-6 text-muted">This certificate is authentic and was issued by Skillopa.</p>
            <div className="mx-auto max-w-sm rounded bg-bg p-6 text-left">
              <div className="mb-4 flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-bold">{data.certificate.course_title}</p>
                  <p className="text-sm text-muted">Awarded to {data.certificate.user_name}</p>
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Certificate ID</dt>
                  <dd className="font-mono font-semibold">{data.certificate.certificate_code}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Issued</dt>
                  <dd>{new Date(data.certificate.issued_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold">Certificate not found</h1>
            <p className="mb-6 text-muted">
              {data?.message ?? (error ? 'Unable to verify this certificate.' : 'Invalid certificate code.')}
            </p>
            {code && (
              <p className="mb-4 font-mono text-sm text-muted">Code: {code}</p>
            )}
          </>
        )}
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}
