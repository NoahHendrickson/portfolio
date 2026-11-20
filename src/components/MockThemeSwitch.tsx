import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { MOCK_THEMES, setMockTheme, useMockTheme, type MockTheme } from '../mockTheme'
import { useIsMobile } from '../hooks/useIsMobile'
import { space } from '../design-system/tokens'
import { TEXT_SOFT } from '../sheetStyle'

/*
  The no3y Code page's theme switch (Nov 14 2026): a recessed well on the Back pill's tint with a
  thumb that slides under the chosen theme, Basic | Glass | Inlet (Basic joined Nov 16 2026). It
  swaps every mockup on the page but the hero, which shows all three on dividers of its own.

  Since Nov 16 2026 it is one floating pill (the page's colour, a soft drop) that follows the
  reader down the page: it starts docked under the intro (below Repo / Download), in a slot that keeps its room, and
  once the page scrolls past `UNDOCK_AT` it travels down to the window's foot, centred (at the
  right on a phone, clear of the light / dark toggle at the left), and back up into its slot at
  the top. It is portalled to the body so no transformed ancestor can trap the fixed position;
  docked, it is placed absolutely at the slot's page position, so it scrolls with the page
  natively. The move is a FLIP: measured before and after the switch, then slid from the old box
  to the new one. Under reduced motion it moves at once.
*/

const LABELS: Record<MockTheme, string> = { basic: 'Basic', glass: 'Glass', inlet: 'Inlet' }
const INSET = 3
/** Page scroll, in px, past which the pill leaves the intro for the window's foot. */
const UNDOCK_AT = 40
const MOVE_MS = 560
const MOVE_EASE = 'cubic-bezier(0.3, 0.8, 0.3, 1)'

function Switch() {
  const theme = useMockTheme()
  const index = MOCK_THEMES.indexOf(theme)

  const well: CSSProperties = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: `repeat(${MOCK_THEMES.length}, 1fr)`,
    padding: INSET,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-tint)',
  }
  const thumb: CSSProperties = {
    position: 'absolute',
    top: INSET,
    bottom: INSET,
    left: INSET,
    width: `calc((100% - ${INSET * 2}px) / ${MOCK_THEMES.length})`,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-cream)',
    transform: `translateX(${index * 100}%)`,
  }

  return (
    <div role="radiogroup" aria-label="Mockup theme" style={well}>
      <span aria-hidden className="mock-theme-thumb" style={thumb} />
      {MOCK_THEMES.map((id) => {
        const on = id === theme
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setMockTheme(id)}
            style={{
              position: 'relative',
              height: 'var(--control-xs)',
              paddingInline: space.lg,
              border: 0,
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              color: on ? 'var(--color-ink)' : TEXT_SOFT,
              font: 'inherit',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 200ms ease-out',
            }}
          >
            {LABELS[id]}
          </button>
        )
      })}
    </div>
  )
}

/** The pill's contents; the slot holds an invisible copy so it keeps the pill's room. */
function Pill({ label }: { label: boolean }) {
  return (
    <>
      {label && <span style={{ fontSize: '14px', color: TEXT_SOFT }}>Theme</span>}
      <Switch />
    </>
  )
}

export default function MockThemeSwitch() {
  const isMobile = useIsMobile()
  const slotRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const [docked, setDocked] = useState(() => window.scrollY <= UNDOCK_AT)
  const dockedRef = useRef(docked)
  // The slot's position on the page, for the docked pill.
  const [seat, setSeat] = useState<{ top: number; left: number } | null>(null)
  const lastBox = useRef<DOMRect | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY <= UNDOCK_AT
      if (next === dockedRef.current) return
      // Remember where the pill is now, to slide it from there once it has moved.
      lastBox.current = pillRef.current?.getBoundingClientRect() ?? null
      dockedRef.current = next
      setDocked(next)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the docked seat on the slot as the page lays out (fonts, resizes).
  useLayoutEffect(() => {
    const slot = slotRef.current
    if (!slot) return
    const measure = () => {
      const r = slot.getBoundingClientRect()
      setSeat({ top: r.top + window.scrollY, left: r.left + window.scrollX })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // FLIP: slide from where the pill was to where it is now.
  useLayoutEffect(() => {
    const from = lastBox.current
    const pill = pillRef.current
    lastBox.current = null
    if (!from || !pill || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const to = pill.getBoundingClientRect()
    const dx = from.left - to.left
    const dy = from.top - to.top
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
    pill.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: MOVE_MS, easing: MOVE_EASE })
  }, [docked])

  const pill: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    width: 'fit-content',
    padding: isMobile ? 4 : `4px 4px 4px ${space.lg}`,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-primary)',
    boxShadow: '0 8px 24px rgb(0 0 0 / 18%), 0 0 0 1px var(--color-border-subtle)',
  }
  const placed: CSSProperties = docked
    ? { position: 'absolute', top: seat?.top ?? 0, left: seat?.left ?? 0, visibility: seat ? 'visible' : 'hidden' }
    : { position: 'fixed', bottom: isMobile ? space.lg : space['2xl'], ...(isMobile ? { right: space.lg } : { left: 0, right: 0, marginInline: 'auto' }) }

  return (
    <>
      <div ref={slotRef} aria-hidden inert style={{ ...pill, visibility: 'hidden', boxShadow: 'none' }}>
        <Pill label={!isMobile} />
      </div>
      {createPortal(
        <div ref={pillRef} style={{ ...pill, ...placed, zIndex: 30 }}>
          <Pill label={!isMobile} />
        </div>,
        document.body,
      )}
    </>
  )
}
