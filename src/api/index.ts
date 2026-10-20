export * from '@/api/types'
export { API_URL, API_ORIGIN, UPLOAD_BASE, request } from '@/api/client'
export { mediaUrl, resolveLectureVideoSrc } from '@/api/media'
export { buildCourseQuery } from '@/api/query'

import { adminApi } from '@/api/modules/admin'
import { authApi } from '@/api/modules/auth'
import { catalogApi } from '@/api/modules/catalog'
import { commerceApi } from '@/api/modules/commerce'
import { communityApi } from '@/api/modules/community'
import { instructorApi } from '@/api/modules/instructor'
import { learningApi } from '@/api/modules/learning'
import { platformApi } from '@/api/modules/platform'

export const api = {
  ...authApi,
  ...catalogApi,
  ...instructorApi,
  ...learningApi,
  ...commerceApi,
  ...communityApi,
  ...adminApi,
  ...platformApi,
}
