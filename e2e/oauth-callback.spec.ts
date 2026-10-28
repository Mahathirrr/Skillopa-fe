import { expect, test } from '@playwright/test'

import { apiBaseURL } from './helpers'

const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'

test.describe('OAuth callback handoff', () => {
  test('oauth/finish + /auth/callback logs user in (cookie sesi)', async ({ page, context }) => {
    test.setTimeout(60_000)
    const apiBase = apiBaseURL()

    const loginRes = await context.request.post(`${apiBase}/auth/login`, {
      data: { email: studentEmail, password: studentPassword },
    })
    expect(loginRes.ok()).toBeTruthy()
    const { token } = (await loginRes.json()) as { token: string }
    expect(token.length).toBeGreaterThan(20)

    await context.addCookies([
      {
        name: 'oauth_finish',
        value: token,
        domain: 'skillopa.showcaseproject.my.id',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
    ])

    await page.goto('/auth/callback')
    await expect(page).toHaveURL(/\/my-learning/, { timeout: 20_000 })
  })

  test('oauth/finish without cookie returns 401', async ({ request }) => {
    const res = await request.get(`${apiBaseURL()}/auth/oauth/finish`)
    expect(res.status()).toBe(401)
  })
})
