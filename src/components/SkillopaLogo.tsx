import { cn } from '@/lib/utils'

type SkillopaLogoProps = {
  className?: string
  alt?: string
}

/** Brand mark: same asset as /favicon.svg */
export function SkillopaLogo({ className, alt = 'Skillopa' }: SkillopaLogoProps) {
  return (
    <img
      src="/favicon.svg"
      alt={alt}
      className={cn('inline-block shrink-0 object-contain', className)}
      draggable={false}
    />
  )
}
