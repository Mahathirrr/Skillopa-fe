import { expect, test } from '@playwright/test'

import { apiBaseURL, registerFreshStudent } from './helpers'

const FREE_SLUG = process.env.E2E_FREE_COURSE_SLUG ?? 'belajar-web-pzn-gratis'

async function bumpProgressToReview(api: string, token: string, courseId: number) {
  const prog = await fetch(`${api}/enrollments/${courseId}/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const progress = (await prog.json()) as {
    enrollment?: { progress_percent?: number }
    completed_lecture_ids?: number[]
  }
  if ((progress.enrollment?.progress_percent ?? 0) >= 20) return

  const courseRes = await fetch(`${api}/courses/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const courseBody = (await courseRes.json()) as {
    curriculum?: { lectures?: { id: number }[] }[]
  }
  const lectureIds =
    courseBody.curriculum?.flatMap((s) => s.lectures?.map((l) => l.id) ?? []) ?? []
  for (const lid of lectureIds.slice(0, 3)) {
    await fetch(`${api}/enrollments/${courseId}/progress`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lecture_id: lid }),
    })
  }
}

test.describe('Reviews (prod API)', () => {
  test('enrolled student can submit review and sees aggregate', async ({ request }) => {
    const student = await registerFreshStudent(request)
    const api = apiBaseURL()

    const slugRes = await fetch(`${api}/courses/${encodeURIComponent(FREE_SLUG)}`)
    expect(slugRes.ok).toBeTruthy()
    const slugBody = (await slugRes.json()) as { course: { id: number } }
    const courseId = slugBody.course.id

    const enroll = await request.post(`${api}/enrollments/${courseId}`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    expect([201, 409]).toContain(enroll.status())

    await bumpProgressToReview(api, student.token, courseId)

    const comment = `e2e ${Date.now()}`
    const reviewRes = await request.post(`${api}/reviews`, {
      headers: { Authorization: `Bearer ${student.token}` },
      data: { course_id: courseId, rating: 5, comment },
    })
    expect([201, 200]).toContain(reviewRes.status())

    const listRes = await fetch(`${api}/courses/${courseId}/reviews`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    expect(listRes.ok).toBeTruthy()
    const listBody = (await listRes.json()) as {
      reviews?: { comment?: string }[]
      meta?: { rating_count?: number }
    }
    const inList = (listBody.reviews ?? []).some((r) => r.comment?.includes('e2e'))
    expect(inList || (listBody.meta?.rating_count ?? 0) > 0).toBeTruthy()
  })
})
