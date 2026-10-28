import { expect, test } from '@playwright/test'

import { loginOnPage, registerFreshStudent, setAuthToken } from './helpers'

const FREE_COURSE_SLUG =
  process.env.E2E_FREE_COURSE_SLUG ?? 'introduction-to-programming'

test.describe('Enrollment', () => {
  test('new student enrolls in a free course', async ({ page, request }) => {
    const student = await registerFreshStudent(request)
    await setAuthToken(page, student.token)

    await page.goto(`/courses/${FREE_COURSE_SLUG}`)
    await page.getByRole('button', { name: /enroll for free/i }).click()

    await expect(page).toHaveURL(new RegExp(`/learn/${FREE_COURSE_SLUG}`), {
      timeout: 20_000,
    })
  })

  test('student adds paid course to cart and sees demo checkout', async ({ page, request }) => {
    const student = await registerFreshStudent(request)
    await loginOnPage(page, student.email, student.password)

    const paidSlug =
      process.env.E2E_PAID_COURSE_SLUG ?? 'go-web-development-with-fiber'
    await page.goto(`/courses/${paidSlug}`)
    await page.getByRole('button', { name: /add to cart/i }).click()
    await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 10_000 })

    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible()
    await page.getByRole('button', { name: /place demo order|buat pesanan demo/i }).click()
    await expect(page.getByRole('button', { name: /confirm demo payment|konfirmasi pembayaran demo/i })).toBeVisible({
      timeout: 15_000,
    })

    await page.getByRole('button', { name: /confirm demo payment|konfirmasi pembayaran demo/i }).click()
    await expect(page).toHaveURL(/\/my-learning/, { timeout: 20_000 })
  })
})
