import { YouTubePlayer } from '@/components/YouTubePlayer'
import { VideoEmbed } from '@/components/VideoEmbed'
import type { Lecture } from '@/lib/api'
import { mediaUrl, resolveLectureVideoSrc } from '@/lib/api'

type Props = {
  lecture: Lecture
  title: string
  token?: string | null
}

/** Preview on course detail — supports YouTube ID-only lectures (no embed URL in JSON). */
export function PreviewLecturePlayer({ lecture, title, token }: Props) {
  if (lecture.has_youtube) {
    return (
      <YouTubePlayer
        lectureId={lecture.id}
        title={title}
        token={token}
        isPreview
        className="aspect-video w-full"
      />
    )
  }
  const src = resolveLectureVideoSrc(lecture)
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-bg text-sm text-muted">
        Video preview tidak tersedia
      </div>
    )
  }
  return <VideoEmbed src={src.startsWith('http') ? src : mediaUrl(src)} title={title} className="aspect-video w-full" />
}
