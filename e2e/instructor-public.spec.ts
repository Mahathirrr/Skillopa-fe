import { expect, test } from '@playwright/test'

test.describe('Profil instruktur publik', () => {
  test('dari halaman kursus ke profil instruktur', async ({ page }) => {
    const courseSlug = process.env.E2E_FREE_COURSE_SLUG ?? 'belajar-web-pzn-gratis'
    const expectedSlug = process.env.E2E_INSTRUCTOR_SLUG ?? 'muhammad-mahathir-s-kom'
    await page.goto(`/courses/${courseSlug}`)
    const instructorSection = page.locator('section[aria-labelledby="instructor-heading"]')
    await expect(instructorSection).toBeVisible({ timeout: 20_000 })
    const profileLink = instructorSection.locator(`a[href="/instructor/${expectedSlug}"]`).first()
    await expect(profileLink).toBeVisible({ timeout: 10_000 })
    await profileLink.click()
    await expect(page).toHaveURL(new RegExp(`/instructor/${expectedSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
