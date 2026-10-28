import { expect, test } from '@playwright/test'

const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'

test.describe('Auth flows', () => {
  test('demo student can log in and open My Learning', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(studentEmail)
    await page.getByLabel(/password/i).fill(studentPassword)
    await page.getByRole('button', { name: /log in|masuk/i }).click()

    await expect(page).toHaveURL(/\/my-learning/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('not-a-real-user@example.com')
    await page.getByLabel(/password/i).fill('wrong-password-xyz')
    await page.getByRole('button', { name: /log in|masuk/i }).click()

    await expect(page.getByText(/invalid|salah|credentials/i)).toBeVisible({ timeout: 10_000 })
    await expect(page).toHaveURL(/\/login/)
  })
})
