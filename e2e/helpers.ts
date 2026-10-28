import type { APIRequestContext, Page } from '@playwright/test'

export function apiBaseURL(): string {
  const root = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173'
  return process.env.PLAYWRIGHT_API_URL ?? `${root.replace(/\/$/, '')}/api`
}

export async function registerFreshStudent(request: APIRequestContext): Promise<{
  email: string
  password: string
  token: string
}> {
  const email = `e2e+${Date.now()}@showcaseproject.my.id`
  const password = 'E2eTestPass123!'
  const base = apiBaseURL()

  const reg = await request.post(`${base}/auth/register`, {
    data: { name: 'E2E Student', email, password },
  })
  if (reg.status() === 201) {
    const body = (await reg.json()) as { token: string }
    return { email, password, token: body.token }
  }

  const login = await request.post(`${base}/auth/login`, {
    data: { email, password },
  })
  if (!login.ok()) {
    throw new Error(`register/login failed: ${reg.status()} ${await reg.text()}`)
  }
  const body = (await login.json()) as { token: string }
  return { email, password, token: body.token }
}

export async function loginOnPage(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /log in|masuk/i }).click()
  await page.waitForURL(/\/(my-learning|courses|instructor|admin)/, { timeout: 15_000 })
}

export async function setAuthToken(page: Page, token: string) {
  await page.goto('/')
  await page.evaluate((t) => {
    localStorage.setItem('skillopa_token', t)
  }, token)
  await page.reload()
}
