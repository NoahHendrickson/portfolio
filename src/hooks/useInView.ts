import { useEffect, useRef, useState } from 'react'

/** A little past the fold, so a block starts moving once it can be seen. */
const ROOT_MARGIN = '0px 0px -10% 0px'

/**
 * Whether the ref's element has scrolled into view yet. It stays true once it
 * has. Anything already scrolled past when it mounts, as after a refresh partway
 * down a page, counts at once rather than waiting to be scrolled back to.
 */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: ROOT_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}

/**
 * Whether all of the ref's element has been on screen, once `enabled`; it stays true
 * once it has. Something taller than the window counts when it fills most of it.
 */
export function useFullyInView(ref: React.RefObject<Element | null>, enabled: boolean) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const box = entry.boundingClientRect.height
        const needed = box > window.innerHeight ? window.innerHeight * 0.85 : box
        if (entry.intersectionRect.height >= needed - 4) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, enabled])

  return inView
}
