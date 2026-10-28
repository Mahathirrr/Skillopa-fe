/** Parse mm:ss or h:mm:ss → seconds */
export function parseClock(raw: string): number | null {
  const t = raw.trim()
  if (!t) return 0
  const parts = t.split(':').map((p) => p.trim())
  if (parts.length < 2 || parts.length > 3) return null
  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return null
  if (parts.length === 2) {
    const [m, s] = nums
    if (s >= 60) return null
    return m * 60 + s
  }
  const [h, m, s] = nums
  if (m >= 60 || s >= 60) return null
  return h * 3600 + m * 60 + s
}

export function formatClock(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export type SegmentPart = {
  title: string
  start: string
  end: string
}

export function partsToPayload(parts: SegmentPart[]) {
  return parts.map((p) => {
    const startSeconds = parseClock(p.start) ?? 0
    const endRaw = parseClock(p.end)
    const endSeconds = endRaw === null ? 0 : endRaw
    return {
      title: p.title.trim(),
      start_seconds: startSeconds,
      end_seconds: endSeconds,
    }
  })
}
