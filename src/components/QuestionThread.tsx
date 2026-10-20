import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { api } from '@/lib/api'

export function QuestionThread({
  question,
  token,
  isAuthenticated,
}: {
  question: { id: number; title: string; body: string; user_name?: string; upvotes: number; answer_count?: number }
  token: string | null
  isAuthenticated: boolean
}) {
  const queryClient = useQueryClient()
  const [answerBody, setAnswerBody] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['question', question.id],
    queryFn: () => api.getCourseQuestion(question.id, token),
    enabled: showAnswers,
  })

  const answerMutation = useMutation({
    mutationFn: () => api.createAnswer(token!, question.id, answerBody),
    onSuccess: () => {
      setAnswerBody('')
      queryClient.invalidateQueries({ queryKey: ['question', question.id] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })

  const upvoteMutation = useMutation({
    mutationFn: () => api.upvoteQuestion(token!, question.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['question', question.id] }),
  })

  const full = data?.question

  return (
    <div className="rounded border border-border bg-surface p-4">
      <h3 className="font-bold">{question.title}</h3>
      <p className="mt-1 text-sm text-muted">{question.body}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span>{question.user_name} · {question.upvotes} upvotes · {question.answer_count ?? 0} answers</span>
        {isAuthenticated && token && (
          <button type="button" onClick={() => upvoteMutation.mutate()} className="font-semibold text-primary hover:underline">
            Helpful
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowAnswers((v) => !v)}
          className="font-semibold text-primary hover:underline"
        >
          {showAnswers ? 'Hide answers' : 'Show answers'}
        </button>
      </div>
      {showAnswers && (
        <>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted">Loading answers...</p>
          ) : (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {(full?.answers ?? []).length === 0 ? (
                <p className="text-sm text-muted">No answers yet.</p>
              ) : (
                full!.answers!.map((a) => (
                  <div key={a.id} className="rounded bg-bg p-3 text-sm">
                    <p className="whitespace-pre-line">{a.body}</p>
                    <p className="mt-1 text-xs text-muted">
                      {a.user_name}{a.is_instructor ? ' · Instructor' : ''} · {a.upvotes} upvotes
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
          {isAuthenticated && token && (
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault()
                answerMutation.mutate()
              }}
            >
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                placeholder="Write an answer..."
                rows={2}
                required
                className="mb-2 w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={answerMutation.isPending}
                className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                Post answer
              </button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
