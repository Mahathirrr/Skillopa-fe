import { expect, test } from '@playwright/test'

test.describe('Halaman legal', () => {
  test('syarat layanan dan kebijakan privasi dapat dibuka', async ({ page }) => {
    await page.goto('/legal/syarat-layanan')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/syarat|terms/i)
    await expect(page.locator('header').getByText(/Terakhir diperbarui:|Last updated:/i)).toBeVisible()

    await page.goto('/legal/kebijakan-privasi')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/kebijakan|privacy/i)
  })

  test('footer memiliki link legal', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const terms = page.getByRole('link', { name: /syarat layanan|terms of service/i }).first()
    await expect(terms).toBeVisible()
    await terms.click()
    await expect(page).toHaveURL(/\/legal\/syarat-layanan/)
  })
})
