import type { CSSProperties } from 'react'

/* The hero slider's dividers (`CompareSlider.tsx`): the grip's look, and how two dividers keep apart. */

export const HANDLE = 40
/** The white grip on a divider: a circle with a caret either way. */
export function gripStyle(dragging: boolean): CSSProperties {
  return {
    position: 'absolute',
    width: HANDLE,
    height: HANDLE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#fff',
    color: '#141414',
    boxShadow: '0 2px 10px rgb(0 0 0 / 30%), 0 0 0 0.5px rgb(0 0 0 / 20%)',
    cursor: 'ew-resize',
    touchAction: 'none',
    transform: dragging ? 'scale(0.94)' : undefined,
    transition: 'transform 150ms ease-out, top 200ms ease-out',
  }
}

/** How far a grip moves off the middle when the two would overlap, so both stay in reach. */
export const gripOffset = (gapPx: number, index: number) => (gapPx < HANDLE + 8 ? (index === 0 ? -1 : 1) * (HANDLE / 2 + 4) : 0)

/** The closest two dividers come, in px: a divider dragged nearer pushes its neighbour along. */
export const DIVIDER_GAP = 24

/**
 * Moves divider `index` to `value`, pushing any neighbour it comes within `gap` of along with
 * it (either way, a chain if need be), all kept between 0 and `max`. Positions are in any one
 * unit (the hero's are percentages of its frame).
 */
export function pushSplits(splits: number[], index: number, value: number, gap: number, max: number): number[] {
  const n = splits.length
  const next = [...splits]
  next[index] = Math.min(max - (n - 1 - index) * gap, Math.max(index * gap, value))
  for (let j = index + 1; j < n; j++) next[j] = Math.max(next[j], next[j - 1] + gap)
  for (let j = index - 1; j >= 0; j--) next[j] = Math.min(next[j], next[j + 1] - gap)
  return next
}
