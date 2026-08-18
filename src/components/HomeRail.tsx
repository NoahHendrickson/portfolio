import { useEffect, useRef, useState } from 'react'
import { color } from '../design-system/tokens'
import type { HomeTab } from '../homeTab'

const ORANGE = color.accent.default

const TABS: { id: HomeTab; label: string }[] = [
  { id: 'me', label: 'Me' },
  { id: 'work', label: 'Work' },
  { id: 'design', label: 'How I design' },
  { id: 'been', label: 'Where I’ve been' },
  { id: 'contact', label: 'Contact' },
  { id: 'lols', label: 'LOLs' },
]

/**
 * The rail's 12 × 10 arrow, drawn as 2px squares the way the file builds it —
 * a shaft on the middle row and a two-step head. `currentColor` so the parent
 * item recolours it with the label.
 */
const ARROW_DOTS: [number, number][] = [
  [0, 4],
  [2, 4],
  [4, 4],
  [6, 0],
  [8, 2],
  [10, 4],
  [8, 6],
  [6, 8],
]

function PixelArrow() {
  return (
    <span aria-hidden style={{ position: 'relative', width: '12px', height: '10px', flexShrink: 0, display: 'block' }}>
      {ARROW_DOTS.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '2px',
            height: '2px',
            background: 'currentColor',
          }}
        />
      ))}
    </span>
  )
}

/**
 * The mobile trigger's glyph (Figma `325:44006`): an up chevron over a down
 * one, the pair that marks a control you unfold rather than a direction you
 * travel. Same 2px squares as the rail's arrow, read off the exported frame —
 * two 10 × 6 chevrons with a 4px channel between them.
 */
const CARET_PAIR_DOTS: [number, number][] = [
  [4, 0],
  [2, 2],
  [6, 2],
  [0, 4],
  [8, 4],
  [0, 10],
  [8, 10],
  [2, 12],
  [6, 12],
  [4, 14],
]

function PixelCaretPair() {
  return (
    <span aria-hidden style={{ position: 'relative', width: '10px', height: '16px', flexShrink: 0, display: 'block' }}>
      {CARET_PAIR_DOTS.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '2px',
            height: '2px',
            background: 'currentColor',
          }}
        />
      ))}
    </span>
  )
}

/**
 * One entry: label, 10px gap, pixel arrow, on the file's 8px pad. The active
 * item goes medium in the primary ink with the orange arrow and underline; the
 * rest stay regular in the secondary ink with the arrow at half-opacity grey.
 * Hovering an item selects it, so there is no separate hover style.
 */
function railItemStyle(active: boolean): React.CSSProperties {
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    border: 'none',
    // The underline itself is the absolute span below; this transparent border
    // just reserves its 2px so items don't shift when it appears.
    borderBottom: '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px',
    fontWeight: active ? 500 : 400,
    lineHeight: 'normal',
    letterSpacing: 0,
    color: active ? color.text.primary : color.text.secondary,
    whiteSpace: 'nowrap',
    transition: 'color 150ms ease',
  }
}

/** The active underline, sweeping in from the left instead of flat-appearing. */
function underlineStyle(active: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-2px',
    height: '2px',
    background: ORANGE,
    transform: active ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 180ms ease-out',
  }
}

/** The arrow's own colour, split from the label's (the file dims it separately). */
const arrowStyle = (active: boolean): React.CSSProperties => ({
  color: active ? ORANGE : 'rgba(217, 217, 217, 0.5)',
  display: 'flex',
})

/**
 * The vertical tab rail. Hover previews a tab and click commits the same
 * switch (the only affordance on keyboard); nothing routes — the whole page
 * lives on `/`. Contact is one of the tabs, showing its panel like the rest.
 * Mobile collapses the column into the dropdown below.
 */
/**
 * How far back the pointer trail looks when judging direction, and how long a
 * deferred tab must be dwelled on before it switches anyway. The trail window
 * doubles as the staleness cutoff — with no fresh samples we can't infer
 * direction, so we fall back to switching immediately.
 */
const TRAIL_WINDOW_MS = 150
const DWELL_MS = 160

/**
 * The mobile menu's surface, on `ContactMenu`'s conventions — the raised
 * surface, the default border, the 2xl radius and an 8px pad — so the two
 * dropdowns on the site read as the same object.
 */
const MENU_SURFACE: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  minWidth: '220px',
  maxWidth: 'calc(100vw - 40px)',
  backgroundColor: 'var(--color-bg-raised)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-2xl)',
  padding: 'var(--space-sm)',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 24px -4px rgba(0,0,0,0.4), 0 8px 8px -4px rgba(0,0,0,0.3)',
  zIndex: 10,
}

export default function HomeRail({
  active,
  onSelect,
  isMobile,
}: {
  active: HomeTab
  onSelect: (tab: HomeTab) => void
  isMobile: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])
  /*
   * Hover-intent guard: leaving the active tab for a card means sweeping
   * rightward across the tabs below it, and a naive mouseenter would swap the
   * panel mid-flight. So the rail keeps a short trail of pointer positions,
   * and a tab entered while the pointer is heading rightward (toward the
   * content) only commits after a dwell — crossing it does nothing, stopping
   * on it still selects. Vertical movement along the rail switches instantly,
   * and click always commits.
   */
  const trail = useRef<{ x: number; y: number; t: number }[]>([])
  const pending = useRef<number | null>(null)

  const cancelPending = () => {
    if (pending.current !== null) {
      clearTimeout(pending.current)
      pending.current = null
    }
  }

  useEffect(() => cancelPending, [])

  const recordMove = (e: React.MouseEvent) => {
    const now = performance.now()
    trail.current.push({ x: e.clientX, y: e.clientY, t: now })
    while (trail.current.length && now - trail.current[0].t > TRAIL_WINDOW_MS) {
      trail.current.shift()
    }
  }

  const enterTab = (tab: HomeTab) => {
    cancelPending()
    if (tab === active) return

    // Runs in the mouseenter handler, never during render; the linter can't
    // infer that because this function is only reached through the per-tab
    // arrow wrappers.
    // eslint-disable-next-line react-hooks/purity
    const now = performance.now()
    const fresh = trail.current.filter((p) => now - p.t <= TRAIL_WINDOW_MS)
    let headingToContent = false
    if (fresh.length >= 2) {
      const dx = fresh[fresh.length - 1].x - fresh[0].x
      const dy = fresh[fresh.length - 1].y - fresh[0].y
      // Rightward within a wide cone (~76° either side of horizontal): the
      // pointer is probably aiming at the content, not this tab. Anything
      // steeper is reading down the rail.
      headingToContent = dx > 3 && dx > Math.abs(dy) * 0.25
    }

    if (headingToContent) {
      pending.current = window.setTimeout(() => {
        pending.current = null
        onSelect(tab)
      }, DWELL_MS)
    } else {
      onSelect(tab)
    }
  }

  const commitTab = (tab: HomeTab) => {
    cancelPending()
    onSelect(tab)
  }

  /*
   * Mobile is a dropdown rather than the rail (Figma `325:43995`). Six tabs
   * wrapped into rows ate a third of a phone screen before the panel started,
   * and the rail's whole affordance — hover to preview — has no meaning on
   * touch anyway, so the closed state shows only where you are. The trigger is
   * the active item's own styling, carrying the file's stacked caret pair in
   * place of the rail's travel arrow — it stays put on open, since the glyph
   * says unfoldable rather than pointing anywhere. The label carries a trailing
   * space in the file, which is what the 10px gap is for, so it isn't
   * reproduced.
   */
  if (isMobile) {
    const activeLabel = TABS.find((tab) => tab.id === active)?.label ?? TABS[0].label
    return (
      <div ref={menuRef} style={{ position: 'relative', alignSelf: 'flex-start' }}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          style={{
            ...railItemStyle(true),
            width: 'max-content',
            borderBottom: `2px solid ${ORANGE}`,
          }}
        >
          {activeLabel}
          <span style={arrowStyle(true)}>
            <PixelCaretPair />
          </span>
        </button>
        {isOpen && (
          <div role="menu" style={MENU_SURFACE}>
            {TABS.map((tab) => {
              const isActive = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="menuitem"
                  aria-current={isActive || undefined}
                  onClick={() => {
                    setIsOpen(false)
                    commitTab(tab.id)
                  }}
                  style={{
                    ...railItemStyle(isActive),
                    width: '100%',
                    justifyContent: 'space-between',
                    // The rail marks the active item with an underline that
                    // sweeps in on hover-preview. In here the trigger above
                    // already carries that orange rule, so the item is left to
                    // the weight, ink and arrow colour alone.
                    borderBottom: 'none',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {tab.label}
                  <span style={arrowStyle(isActive)}>
                    <PixelArrow />
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      onMouseMove={recordMove}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexShrink: 0,
        // Held in place beside the panel, which is the only thing that scrolls.
        position: 'sticky',
        top: '56px',
        alignSelf: 'flex-start',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onMouseEnter={() => enterTab(tab.id)}
            onMouseLeave={cancelPending}
            onClick={() => commitTab(tab.id)}
            aria-current={isActive || undefined}
            style={railItemStyle(isActive)}
          >
            {tab.label}
            <span style={arrowStyle(isActive)}>
              <PixelArrow />
            </span>
            <span aria-hidden style={underlineStyle(isActive)} />
          </button>
        )
      })}
    </nav>
  )
}
