import { Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { api, type UploadCategory, type UploadedFile } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

type UploadFieldProps = {
  category: UploadCategory
  accept?: string
  label?: string
  onUploaded: (file: UploadedFile) => void
  className?: string
}

export function UploadField({ category, accept, label, onUploaded, className }: UploadFieldProps) {
  const { token } = useAuthStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !token) return
    setUploading(true)
    setError('')
    try {
      const res = await api.uploadFile(token, file, category)
      onUploaded(res.file)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || !token}
        className="inline-flex items-center gap-2 rounded border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {label ?? 'Upload file'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
