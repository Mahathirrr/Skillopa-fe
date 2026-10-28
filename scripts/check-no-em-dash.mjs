#!/usr/bin/env node
/**
 * Fail if user-facing trees contain em dash (U+2014) or en dash (U+2013).
 * ASCII "--" in CSS BEM / variables is allowed (not scanned in .css for en/em).
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SCAN_DIRS = ['src', 'e2e', 'docs', '.cursor/rules']
const EXT = new Set(['.ts', '.tsx', '.json', '.md', '.mdc'])

function hasEmOrEnDash(text) {
  return /[\u2013\u2014]/.test(text)
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue
      walk(p, out)
    } else if (EXT.has(path.extname(name))) {
      out.push(p)
    }
  }
  return out
}

let failed = false
for (const rel of SCAN_DIRS) {
  const base = path.join(ROOT, rel)
  for (const file of walk(base)) {
    const text = fs.readFileSync(file, 'utf8')
    if (!hasEmOrEnDash(text)) continue
    failed = true
    const relFile = path.relative(ROOT, file)
    const lines = text.split('\n')
    lines.forEach((line, i) => {
      if (hasEmOrEnDash(line)) {
        console.error(`${relFile}:${i + 1}: em/en dash found`)
      }
    })
  }
}

if (failed) {
  console.error('check-no-em-dash: replace U+2013/U+2014 with comma, colon, or hyphen.')
  process.exit(1)
}
console.log('check-no-em-dash: ok')
