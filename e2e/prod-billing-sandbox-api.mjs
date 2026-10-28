#!/usr/bin/env node
const API_BASE = (process.env.API_BASE ?? 'https://skillopa.showcaseproject.my.id/api').replace(/\/$/, '')

function assert(name, ok, detail) {
  if (!ok) {
    console.error('FAIL', name, detail)
    process.exit(1)
  }
  console.log('OK ', name)
}

async function freshStudent() {
  const email = `billing+${Date.now()}@showcaseproject.my.id`
  const password = 'E2eTestPass123!'
  const reg = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Billing E2E', email, password, role: 'student' }),
  })
  if (reg.status === 201) {
    const body = await reg.json()
    return { token: body.token }
  }
  const login = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = await login.json()
  if (!login.ok || !body.token) throw new Error('register/login failed')
  return { token: body.token }
}

async function main() {
  const statusRes = await fetch(`${API_BASE}/payments/status`)
  const status = await statusRes.json()
  assert('payment status', statusRes.ok, status)
  assert('billing enabled', status.enabled === true, status)
  assert('billing sandbox', status.sandbox === true, status)
  assert('provider mayar', status.provider === 'mayar', status)

  const { token } = await freshStudent()
  assert('auth token', !!token, null)

  const coursesRes = await fetch(`${API_BASE}/courses?limit=30`)
  const coursesBody = await coursesRes.json()
  const courses = coursesBody.data ?? coursesBody.courses ?? []
  const paid = courses.find((c) => !c.is_free && Number(c.price) > 0)
  assert('paid course id', paid != null, courses.slice(0, 5))
  const courseId = paid.id

  const checkoutRes = await fetch(`${API_BASE}/orders/checkout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_ids: [courseId] }),
  })
  const checkout = await checkoutRes.json()
  assert('checkout 201', checkoutRes.status === 201, checkout)
  assert('payment url', typeof checkout.payment_url === 'string' && checkout.payment_url.length > 8, checkout)
  const orderId = checkout.order?.id
  assert('order id', !!orderId, checkout.order)

  const simRes = await fetch(`${API_BASE}/payments/sandbox/orders/${orderId}/simulate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(120_000),
  })
  assert('simulate', simRes.ok, `${simRes.status} ${await simRes.text()}`)

  const syncRes = await fetch(`${API_BASE}/orders/${orderId}/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const synced = await syncRes.json()
  assert('sync ok', syncRes.ok, syncRes.status)
  assert('order paid', synced.order?.status === 'paid', synced.order)

  const after = await fetch(`${API_BASE}/enrollments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const afterBody = await after.json()
  assert(
    'enrollment active',
    (afterBody.enrollments ?? []).some((e) => e.course_id === courseId),
    afterBody,
  )

  console.log('\nSkillopa billing sandbox API smoke LULUS.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
