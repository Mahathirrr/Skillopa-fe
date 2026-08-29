export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function friendlyApiMessage(status: number, raw: string): string {
  if (raw) return raw
  switch (status) {
    case 400:
      return 'Invalid request'
    case 401:
      return 'Please sign in to continue'
    case 403:
      return 'You do not have permission'
    case 404:
      return 'Not found'
    case 409:
      return 'Conflict with existing data'
    default:
      return 'Something went wrong'
  }
}
