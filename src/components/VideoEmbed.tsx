import { useEffect, useRef } from 'react'

function isEmbeddableVideo(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url)
}

type VideoEmbedProps = {
  src: string
  title: string
  className?: string
  startSeconds?: number
  onSavePosition?: (seconds: number) => void
}

export function VideoEmbed({ src, title, className, startSeconds = 0, onSavePosition }: VideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSaved = useRef(0)

  useEffect(() => {
    const el = videoRef.current
    if (!el || isEmbeddableVideo(src) || startSeconds <= 0) return
    const apply = () => {
      if (el.readyState >= 1) {
        el.currentTime = startSeconds
      }
    }
    apply()
    el.addEventListener('loadedmetadata', apply)
    return () => el.removeEventListener('loadedmetadata', apply)
  }, [src, startSeconds])

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-bg text-muted ${className ?? 'aspect-video w-full'}`}>
        Video unavailable
      </div>
    )
  }
  if (isEmbeddableVideo(src)) {
    return (
      <iframe
        src={src}
        title={title}
        className={className ?? 'aspect-video w-full'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <video
      ref={videoRef}
      src={src}
      controls
      className={className ?? 'aspect-video w-full bg-black'}
      title={title}
      onTimeUpdate={(e) => {
        if (!onSavePosition) return
        const sec = Math.floor(e.currentTarget.currentTime)
        if (sec - lastSaved.current >= 8) {
          lastSaved.current = sec
          onSavePosition(sec)
        }
      }}
      onPause={(e) => {
        if (onSavePosition) {
          onSavePosition(Math.floor(e.currentTarget.currentTime))
        }
      }}
    />
  )
}
