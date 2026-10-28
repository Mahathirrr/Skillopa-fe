import {
  Bell,
  BookOpen,
  Heart,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Share2,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { NavbarSearch } from '@/components/layout/NavbarSearch'
import { SkillopaLogo } from '@/components/SkillopaLogo'
import { api } from '@/lib/api'
import { setAppLocale } from '@/i18n'
import { useAuthStore } from '@/stores/auth'

export function Navbar() {
  const { isAuthenticated, isInstructor, isAdmin, user, token, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const catalogSearchKey =
    location.pathname === '/courses' ? `catalog-${searchParams.get('q') ?? ''}` : 'nav-global'
  const catalogInitialQ = location.pathname === '/courses' ? (searchParams.get('q') ?? '') : ''

  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => api.getUnreadNotificationCount(token!),
    enabled: !!token && isAuthenticated,
    refetchInterval: 60000,
  })

  const unreadCount = unreadData?.count ?? 0
  const locale = i18n.language.startsWith('id') ? 'id' : 'en'

  function submitSearch(q: string) {
    if (!q) return
    navigate(`/courses?q=${encodeURIComponent(q)}`)
    setMenuOpen(false)
  }

  function toggleLocale() {
    const next = locale === 'en' ? 'id' : 'en'
    setAppLocale(next)
  }

  const navLinks = (
    <>
      <Link to="/courses" className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted">
        {t('nav.explore')}
      </Link>
      <Link to="/bundles" className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted">
        {t('nav.bundles')}
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/my-learning"
            className="flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted"
          >
            <BookOpen className="h-4 w-4" />
            {t('nav.myLearning')}
          </Link>
          <Link to="/subscriptions" className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted">
            {t('nav.subscriptions')}
          </Link>
          <Link to="/affiliate" className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted">
            {t('nav.affiliate')}
          </Link>
          <Link to="/wishlist" className="rounded p-2 hover:bg-dark-muted" aria-label={t('nav.wishlist')}>
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="rounded p-2 hover:bg-dark-muted" aria-label={t('nav.cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            to="/notifications"
            className="relative rounded p-2 hover:bg-dark-muted"
            aria-label={t('nav.notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          {isInstructor && (
            <Link
              to="/instructor/dashboard"
              className="flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t('nav.instructor')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="rounded px-3 py-2 text-sm font-medium hover:bg-dark-muted">
              {t('nav.admin')}
            </Link>
          )}
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-dark-muted bg-dark text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <SkillopaLogo className="h-7 w-7" />
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

        <NavbarSearch
          key={catalogSearchKey}
          initialQuery={catalogInitialQ}
          onSubmit={submitSearch}
          className="hidden flex-1 lg:flex"
        />

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {navLinks}

          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center gap-1 rounded px-2 py-2 text-sm font-medium hover:bg-dark-muted"
            aria-label={t('nav.language')}
          >
            <Languages className="h-4 w-4" />
            {locale.toUpperCase()}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-dark-muted"
                aria-expanded={userMenuOpen}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </button>
              {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 min-w-[180px] rounded border border-border bg-surface py-1 text-dark shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-bg">
                  {t('nav.profile')}
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-bg">
                  {t('nav.orders')}
                </Link>
                <Link to="/certificates" className="block px-4 py-2 text-sm hover:bg-bg">
                  {t('nav.certificates')}
                </Link>
                <Link to="/affiliate" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-bg">
                  <Share2 className="h-3.5 w-3.5" />
                  {t('nav.affiliate')}
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
                  {t('nav.logout')}
                </button>
              </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded border border-white px-4 py-2 text-sm font-bold text-white hover:bg-white hover:!text-[#1c1d1f]"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="btn-on-dark rounded px-4 py-2 text-sm font-bold hover:bg-accent hover:!text-[#1c1d1f]"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-dark-muted px-4 py-4 lg:hidden">
          <NavbarSearch
            key={`mobile-${catalogSearchKey}`}
            initialQuery={catalogInitialQ}
            onSubmit={submitSearch}
            className="mb-4"
          />
          <button
            type="button"
            onClick={toggleLocale}
            className="mb-3 flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-dark-muted"
          >
            <Languages className="h-4 w-4" />
            {t('nav.language')}: {locale.toUpperCase()}
          </button>
          <div className="flex flex-col gap-1">
            <Link to="/courses" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
              {t('nav.explore')}
            </Link>
            <Link to="/bundles" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
              {t('nav.bundles')}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-learning" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.myLearning')}
                </Link>
                <Link to="/subscriptions" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.subscriptions')}
                </Link>
                <Link to="/affiliate" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.affiliate')}
                </Link>
                <Link to="/wishlist" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.wishlist')}
                </Link>
                <Link to="/cart" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.cart')}
                </Link>
                <Link to="/notifications" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.notifications')}{unreadCount > 0 ? ` (${unreadCount})` : ''}
                </Link>
                <Link to="/orders" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.orders')}
                </Link>
                {isInstructor && (
                  <Link to="/instructor/dashboard" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                    {t('nav.instructor')}
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                    {t('nav.admin')}
                  </Link>
                )}
                <Link to="/profile" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.profile')}
                </Link>
                <Link to="/certificates" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.certificates')}
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
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="rounded px-3 py-2 hover:bg-dark-muted" onClick={() => setMenuOpen(false)}>
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
