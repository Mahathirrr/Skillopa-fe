import { create } from 'zustand'

import { api, type User, type UserRole } from '@/lib/api'
import { ApiError } from '@/lib/api-error'

const TOKEN_KEY = 'skillopa_token'

type AuthState = {
  token: string | null
  user: User | null
  loading: boolean
  error: string
  isAuthenticated: boolean
  isInstructor: boolean
  login: (email: string, password: string) => Promise<string>
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<string>
  logout: () => void
  init: () => Promise<void>
  fetchMe: () => Promise<void>
  setUser: (user: User) => void
}

function redirectPathForRole(role: UserRole): string {
  if (role === 'instructor' || role === 'admin') return '/instructor/dashboard'
  return '/my-learning'
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  error: '',
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isInstructor: false,

  async login(email, password) {
    set({ loading: true, error: '' })
    try {
      const res = await api.login(email, password)
      localStorage.setItem(TOKEN_KEY, res.token)
      set({
        token: res.token,
        user: res.user,
        isAuthenticated: true,
        isInstructor: res.user.role === 'instructor' || res.user.role === 'admin',
      })
      return redirectPathForRole(res.user.role)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Login failed'
      set({ error: msg })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  async register(name, email, password, role = 'student') {
    set({ loading: true, error: '' })
    try {
      const res = await api.register(name, email, password, role)
      localStorage.setItem(TOKEN_KEY, res.token)
      set({
        token: res.token,
        user: res.user,
        isAuthenticated: true,
        isInstructor: res.user.role === 'instructor' || res.user.role === 'admin',
      })
      return redirectPathForRole(res.user.role)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Registration failed'
      set({ error: msg })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null, isAuthenticated: false, isInstructor: false, error: '' })
  },

  async fetchMe() {
    const { token } = get()
    if (!token) return
    const res = await api.me(token)
    set({
      user: res.user,
      isInstructor: res.user.role === 'instructor' || res.user.role === 'admin',
    })
  },

  async init() {
    const { token } = get()
    if (!token) return
    try {
      await get().fetchMe()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) get().logout()
    }
  },

  setUser(user) {
    set({ user, isInstructor: user.role === 'instructor' || user.role === 'admin' })
  },
}))

export function useToken() {
  return useAuthStore((s) => s.token)
}
