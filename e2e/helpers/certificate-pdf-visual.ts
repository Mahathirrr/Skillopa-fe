import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'

/** Bagian kiri gambar yang bukan putih polos (deteksi PDF geser/kosong). */
export function leftRegionInkRatio(png: PNG, widthFraction = 0.35): number {
  const cutoff = Math.max(1, Math.floor(png.width * widthFraction))
  let ink = 0
  const total = cutoff * png.height
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < cutoff; x++) {
      const i = (png.width * y + x) << 2
      const r = png.data[i]!
      const g = png.data[i + 1]!
      const b = png.data[i + 2]!
      if (r < 248 || g < 248 || b < 248) ink++
    }
  }
  return ink / total
}

export async function pdfFirstPageToPng(pdfPath: string): Promise<Buffer> {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skillopa-cert-'))
  const outBase = path.join(tmp, 'page')
  try {
    execSync(`pdftoppm -png -singlefile -r 144 "${pdfPath}" "${outBase}"`, {
      stdio: 'pipe',
    })
    return fs.readFileSync(`${outBase}.png`)
  } finally {
    fs.rmSync(tmp, { force: true, recursive: true })
  }
}

export async function compareCertificateImages(
  webPng: Buffer,
  pdfPng: Buffer,
): Promise<{ mismatchRatio: number; leftInkWeb: number; leftInkPdf: number }> {
  const pdfMeta = PNG.sync.read(pdfPng)
  const webResized = await sharp(webPng)
    .resize(pdfMeta.width, pdfMeta.height, { fit: 'fill' })
    .png()
    .toBuffer()
  const webMeta = PNG.sync.read(webResized)

  const { width, height } = pdfMeta
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(webMeta.data, pdfMeta.data, diff.data, width, height, {
    threshold: 0.12,
    includeAA: true,
  })

  return {
    mismatchRatio: mismatched / (width * height),
    leftInkWeb: leftRegionInkRatio(webMeta),
    leftInkPdf: leftRegionInkRatio(pdfMeta),
  }
}

export function hasPdftoppm(): boolean {
  try {
    execSync('pdftoppm -v', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
