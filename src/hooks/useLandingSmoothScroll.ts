import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

type Options = {
  enabled?: boolean
}

/**
 * Smooth scroll + subtle parallax on landing page.
 * Returns cleanup; pairs with ScrollReveal for visible scroll motion.
 */
export function useLandingSmoothScroll({ enabled = true }: Options = {}) {
  useEffect(() => {
    if (!enabled) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const lenis = new Lenis({
      lerp: 0.085,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      autoRaf: true,
      respectReducedMotion: true,
    })

    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))

    const onScroll = ({ scroll }: { scroll: number }) => {
      for (const el of parallaxEls) {
        const speed = Number(el.dataset.parallax ?? '0.12')
        el.style.transform = `translate3d(0, ${scroll * speed}px, 0)`
      }
    }

    lenis.on('scroll', onScroll)

    return () => {
      lenis.destroy()
      for (const el of parallaxEls) {
        el.style.transform = ''
      }
    }
  }, [enabled])
}
