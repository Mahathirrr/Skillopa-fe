import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  label?: string
}

export function LoadingSpinner({ className, label = 'Loading' }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-muted', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
