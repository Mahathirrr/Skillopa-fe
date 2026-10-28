import { useMemo, useState } from 'react'

import { youtubeThumbnailCandidates } from '@/lib/youtube'

type Props = {
  videoId?: string
  src?: string
  alt: string
  className?: string
  lazy?: boolean
}

export function YouTubeThumbnail({ videoId, src, alt, className, lazy = true }: Props) {
  const candidates = useMemo(() => {
    if (src) return [src]
    if (videoId) return youtubeThumbnailCandidates(videoId)
    return []
  }, [src, videoId])
  const [idx, setIdx] = useState(0)
  const url = candidates[idx]

  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-bg text-xs text-muted ${className ?? 'aspect-video w-full'}`}
      >
        No thumbnail
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      className={className ?? 'aspect-video w-full object-cover'}
      onError={() => {
        if (idx + 1 < candidates.length) setIdx(idx + 1)
      }}
    />
  )
}
