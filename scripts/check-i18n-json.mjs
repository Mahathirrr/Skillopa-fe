#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/i18n')
let failed = false

for (const file of ['en.json', 'id.json']) {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8')
  const topKeys = [...raw.matchAll(/^  "([^"]+)":/gm)].map((m) => m[1])
  const seen = new Set()
  for (const k of topKeys) {
    if (seen.has(k)) {
      console.error(`${file}: duplicate top-level key "${k}"`)
      failed = true
    }
    seen.add(k)
  }
}

if (failed) process.exit(1)
console.log('i18n JSON: no duplicate top-level keys')
