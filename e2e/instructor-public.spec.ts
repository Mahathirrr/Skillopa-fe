import { expect, test } from '@playwright/test'

const SLUG = process.env.E2E_INSTRUCTOR_SLUG ?? 'muhammad-mahathir'

test.describe('Profil instruktur publik', () => {
  test('dari halaman kursus ke profil instruktur', async ({ page }) => {
    const courseSlug = process.env.E2E_FREE_COURSE_SLUG ?? 'belajar-web-pzn-gratis'
    await page.goto(`/courses/${courseSlug}`)
    await expect(page.getByRole('link', { name: /lihat profil lengkap|view full profile/i })).toBeVisible({
      timeout: 15_000,
    })
    await page.getByRole('link', { name: /lihat profil lengkap|view full profile/i }).click()
    await expect(page).toHaveURL(new RegExp(`/instructor/`))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
