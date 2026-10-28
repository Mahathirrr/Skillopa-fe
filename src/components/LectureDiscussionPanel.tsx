import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { api } from '@/lib/api'
import type { LectureDiscussionComment } from '@/api/types'

export function LectureDiscussionPanel({
  lectureId,
  token,
  videoSeconds,
}: {
  lectureId: number
  token: string
  videoSeconds?: number
}) {
  const queryClient = useQueryClient()
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['lecture-discussion', lectureId],
    queryFn: () => api.listLectureDiscussion(lectureId, token),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      api.createLectureDiscussionComment(lectureId, token, {
        body,
        parent_id: replyTo ?? undefined,
        video_timestamp_seconds: videoSeconds,
      }),
    onSuccess: () => {
      setBody('')
      setReplyTo(null)
      queryClient.invalidateQueries({ queryKey: ['lecture-discussion', lectureId] })
    },
  })

  const comments: LectureDiscussionComment[] = data?.comments ?? []

  return (
    <div className="mt-4 border-t border-border pt-4">
      <h3 className="mb-2 text-sm font-bold">Diskusi materi</h3>
      {isLoading ? (
        <p className="text-xs text-muted">Memuat...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted">Belum ada komentar.</p>
      ) : (
        <ul className="mb-3 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="rounded bg-bg p-2 text-sm">
              <p className="font-semibold">{c.user_name}</p>
              <p className="whitespace-pre-line">{c.body}</p>
              {c.video_timestamp_seconds != null && (
                <p className="mt-1 text-xs text-primary">@{c.video_timestamp_seconds}s</p>
              )}
              <button
                type="button"
                className="mt-1 text-xs text-primary hover:underline"
                onClick={() => setReplyTo(c.id)}
              >
                Balas
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createMutation.mutate()
        }}
        className="space-y-2"
      >
        {replyTo && (
          <p className="text-xs text-muted">
            Membalas #{replyTo}{' '}
            <button type="button" className="text-primary" onClick={() => setReplyTo(null)}>
              batal
            </button>
          </p>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          required
          placeholder="Tulis komentar..."
          className="w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !body.trim()}
          className="rounded bg-primary px-3 py-1 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          Kirim
        </button>
      </form>
    </div>
  )
}
