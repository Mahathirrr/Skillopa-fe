import { Play } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { loadYouTubeIframeAPI } from '@/lib/youtube'
import { api } from '@/lib/api'

type Props = {
  lectureId: number
  title: string
  token?: string | null
  isPreview?: boolean
  resumeSeconds?: number
  onSavePosition?: (seconds: number) => void
  onDuration?: (seconds: number) => void
  className?: string
}

const APP_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''

export function YouTubePlayer({
  lectureId,
  title,
  token,
  isPreview = false,
  resumeSeconds = 0,
  onSavePosition,
  onDuration,
  className,
}: Props) {
  const mountId = useId().replace(/:/g, '')
  const [active, setActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [thumbVideoId, setThumbVideoId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const lastSaved = useRef(0)
  const reportedError = useRef(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const playback = await api.getLecturePlayback(lectureId, token)
        if (cancelled) return
        setThumbVideoId(playback.video_id)
      } catch {
        if (!cancelled) {
          setErrorMsg(
            isPreview
              ? 'Preview video tidak dapat dimuat.'
              : 'Video tidak tersedia. Daftar kursus untuk menonton.',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lectureId, token, isPreview])

  const destroyPlayer = useCallback(() => {
    playerRef.current?.destroy()
    playerRef.current = null
  }, [])

  useEffect(() => () => destroyPlayer(), [destroyPlayer])

  async function startPlayback() {
    setActive(true)
    setErrorMsg(null)
    try {
      const playback = await api.getLecturePlayback(lectureId, token)
      await loadYouTubeIframeAPI()
      if (!window.YT?.Player) {
        setErrorMsg('Pemutar YouTube gagal dimuat.')
        return
      }
      const start = resumeSeconds > 0 ? resumeSeconds : playback.start_seconds
      const endCap = playback.end_seconds ?? 0
      destroyPlayer()
      const el = document.getElementById(`yt-player-${mountId}`)
      if (!el) return
      playerRef.current = new window.YT.Player(el, {
        videoId: playback.video_id,
        playerVars: {
          autoplay: 1,
          enablejsapi: 1,
          playsinline: 1,
          origin: playback.origin || APP_ORIGIN,
          start,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            const full = Math.floor(e.target.getDuration())
            let segLen = full
            if (endCap > start && endCap > 0) {
              segLen = endCap - start
            }
            if (segLen > 0 && token && !isPreview) {
              void api.setLectureDuration(token, lectureId, segLen).catch(() => {})
              onDuration?.(segLen)
            }
            if (start > 0) {
              e.target.seekTo?.(start, true)
            }
          },
          onStateChange: (e) => {
            if (!playerRef.current) return
            const t = Math.floor(playerRef.current.getCurrentTime())
            if (endCap > start && t >= endCap) {
              playerRef.current.pauseVideo?.()
              if (onSavePosition) onSavePosition(endCap)
              return
            }
            if (e.data === 0 && onSavePosition) {
              onSavePosition(t)
            }
          },
          onError: (e) => {
            if (!reportedError.current && token) {
              reportedError.current = true
              void api.reportLecturePlayerError(token, lectureId, e.data)
            }
            if (e.data === 101 || e.data === 150) {
              setErrorMsg(
                'Video tidak bisa diputar di Skillopa. Ubah ke Unlisted atau Public dan pastikan embed diizinkan.',
              )
            } else if (e.data === 100) {
              setErrorMsg('Video tidak ditemukan atau privat.')
            } else {
              setErrorMsg('Video tidak dapat diputar.')
            }
          },
        },
      })
      const tick = window.setInterval(() => {
        if (!playerRef.current || !onSavePosition) return
        const sec = Math.floor(playerRef.current.getCurrentTime())
        if (endCap > start && sec >= endCap) {
          playerRef.current.pauseVideo?.()
          onSavePosition(endCap)
          return
        }
        if (sec - lastSaved.current >= 8) {
          lastSaved.current = sec
          onSavePosition(sec)
        }
      }, 2000)
      return () => window.clearInterval(tick)
    } catch {
      setErrorMsg('Gagal memuat video.')
      setActive(false)
    }
  }

  if (errorMsg && !active) {
    return (
      <div className={`flex items-center justify-center bg-black p-6 text-center text-white ${className ?? 'aspect-video w-full'}`}>
        <p className="text-sm">{errorMsg}</p>
      </div>
    )
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => void startPlayback()}
        className={`group relative w-full overflow-hidden bg-black ${className ?? 'aspect-video'}`}
        aria-label={`Putar ${title}`}
      >
        {thumbVideoId ? (
          <img
            src={`https://i.ytimg.com/vi/${thumbVideoId}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center bg-neutral-900 text-white/50">
            Memuat…
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg">
            <Play className="ml-1 h-8 w-8 fill-white text-white" />
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className={className ?? 'aspect-video w-full'}>
      <div id={`yt-player-${mountId}`} className="aspect-video w-full" title={title} />
      {errorMsg && <p className="mt-2 text-center text-sm text-red-200">{errorMsg}</p>}
    </div>
  )
}
