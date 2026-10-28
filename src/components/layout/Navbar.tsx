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
import { buttonClass } from '@/components/ui/button'
import { api } from '@/lib/api'
import { setAppLocale } from '@/i18n'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

type NavbarProps = { className?: string }

const navLinkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-background hover:text-foreground'

export function Navbar({ className }: NavbarProps) {
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
      <Link to="/courses" className={navLinkClass}>
        {t('nav.explore')}
      </Link>
      <Link to="/bundles" className={navLinkClass}>
        {t('nav.bundles')}
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/my-learning" className={cn(navLinkClass, 'inline-flex items-center gap-1.5')}>
            <BookOpen className="h-4 w-4" aria-hidden />
            {t('nav.myLearning')}
          </Link>
          <Link to="/subscriptions" className={navLinkClass}>
            {t('nav.subscriptions')}
          </Link>
          <Link to="/affiliate" className={navLinkClass}>
            {t('nav.affiliate')}
          </Link>
          <Link
            to="/wishlist"
            className="rounded-lg p-2 text-foreground-muted hover:bg-background hover:text-primary"
            aria-label={t('nav.wishlist')}
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="rounded-lg p-2 text-foreground-muted hover:bg-background hover:text-primary"
            aria-label={t('nav.cart')}
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            to="/notifications"
            className="relative rounded-lg p-2 text-foreground-muted hover:bg-background hover:text-primary"
            aria-label={t('nav.notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          {isInstructor && (
            <Link to="/instructor/dashboard" className={cn(navLinkClass, 'inline-flex items-center gap-1.5')}>
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              {t('nav.instructor')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={navLinkClass}>
              {t('nav.admin')}
            </Link>
          )}
        </>
      )}
    </>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-surface/95 text-foreground backdrop-blur-md supports-[backdrop-filter]:bg-surface/90',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight text-foreground">
          <SkillopaLogo className="h-8 w-8" />
          <span className="hidden text-lg sm:inline">Skillopa</span>
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-foreground-muted hover:bg-background lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <NavbarSearch
          key={catalogSearchKey}
          initialQuery={catalogInitialQ}
          onSubmit={submitSearch}
          className="hidden flex-1 lg:flex"
        />

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {navLinks}

          <button
            type="button"
            onClick={toggleLocale}
            className={cn(navLinkClass, 'inline-flex items-center gap-1')}
            aria-label={t('nav.language')}
          >
            <Languages className="h-4 w-4" aria-hidden />
            {locale.toUpperCase()}
          </button>

          {isAuthenticated ? (
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className={cn(navLinkClass, 'inline-flex max-w-[160px] items-center gap-2')}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <User className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{user?.name}</span>
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-border bg-surface py-1 shadow-md"
                >
                  <Link role="menuitem" to="/profile" className="block px-4 py-2.5 text-sm hover:bg-background" onClick={() => setUserMenuOpen(false)}>
                    {t('nav.profile')}
                  </Link>
                  <Link role="menuitem" to="/orders" className="block px-4 py-2.5 text-sm hover:bg-background" onClick={() => setUserMenuOpen(false)}>
                    {t('nav.orders')}
                  </Link>
                  <Link role="menuitem" to="/certificates" className="block px-4 py-2.5 text-sm hover:bg-background" onClick={() => setUserMenuOpen(false)}>
                    {t('nav.certificates')}
                  </Link>
                  <Link role="menuitem" to="/affiliate" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-background" onClick={() => setUserMenuOpen(false)}>
                    <Share2 className="h-3.5 w-3.5" aria-hidden />
                    {t('nav.affiliate')}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-background"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/login" className={buttonClass('ghost', 'sm')}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className={buttonClass('primary', 'sm')}>
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-4 py-4 lg:hidden">
          <NavbarSearch
            key={`mobile-${catalogSearchKey}`}
            initialQuery={catalogInitialQ}
            onSubmit={submitSearch}
            className="mb-4"
          />
          <button type="button" onClick={toggleLocale} className={cn(navLinkClass, 'mb-2 flex w-full items-center gap-2')}>
            <Languages className="h-4 w-4" aria-hidden />
            {t('nav.language')}: {locale.toUpperCase()}
          </button>
          <div className="flex flex-col gap-0.5">{navLinks}</div>
          {isAuthenticated ? (
            <div className="mt-4 flex flex-col gap-0.5 border-t border-border pt-4">
              <Link to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {t('nav.profile')}
              </Link>
              <Link to="/orders" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {t('nav.orders')}
              </Link>
              <Link to="/certificates" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {t('nav.certificates')}
              </Link>
              <button
                type="button"
                className={cn(navLinkClass, 'text-left')}
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                  navigate('/')
                }}
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link to="/login" className={buttonClass('secondary', 'md', 'w-full')} onClick={() => setMenuOpen(false)}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className={buttonClass('primary', 'md', 'w-full')} onClick={() => setMenuOpen(false)}>
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
