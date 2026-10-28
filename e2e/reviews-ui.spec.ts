import { expect, test } from '@playwright/test'

import { apiBaseURL, loginOnPage } from './helpers'

const SLUG = process.env.E2E_FREE_COURSE_SLUG ?? 'belajar-web-pzn-gratis'

test.describe('Ulasan di UI kursus', () => {
  test('section ulasan selaras dengan API (bukan angka hardcode)', async ({ page, request }) => {
    const api = apiBaseURL()
    const slugRes = await request.get(`${api}/courses/${encodeURIComponent(SLUG)}`)
    expect(slugRes.ok()).toBeTruthy()
    const slugBody = (await slugRes.json()) as { course: { id: number } }
    const courseId = slugBody.course.id

    const reviewsRes = await request.get(`${api}/courses/${courseId}/reviews?limit=5`)
    expect(reviewsRes.ok()).toBeTruthy()
    const reviewsBody = (await reviewsRes.json()) as {
      meta?: { rating_avg?: number; rating_count?: number }
    }
    const avg = reviewsBody.meta?.rating_avg ?? 0
    const count = reviewsBody.meta?.rating_count ?? 0

    await page.goto(`/courses/${SLUG}`)
    const section = page.getByTestId('course-reviews-section')
    await expect(section.getByRole('heading', { name: /ulasan peserta|student reviews/i })).toBeVisible({
      timeout: 15_000,
    })

    if (count === 0) {
      await expect(section.getByText(/belum ada ulasan|no reviews yet/i)).toBeVisible()
    } else {
      await expect(section.getByText(avg.toFixed(1))).toBeVisible()
      await expect(section.getByText(/\(\d+\)/).first()).toBeVisible()
    }
  })

  test('admin dapat membuka antrean laporan ulasan', async ({ page }) => {
    await loginOnPage(page, 'admin@showcaseproject.my.id', 'admin123')
    await page.goto('/admin/review-reports')
    await expect(page.getByRole('heading', { name: /laporan ulasan/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/tidak ada laporan pending|review #/i)).toBeVisible()
  })
})
