import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AnnouncementsPage } from '@/pages/instructor/AnnouncementsPage'
import { CourseFormPage } from '@/pages/instructor/CourseFormPage'
import { CurriculumBuilderPage } from '@/pages/instructor/CurriculumBuilderPage'
import { InstructorAnalyticsPage } from '@/pages/instructor/InstructorAnalyticsPage'
import { InstructorCoursesPage } from '@/pages/instructor/InstructorCoursesPage'
import { InstructorDashboardPage } from '@/pages/instructor/InstructorDashboardPage'
import { InstructorStudentsPage } from '@/pages/instructor/InstructorStudentsPage'
import { QuizBuilderPage } from '@/pages/instructor/QuizBuilderPage'

export const instructorRoutes: RouteObject = {
  element: <ProtectedRoute instructor />,
  children: [
    { path: 'instructor/dashboard', element: <InstructorDashboardPage /> },
    { path: 'instructor/analytics', element: <InstructorAnalyticsPage /> },
    { path: 'instructor/students', element: <InstructorStudentsPage /> },
    { path: 'instructor/announcements', element: <AnnouncementsPage /> },
    { path: 'instructor/courses', element: <InstructorCoursesPage /> },
    { path: 'instructor/courses/new', element: <CourseFormPage /> },
    { path: 'instructor/courses/:id/edit', element: <CourseFormPage /> },
    { path: 'instructor/courses/:id/curriculum', element: <CurriculumBuilderPage /> },
    {
      path: 'instructor/courses/:courseId/lectures/:lectureId/quiz',
      element: <QuizBuilderPage />,
    },
  ],
}
