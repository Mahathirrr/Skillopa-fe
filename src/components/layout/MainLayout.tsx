import { Outlet, useLocation } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

function isCertificateFocusRoute(pathname: string) {
  return (
    pathname.startsWith('/certificates/view/') || pathname.startsWith('/certificates/verify/')
  )
}

export function MainLayout() {
  const { pathname } = useLocation()
  const certificateFocus = isCertificateFocusRoute(pathname)

  return (
    <>
      <Navbar />
      <main className={`flex-1 ${certificateFocus ? 'certificate-focus-main' : ''}`}>
        <Outlet />
      </main>
      {!certificateFocus ? <Footer /> : null}
    </>
  )
}
