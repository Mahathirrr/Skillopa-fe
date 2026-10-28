import { expect, test } from '@playwright/test'

const SAMPLE_CODE = process.env.E2E_CERT_CODE ?? 'SKL-60f89fa7'

test.describe('Bagikan sertifikat', () => {
  test('ikon bagikan dan salin link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`/certificates/view/${SAMPLE_CODE}`)
    await expect(page.locator('[data-certificate-sheet]')).toBeVisible()

    await expect(page.getByLabel('Bagikan via WhatsApp')).toBeVisible()
    await page.getByRole('button', { name: 'Salin link' }).click()
    await expect(page.getByRole('button', { name: 'Tersalin' })).toBeVisible({ timeout: 5000 })
  })
})
