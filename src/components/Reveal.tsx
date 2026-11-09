import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Animates its children in, once, as they scroll into view (Nov 9 2026).
 * `rise` lifts and fades them; `settle` eases them down from a slight zoom, for
 * media inside something that clips it. `settle` scales, so don't use it around
 * anything that measures itself with `getBoundingClientRect` as it mounts (the
 * sidebar playground's glass). `delay` staggers neighbours that arrive together.
 */
export default function Reveal({
  kind = 'rise',
  delay = 0,
  style,
  children,
}: {
  kind?: 'rise' | 'settle'
  delay?: number
  style?: CSSProperties
  children: ReactNode
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal-${kind}`} style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}>
      {children}
    </div>
  )
}
