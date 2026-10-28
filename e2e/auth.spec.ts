import { expect, test } from '@playwright/test'

const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'

test.describe('Auth flows', () => {
  test('demo student can log in and open My Learning', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(studentEmail)
    await page.locator('#login-password').fill(studentPassword)
    await page.getByRole('button', { name: /log in|masuk/i }).click()

    await expect(page).toHaveURL(/\/my-learning/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('register new student then lands on My Learning', async ({ page }) => {
    const uniq = `e2e-${Date.now()}@example.com`
    await page.goto('/register')
    await page.getByLabel(/full name|nama lengkap/i).fill('E2E Register')
    await page.getByLabel(/^email$/i).fill(uniq)
    await page.getByLabel(/^password$|^kata sandi$/i).first().fill('TestPass123!')
    await page.getByLabel(/confirm|konfirmasi/i).fill('TestPass123!')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: /sign up|daftar/i }).click()
    await expect(page).toHaveURL(/\/my-learning/, { timeout: 20_000 })
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('not-a-real-user@example.com')
    await page.locator('#login-password').fill('wrong-password-xyz')
    await page.getByRole('button', { name: /log in|masuk/i }).click()

    await expect(page.getByText(/invalid|salah|credentials/i)).toBeVisible({ timeout: 10_000 })
    await expect(page).toHaveURL(/\/login/)
  })
})
