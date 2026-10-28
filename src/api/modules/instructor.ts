import { request } from '@/api/client'
import type {
  Course,
  CourseStudent,
  CreateCourseInput,
  CreateLectureInput,
  CreateSectionInput,
  InstructorAnalytics,
  Lecture,
  QuizQuestion,
  QuizQuestionInput,
  Section,
  UpdateCourseInput,
} from '@/api/types'

export const instructorApi = {
  listInstructorCourses(token: string) {
    return request<{ courses: Course[] }>('/courses/instructor/me', { token })
  },

  createCourse(token: string, data: CreateCourseInput) {
    return request<{ course: Course }>('/courses', { method: 'POST', body: data, token })
  },

  updateCourse(token: string, id: number, data: UpdateCourseInput) {
    return request<{ course: Course }>(`/courses/${id}`, { method: 'PUT', body: data, token })
  },

  deleteCourse(token: string, id: number) {
    return request<void>(`/courses/${id}`, { method: 'DELETE', token })
  },

  createSection(token: string, courseId: number, data: CreateSectionInput) {
    return request<{ section: Section }>(`/courses/${courseId}/sections`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateSection(token: string, courseId: number, sectionId: number, data: CreateSectionInput) {
    return request<{ section: Section }>(`/courses/${courseId}/sections/${sectionId}`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  deleteSection(token: string, courseId: number, sectionId: number) {
    return request<void>(`/courses/${courseId}/sections/${sectionId}`, { method: 'DELETE', token })
  },

  createLecture(token: string, courseId: number, sectionId: number, data: CreateLectureInput) {
    return request<{ lecture: Lecture }>(`/courses/${courseId}/sections/${sectionId}/lectures`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateLecture(
    token: string,
    courseId: number,
    sectionId: number,
    lectureId: number,
    data: CreateLectureInput,
  ) {
    return request<{ lecture: Lecture }>(
      `/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
      { method: 'PUT', body: data, token },
    )
  },

  deleteLecture(token: string, courseId: number, sectionId: number, lectureId: number) {
    return request<void>(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`, {
      method: 'DELETE',
      token,
    })
  },

  bulkCreateYouTubeLectures(token: string, courseId: number, sectionId: number, links: string) {
    return request<{ lectures: Lecture[] }>(
      `/courses/${courseId}/sections/${sectionId}/lectures/youtube-bulk`,
      { method: 'POST', body: { links }, token },
    )
  },

  createYouTubeSegments(
    token: string,
    courseId: number,
    sectionId: number,
    body: { youtube_url: string; is_preview?: boolean; parts: { title: string; start_seconds: number; end_seconds: number }[] },
  ) {
    return request<{ lectures: Lecture[] }>(
      `/courses/${courseId}/sections/${sectionId}/lectures/youtube-segments`,
      { method: 'POST', body, token },
    )
  },

  refreshLectureYouTube(token: string, lectureId: number) {
    return request<{ lecture: Lecture }>(`/courses/lectures/${lectureId}/youtube/refresh`, {
      method: 'POST',
      token,
    })
  },

  getInstructorAnalytics(token: string) {
    return request<{ analytics: InstructorAnalytics }>('/instructor/analytics', { token })
  },

  listCourseStudents(token: string, courseId: number) {
    return request<{ students: CourseStudent[] }>(`/courses/${courseId}/students`, { token })
  },

  submitCourseForModeration(token: string, courseId: number) {
    return request<{ course: Course }>(`/courses/${courseId}/submit-review`, {
      method: 'POST',
      token,
    })
  },

  setSectionDripSchedule(token: string, sectionId: number, availableAt: string | null) {
    return request<void>(`/drip/sections/${sectionId}`, {
      method: 'PUT',
      body: { available_at: availableAt },
      token,
    })
  },

  setLectureDripSchedule(token: string, lectureId: number, availableAt: string | null) {
    return request<void>(`/drip/lectures/${lectureId}`, {
      method: 'PUT',
      body: { available_at: availableAt },
      token,
    })
  },

  createQuizQuestion(token: string, lectureId: number, data: QuizQuestionInput) {
    return request<{ question: QuizQuestion }>(`/lectures/${lectureId}/quiz/questions`, {
      method: 'POST',
      body: data,
      token,
    })
  },

  updateQuizQuestion(token: string, lectureId: number, questionId: number, data: QuizQuestionInput) {
    return request<{ question: QuizQuestion }>(`/lectures/${lectureId}/quiz/questions/${questionId}`, {
      method: 'PUT',
      body: data,
      token,
    })
  },

  deleteQuizQuestion(token: string, lectureId: number, questionId: number) {
    return request<void>(`/lectures/${lectureId}/quiz/questions/${questionId}`, {
      method: 'DELETE',
      token,
    })
  },
}
