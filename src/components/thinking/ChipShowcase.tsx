import { useLayoutEffect, useRef, useState } from 'react'
import { chipById, type Chip } from '../../thinkingStates/chips'
import ThinkingChip from './ThinkingChip'

/**
 * Thinking States' home card (Nov 10 2026; the whole `ChipField` read as a busy
 * wall at card size): four chips, one per colour and family, large and live,
 * stepping left and right down the middle of the card. Laid out on a 300 × 200
 * design box and scaled to fit the card with CSS `zoom`; each canvas is told the
 * zoom, so the pixels stay crisp. Fills its positioned parent.
 */

/**
 * Each chip, with a label or colour where it takes another than its own: the helix
 * reads Analysing, Compiling's rain takes the project's purple.
 */
const PICKS: { chip: Chip; label?: string; color?: string }[] = [
  { chip: chipById('dna-helix')!, label: 'Analysing' },
  { chip: chipById('wave')! },
  { chip: chipById('rain-bare4')!, color: '#A78BFA' },
  { chip: chipById('dna')! },
]
const DESIGN = { width: 300, height: 200 }
/** Each pill's sideways step off the centre line, in design px. */
const STAGGER = 36

export default function ChipShowcase() {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(DESIGN)
  const zoom = Math.max(0.1, Math.min(size.width / DESIGN.width, size.height / DESIGN.height))

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} aria-hidden style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ zoom, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {PICKS.map(({ chip, label, color }, i) => (
          <span key={chip.id} style={{ transform: `translateX(${i % 2 ? STAGGER : -STAGGER}px)` }}>
            <ThinkingChip chip={chip} label={label} color={color} density={zoom} />
          </span>
        ))}
      </div>
    </div>
  )
}
