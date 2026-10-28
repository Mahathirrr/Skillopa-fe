export function youtubeThumbnailCandidates(videoId: string): string[] {
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ]
}

export function defaultYoutubeThumbnail(videoId: string): string {
  return youtubeThumbnailCandidates(videoId)[0] ?? ''
}

export type YouTubeIFrameAPI = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string
      playerVars?: Record<string, string | number>
      events?: {
        onReady?: (e: { target: { getDuration: () => number; seekTo?: (s: number, a: boolean) => void } }) => void
        onStateChange?: (e: { data: number }) => void
        onError?: (e: { data: number }) => void
      }
    },
  ) => {
    destroy: () => void
    getCurrentTime: () => number
    getDuration: () => number
    seekTo: (seconds: number, allowSeek: boolean) => void
  }
}

declare global {
  interface Window {
    YT?: YouTubeIFrameAPI
    onYouTubeIframeAPIReady?: () => void
  }
}

let ytReady: Promise<void> | null = null

export function loadYouTubeIframeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (ytReady) return ytReady
  ytReady = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return ytReady
}
