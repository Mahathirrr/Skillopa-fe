import { expect, test } from '@playwright/test'

import {
  compareCertificateImages,
  hasPdftoppm,
  pdfFirstPageToPng,
} from './helpers/certificate-pdf-visual'

const SAMPLE_CODE = process.env.E2E_CERT_CODE ?? 'SKL-60f89fa7'

test.describe('Unduh sertifikat PDF', () => {
  test('unduh PDF dan visual match dengan tampilan web', async ({ page }) => {
    test.setTimeout(90_000)
    test.skip(!hasPdftoppm(), 'pdftoppm (poppler) diperlukan untuk banding pixel PDF vs web')

    await page.setViewportSize({ width: 980, height: 900 })
    await page.goto(`/certificates/view/${SAMPLE_CODE}`)
    const sheet = page.locator('[data-certificate-sheet]')
    await expect(sheet).toBeVisible({ timeout: 15_000 })

    const webPng = await sheet.screenshot()

    const downloadPromise = page.waitForEvent('download', { timeout: 45_000 })
    await page.getByRole('button', { name: 'Unduh PDF' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i)

    const pdfPath = await download.path()
    expect(pdfPath).toBeTruthy()

    const pdfPng = await pdfFirstPageToPng(pdfPath!)
    const { mismatchRatio, leftInkPdf, leftInkWeb } = await compareCertificateImages(webPng, pdfPng)

    expect(leftInkWeb).toBeGreaterThan(0.015)
    expect(leftInkPdf).toBeGreaterThan(0.015)
    expect(Math.abs(leftInkPdf - leftInkWeb)).toBeLessThan(0.04)
    expect(mismatchRatio).toBeLessThan(0.12)
  })
})
