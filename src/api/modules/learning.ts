import { request } from '@/api/client'
import type {
  Assignment,
  AssignmentSubmission,
  Bookmark,
  Enrollment,
  LectureNote,
  ProgressResponse,
  QuizAttempt,
  QuizQuestion,
  QuizSubmitResult,
} from '@/api/types'

export const learningApi = {
  listEnrollments(token: string) {
    return request<{ enrollments: Enrollment[] }>('/enrollments', { token })
  },

  enrollFree(token: string, courseId: number) {
    return request<{ enrollment: Enrollment }>(`/enrollments/${courseId}`, { method: 'POST', token })
  },

  getProgress(token: string, courseId: number) {
    return request<ProgressResponse>(`/enrollments/${courseId}/progress`, { token })
  },

  updateProgress(token: string, courseId: number, data: { lecture_id: number }) {
    return request<ProgressResponse>(`/enrollments/${courseId}/progress`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  saveVideoPosition(token: string, courseId: number, lectureId: number, seconds: number) {
    return request<{ message: string }>(`/enrollments/${courseId}/progress/video`, {
      method: 'PUT',
      body: { lecture_id: lectureId, seconds },
      token,
    })
  },

  getQuiz(token: string, lectureId: number) {
    return request<{ questions: QuizQuestion[] }>(`/lectures/${lectureId}/quiz`, { token })
  },

  submitQuiz(token: string, lectureId: number, answers: { question_id: number; option_id: number }[]) {
    return request<QuizSubmitResult>(`/lectures/${lectureId}/quiz/submit`, {
      method: 'POST',
      body: { answers },
      token,
    })
  },

  getQuizAttempts(token: string, lectureId: number) {
    return request<{ attempts: QuizAttempt[] }>(`/lectures/${lectureId}/quiz/attempts`, { token })
  },

  getAssignment(token: string, lectureId: number) {
    return request<{ assignment: Assignment; submission?: AssignmentSubmission }>(
      `/assignments/lecture/${lectureId}`,
      { token },
    )
  },

  submitAssignment(token: string, assignmentId: number, content: string, fileUrl?: string) {
    return request<{ submission: AssignmentSubmission }>(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: { content, file_url: fileUrl },
      token,
    })
  },

  listBookmarks(token: string, courseId?: number) {
    const qs = courseId ? `?course_id=${courseId}` : ''
    return request<{ bookmarks: Bookmark[] }>(`/bookmarks${qs}`, { token })
  },

  createBookmark(token: string, lectureId: number, timestampSeconds: number, note?: string) {
    return request<{ bookmark: Bookmark }>('/bookmarks', {
      method: 'POST',
      body: { lecture_id: lectureId, timestamp_seconds: timestampSeconds, note },
      token,
    })
  },

  deleteBookmark(token: string, bookmarkId: number) {
    return request<void>(`/bookmarks/${bookmarkId}`, { method: 'DELETE', token })
  },

  getLectureNote(token: string, lectureId: number) {
    return request<{ note: LectureNote | null }>(`/lectures/${lectureId}/notes`, { token })
  },

  saveLectureNote(token: string, lectureId: number, content: string, timestampSeconds?: number) {
    return request<{ note: LectureNote }>(`/lectures/${lectureId}/notes`, {
      method: 'PUT',
      body: { content, timestamp_seconds: timestampSeconds ?? 0 },
      token,
    })
  },

  getLecturePlayback(lectureId: number, token?: string | null) {
    return request<{ provider: string; video_id: string; start_seconds: number; origin: string }>(
      `/lectures/${lectureId}/playback`,
      { token: token ?? undefined },
    )
  },

  setLectureDuration(token: string, lectureId: number, durationSeconds: number) {
    return request<void>(`/lectures/${lectureId}/duration`, {
      method: 'PATCH',
      body: { duration_seconds: durationSeconds },
      token,
    })
  },

  reportLecturePlayerError(token: string, lectureId: number, errorCode: number) {
    return request<void>(`/lectures/${lectureId}/player-error`, {
      method: 'POST',
      body: { error_code: errorCode },
      token,
    })
  },
}
