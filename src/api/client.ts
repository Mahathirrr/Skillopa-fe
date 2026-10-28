import { ApiError, friendlyApiMessage } from '@/lib/api-error'

const raw = import.meta.env.VITE_API_URL as string | undefined
export const API_URL = (
  raw !== undefined && raw !== ''
    ? raw
    : import.meta.env.PROD
      ? '/api'
      : 'http://localhost:8080/api'
).replace(/\/$/, '')

export const API_ORIGIN = API_URL.startsWith('/')
  ? typeof window !== 'undefined'
    ? window.location.origin
    : ''
  : API_URL.replace(/\/api\/?$/, '')

export const UPLOAD_BASE = (
  (import.meta.env.VITE_UPLOAD_URL_BASE as string | undefined) || '/uploads'
).replace(/\/$/, '')

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  formData?: FormData
  credentials?: RequestCredentials
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (!options.formData) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials ?? 'same-origin',
    body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  if (!res.ok) {
    const msg =
      typeof data.error === 'string'
        ? data.error
        : typeof data.message === 'string'
          ? data.message
          : ''
    throw new ApiError(friendlyApiMessage(res.status, msg), res.status)
  }
  return data as T
}
