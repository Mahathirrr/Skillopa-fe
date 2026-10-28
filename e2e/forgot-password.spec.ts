import { expect, test } from '@playwright/test'

import { apiBaseURL } from './helpers'

test.describe('Lupa kata sandi', () => {
  test('status API dan halaman forgot-password', async ({ page, request }) => {
    const statusRes = await request.get(`${apiBaseURL()}/auth/password-reset/status`)
    expect(statusRes.ok()).toBeTruthy()
    const { enabled } = (await statusRes.json()) as { enabled: boolean }

    await page.goto('/forgot-password')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/lupa|forgot/i)

    expect(enabled).toBe(true)
    await page.getByPlaceholder(/@/).fill('ahmad.rizki@student.usk.ac.id')
    await page.getByRole('button', { name: /kirim|send/i }).click()
    await expect(page.getByText(/kotak masuk|inbox|spam/i)).toBeVisible({ timeout: 10_000 })
  })

  test('confirm reset menolak token invalid', async ({ request }) => {
    const res = await request.post(`${apiBaseURL()}/auth/password-reset/confirm`, {
      data: { token: 'invalid-token-xyz', new_password: 'newpass123' },
    })
    expect([400, 404]).toContain(res.status())
  })
})
