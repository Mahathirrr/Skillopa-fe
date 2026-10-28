import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bookmark,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  Play,
  StickyNote,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { VideoEmbed } from '@/components/VideoEmbed'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { YouTubeThumbnail } from '@/components/YouTubeThumbnail'
import { LectureDiscussionPanel } from '@/components/LectureDiscussionPanel'
import { QuestionThread } from '@/components/QuestionThread'
import type { Lecture, Section } from '@/lib/api'
import { api, mediaUrl, resolveLectureVideoSrc } from '@/lib/api'
import { formatDuration } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

type SideTab = 'content' | 'notes' | 'bookmarks' | 'qa'

function LectureNoteEditor({
  initialContent,
  saving,
  onSave,
}: {
  initialContent: string
  saving: boolean
  onSave: (content: string) => void
}) {
  const [noteContent, setNoteContent] = useState(initialContent)

  return (
    <div className="flex flex-1 flex-col p-4">
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Take notes for this lecture..."
        rows={12}
        className="mb-3 flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={() => onSave(noteContent)}
        disabled={saving}
        className="rounded bg-primary py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        Save notes
      </button>
    </div>
  )
}

function QuizPanel({ lectureId, token, onComplete }: { lectureId: number; token: string; onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['quiz', lectureId],
    queryFn: () => api.getQuiz(token, lectureId),
  })

  const submitMutation = useMutation({
    mutationFn: () =>
      api.submitQuiz(
        token,
        lectureId,
        Object.entries(answers).map(([question_id, option_id]) => ({
          question_id: Number(question_id),
          option_id,
        })),
      ),
    onSuccess: (res) => {
      setResult({ score: res.attempt.score, passed: res.attempt.passed })
      if (res.attempt.passed) onComplete()
    },
  })

  if (isLoading) return <p className="p-4 text-sm text-muted">Loading quiz...</p>
  const questions = data?.questions ?? []
  if (questions.length === 0) return <p className="p-4 text-sm text-muted">No quiz for this lecture.</p>

  if (result) {
    return (
      <div className="p-4 text-center">
        <p className={`text-lg font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          Score: {Math.round(result.score)}% — {result.passed ? 'Passed!' : 'Try again'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="rounded border border-border bg-surface p-3">
          <p className="mb-2 text-sm font-semibold">{qi + 1}. {q.question_text}</p>
          <div className="space-y-1">
            {q.options?.map((opt) => (
              <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === opt.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                />
                {opt.option_text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => submitMutation.mutate()}
        disabled={Object.keys(answers).length < questions.length || submitMutation.isPending}
        className="w-full rounded bg-primary py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        Submit quiz
      </button>
    </div>
  )
}

function AssignmentPanel({
  lectureId,
  token,
  onComplete,
}: {
  lectureId: number
  token: string
  onComplete: () => void
}) {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['assignment', lectureId],
    queryFn: () => api.getAssignment(token, lectureId),
  })

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!assignment) throw new Error('No assignment')
      return api.submitAssignment(token, assignment.id, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', lectureId] })
      onComplete()
    },
  })

  if (isLoading) return <p className="p-4 text-sm text-muted">Loading assignment...</p>
  const assignment = data?.assignment
  if (!assignment) return <p className="p-4 text-sm text-muted">No assignment for this lecture.</p>

  const submission = data?.submission

  return (
    <div className="space-y-4 p-4">
      <div className="rounded border border-border bg-surface p-3 text-sm">
        <p className="whitespace-pre-line">{assignment.instructions}</p>
        <p className="mt-2 text-xs text-muted">Max score: {assignment.max_score}</p>
      </div>
      {submission ? (
        <div className="rounded bg-bg p-3 text-sm">
          <p className="mb-1 font-semibold capitalize">Status: {submission.status}</p>
          <p className="whitespace-pre-line text-muted">{submission.content}</p>
          {submission.score != null && (
            <p className="mt-2 font-bold">Score: {submission.score}/{assignment.max_score}</p>
          )}
          {submission.feedback && <p className="mt-2 text-muted">Feedback: {submission.feedback}</p>}
        </div>
      ) : (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your submission..."
            rows={6}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => submitMutation.mutate()}
            disabled={!content.trim() || submitMutation.isPending}
            className="w-full rounded bg-primary py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            Submit assignment
          </button>
        </>
      )}
    </div>
  )
}

function QAPanel({ courseId, lectureId, token, isAuthenticated }: { courseId: number; lectureId?: number; token: string; isAuthenticated: boolean }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['questions', courseId, lectureId],
    queryFn: () => api.listCourseQuestions(courseId, lectureId, token),
  })

  const createMutation = useMutation({
    mutationFn: () => api.createQuestion(token, courseId, { title, body, lecture_id: lectureId }),
    onSuccess: () => {
      setTitle('')
      setBody('')
      queryClient.invalidateQueries({ queryKey: ['questions', courseId] })
    },
  })

  const questions = data?.questions ?? []

  return (
    <div className="space-y-4 p-4">
      {isAuthenticated && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
          className="rounded border border-border bg-surface p-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question title"
            required
            className="mb-2 w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your question..."
            rows={2}
            required
            className="mb-2 w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            Ask question
          </button>
        </form>
      )}
      {questions.length === 0 ? (
        <p className="text-sm text-muted">Belum ada pertanyaan.</p>
      ) : (
        questions.map((q) => (
          <QuestionThread key={q.id} question={q} token={token} isAuthenticated={isAuthenticated} />
        ))
      )}
      {lectureId && (
        <LectureDiscussionPanel lectureId={lectureId} token={token} />
      )}
    </div>
  )
}

export function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>()
  const { token, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null)
  const [sideTab, setSideTab] = useState<SideTab>('content')
  const [bookmarkNote, setBookmarkNote] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', slug, token],
    queryFn: () => api.getCourseBySlug(slug!, token),
    enabled: !!slug,
  })

  const course = data?.course
  const curriculum = data?.curriculum

  useEffect(() => {
    if (!curriculum?.length) return
    setExpandedSections(new Set(curriculum.map((s) => s.id)))
  }, [curriculum])

  const allLectures = useMemo(
    () => (curriculum ?? []).flatMap((s) => s.lectures ?? []),
    [curriculum],
  )

  const { data: progressData } = useQuery({
    queryKey: ['progress', course?.id],
    queryFn: () => api.getProgress(token!, course!.id),
    enabled: !!token && !!course?.id,
  })

  const { data: announcementsData } = useQuery({
    queryKey: ['announcements', course?.id],
    queryFn: () => api.listAnnouncements(token!, course!.id),
    enabled: !!token && !!course?.id,
  })

  const announcements = announcementsData?.announcements ?? []

  const completedIds = useMemo(() => {
    const ids = new Set(progressData?.completed_lecture_ids ?? [])
    progressData?.lecture_progress?.forEach((lp) => {
      if (lp.completed) ids.add(lp.lecture_id)
    })
    return ids
  }, [progressData])

  const progress = progressData?.enrollment?.progress_percent ?? 0

  const { data: noteData } = useQuery({
    queryKey: ['lecture-note', activeLecture?.id],
    queryFn: () => api.getLectureNote(token!, activeLecture!.id),
    enabled: !!token && !!activeLecture?.id,
  })

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks', course?.id],
    queryFn: () => api.listBookmarks(token!, course!.id),
    enabled: !!token && !!course?.id,
  })

  const completeMutation = useMutation({
    mutationFn: (lectureId: number) =>
      api.updateProgress(token!, course!.id, { lecture_id: lectureId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', course!.id] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })

  const saveNoteMutation = useMutation({
    mutationFn: (content: string) => api.saveLectureNote(token!, activeLecture!.id, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lecture-note', activeLecture!.id] }),
  })

  const bookmarkMutation = useMutation({
    mutationFn: () =>
      api.createBookmark(token!, activeLecture!.id, 0, bookmarkNote || undefined),
    onSuccess: () => {
      setBookmarkNote('')
      queryClient.invalidateQueries({ queryKey: ['bookmarks', course!.id] })
    },
  })

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id: number) => api.deleteBookmark(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks', course!.id] }),
  })

  if (isLoading) return <LoadingSpinner />
  if (error || !course) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/my-learning" className="mt-4 inline-block text-primary hover:underline">
          Back to My Learning
        </Link>
      </div>
    )
  }

  const current = activeLecture ?? allLectures.find((l) => !isLectureLocked(l)) ?? allLectures[0] ?? null
  const currentLocked = current ? isLectureLocked(current) : false
  const videoSrc = current ? resolveLectureVideoSrc(current) : ''
  const videoStartSeconds =
    current && progressData?.lecture_progress
      ? (progressData.lecture_progress.find((lp) => lp.lecture_id === current.id)?.video_position_seconds ?? 0)
      : 0

  const saveVideoPosition = (seconds: number) => {
    if (!token || !course || !current) return
    void api.saveVideoPosition(token, course.id, current.id, seconds)
  }
  const bookmarks = bookmarksData?.bookmarks ?? []
  const isQuiz = current?.content_type === 'quiz'
  const isAssignment = current?.content_type === 'assignment'

  function toggleSection(id: number) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function isLectureLocked(lecture: Lecture): boolean {
    if (lecture.is_locked) return true
    if (!lecture.available_at) return false
    return new Date(lecture.available_at) > new Date()
  }

  function selectLecture(lecture: Lecture) {
    if (isLectureLocked(lecture)) return
    setActiveLecture(lecture)
    setSideTab('content')
  }

  function handleMarkComplete() {
    if (!current || !token) return
    completeMutation.mutate(current.id)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
      <div className="flex flex-1 flex-col bg-dark">
        <div className="border-b border-dark-muted px-4 py-3 text-white">
          <Link to={`/courses/${course.slug}`} className="text-sm text-white/70 hover:text-white">
            {course.title}
          </Link>
          {current && (
            <h1 className="mt-1 text-lg font-semibold">{current.title}</h1>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center bg-black">
          {isQuiz && current && token ? (
            <div className="w-full max-w-2xl bg-surface text-dark">
              <QuizPanel
                lectureId={current.id}
                token={token}
                onComplete={() => completeMutation.mutate(current.id)}
              />
            </div>
          ) : isAssignment && current && token ? (
            <div className="w-full max-w-2xl bg-surface text-dark">
              <AssignmentPanel
                lectureId={current.id}
                token={token}
                onComplete={() => completeMutation.mutate(current.id)}
              />
            </div>
          ) : currentLocked ? (
            <div className="max-w-lg p-8 text-center text-white">
              <Lock className="mx-auto mb-4 h-12 w-12 text-accent" />
              <p className="text-lg font-bold">{t('learn.locked')}</p>
              {current?.available_at && (
                <p className="mt-2 text-white/70">
                  {t('learn.availableOn', {
                    date: new Date(current.available_at).toLocaleString(),
                  })}
                </p>
              )}
              <p className="mt-4 text-sm text-white/60">{t('learn.dripMessage')}</p>
            </div>
          ) : current?.has_youtube && current?.id ? (
            <div className="w-full max-w-5xl">
              <YouTubePlayer
                lectureId={current.id}
                title={current.title}
                token={token}
                resumeSeconds={videoStartSeconds}
                onSavePosition={saveVideoPosition}
              />
            </div>
          ) : videoSrc ? (
            <div className="w-full max-w-5xl">
              <VideoEmbed
                src={videoSrc}
                title={current?.title ?? 'Lecture'}
                className="aspect-video w-full"
                startSeconds={videoStartSeconds}
                onSavePosition={saveVideoPosition}
              />
            </div>
          ) : current?.file_url ? (
            <div className="max-w-3xl p-8 text-white">
              <a
                href={mediaUrl(current.file_url)}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Download document
              </a>
            </div>
          ) : current?.text_content ? (
            <div className="max-w-3xl p-8 text-white">
              <p className="whitespace-pre-line">{current.text_content}</p>
            </div>
          ) : (
            <p className="text-white/60">{t('learn.selectLecture')}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-dark-muted bg-dark-muted px-4 py-3 text-white">
          <div className="text-sm">
            Progress: <span className="font-bold text-accent">{Math.round(progress)}%</span>
          </div>
          {current && !isQuiz && !isAssignment && (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={completeMutation.isPending || completedIds.has(current.id)}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold hover:bg-primary-dark disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              {completedIds.has(current.id) ? 'Completed' : 'Mark as complete'}
            </button>
          )}
        </div>
      </div>

      <aside className="flex w-full flex-col border-l border-border bg-surface lg:w-96">
        <div className="flex border-b border-border">
          {([
            ['content', 'Content', Play],
            ['notes', 'Notes', StickyNote],
            ['bookmarks', 'Bookmarks', Bookmark],
            ['qa', 'Q&A', MessageSquare],
          ] as const).map(([tab, label, Icon]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSideTab(tab)}
              className={`flex flex-1 items-center justify-center gap-1 px-2 py-2.5 text-xs font-semibold ${
                sideTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted hover:text-dark'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {sideTab === 'content' && (
          <>
            <div className="border-b border-border px-4 py-3">
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {announcements.length > 0 && (
                <div className="border-b border-border bg-primary/5 p-4">
                  <p className="mb-2 text-xs font-bold uppercase text-primary">Announcements</p>
                  <div className="space-y-3">
                    {announcements.map((a) => (
                      <div key={a.id} className="rounded border border-border bg-surface p-3 text-sm">
                        <p className="font-bold">{a.title}</p>
                        <p className="mt-1 whitespace-pre-line text-muted">{a.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(curriculum ?? []).map((section: Section) => {
                const open = expandedSections.has(section.id) || expandedSections.size === 0
                return (
                  <div key={section.id} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold hover:bg-bg"
                    >
                      {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {section.title}
                    </button>
                    {open &&
                      section.lectures?.map((lecture) => {
                        const locked = isLectureLocked(lecture)
                        return (
                        <button
                          key={lecture.id}
                          type="button"
                          onClick={() => selectLecture(lecture)}
                          disabled={locked}
                          className={`flex w-full items-center gap-2 border-t border-border px-4 py-2.5 pl-6 text-left text-sm hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50 ${
                            current?.id === lecture.id ? 'bg-primary/5 font-semibold text-primary' : ''
                          }`}
                        >
                          {lecture.youtube_thumbnail_url && lecture.content_type === 'video' ? (
                            <YouTubeThumbnail
                              src={lecture.youtube_thumbnail_url}
                              alt=""
                              className="h-10 w-[4.5rem] shrink-0 rounded object-cover"
                            />
                          ) : null}
                          {locked ? (
                            <Lock className="h-3.5 w-3.5 shrink-0 text-muted" />
                          ) : completedIds.has(lecture.id) ? (
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" />
                          ) : lecture.content_type === 'quiz' ? (
                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-muted" />
                          ) : lecture.content_type === 'assignment' ? (
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted" />
                          ) : (
                            <Play className="h-3.5 w-3.5 shrink-0 text-muted" />
                          )}
                          <span className="flex-1 truncate">{lecture.title}</span>
                          <span className="shrink-0 text-xs text-muted">
                            {locked ? t('learn.locked') : formatDuration(lecture.duration_seconds)}
                          </span>
                        </button>
                      )})}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {sideTab === 'notes' && current && token && activeLecture && (
          <LectureNoteEditor
            key={activeLecture.id}
            initialContent={noteData?.note?.content ?? ''}
            saving={saveNoteMutation.isPending}
            onSave={(content) => saveNoteMutation.mutate(content)}
          />
        )}

        {sideTab === 'bookmarks' && token && (
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            {current && (
              <div className="mb-4 rounded border border-border p-3">
                <input
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="Optional note..."
                  className="mb-2 w-full rounded border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => bookmarkMutation.mutate()}
                  disabled={bookmarkMutation.isPending}
                  className="w-full rounded bg-primary py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  Bookmark current position
                </button>
              </div>
            )}
            {bookmarks.length === 0 ? (
              <p className="text-sm text-muted">No bookmarks yet.</p>
            ) : (
              bookmarks.map((b) => (
                <div key={b.id} className="mb-2 flex items-start justify-between rounded border border-border p-2 text-sm">
                  <div>
                    <p className="font-semibold">{b.lecture_title}</p>
                    <p className="text-xs text-muted">
                      {formatDuration(b.timestamp_seconds)}
                      {b.note && ` · ${b.note}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteBookmarkMutation.mutate(b.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {sideTab === 'qa' && token && course && (
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <QAPanel courseId={course.id} lectureId={current?.id} token={token!} isAuthenticated={isAuthenticated} />
          </div>
        )}
      </aside>
    </div>
  )
}
