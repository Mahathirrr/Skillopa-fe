#!/usr/bin/env node
/**
 * Capture UI screenshots for before/after comparison.
 * Usage: node scripts/capture-ui-screenshots.mjs [--base URL] [--out dir] [--tag before|after]
 */
import { mkdirSync } from 'fs'
import { join } from 'path'
import { chromium } from '@playwright/test'

const base =
  process.argv.find((a) => a.startsWith('--base='))?.split('=')[1] ??
  process.env.PLAYWRIGHT_BASE_URL ??
  'https://skillopa.showcaseproject.my.id'
const tag = process.argv.find((a) => a.startsWith('--tag='))?.split('=')[1] ?? 'capture'
const outRoot =
  process.argv.find((a) => a.startsWith('--out='))?.split('=')[1] ??
  join('docs', 'design', 'screenshots', tag)

const routes = [
  { name: 'home', path: '/' },
  { name: 'catalog', path: '/courses' },
  { name: 'course-detail', path: '/courses/html-dasar-pzn' },
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
  { name: 'bundles', path: '/bundles' },
  { name: 'legal-terms', path: '/legal/syarat-layanan' },
  { name: 'legal-privacy', path: '/legal/kebijakan-privasi' },
  { name: 'forgot-password', path: '/forgot-password' },
]

const viewports = [
  { label: '360', width: 360, height: 780 },
  { label: '768', width: 768, height: 1024 },
  { label: '1280', width: 1280, height: 900 },
]

mkdirSync(outRoot, { recursive: true })

const browser = await chromium.launch({ headless: true })
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    locale: 'id-ID',
  })
  const page = await context.newPage()
  for (const route of routes) {
    const url = `${base.replace(/\/$/, '')}${route.path}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(800)
      const file = join(outRoot, `${route.name}-${vp.label}.png`)
      await page.screenshot({ path: file, fullPage: true })
      console.log('ok', file)
    } catch (e) {
      console.error('fail', url, e.message)
    }
  }
  await context.close()
}
await browser.close()
console.log(JSON.stringify({ base, outRoot, tag, routes: routes.length, viewports: viewports.length }))
