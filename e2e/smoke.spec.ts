import { expect, test } from '@playwright/test'

test.describe('Skillopa smoke', () => {
  test('home shows catalog entry point', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /explore|jelajahi/i }).first()).toBeVisible()
  })

  test('catalog page loads', async ({ page }) => {
    await page.goto('/courses')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('login form renders', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })
})
