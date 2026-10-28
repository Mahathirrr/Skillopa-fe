#!/usr/bin/env node
/** Flag hardcoded hex colors in src (excluding allowed paths). */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const root = join(import.meta.dirname, '..', 'src')
const allow = [/certificate/i, /CertificateDisplay/, /ShareBrandIcons/]
const hexRe = /#([0-9a-fA-F]{3,8})\b/g

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|css)$/.test(name)) out.push(p)
  }
  return out
}

const hits = []
for (const file of walk(root)) {
  if (allow.some((r) => r.test(file))) continue
  const text = readFileSync(file, 'utf8')
  let m
  while ((m = hexRe.exec(text))) {
    hits.push({ file, hex: m[0] })
  }
}

const unique = [...new Map(hits.map((h) => [`${h.file}:${h.hex}`, h])).values()]
console.log(JSON.stringify({ violations: unique.length, sample: unique.slice(0, 30) }, null, 2))
process.exit(unique.length > 40 ? 1 : 0)
