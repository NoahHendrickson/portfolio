import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CaretDown, Copy, LinkedinLogo, GithubLogo } from '@phosphor-icons/react'
import Button from '../design-system/Button'
import { space } from '../design-system/tokens'
import { useMediaQuery } from '../hooks/useMediaQuery'

const EMAIL = 'noahjames017@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/noah-hendrickson-808959192/'
const GITHUB_URL = 'https://github.com/NoahHendrickson'

/*
  Contact's menu hangs from its button the Inlet way (Nov 12 2026, the user's
  INLET-DESIGN-LANGUAGE.md): the button and the menu are one shape, drawn as
  one SVG path (`hungShape`) in the accent, the button's own orange, so button,
  join and menu are the same colour. The trigger's top corners stay round; where
  the menu reaches past the button's left side the surface turns in on the site's
  24 concave join; its right edge runs straight down, flush with the button. It
  opens and closes as that one shape morphing (Inlet R6): width leads, height
  follows, the rows fade in last; a reversal carries on from where the shape is.
  Under reduced motion it simply appears, in the same shape.
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
const OPEN_MS = 300
const CLOSE_MS = 280

const ACCENT = 'var(--color-orange)'
const INK = 'var(--color-on-accent)'
/** Solid steps off the accent, never translucent (Inlet R3). */
const ROW_HOVER = 'color-mix(in srgb, var(--color-on-accent) 16%, var(--color-orange))'
const DIVIDER = 'color-mix(in srgb, var(--color-on-accent) 28%, var(--color-orange))'

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

export default function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false)
  /** Mounted while open and until the shape has folded home. */
  const [shown, setShown] = useState(false)
  const [progress, setProgress] = useState(0)
  const [path, setPath] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
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

  const [copiedNonce, setCopiedNonce] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const copiedVisible = copiedNonce > 0

  /** The outline for the current progress, measured off the button and menu as they sit now. */
  const draw = useCallback((p: number) => {
    const root = menuRef.current
    const trigger = root?.querySelector<HTMLElement>(':scope > button')
    const list = listRef.current
    if (!root || !trigger || !list) return
    const frame = root.getBoundingClientRect()
    const t = trigger.getBoundingClientRect()
    const m = list.getBoundingClientRect()
    const B = { l: t.left - frame.left - PAD, t: t.top - frame.top - PAD, r: t.right - frame.left + PAD, b: t.bottom - frame.top + PAD }
    const M = { l: m.left - frame.left, t: m.top - frame.top, r: m.right - frame.left, b: m.bottom - frame.top }
    const radius = parseFloat(getComputedStyle(trigger).borderTopLeftRadius) || 0
    setPath(hungShape(B, M, p, Math.min(radius, (t.bottom - t.top) / 2)))
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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
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

  useEffect(() => {
    if (!copiedVisible) return
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    const timeout = setTimeout(() => setCopiedNonce(0), 1000)
    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(timeout)
    }
  }, [copiedNonce, copiedVisible])

  const copyToClipboard = (value: string, e: React.MouseEvent) => {
    navigator.clipboard?.writeText(value)
    setCursorPos({ x: e.clientX, y: e.clientY })
    setCopiedNonce(n => n + 1)
    close()
  }

  // The shape fades in over the first stretch (hiding the 4px it stands round the
  // button); the rows come in last.
  const p = still ? (isOpen ? 1 : 0) : progress
  const shapeOpacity = segment(p, 0, 0.22)
  const contentOpacity = segment(p, 0.62, 1)

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {shown && (
        <svg
          aria-hidden
          width={1}
          height={1}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'visible',
            pointerEvents: 'none',
            zIndex: 9,
            opacity: shapeOpacity,
            // Cast downward, away from the button (Inlet R1.4).
            filter: 'drop-shadow(0 10px 18px rgb(0 0 0 / 0.3))',
          }}
        >
          <path d={path} style={{ fill: ACCENT }} />
        </svg>
      )}
      <Button
        variant="primary"
        size="sm"
        trailingIcon={
          <CaretDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          />
        }
        onClick={() => (isOpen ? close() : open())}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        // 12 a side rather than 16, to match the Back pill (Nov 4 2026). Over the
        // shape while the menu is up, held at the accent so it can't drift to the
        // hover shade and show a seam against the menu.
        style={{
          paddingInline: space.md,
          position: 'relative',
          zIndex: 10,
          // The border too: on hover it takes the hover shade, which drew an outline on the shape.
          ...(shown ? { background: ACCENT, borderColor: ACCENT, color: INK } : null),
        }}
      >
        Contact
      </Button>
      {shown && (
        <div
          ref={listRef}
          role="menu"
          style={{
            position: 'absolute',
            // The padded button's foot, then the gap.
            top: `calc(100% + ${PAD + GAP}px)`,
            // Flush with the padded button's right side.
            right: -PAD,
            minWidth: '280px',
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
          <MenuRow onClick={(e) => copyToClipboard(EMAIL, e)}>
            <Copy size={16} weight="fill" />
            <span>{EMAIL}</span>
          </MenuRow>
          <div style={{ height: 1, background: DIVIDER, margin: `${space.xs} ${MENU_INSET}px` }} />
          <MenuRow href={LINKEDIN_URL} onClick={close}>
            <LinkedinLogo size={16} weight="fill" />
            <span>LinkedIn</span>
          </MenuRow>
          <MenuRow href={GITHUB_URL} onClick={close}>
            <GithubLogo size={16} weight="fill" />
            <span>GitHub</span>
          </MenuRow>
        </div>
      )}

      {copiedVisible && (
        <>
          <style>{`* { cursor: none !important; }`}</style>
          <div
            style={{
              position: 'fixed',
              top: cursorPos.y,
              left: cursorPos.x,
              transform: 'translate(-50%, -50%)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-raised)',
              color: 'var(--color-bg-inverse)',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              border: '1px solid var(--color-border-default)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              zIndex: 1000,
              whiteSpace: 'nowrap',
            }}
          >
            Copied!
          </div>
        </>
      )}
    </div>
  )
}

/** A row on the accent: white ink, a solid step lighter on hover, corners parallel to the menu's. */
function MenuRow({
  href,
  onClick,
  children,
}: {
  href?: string
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: '8px 10px',
    borderRadius: ROW_RADIUS,
    width: '100%',
    boxSizing: 'border-box',
    background: hovered ? ROW_HOVER : 'transparent',
    border: 'none',
    color: INK,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    textDecoration: 'none',
  }
  const hover = { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" role="menuitem" style={style} onClick={onClick} {...hover}>
      {children}
    </a>
  ) : (
    <button type="button" role="menuitem" style={style} onClick={onClick} {...hover}>
      {children}
    </button>
  )
}
