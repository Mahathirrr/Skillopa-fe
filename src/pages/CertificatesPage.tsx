import { useQuery } from '@tanstack/react-query'
import { Award, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function CertificatesPage() {
  const { token } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => api.listCertificates(token!),
    enabled: !!token,
  })

  const certificates = data?.certificates ?? []

  async function handleDownload(code: string, title: string) {
    if (!token) return
    try {
      const blob = await api.downloadCertificate(code, token)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Download failed')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="mb-2 text-3xl font-bold">Certificates</h1>
      <p className="mb-8 text-muted">Download certificates for completed courses</p>

      {certificates.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <Award className="mx-auto mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-semibold">No certificates yet</p>
          <p className="mt-1 text-sm text-muted">Complete a course to earn your first certificate</p>
          <Link to="/my-learning" className="mt-4 inline-block text-primary hover:underline">
            Go to My Learning
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col gap-4 rounded border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-bold">{cert.course_title}</h3>
                <p className="text-sm text-muted">
                  Issued {new Date(cert.issued_at).toLocaleDateString()} · Code: {cert.certificate_code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(cert.certificate_code, cert.course_title ?? 'course')}
                className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
