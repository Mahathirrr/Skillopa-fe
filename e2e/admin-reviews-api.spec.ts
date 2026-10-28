import { expect, test } from '@playwright/test'

import { apiBaseURL, registerFreshStudent } from './helpers'

test('admin hide review via API memperbarui agregat', async ({ request }) => {
  const api = apiBaseURL()
  const adminLogin = await request.post(`${api}/auth/login`, {
    data: { email: 'admin@showcaseproject.my.id', password: 'admin123' },
  })
  expect(adminLogin.ok()).toBeTruthy()
  const adminToken = ((await adminLogin.json()) as { token: string }).token

  const student = await registerFreshStudent(request)
  const slugRes = await request.get(`${api}/courses/belajar-web-pzn-gratis`)
  const { course } = (await slugRes.json()) as { course: { id: number } }

  await request.post(`${api}/enrollments/${course.id}`, {
    headers: { Authorization: `Bearer ${student.token}` },
  })

  const courseDetail = await request.get(`${api}/courses/${course.id}`, {
    headers: { Authorization: `Bearer ${student.token}` },
  })
  const detail = (await courseDetail.json()) as {
    curriculum?: { lectures?: { id: number }[] }[]
  }
  const lectureIds =
    detail.curriculum?.flatMap((s) => s.lectures?.map((l) => l.id) ?? []) ?? []
  for (const lid of lectureIds.slice(0, 3)) {
    await request.put(`${api}/enrollments/${course.id}/progress`, {
      headers: { Authorization: `Bearer ${student.token}` },
      data: { lecture_id: lid },
    })
  }

  const reviewRes = await request.post(`${api}/reviews`, {
    headers: { Authorization: `Bearer ${student.token}` },
    data: { course_id: course.id, rating: 5, comment: `admin-hide-${Date.now()}` },
  })
  expect([200, 201]).toContain(reviewRes.status())
  const reviewBody = (await reviewRes.json()) as { review: { id: number } }
  const reviewId = reviewBody.review.id
  expect(reviewId).toBeGreaterThan(0)

  const hide = await request.post(`${api}/admin/reviews/${reviewId}/hide`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  expect(hide.ok()).toBeTruthy()

  const list = await request.get(`${api}/courses/${course.id}/reviews`)
  const listBody = (await list.json()) as { reviews: { id: number }[] }
  expect(listBody.reviews?.some((r) => r.id === reviewId)).toBeFalsy()
})
