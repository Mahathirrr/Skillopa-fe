import type { CourseListParams } from '@/api/types'

export function buildCourseQuery(params?: CourseListParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.category_id) search.set('category_id', String(params.category_id))
  if (params.level) search.set('level', params.level)
  if (params.min_price != null) search.set('min_price', String(params.min_price))
  if (params.max_price != null) search.set('max_price', String(params.max_price))
  if (params.min_rating != null) search.set('min_rating', String(params.min_rating))
  if (params.min_duration != null) search.set('min_duration', String(params.min_duration))
  if (params.max_duration != null) search.set('max_duration', String(params.max_duration))
  if (params.sort) search.set('sort', params.sort)
  if (params.limit) search.set('limit', String(params.limit))
  if (params.offset) search.set('offset', String(params.offset))
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
