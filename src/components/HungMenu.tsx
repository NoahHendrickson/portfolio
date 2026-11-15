import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { space } from '../design-system/tokens'
import { useMediaQuery } from '../hooks/useMediaQuery'

/*
  A menu that hangs from its button the Inlet way (Nov 12 2026, the user's
  INLET-DESIGN-LANGUAGE.md): the button and the menu are one shape, drawn as
  one SVG path (`hungShape`) in the accent, the button's own orange, so button,
  join and menu are the same colour. The trigger's top corners stay round; where
  the menu reaches past the button's side the surface turns in on the site's
  24 concave join; its other edge runs straight down, flush with the button. It
  opens and closes as that one shape morphing (Inlet R6): width leads, height
  follows, the rows fade in last; a reversal carries on from where the shape is.
  Under reduced motion it simply appears, in the same shape.

  Contact's menu came first (`ContactMenu`, hung flush right); the home rail's
  mobile dropdown hangs the same way, flush left (Nov 15 2026).
*/

/** The thin-trigger fill (Inlet R1.5): the shape stands this far round the button. */
const PAD = 4
/** Button to menu (Inlet R1.8). */
const GAP = 4
/** The concave join, the site's 24 (the curved cards' and the brand page's). */
const FILLET = 24
/** The menu's corner matches the padded button's (16 + 4): corners that meet, match. */
const MENU_RADIUS = 20
/** Rows sit 8 in, with corners parallel to the menu's. */
const MENU_INSET = 8
const ROW_RADIUS = MENU_RADIUS - MENU_INSET
/**
 * Room round the shape for its drop shadow (10 down, 18 blur). The SVG is sized to the
 * shape plus this rather than left 1 × 1 with `overflow: visible`: Safari bounds a CSS
 * filter by the element's own box, which cut the shadow off along the menu's foot.
 */
const SHADOW_ROOM = 48
const OPEN_MS = 300
const CLOSE_MS = 280

const ACCENT = 'var(--color-orange)'
const INK = 'var(--color-on-accent)'
/** Solid steps off the accent, never translucent (Inlet R3). */
const ROW_HOVER = 'color-mix(in srgb, var(--color-on-accent) 16%, var(--color-orange))'
const DIVIDER = 'color-mix(in srgb, var(--color-on-accent) 28%, var(--color-orange))'

/** Over the shape while the menu is up, the trigger holds the accent so it can't drift to its hover shade and show a seam. */
const HELD: CSSProperties = { background: ACCENT, borderColor: ACCENT, color: INK }

type Box = { l: number; t: number; r: number; b: number }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const segment = (v: number, from: number, to: number) => clamp01((v - from) / (to - from))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/**
 * The button and its menu as one outline at progress `p` (0 the button alone, 1 open),
 * clockwise from the button's top-left, per Inlet's morph recipe. `B` is the button
 * grown by `PAD`; `M` the menu's box.
 */
function hungShape(B: Box, M: Box, p: number, triggerRadius: number): string {
  const w = easeInOutCubic(segment(p, 0.12, 0.72))
  const h = easeInOutCubic(segment(p, 0.08, 1))
  const left = Math.min(B.l, lerp(B.l, M.l, w))
  const right = Math.max(B.r, lerp(B.r, M.r, w))
  const bottom = lerp(B.b, M.b, h)
  const menuTop = Math.min(M.t, bottom)
  const menuH = bottom - menuTop
  const rT = Math.min(triggerRadius + PAD, (B.b - B.t) / 2)
  const roomL = B.l - left
  const roomR = right - B.r
  const flush = roomL < 0.5 && roomR < 0.5
  const foot =
    menuH > 0.5 ? Math.min(MENU_RADIUS, menuH / 2, (right - left) / 2) : flush ? Math.min(rT, (bottom - B.t) / 2) : 0
  const side = (room: number) => {
    if (room < 0.5) return null
    const fillet = Math.max(0, Math.min(FILLET, room / 2, menuTop - B.t - rT))
    const corner = Math.max(0, Math.min(MENU_RADIUS, room - fillet, menuH / 2))
    return { fillet, corner }
  }
  const R = side(roomR)
  const L = side(roomL)
  const n = (v: number) => Math.round(v * 100) / 100
  let d = `M${n(B.l)} ${n(B.t + rT)}A${n(rT)} ${n(rT)} 0 0 1 ${n(B.l + rT)} ${n(B.t)}`
  d += `L${n(B.r - rT)} ${n(B.t)}A${n(rT)} ${n(rT)} 0 0 1 ${n(B.r)} ${n(B.t + rT)}`
  if (R) {
    d += `L${n(B.r)} ${n(menuTop - R.fillet)}A${n(R.fillet)} ${n(R.fillet)} 0 0 0 ${n(B.r + R.fillet)} ${n(menuTop)}`
    d += `L${n(right - R.corner)} ${n(menuTop)}A${n(R.corner)} ${n(R.corner)} 0 0 1 ${n(right)} ${n(menuTop + R.corner)}`
  }
  d += `L${n(right)} ${n(bottom - foot)}A${n(foot)} ${n(foot)} 0 0 1 ${n(right - foot)} ${n(bottom)}`
  d += `L${n(left + foot)} ${n(bottom)}A${n(foot)} ${n(foot)} 0 0 1 ${n(left)} ${n(bottom - foot)}`
  if (L) {
    d += `L${n(left)} ${n(menuTop + L.corner)}A${n(L.corner)} ${n(L.corner)} 0 0 1 ${n(left + L.corner)} ${n(menuTop)}`
    d += `L${n(B.l - L.fillet)} ${n(menuTop)}A${n(L.fillet)} ${n(L.fillet)} 0 0 0 ${n(B.l)} ${n(menuTop - L.fillet)}`
  }
  return d + 'Z'
}

export type HungTrigger = {
  isOpen: boolean
  toggle: () => void
  /** Spread onto the trigger's style: the accent, held while the shape is up. */
  held: CSSProperties | null
}

export default function HungMenu({
  align,
  minWidth,
  trigger,
  children,
  style,
}: {
  /** Which side of the button the menu runs flush with; it reaches past the other. */
  align: 'left' | 'right'
  minWidth: number
  /** The button. It must render a `<button>` as this component's direct child. */
  trigger: (t: HungTrigger) => ReactNode
  children: (close: () => void) => ReactNode
  style?: CSSProperties
}) {
  const [isOpen, setIsOpen] = useState(false)
  /** Mounted while open and until the shape has folded home. */
  const [shown, setShown] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shape, setShape] = useState({ d: '', x: 0, y: 0, w: 0, h: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const frameRef = useRef(0)
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')

  // Opening mounts the menu, and the morph runs once it has a box to measure;
  // closing unmounts it when the shape is home (at once under reduced motion).
  const open = () => {
    setIsOpen(true)
    setShown(true)
  }
  const close = useCallback(() => {
    setIsOpen(false)
    if (still) setShown(false)
  }, [still])

  /** The outline for the current progress, measured off the button and menu as they sit now. */
  const draw = useCallback((p: number) => {
    const root = rootRef.current
    const button = root?.querySelector<HTMLElement>(':scope > button')
    const list = listRef.current
    if (!root || !button || !list) return
    const frame = root.getBoundingClientRect()
    const t = button.getBoundingClientRect()
    const m = list.getBoundingClientRect()
    const B = { l: t.left - frame.left - PAD, t: t.top - frame.top - PAD, r: t.right - frame.left + PAD, b: t.bottom - frame.top + PAD }
    const M = { l: m.left - frame.left, t: m.top - frame.top, r: m.right - frame.left, b: m.bottom - frame.top }
    const radius = parseFloat(getComputedStyle(button).borderTopLeftRadius) || 0
    const x = Math.min(B.l, M.l) - SHADOW_ROOM
    const y = B.t - SHADOW_ROOM
    setShape({
      d: hungShape(B, M, p, Math.min(radius, (t.bottom - t.top) / 2)),
      x,
      y,
      w: Math.max(B.r, M.r) + SHADOW_ROOM - x,
      h: Math.max(B.b, M.b) + SHADOW_ROOM - y,
    })
  }, [])

  useLayoutEffect(() => {
    if (!shown) return
    cancelAnimationFrame(frameRef.current)
    const target = isOpen ? 1 : 0
    const from = progressRef.current
    const set = (p: number) => {
      progressRef.current = p
      setProgress(p)
      draw(p)
    }
    // Reduced motion: no morph, the shape drawn whole (`progress` reads 1 while open, below).
    if (still) {
      progressRef.current = target
      draw(target)
      return
    }
    if (from === target) return
    // A reversal carries on from where the shape is, over the distance left.
    const duration = (isOpen ? OPEN_MS : CLOSE_MS) * Math.abs(target - from)
    const start = performance.now()
    const step = (now: number) => {
      const t = clamp01((now - start) / duration)
      const p = isOpen ? from + (1 - from) * easeOutCubic(t) : from - from * easeInOutSine(t)
      set(p)
      if (t < 1) frameRef.current = requestAnimationFrame(step)
      else if (!isOpen) setShown(false)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isOpen, shown, still, draw])

  // The shape follows the menu: redraw on resize and scroll while it's up.
  useEffect(() => {
    if (!shown) return
    const redraw = () => draw(progressRef.current)
    window.addEventListener('resize', redraw)
    window.addEventListener('scroll', redraw, true)
    return () => {
      window.removeEventListener('resize', redraw)
      window.removeEventListener('scroll', redraw, true)
    }
  }, [shown, draw])

  useEffect(() => {
    if (!isOpen) return
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen, close])

  // The shape fades in over the first stretch (hiding the 4px it stands round the
  // button); the rows come in last.
  const p = still ? (isOpen ? 1 : 0) : progress
  const shapeOpacity = segment(p, 0, 0.22)
  const contentOpacity = segment(p, 0.62, 1)

  return (
    <div ref={rootRef} style={{ position: 'relative', ...style }}>
      {shown && (
        <svg
          aria-hidden
          width={shape.w}
          height={shape.h}
          viewBox={`${shape.x} ${shape.y} ${shape.w} ${shape.h}`}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            overflow: 'visible',
            pointerEvents: 'none',
            zIndex: 9,
            opacity: shapeOpacity,
            // Cast downward, away from the button (Inlet R1.4).
            filter: 'drop-shadow(0 10px 18px rgb(0 0 0 / 0.3))',
          }}
        >
          <path d={shape.d} style={{ fill: ACCENT }} />
        </svg>
      )}
      {trigger({ isOpen, toggle: () => (isOpen ? close() : open()), held: shown ? HELD : null })}
      {shown && (
        <div
          ref={listRef}
          role="menu"
          style={{
            position: 'absolute',
            // The padded button's foot, then the gap.
            top: `calc(100% + ${PAD + GAP}px)`,
            // Flush with the padded button's side.
            [align]: -PAD,
            minWidth: `${minWidth}px`,
            maxWidth: 'calc(100vw - 40px)',
            boxSizing: 'border-box',
            padding: MENU_INSET,
            display: 'flex',
            flexDirection: 'column',
            gap: space.xs,
            zIndex: 10,
            opacity: contentOpacity,
            pointerEvents: isOpen ? undefined : 'none',
          }}
        >
          {children(close)}
        </div>
      )}
    </div>
  )
}

/** A hairline between rows, a solid step off the accent. */
export function MenuDivider() {
  return <div style={{ height: 1, background: DIVIDER, margin: `${space.xs} ${MENU_INSET}px` }} />
}

/**
 * A row on the accent: the accent's ink, a solid step lighter on hover (and held
 * there for the row you're on), corners parallel to the menu's.
 */
export function MenuRow({
  href,
  onClick,
  current = false,
  style: extra,
  children,
}: {
  href?: string
  onClick: (e: React.MouseEvent) => void
  /** The row for where you already are: filled, at medium weight. */
  current?: boolean
  style?: CSSProperties
  children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: '8px 10px',
    borderRadius: ROW_RADIUS,
    width: '100%',
    boxSizing: 'border-box',
    background: hovered || current ? ROW_HOVER : 'transparent',
    border: 'none',
    color: INK,
    fontSize: '16px',
    fontWeight: current ? 500 : 400,
    lineHeight: '24px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    textDecoration: 'none',
    ...extra,
  }
  const hover = { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" role="menuitem" style={style} onClick={onClick} {...hover}>
      {children}
    </a>
  ) : (
    <button type="button" role="menuitem" aria-current={current || undefined} style={style} onClick={onClick} {...hover}>
      {children}
    </button>
  )
}
