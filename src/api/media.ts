import type { Lecture } from '@/api/types'
import { API_ORIGIN, UPLOAD_BASE } from '@/api/client'

export function mediaUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`
  return `${UPLOAD_BASE}/${path.replace(/^\//, '')}`
}

export function resolveLectureVideoSrc(lecture: Lecture): string {
  if (lecture.local_media_path) return mediaUrl(lecture.local_media_path)
  if (lecture.video_url?.startsWith('/uploads')) return mediaUrl(lecture.video_url)
  return lecture.video_url ?? ''
}
