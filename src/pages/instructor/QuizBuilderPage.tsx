import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

type OptionDraft = { option_text: string; is_correct: boolean }

export function QuizBuilderPage() {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<OptionDraft[]>([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
  ])

  const { data, isLoading } = useQuery({
    queryKey: ['quiz-manage', lectureId],
    queryFn: () => api.getQuiz(token!, Number(lectureId)),
    enabled: !!token && !!lectureId,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['quiz-manage', lectureId] })

  const createMutation = useMutation({
    mutationFn: () =>
      api.createQuizQuestion(token!, Number(lectureId), {
        question_text: questionText,
        options: options.map((o, i) => ({ ...o, sort_order: i })),
      }),
    onSuccess: () => {
      setQuestionText('')
      setOptions([
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
      ])
      invalidate()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (questionId: number) =>
      api.deleteQuizQuestion(token!, Number(lectureId), questionId),
    onSuccess: invalidate,
  })

  if (isLoading) return <LoadingSpinner />

  const questions = data?.questions ?? []

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <Link
        to={`/instructor/courses/${courseId}/curriculum`}
        className="text-sm text-primary hover:underline"
      >
        {t('common.back')}
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-bold">{t('instructor.quizBuilder')}</h1>

      <div className="mb-8 space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded border border-border bg-surface p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="font-semibold">
                {qi + 1}. {q.question_text}
              </p>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(q.id)}
                className="text-muted hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1 text-sm text-muted">
              {q.options?.map((opt) => (
                <li key={opt.id} className={opt.is_correct ? 'font-semibold text-primary' : ''}>
                  {opt.option_text}
                  {opt.is_correct && ` (${t('instructor.correct')})`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          createMutation.mutate()
        }}
        className="rounded border border-border bg-surface p-6"
      >
        <h2 className="mb-4 font-bold">{t('instructor.addQuestion')}</h2>
        <div className="mb-4">
          <label htmlFor="qtext" className="mb-1 block text-sm font-semibold">
            {t('instructor.questionText')}
          </label>
          <input
            id="qtext"
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full rounded border border-border px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <p className="mb-2 text-sm font-semibold">{t('instructor.options')}</p>
        <div className="mb-4 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={opt.is_correct}
                onChange={() =>
                  setOptions((prev) =>
                    prev.map((o, j) => ({ ...o, is_correct: j === i })),
                  )
                }
              />
              <input
                value={opt.option_text}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((o, j) => (j === i ? { ...o, option_text: e.target.value } : o)),
                  )
                }
                placeholder={`Option ${i + 1}`}
                required
                className="flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOptions((prev) => [...prev, { option_text: '', is_correct: false }])}
          className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add option
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="block w-full rounded bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {t('instructor.addQuestion')}
        </button>
      </form>
    </div>
  )
}
