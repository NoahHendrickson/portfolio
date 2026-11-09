import { useEffect, useRef } from 'react'

/**
 * Marks an element `data-revealed`, once, when it scrolls into view; the CSS
 * (`.reveal-*`, `.cream-rule` in `index.css`) does the rest. The huge top margin
 * counts everything above the viewport as seen, so a jump down the page or a
 * restored scroll position doesn't leave content to animate in on the way back
 * up. The bottom margin waits until it's properly on screen.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.revealed = ''
        io.disconnect()
      },
      { rootMargin: '100000px 0px -64px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
