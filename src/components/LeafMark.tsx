import { MARK, MARK_INK } from '../introTimeline'

/**
 * The mark as one path per colour, each square a unit box. Drawing a colour
 * as one path rather than a rect a square keeps hairline seams from showing
 * between neighbours when the 23-square grid lands on fractional pixels.
 */
const PATHS = (() => {
  const byInk = new Map<string, string>()
  MARK.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '.') return
      const ink = MARK_INK[ch]
      byInk.set(ink, `${byInk.get(ink) ?? ''}M${x} ${y}h1v1h-1z`)
    }),
  )
  return [...byInk]
})()

/** The intro's four-leaf mark, drawn from the same 23 × 23 grid as a still. */
export default function LeafMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${MARK.length} ${MARK.length}`}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {PATHS.map(([ink, d]) => (
        <path key={ink} d={d} fill={ink} />
      ))}
    </svg>
  )
}
