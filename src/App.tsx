import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/router'
import { useAuthStore } from '@/stores/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  )
}
