import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

type Props = {
  value: string
  size?: number
  className?: string
}

/** QR same-origin (data URL) — aman untuk export PDF. */
export function CertificateQr({ value, size = 64, className }: Props) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: '#1c1d1f', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setSrc(url)
      })
      .catch(() => {
        if (!cancelled) setSrc(null)
      })
    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!src) {
    return (
      <span
        className={`inline-block animate-pulse rounded-sm bg-border ${className ?? ''}`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`rounded-sm border border-border ${className ?? ''}`}
    />
  )
}
