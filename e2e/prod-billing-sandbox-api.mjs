#!/usr/bin/env node
const API_BASE = (process.env.API_BASE ?? 'https://skillopa.showcaseproject.my.id/api').replace(/\/$/, '')
const EMAIL = process.env.E2E_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const PASSWORD = process.env.E2E_PASSWORD ?? 'student123'

function assert(name, ok, detail) {
  if (!ok) {
    console.error('FAIL', name, detail)
    process.exit(1)
  }
  console.log('OK ', name)
}

async function main() {
  const statusRes = await fetch(`${API_BASE}/payments/status`)
  const status = await statusRes.json()
  assert('payment status', statusRes.ok, status)
  assert('billing enabled', status.enabled === true, status)
  assert('billing sandbox', status.sandbox === true, status)
  assert('provider mayar', status.provider === 'mayar', status)

  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const login = await loginRes.json()
  assert('login', loginRes.ok && login.token, loginRes.status)
  const token = login.token

  const coursesRes = await fetch(`${API_BASE}/courses?limit=20&is_free=false`)
  const coursesBody = await coursesRes.json()
  const courses = coursesBody.data ?? coursesBody.courses ?? []
  assert('paid courses list', courses.length > 0, coursesBody)

  const enrollRes = await fetch(`${API_BASE}/enrollments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const enrollBody = await enrollRes.json()
  const enrolledIds = new Set((enrollBody.enrollments ?? []).map((e) => e.course_id))

  let courseId = null
  for (const c of courses) {
    if (!enrolledIds.has(c.id)) {
      courseId = c.id
      break
    }
  }
  assert('find unenrolled paid course', courseId != null, { enrolledIds: [...enrolledIds] })

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
  const simBody = await simRes.text()
  assert('simulate', simRes.ok, `${simRes.status} ${simBody}`)

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

main()
