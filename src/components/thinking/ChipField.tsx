import { useLayoutEffect, useRef, useState } from 'react'
import { CHIPS, type Chip } from '../../thinkingStates/chips'
import ThinkingChip from './ThinkingChip'

/**
 * A field of Thinking States' chips, live, running off both sides in staggered
 * rows, on whatever the box behind it paints (the dark stage on the project page,
 * the card's raised surface on the home bento — the project's own `#34322f`
 * read out of place on the portfolio's near-black, Nov 6 2026): the home bento's card
 * (the default export) and the project page's hero (`ChipField` at a wider
 * `designWidth`). Laid out at `designWidth` and scaled as a whole with CSS
 * `zoom` to its box, like D2 Conflux's collage, so a phone's half-width card
 * shows the same field smaller rather than fewer, cramped pills. Fills its
 * positioned parent.
 */

const ROWS = 7
/** A pill is ~150 design px with its gap; each row runs past both edges. */
const PILL = 140

/**
 * One chip a label first, so the field doesn't repeat a word until it runs out
 * of them, stepping through the list (grid, dots, vector) so the families mix;
 * then every other chip.
 */
const ORDER: Chip[] = (() => {
  const seen = new Set<string>()
  const unique: Chip[] = []
  for (const chip of CHIPS) {
    if (seen.has(chip.label)) continue
    seen.add(chip.label)
    unique.push(chip)
  }
  // 7 visits every chip unless the count is a multiple of it.
  const step = unique.length % 7 === 0 ? 5 : 7
  const mixed = unique.map((_, i) => unique[(i * step) % unique.length])
  return [...mixed, ...CHIPS.filter((chip) => !unique.includes(chip))]
})()

/** Each row's sideways offset, as a share of the design width, so the rows stagger. */
const OFFSETS = [-0.22, -0.05, -0.31, -0.12, -0.27, -0.02, -0.18]

export default function ChipField({ designWidth = 600 }: { designWidth?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: designWidth, height: 400 })
  const zoom = Math.max(1, size.width) / designWidth
  const perRow = Math.ceil((designWidth * 1.35) / PILL)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          width: designWidth,
          // In design px: zoom scales it back to the box's height.
          height: size.height / zoom,
          zoom,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} style={{ display: 'flex', gap: 12, marginLeft: OFFSETS[row] * designWidth, flexShrink: 0 }}>
            {Array.from({ length: perRow }, (_, i) => {
              const chip = ORDER[(row * perRow + i) % ORDER.length]
              return (
                <span key={i} style={{ flexShrink: 0 }}>
                  <ThinkingChip chip={chip} />
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
