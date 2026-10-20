import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, isFree?: boolean): string {
  if (isFree || price === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '0 min'
  const m = Math.floor(seconds / 60)
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h > 0) return `${h}h ${rem}m`
  return `${m} min`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function courseUrl(slug: string): string {
  return `/courses/${slug}`
}

export function learnUrl(slug: string): string {
  return `/learn/${slug}`
}
