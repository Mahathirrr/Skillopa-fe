import { expect, test } from '@playwright/test'

import { apiBaseURL, registerFreshStudent, setAuthToken } from './helpers'

test.describe('Paid checkout', () => {
  test('API E2E: checkout through paid enrollment', async ({ request }) => {
    const base = apiBaseURL()
    const statusRes = await request.get(`${base}/payments/status`)
    expect(statusRes.ok()).toBeTruthy()
    const status = (await statusRes.json()) as {
      enabled: boolean
      sandbox: boolean
      provider: string
      demo_confirm_enabled: boolean
    }
    expect(status.enabled).toBe(true)
    expect(status.sandbox).toBe(true)
    expect(status.provider).toBe('mayar')

    const student = await registerFreshStudent(request)
    const coursesRes = await request.get(`${base}/courses?limit=20`)
    expect(coursesRes.ok()).toBeTruthy()
    const coursesBody = (await coursesRes.json()) as {
      courses: { id: number; is_free: boolean; price: number; slug: string }[]
    }
    const paid = coursesBody.courses.find((c) => !c.is_free && c.price > 0)
    expect(paid).toBeTruthy()

    await request.post(`${base}/cart`, {
      headers: { Authorization: `Bearer ${student.token}` },
      data: { course_id: paid!.id },
    })

    const checkoutRes = await request.post(`${base}/orders/checkout`, {
      headers: { Authorization: `Bearer ${student.token}` },
      data: { course_ids: [paid!.id] },
    })
    expect(checkoutRes.status()).toBe(201)
    const checkout = (await checkoutRes.json()) as {
      order: { id: number; status: string }
      payment_url?: string
    }
    const orderId = checkout.order.id

    expect(checkout.payment_url?.length).toBeGreaterThan(8)
    const sim = await request.post(`${base}/payments/sandbox/orders/${orderId}/simulate`, {
      headers: { Authorization: `Bearer ${student.token}` },
      timeout: 120_000,
    })
    expect(sim.ok()).toBeTruthy()
    const sync = await request.post(`${base}/orders/${orderId}/sync`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    expect(sync.ok()).toBeTruthy()
    const synced = (await sync.json()) as { order: { status: string } }
    expect(synced.order.status).toBe('paid')

    const after = await request.get(`${base}/enrollments`, {
      headers: { Authorization: `Bearer ${student.token}` },
    })
    const afterBody = (await after.json()) as { enrollments: { course_id: number }[] }
    expect(afterBody.enrollments.some((e) => e.course_id === paid!.id)).toBeTruthy()
  })

  test('UI checkout completes to my-learning', async ({ page, request }) => {
    const base = apiBaseURL()
    const statusRes = await request.get(`${base}/payments/status`)
    const status = (await statusRes.json()) as {
      enabled: boolean
      sandbox: boolean
      provider: string
    }
    expect(status.enabled).toBe(true)
    expect(status.provider).toBe('mayar')

    const student = await registerFreshStudent(request)
    await setAuthToken(page, student.token)

    const paidSlug = process.env.E2E_PAID_COURSE_SLUG ?? 'go-web-development-with-fiber'
    await page.goto(`/courses/${paidSlug}`)
    await page.getByRole('button', { name: /add to cart/i }).click()
    await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 10_000 })

    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible()

    await page.getByRole('button', { name: /continue to mayar|lanjut ke pembayaran mayar/i }).click()
    await expect(
      page.getByRole('button', { name: /simulate sandbox|simulasi sandbox/i }),
    ).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /simulate sandbox|simulasi sandbox/i }).click()

    await expect(page).toHaveURL(/\/my-learning/, { timeout: 120_000 })
  })
})
