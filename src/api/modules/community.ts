import { request } from '@/api/client'
import type {
  Announcement,
  CourseQuestion,
  Notification,
  QuestionAnswer,
} from '@/api/types'

export const communityApi = {
  listCourseQuestions(courseId: number, lectureId?: number, token?: string | null) {
    const search = new URLSearchParams()
    if (lectureId) search.set('lecture_id', String(lectureId))
    const qs = search.toString()
    return request<{ questions: CourseQuestion[] }>(
      `/qa/courses/${courseId}/questions${qs ? `?${qs}` : ''}`,
      { token },
    )
  },

  getCourseQuestion(questionId: number, token?: string | null) {
    return request<{ question: CourseQuestion }>(`/qa/questions/${questionId}`, { token })
  },

  createQuestion(
    token: string,
    courseId: number,
    data: { title: string; body: string; lecture_id?: number },
  ) {
    return request<{ question: CourseQuestion }>(`/qa/questions`, {
      method: 'POST',
      body: { course_id: courseId, ...data },
      token,
    })
  },

  createAnswer(token: string, questionId: number, body: string) {
    return request<{ answer: QuestionAnswer }>(`/qa/questions/${questionId}/answers`, {
      method: 'POST',
      body: { body },
      token,
    })
  },

  upvoteQuestion(token: string, questionId: number) {
    return request<{ question: CourseQuestion }>(`/qa/questions/${questionId}/vote`, {
      method: 'POST',
      body: { vote_type: 'up' },
      token,
    })
  },

  upvoteAnswer(token: string, answerId: number) {
    return request<{ answer: QuestionAnswer }>(`/qa/answers/${answerId}/vote`, {
      method: 'POST',
      body: { vote_type: 'up' },
      token,
    })
  },

  listAnnouncements(token: string, courseId: number) {
    return request<{ announcements: Announcement[] }>(`/announcements/courses/${courseId}`, { token })
  },

  createAnnouncement(token: string, courseId: number, title: string, body: string) {
    return request<{ announcement: Announcement }>(`/announcements`, {
      method: 'POST',
      body: { course_id: courseId, title, body },
      token,
    })
  },

  deleteAnnouncement(token: string, announcementId: number) {
    return request<void>(`/announcements/${announcementId}`, { method: 'DELETE', token })
  },

  listNotifications(token: string) {
    return request<{ notifications: Notification[] }>('/notifications', { token })
  },

  getUnreadNotificationCount(token: string) {
    return request<{ notifications: Notification[] }>('/notifications?unread=true', { token }).then(
      (res) => ({ count: res.notifications?.length ?? 0 }),
    )
  },

  markNotificationRead(token: string, notificationId: number) {
    return request<{ notification: Notification }>(`/notifications/${notificationId}/read`, {
      method: 'POST',
      token,
    })
  },

  markAllNotificationsRead(token: string) {
    return request<{ message: string }>('/notifications/read-all', { method: 'POST', token })
  },

  listLectureDiscussion(lectureId: number, token: string, cursor?: string) {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    return request<{ comments: import('@/api/types').LectureDiscussionComment[]; next_cursor?: string }>(
      `/lectures/${lectureId}/discussion${qs}`,
      { token },
    )
  },

  createLectureDiscussionComment(
    lectureId: number,
    token: string,
    data: { body: string; parent_id?: number; video_timestamp_seconds?: number },
  ) {
    return request<{ comment: import('@/api/types').LectureDiscussionComment }>(
      `/lectures/${lectureId}/discussion`,
      { method: 'POST', body: data, token },
    )
  },
}
