import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { UserRole } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export function RegisterPage() {
  const { register, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const path = await register(name, email, password, role)
      navigate(path)
    } catch {
      /* error shown from store */
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md rounded border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-dark">Sign up and start learning</h1>
        <p className="mb-6 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold">
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-semibold">
              I want to
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="student">Learn courses</option>
              <option value="instructor">Teach courses</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}
