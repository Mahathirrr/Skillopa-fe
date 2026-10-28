import { toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'

/** Lebar kartu sertifikat (px), rasio A4 landscape 297:210 */
export const CERT_CAPTURE_W = 920
export const CERT_CAPTURE_H = Math.round((CERT_CAPTURE_W * 210) / 297)
const A4_LANDSCAPE_MM = { w: 297, h: 210 }

async function waitForImages(root: HTMLElement) {
  const imgs = [...root.querySelectorAll('img')]
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) resolve()
          else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }
        }),
    ),
  )
}

function styleCaptureTarget(el: HTMLElement) {
  el.style.width = `${CERT_CAPTURE_W}px`
  el.style.height = `${CERT_CAPTURE_H}px`
  el.style.maxWidth = `${CERT_CAPTURE_W}px`
  el.style.minHeight = `${CERT_CAPTURE_H}px`
  el.style.aspectRatio = 'unset'
  el.style.boxShadow = 'none'
  el.style.overflow = 'visible'
  el.style.margin = '0'
  el.style.padding = '0'
  el.style.transform = 'none'
  el.style.position = 'relative'
  el.style.left = '0'
  el.style.top = '0'
}

/** Pastikan raster export sama dengan CSS di layar (SVG/filter sering beda saat clone). */
function normalizeCloneForRaster(clone: HTMLElement) {
  const watermark = clone.querySelector<HTMLImageElement>('[data-certificate-watermark] img')
  if (watermark) {
    watermark.style.width = '260px'
    watermark.style.height = 'auto'
    watermark.style.maxHeight = '240px'
    watermark.style.objectFit = 'contain'
    watermark.style.opacity = '0.045'
  }

  const headerLogo = clone.querySelector<HTMLImageElement>('[data-certificate-header-logo] img')
  if (headerLogo) {
    headerLogo.style.width = '40px'
    headerLogo.style.height = '40px'
    headerLogo.style.padding = '2px'
    headerLogo.style.boxSizing = 'content-box'
    headerLogo.style.objectFit = 'contain'
  }
}

/**
 * Clone ke (0,0) fixed; html-to-image tidak lagi menangkap offset layout
 * (penyebab PDF kosong kiri + konten nyempil kanan).
 */
async function captureOffscreen(source: HTMLElement): Promise<HTMLCanvasElement> {
  await waitForImages(source)
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

  const wrapper = document.createElement('div')
  wrapper.setAttribute('data-pdf-capture-wrapper', 'true')
  wrapper.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    `width:${CERT_CAPTURE_W}px`,
    `height:${CERT_CAPTURE_H}px`,
    'overflow:hidden',
    'z-index:-99999',
    'opacity:1',
    'pointer-events:none',
    'background:#fafafa',
    'margin:0',
    'padding:0',
  ].join(';')

  const clone = source.cloneNode(true) as HTMLElement
  styleCaptureTarget(clone)
  normalizeCloneForRaster(clone)
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  try {
    await waitForImages(clone)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    return await toCanvas(clone, {
      width: CERT_CAPTURE_W,
      height: CERT_CAPTURE_H,
      pixelRatio: 2,
      backgroundColor: '#fafafa',
      cacheBust: true,
      skipFonts: false,
    })
  } finally {
    wrapper.remove()
  }
}

export async function captureCertificateCanvas(source: HTMLElement): Promise<HTMLCanvasElement> {
  return captureOffscreen(source)
}

/** PDF identik dengan kartu sertifikat di layar (A4 landscape, full bleed). */
export async function downloadCertificatePdf(root: HTMLElement, fileName: string) {
  const canvas = await captureOffscreen(root)

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.94)
  pdf.addImage(imgData, 'JPEG', 0, 0, A4_LANDSCAPE_MM.w, A4_LANDSCAPE_MM.h)
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`)
}
