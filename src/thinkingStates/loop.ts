import type { Chip } from './chips'
import { makeUtils } from './engine/grid'
import { makePix } from './engine/pix'
import type { Shape } from './engine/types'

/**
 * Thinking States' shared animation loop (`src/render.ts` in
 * ~/Developer/thinking-states), trimmed to what the portfolio needs: one
 * requestAnimationFrame for every chip on the page, drawing only the ones on
 * screen, capped at 60 fps, and holding a still frame under reduced motion.
 * The engine and chips beside it are copied verbatim; this file is the one
 * adapted (lazy observer, no pause).
 */

export interface ChipOptions {
  shape: Shape
  color: string
  speed: number
}

interface Mount {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  chip: () => Chip
  options: () => ChipOptions
  t: number
  visible: boolean
  key: string
  draw: (t: number) => void
}

/** The frame a chip holds under reduced motion. */
const STATIC_T = 0.6
/** At most 60 fps: a 120 Hz display skips every other frame. */
const MIN_FRAME_MS = 1000 / 60 - 4

const mounts = new Set<Mount>()
let raf = 0
let last: number | null = null
let observer: IntersectionObserver | null = null
let reduced: MediaQueryList | null = null

const still = () => reduced?.matches ?? false

function watch() {
  if (observer) return observer
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
  reduced.addEventListener('change', () => {
    last = null
    schedule()
  })
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        for (const m of mounts) if (m.canvas === e.target) m.visible = e.isIntersecting
      }
      schedule()
    },
    { rootMargin: '120px' },
  )
  return observer
}

function prepare(m: Mount) {
  const chip = m.chip()
  const { shape, color } = m.options()
  const key = `${chip.id}|${shape}|${color}`
  if (key === m.key) return
  m.key = key
  if (chip.system === 'grid') {
    const o = makeUtils(m.ctx, 56, shape, color)
    m.draw = (t) => chip.draw(t, m.ctx, o)
  } else {
    const o = makePix(m.ctx, 56, shape, color, chip.scale)
    m.draw = (t) => chip.draw(t, m.ctx, o)
  }
}

function paint(m: Mount) {
  prepare(m)
  const px = m.canvas.width
  m.ctx.setTransform(px / 56, 0, 0, px / 56, 0, 0)
  m.ctx.clearRect(0, 0, 56, 56)
  m.draw(still() ? STATIC_T : m.t)
}

function frame(now: number) {
  raf = 0
  if (!still() && last !== null && now - last < MIN_FRAME_MS) return schedule()
  const dt = last === null ? 0 : Math.min(0.1, (now - last) / 1000)
  last = now
  for (const m of mounts) {
    if (!m.visible) continue
    if (!still()) m.t += dt * m.options().speed
    paint(m)
  }
  // Still: paint once and stop until something changes.
  if (!still()) schedule()
  else last = null
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(frame)
}

/** Repaint now — for an option change while motion is reduced. */
export const invalidate = () => schedule()

/**
 * Animates `chip` on `canvas` at `size` CSS px. Options are read every frame,
 * so callers pass getters over live state. Returns the unmount.
 */
export function mountChip(
  canvas: HTMLCanvasElement,
  chip: () => Chip,
  options: () => ChipOptions,
  size: number,
): () => void {
  const px = Math.round(size * Math.min(3, window.devicePixelRatio || 1))
  canvas.width = canvas.height = px
  const m: Mount = {
    canvas,
    ctx: canvas.getContext('2d')!,
    chip,
    options,
    // Start each chip at its own point in its cycle, so a wall of them doesn't move in step.
    t: Math.random() * 10,
    visible: false,
    key: '',
    draw: () => {},
  }
  mounts.add(m)
  watch().observe(canvas)
  return () => {
    observer?.unobserve(canvas)
    mounts.delete(m)
  }
}
