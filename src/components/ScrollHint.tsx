import { useEffect, useState } from 'react'
import { pixelPath } from '../pixelFaces'

const ARROW = [
  '...X...',
  '...X...',
  '...X...',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
]

const COLS = ARROW[0].length
/** The rows the arrow steps down through (`scroll-hint-arrow` in `index.css`). */
const TRAVEL = 2
const ROWS = ARROW.length + TRAVEL
/** 3px a square, a step up from the rail's 2: at 2 the arrow read too small. */
const SQUARE = 3
/** How far the panel moves before the hint has done its job. */
const SCROLLED_PAST = 8

/**
 * A small pixel arrow stepping downward, telling a visitor on Hi there is more
 * under the fold. Goes when the panel scrolls and returns if it comes back to
 * the top.
 */
export default function ScrollHint({
  scroller,
  style,
}: {
  scroller: React.RefObject<HTMLElement | null>
  style?: React.CSSProperties
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > SCROLLED_PAST)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scroller])

  return (
    <svg
      aria-hidden
      className="scroll-hint"
      data-hidden={scrolled || undefined}
      width={COLS * SQUARE}
      height={ROWS * SQUARE}
      viewBox={`0 0 ${COLS} ${ROWS}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', pointerEvents: 'none', ...style }}
    >
      <path className="scroll-hint-arrow" d={pixelPath(ARROW)} fill="var(--color-orange)" />
    </svg>
  )
}
