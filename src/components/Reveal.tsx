import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

/**
 * Springs its children up as they scroll into view, once (`.reveal` in
 * `index.css`). `delay` staggers neighbours that arrive together; `scale` is the
 * size it grows from, which a small card can take further than a page-wide
 * section.
 */
export default function Reveal({
  children,
  delay = 0,
  scale,
}: {
  children: ReactNode
  delay?: number
  scale?: number
}) {
  const [ref, shown] = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="reveal"
      data-shown={shown || undefined}
      style={
        {
          transitionDelay: delay ? `${delay}ms` : undefined,
          '--reveal-scale': scale,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
