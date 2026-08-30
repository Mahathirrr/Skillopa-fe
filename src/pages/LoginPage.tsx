import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/auth'

export function LoginPage() {
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/my-learning'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')
    try {
      const path = await login(email, password)
      navigate(from !== '/login' ? from : path)
    } catch {
      setLocalError('Invalid email or password')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md rounded border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-dark">Log in to continue</h1>
        <p className="mb-6 text-sm text-muted">
          New to Skillopa?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          {(error || localError) && (
            <p className="text-sm text-red-600">{error || localError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
