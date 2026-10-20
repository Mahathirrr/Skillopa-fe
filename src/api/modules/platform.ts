import { ApiError } from '@/lib/api-error'
import { request, API_URL } from '@/api/client'
import type {
  AffiliateCommission,
  Certificate,
  CertificateVerifyResponse,
  UploadCategory,
  UploadedFile,
} from '@/api/types'

export const platformApi = {
  listCertificates(token: string) {
    return request<{ certificates: Certificate[] }>('/certificates', { token })
  },

  verifyCertificate(code: string) {
    return request<CertificateVerifyResponse>(`/certificates/${code}`)
  },

  certificateDownloadUrl(code: string, token: string) {
    return `${API_URL}/certificates/${code}/download?token=${encodeURIComponent(token)}`
  },

  async downloadCertificate(code: string, token: string) {
    const res = await fetch(`${API_URL}/certificates/${code}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = typeof data.error === 'string' ? data.error : 'Download failed'
      throw new ApiError(msg, res.status)
    }
    return res.blob()
  },

  uploadFile(token: string, file: File, category: UploadCategory) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    return request<{ file: UploadedFile }>('/uploads', { method: 'POST', formData, token })
  },

  getReferralCode(token: string) {
    return request<{ referral_code: string }>('/affiliate/code', { token })
  },

  listAffiliateCommissions(token: string) {
    return request<{ commissions: AffiliateCommission[] }>('/affiliate/commissions', { token })
  },

  subscribePush(token: string, data: { endpoint: string; p256dh: string; auth: string }) {
    return request<{ message: string }>('/push/subscribe', { method: 'POST', body: data, token })
  },

  unsubscribePush(token: string, endpoint: string) {
    return request<{ message: string }>('/push/subscribe', {
      method: 'DELETE',
      body: { endpoint },
      token,
    })
  },
}
