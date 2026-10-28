/** Selaras dengan backend: `validate:"required,min=6"` pada password. */
export const AUTH_MIN_PASSWORD_LENGTH = 6
export const AUTH_MIN_NAME_LENGTH = 2

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isValidEmail(value: string) {
  return EMAIL_RE.test(normalizeEmail(value))
}

export type PasswordCheck = { id: string; ok: boolean }

export function passwordChecks(password: string): PasswordCheck[] {
  return [
    { id: 'length', ok: password.length >= AUTH_MIN_PASSWORD_LENGTH },
    { id: 'letter', ok: /[a-zA-Z]/.test(password) },
    { id: 'number', ok: /\d/.test(password) },
  ]
}

/** Aturan minimum yang diterima API (min 6 karakter). */
export function isPasswordValidForBackend(password: string) {
  return password.length >= AUTH_MIN_PASSWORD_LENGTH
}

export function isRegisterFormValid(input: {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}) {
  return (
    input.name.trim().length >= AUTH_MIN_NAME_LENGTH &&
    isValidEmail(input.email) &&
    isPasswordValidForBackend(input.password) &&
    input.password === input.confirmPassword &&
    input.acceptTerms
  )
}
