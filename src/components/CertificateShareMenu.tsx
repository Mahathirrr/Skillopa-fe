import { Check, Copy, Share2, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { buildShareChannels, ShareBrandIconRow } from '@/components/ShareBrandIcons'
import { copyText } from '@/lib/copy-text'

type Props = {
  pageUrl: string
  certTitle: string
  userName: string
  className?: string
}

function shareMessage(userName: string, certTitle: string) {
  return `${userName} menyelesaikan kursus "${certTitle}" di Skillopa.`
}

export function CertificateShareMenu({ pageUrl, certTitle, userName, className }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const message = shareMessage(userName, certTitle)
  const channels = buildShareChannels(pageUrl, message, certTitle)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function doCopy() {
    const ok = await copyText(pageUrl)
    setCopied(ok)
    setStatus(ok ? 'Link disalin ke clipboard' : 'Gagal menyalin — pilih link di bawah')
    window.setTimeout(() => {
      setCopied(false)
      setStatus(null)
    }, 2500)
  }

  async function tryNativeShare(): Promise<'shared' | 'unavailable' | 'failed'> {
    if (!navigator.share) return 'unavailable'
    try {
      await navigator.share({
        title: `Sertifikat Skillopa — ${certTitle}`,
        text: message,
        url: pageUrl,
      })
      setOpen(false)
      return 'shared'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'failed'
      return 'failed'
    }
  }

  async function onShareClick() {
    setStatus(null)
    const result = await tryNativeShare()
    if (result === 'shared') return
    setOpen(true)
  }

  return (
    <div ref={rootRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => void onShareClick()}
        className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
      >
        <Share2 className="h-4 w-4" />
        Bagikan
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Bagikan sertifikat"
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,340px)] rounded-lg border border-border bg-surface p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Bagikan sertifikat</p>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted hover:bg-bg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ShareBrandIconRow
            channels={channels}
            variant="light"
            onNavigate={() => setOpen(false)}
          />

          <button
            type="button"
            onClick={() => void doCopy()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink hover:bg-white"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Link tersalin' : 'Salin link'}
          </button>

          <p className="mt-2 break-all text-center font-mono text-[10px] text-muted">{pageUrl}</p>
          {status ? <p className="mt-2 text-center text-xs text-primary">{status}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
