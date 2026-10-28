import { lazy, Suspense, type ComponentType } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'

export function lazyPage(loader: () => Promise<{ default: ComponentType }>) {
  const Page = lazy(loader)
  return function LazyPage() {
    return (
      <Suspense fallback={<LoadingSpinner className="min-h-[40vh]" />}>
        <Page />
      </Suspense>
    )
  }
}
