import type { RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { lazyPage } from '@/router/lazy'

const InstructorDashboardPage = lazyPage(() =>
  import('@/pages/instructor/InstructorDashboardPage').then((m) => ({ default: m.InstructorDashboardPage })),
)
const InstructorAnalyticsPage = lazyPage(() =>
  import('@/pages/instructor/InstructorAnalyticsPage').then((m) => ({ default: m.InstructorAnalyticsPage })),
)
const InstructorStudentsPage = lazyPage(() =>
  import('@/pages/instructor/InstructorStudentsPage').then((m) => ({ default: m.InstructorStudentsPage })),
)
const AnnouncementsPage = lazyPage(() =>
  import('@/pages/instructor/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })),
)
const InstructorCoursesPage = lazyPage(() =>
  import('@/pages/instructor/InstructorCoursesPage').then((m) => ({ default: m.InstructorCoursesPage })),
)
const CourseFormPage = lazyPage(() =>
  import('@/pages/instructor/CourseFormPage').then((m) => ({ default: m.CourseFormPage })),
)
const CurriculumBuilderPage = lazyPage(() =>
  import('@/pages/instructor/CurriculumBuilderPage').then((m) => ({ default: m.CurriculumBuilderPage })),
)
const QuizBuilderPage = lazyPage(() =>
  import('@/pages/instructor/QuizBuilderPage').then((m) => ({ default: m.QuizBuilderPage })),
)

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
