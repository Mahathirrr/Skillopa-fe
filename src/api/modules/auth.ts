import { API_URL, request } from '@/api/client'
import type {
  AuthResponse,
  InstructorProfile,
  User,
  UserRole,
} from '@/api/types'

export const authApi = {
  register(name: string, email: string, password: string, role?: UserRole, referralCode?: string) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: {
        name,
        email,
        password,
        role,
        referral_code: referralCode || undefined,
      },
    })
  },

  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  me(token: string) {
    return request<{ user: User }>('/auth/me', { token })
  },

  getProfile(token: string) {
    return request<{ user: User }>('/users/me', { token })
  },

  updateProfile(
    token: string,
    data: { name: string; avatar_url?: string; headline?: string; bio?: string },
  ) {
    return request<{ user: User }>('/users/me', { method: 'PUT', body: data, token })
  },

  getInstructorProfile(instructorId: number) {
    return request<{ instructor: InstructorProfile }>(`/instructors/${instructorId}`)
  },

  updateInstructorProfile(
    token: string,
    data: { headline?: string; bio?: string; avatar_url?: string },
  ) {
    return request<{ instructor: InstructorProfile }>('/instructor/profile', {
      method: 'PUT',
      body: data,
      token,
    })
  },

  promoteToInstructor(token: string, userId: number) {
    return request<{ user: User }>(`/users/${userId}/promote`, { method: 'POST', token })
  },

  googleAuthStatus() {
    return request<{ enabled: boolean; url?: string }>('/auth/google/status')
  },

  googleAuthStartUrl(referralCode?: string) {
    const q = referralCode ? `?referral_code=${encodeURIComponent(referralCode)}` : ''
    return `${API_URL}/auth/google/start${q}`
  },
}
