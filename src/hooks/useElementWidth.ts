import { useLayoutEffect, useState, type RefObject } from 'react'

/**
 * The current content-box width of `ref`'s element, kept fresh through a
 * `ResizeObserver`. Starts at 0 until the first measurement, so a caller
 * that switches layout on it should treat 0 as "not yet known".
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return width
}
