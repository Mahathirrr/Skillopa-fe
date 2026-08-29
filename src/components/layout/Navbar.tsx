import {
  BookOpen,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/auth'

export function Navbar() {
  const { isAuthenticated, isInstructor, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/courses?q=${encodeURIComponent(query.trim())}`)
      setMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-dark-muted bg-dark text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <GraduationCap className="h-7 w-7 text-accent" />
          <span className="hidden text-lg sm:inline">Skillopa</span>
        </Link>

        <button
          type="button"
          className="rounded p-1 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <form onSubmit={handleSearch} className="hidden flex-1 lg:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for courses"
              className="w-full rounded-full border border-transparent bg-white py-2 pl-10 pr-4 text-sm text-dark outline-none focus:border-accent"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/courses"
            className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted"
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-learning"
                className="flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted"
              >
                <BookOpen className="h-4 w-4" />
                My Learning
              </Link>
              <Link
                to="/wishlist"
                className="rounded p-2 hover:bg-dark-muted"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link to="/cart" className="rounded p-2 hover:bg-dark-muted" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              {isInstructor && (
                <Link
                  to="/instructor/dashboard"
                  className="flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Instructor
                </Link>
              )}
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-dark-muted"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </button>
                <div className="invisible absolute right-0 top-full z-50 min-w-[180px] rounded border border-border bg-surface py-1 text-dark opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-bg"
                  >
                    Profile settings
                  </Link>
                  <Link
                    to="/certificates"
                    className="block px-4 py-2 text-sm hover:bg-bg"
                  >
                    Certificates
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-bg"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded border border-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-dark"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded bg-white px-4 py-2 text-sm font-bold text-dark hover:bg-accent"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-dark-muted px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for courses"
                className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm text-dark"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            <Link to="/courses" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-learning" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  My Learning
                </Link>
                <Link to="/wishlist" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Wishlist
                </Link>
                <Link to="/cart" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Cart
                </Link>
                {isInstructor && (
                  <Link to="/instructor/dashboard" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                    Instructor
                  </Link>
                )}
                <Link to="/profile" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/certificates" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Certificates
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                    navigate('/')
                  }}
                  className="rounded px-3 py-2 text-left hover:bg-dark-muted"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
