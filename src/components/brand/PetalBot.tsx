import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BOT_BOX, EYE_H, EYE_W, OUTLINE, BOT_ART, SHINE, lookToward, watchPointer, type Offset } from '../../petalBots'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/*
  A Petal bot whose eyes follow the pointer (Nov 14 2026). The eyes step a whole
  square toward it, eight ways, and look straight out while the pointer is on
  the face; poses switch in steps, never eased, so the pixels never blend (the
  file's animated Sakura does the same). Each bot answers a little after the
  last (`lag`), so a row of them turns like a crowd rather than in lockstep.
  They blink now and then. With no mouse (a phone), the eyes wander instead.
  Under reduced motion they still follow the pointer but don't blink or wander;
  paused (the texture's "I'm overstimulated"), they don't blink.
*/


/** Within this many squares of the eyes, the pointer is on the face and they look straight out. */
const DEAD_SQUARES = 2.5
const BLINK_MS = 130
/** Wait between blinks, and the chance a blink comes twice. */
const BLINK_GAP: [number, number] = [2400, 6400]
const DOUBLE_BLINK = 0.2
const WANDER_GAP: [number, number] = [1400, 3600]

const between = ([a, b]: [number, number]) => a + Math.random() * (b - a)
const CENTRE: Offset = { dx: 0, dy: 0 }

export function PetalBot({
  index,
  square = 8,
  lag = 0,
  paused = false,
  style,
}: {
  /** Which bot, in `BOT_ART` order. */
  index: number
  /** Px a square at full size; the drawing shrinks with its box rather than overflow it. */
  square?: number
  /** Ms after the pointer moves before this one looks. */
  lag?: number
  paused?: boolean
  style?: CSSProperties
}) {
  const art = BOT_ART[index]
  const ref = useRef<SVGSVGElement>(null)
  const [look, setLook] = useState<Offset>(CENTRE)
  const [closed, setClosed] = useState(false)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const touch = useMediaQuery('(hover: none)')

  // Follow the pointer.
  useEffect(() => {
    if (touch) return
    let target = CENTRE
    let timer = 0
    const stop = watchPointer(({ x, y }) => {
      const svg = ref.current
      if (!svg) return
      const r = svg.getBoundingClientRect()
      if (!r.width) return
      const scale = r.width / BOT_BOX
      const ex = r.left + art.centre.x * scale
      const ey = r.top + art.centre.y * scale
      const next = lookToward(art, x - ex, y - ey, DEAD_SQUARES * scale)
      if (next.dx === target.dx && next.dy === target.dy) return
      target = next
      clearTimeout(timer)
      if (lag) timer = window.setTimeout(() => setLook(target), lag)
      else setLook(target)
    })
    return () => {
      stop()
      clearTimeout(timer)
    }
  }, [art, lag, touch])

  // No mouse: look about on its own.
  useEffect(() => {
    if (!touch || reduced) return
    let timer = 0
    const step = () => {
      const pick = Math.random() < 0.35 ? CENTRE : art.offsets[Math.floor(Math.random() * art.offsets.length)]
      setLook(pick)
      timer = window.setTimeout(step, between(WANDER_GAP))
    }
    timer = window.setTimeout(step, between(WANDER_GAP) + lag)
    return () => clearTimeout(timer)
  }, [art, lag, reduced, touch])

  // Blink.
  useEffect(() => {
    if (reduced || paused) return
    let timer = 0
    const blink = (again: boolean) => {
      setClosed(true)
      timer = window.setTimeout(() => {
        setClosed(false)
        timer = again
          ? window.setTimeout(() => blink(false), BLINK_MS * 1.4)
          : window.setTimeout(() => blink(Math.random() < DOUBLE_BLINK), between(BLINK_GAP))
      }, BLINK_MS)
    }
    timer = window.setTimeout(() => blink(false), between(BLINK_GAP))
    return () => {
      clearTimeout(timer)
      setClosed(false)
    }
  }, [reduced, paused])

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${BOT_BOX} ${BOT_BOX}`}
      width={BOT_BOX * square}
      height={BOT_BOX * square}
      role="img"
      aria-label={`${art.name}, a ${art.family} bot`}
      style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
    >
      {art.inks.map((ink) => (
        <path key={ink.color} d={ink.d} fill={ink.color} />
      ))}
      {art.eyes.map((e) => {
        const x = e.x + look.dx
        const y = e.y + look.dy
        return closed ? (
          <rect key={e.x} x={x} y={y + EYE_H - 1} width={EYE_W} height={1} fill={OUTLINE} />
        ) : (
          <g key={e.x}>
            <rect x={x} y={y} width={EYE_W} height={EYE_H} fill={OUTLINE} />
            <rect x={x} y={y} width={1} height={1} fill={SHINE} />
          </g>
        )
      })}
    </svg>
  )
}
