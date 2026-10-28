import { expect, test } from '@playwright/test'

import { apiBaseURL, registerFreshStudent, setAuthToken } from './helpers'

const COURSE_SLUG = process.env.E2E_PZN_COURSE_SLUG ?? 'belajar-web-pzn-gratis'

test.describe('Kursus gratis PZN (15 video)', () => {
  test('enroll, buka semua section, putar video, selesaikan, sertifikat', async ({
    page,
    request,
  }) => {
    test.setTimeout(180_000)

    const student = await registerFreshStudent(request)
    await setAuthToken(page, student.token)

    const courseRes = await request.get(`${apiBaseURL()}/courses/${COURSE_SLUG}`)
    expect(courseRes.ok()).toBeTruthy()
    const courseBody = (await courseRes.json()) as {
      course: { id: number }
      curriculum: { id: number; lectures?: { id: number; title: string }[] }[]
    }
    const courseId = courseBody.course.id
    const lectures = courseBody.curriculum.flatMap((s) => s.lectures ?? [])
    expect(lectures.length).toBe(15)

    await page.goto(`/courses/${COURSE_SLUG}`)
    await page.getByRole('button', { name: /enroll for free|daftar gratis/i }).click()
    await expect(page).toHaveURL(new RegExp(`/learn/${COURSE_SLUG}`), { timeout: 25_000 })

    for (let i = 0; i < lectures.length; i++) {
      const lec = lectures[i]!
      await page.getByRole('button', { name: lec.title, exact: false }).click()
      const play = page.getByRole('button', { name: /Putar/i }).first()
      await expect(play).toBeVisible({ timeout: 10_000 })
      await play.click()
      await expect(page.locator('iframe').first()).toBeVisible({ timeout: 25_000 })
      const mark = await request.put(`${apiBaseURL()}/enrollments/${courseId}/progress`, {
        headers: { Authorization: `Bearer ${student.token}` },
        data: { lecture_id: lec.id },
      })
      expect(mark.ok()).toBeTruthy()
    }

    const progress = await request.get(`${apiBaseURL()}/enrollments/${courseId}/progress`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    expect(progress.ok()).toBeTruthy()
    const prog = (await progress.json()) as { enrollment?: { progress_percent?: number } }
    expect(prog.enrollment?.progress_percent ?? 0).toBeGreaterThanOrEqual(99)

    const certs = await request.get(`${apiBaseURL()}/certificates`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    expect(certs.ok()).toBeTruthy()
    const certList = (await certs.json()) as { certificates?: { course_id: number }[] }
    expect(certList.certificates?.some((c) => c.course_id === courseId)).toBeTruthy()
  })
})
