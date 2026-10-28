import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms */
  delay?: number
  as?: ElementType
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={cn(
        'scroll-reveal',
        visible ? 'scroll-reveal--visible' : 'scroll-reveal--hidden',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
