import { expect, test } from '@playwright/test'

import { apiBaseURL } from './helpers'

const apiBase = apiBaseURL()

test.describe('Google OAuth', () => {
  test('API status enabled on production', async ({ request }) => {
    const res = await request.get(`${apiBase}/auth/google/status`)
    expect(res.ok()).toBeTruthy()
    const body = (await res.json()) as { enabled: boolean; url: string }
    expect(body.enabled).toBe(true)
    expect(body.url).toBe('/api/auth/google/start')
  })

  test('start redirects to Google with oauth_state cookie', async ({ request }) => {
    const res = await request.get(`${apiBase}/auth/google/start`, { maxRedirects: 0 })
    expect([302, 307]).toContain(res.status())
    const loc = res.headers()['location'] ?? ''
    expect(loc).toMatch(/accounts\.google\.com/)
    expect(loc).toContain('client_id=')
    const stateMatch = loc.match(/state=([^&]+)/)
    expect(stateMatch?.[1]).toBeTruthy()
    expect(decodeURIComponent(stateMatch![1]!)).toMatch(/^[a-f0-9]{32}\.[a-f0-9]{64}$/)
    const cookies = res.headers()['set-cookie'] ?? ''
    expect(cookies).toMatch(/oauth_state=/)
  })

  test('login page shows enabled Google button', async ({ page }) => {
    await page.goto('/login')
    const btn = page.getByRole('button', { name: /continue with google|lanjutkan dengan google/i })
    await expect(btn).toBeEnabled({ timeout: 15_000 })
  })
})
