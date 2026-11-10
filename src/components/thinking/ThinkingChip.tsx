import { useEffect, useRef } from 'react'
import type { Chip } from '../../thinkingStates/chips'
import type { Shape } from '../../thinkingStates/engine/types'
import { invalidate, mountChip } from '../../thinkingStates/loop'
import './ThinkingStates.css'

/**
 * One Thinking States loader, live: the animated icon on its canvas and, unless
 * `iconOnly`, the monospace label — in the dark pill the project's snippets
 * produce (`.chip` in the project's `styles.css`), or `bare` without it.
 * Shape, colour and speed are read every frame, so changing them never
 * remounts the canvas or restarts the cycle.
 */
export default function ThinkingChip({
  chip,
  label = chip.label,
  color = chip.color,
  shape = chip.shape ?? 'rounded',
  speed = 1,
  size = 16,
  bare = false,
  iconOnly = false,
  shimmer = false,
  title,
  density = 1,
}: {
  chip: Chip
  label?: string
  color?: string
  shape?: Shape
  speed?: number
  /** The icon's CSS px: the project offers 16 and 24. */
  size?: number
  bare?: boolean
  iconOnly?: boolean
  shimmer?: boolean
  /** A tooltip, for an icon shown without its label. */
  title?: string
  /** The CSS `zoom` it is drawn under, so the canvas stays sharp. */
  density?: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const live = useRef({ chip, shape, color, speed })

  useEffect(() => {
    live.current = { chip, shape, color, speed }
    // Under reduced motion the loop holds still, so an option change has to ask for a repaint.
    invalidate()
  }, [chip, shape, color, speed])

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    return mountChip(
      el,
      () => live.current.chip,
      () => live.current,
      size,
      density,
    )
  }, [size, density])

  const icon = <canvas ref={canvas} aria-hidden style={{ width: size, height: size }} />
  if (iconOnly) {
    return (
      <span className="ts-icon" title={title} role="img" aria-label={title ?? label}>
        {icon}
      </span>
    )
  }
  return (
    <span className={['ts-chip', bare && 'ts-chip--bare', shimmer && 'ts-shimmer'].filter(Boolean).join(' ')}>
      {icon}
      <span>{label}</span>
    </span>
  )
}
