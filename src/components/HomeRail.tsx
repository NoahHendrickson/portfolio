import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowSquareDown, ArrowSquareLeft } from '@phosphor-icons/react'
import { color } from '../design-system/tokens'
import type { HomeTab } from '../homeTab'
import { WORK_FILTERS, type WorkFilter } from '../workFilter'

const ORANGE = color.accent.default
/** The file paints the spine and active pill white, not `--color-bg-inverse`. */
const PILL = '#ffffff'
/** The Work rail's column — the same cream `App` paints the sheet. */
const SHEET = color.bg.cream
const PAGE = color.bg.primary
const KEY_HINT = '#7f7f7e'
/**
 * The spine now runs the full height of the viewport, flush with its left
 * edge, at the file's 48 (Figma `365:6122`); the Work rail's "spine" is the
 * 16px channel of page left between the two white columns (`365:6192`).
 */
const SPINE_W = 48
const CHANNEL_W = 16
/** Inner radius at the spine join, up from 8 — the pill's own corners stay 8. */
const FILLET = 16
/** The file's 48 above the first row and below the last. */
const RAIL_PAD = 48
/** The white sheet's top-left corner (the `Subtract_3` in the Work rail's spine). */
const SHEET_RADIUS = 'var(--radius-xl)'
/** How far the main rail drops back while the Work rail has the keys. */
const DIMMED = 0.65

type RailItem<T extends string> = {
  id: T
  label: string
  /** Stands in for the arrow on the active pill — the Hi tab's pixel bloom. */
  glyph?: ReactNode
}

/**
 * The Hi tab's mark (Figma `365:11616`), a 16px pixel-art bloom the frame
 * seats where every other pill carries the orange arrow. Exported whole as an
 * SVG of the file's 0.696px squares, so it stays crisp at any density.
 */
const BLOOM = (
  <img src="/rail-bloom.svg" alt="" width={16} height={16} style={{ display: 'block', flexShrink: 0 }} />
)

const TABS: RailItem<HomeTab>[] = [
  { id: 'me', label: 'Hi', glyph: BLOOM },
  { id: 'work', label: 'Work' },
  { id: 'been', label: 'Where I’ve been' },
  { id: 'design', label: 'How I design' },
  { id: 'contact', label: 'Contact' },
  { id: 'lols', label: 'LOLs' },
]

const SUB_TABS: RailItem<WorkFilter>[] = WORK_FILTERS

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
 * The two rails are the same object with the colours swapped: the main rail is
 * a white pill reaching off a white spine onto the dark page, the Work rail a
 * dark pill reaching off the dark channel onto the white sheet.
 */
type RailPalette = {
  pill: string
  ink: string
  idle: string
}

const MAIN_PALETTE: RailPalette = { pill: PILL, ink: color.text.inverse, idle: color.text.secondary }
const SUB_PALETTE: RailPalette = { pill: PAGE, ink: color.text.primary, idle: color.ink.default }

/**
 * Everything the two states share, so that only `background`, `color` and
 * `fontWeight` differ between them. On the rail that matters because the pill
 * is laid *over* an idle row rather than replacing it, and the two labels have
 * to land on the same pixel; the properties only a pill can show (the radius,
 * the gap before the arrow) sit here rather than on `pillStyle` because an
 * idle tab is transparent and holds its arrow slot open anyway. The mobile
 * dropdown uses the two as ordinary button styles.
 */
const tabBase: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  // The file's 12 / 8, up from the 8 all round the earlier rail ran.
  padding: '8px 12px',
  border: 'none',
  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '16px',
  lineHeight: 'normal',
  letterSpacing: 0,
  whiteSpace: 'nowrap',
}

const idleStyle = (palette: RailPalette): CSSProperties => ({
  ...tabBase,
  background: 'transparent',
  fontWeight: 400,
  color: palette.idle,
})

const pillStyle = (palette: RailPalette): CSSProperties => ({
  ...tabBase,
  background: palette.pill,
  fontWeight: 500,
  color: palette.ink,
})

/**
 * The arrow's (or glyph's) footprint, held open in the idle button so a row is
 * the same width as the sliding pill (which draws the real one). Without it
 * the rail would reflow on every switch and the pill would be chasing a
 * moving box.
 */
const slotStyle = <T extends string>(item: RailItem<T>): CSSProperties =>
  item.glyph ? { width: '16px', height: '16px', flexShrink: 0 } : { width: '12px', height: '10px', flexShrink: 0 }

/**
 * How long the trailing edge waits before it follows. Long enough that the
 * stretch reads as a squash rather than a slide; short enough that a skip
 * across several rows doesn't leave the blob hanging.
 */
const PILL_STAGGER = '70ms'

/**
 * The join at the spine, which the file draws as a corner the page turns
 * rather than one the pill turns: the pill's colour keeps running past its
 * edge and the other surface rounds off against it, so the L reads as one
 * continuous ribbon. So the fillet sits *outside* the pill — a square of the
 * pill's colour with a quarter-disk knocked out of its far corner, which is
 * the inverse of a border-radius and can't be written as one. Both sides
 * always render; with the list padded by more than the fillet, they are never
 * clipped.
 */
function Fillet({ side, fill }: { side: 'top' | 'bottom'; fill: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        width: FILLET,
        height: FILLET,
        pointerEvents: 'none',
        ...(side === 'top'
          ? {
              bottom: '100%',
              background: `radial-gradient(circle ${FILLET}px at 100% 0, transparent ${FILLET}px, ${fill} ${FILLET + 0.5}px)`,
            }
          : {
              top: '100%',
              background: `radial-gradient(circle ${FILLET}px at 100% 100%, transparent ${FILLET}px, ${fill} ${FILLET + 0.5}px)`,
            }),
      }}
    />
  )
}

/**
 * The mobile menu's surface, on `ContactMenu`'s conventions — the raised
 * surface, the default border, the 2xl radius and an 8px pad — so the two
 * dropdowns on the site read as the same object.
 */
const MENU_SURFACE: CSSProperties = {
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

/**
 * How far back the pointer trail looks when judging direction, and how long a
 * deferred tab must be dwelled on before it switches anyway. The trail window
 * doubles as the staleness cutoff — with no fresh samples we can't infer
 * direction, so we fall back to switching immediately.
 */
const TRAIL_WINDOW_MS = 150
const DWELL_MS = 160

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/**
 * One rail: a spine beside a column of rows, with the active row's pill
 * sliding along the spine. Both rails on the page are this, differing only in
 * `palette`, the spine's width and colour, and whether the column itself is
 * painted (the Work rail is the left margin of the white sheet).
 */
function RailList<T extends string>({
  items,
  active,
  onEnter,
  onCommit,
  palette,
  spine,
  surface,
  hint,
  label,
  dimmed,
}: {
  items: RailItem<T>[]
  active: T
  onEnter: (id: T) => void
  onCommit: (id: T) => void
  palette: RailPalette
  spine: { width: number; background: string }
  /** Paint the column itself — the Work rail's white, with the sheet's corner. */
  surface?: { background: string; radius: string }
  /** The key hint beside the active pill. */
  hint: ReactNode
  label: string
  dimmed?: boolean
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const pillBox = useRef({ top: 0, bottom: 0, width: 0 })
  const [pillReady, setPillReady] = useState(false)
  const [pill, setPill] = useState({
    top: 0,
    bottom: 0,
    width: 0,
    topDelay: '0ms',
    bottomDelay: '0ms',
    widthDelay: '0ms',
    topEase: 'var(--rail-trail-ease)',
    bottomEase: 'var(--rail-trail-ease)',
    widthEase: 'var(--rail-trail-ease)',
  })

  /*
   * Seat the sliding pill on the active row. `top` and `bottom` are measured
   * as insets of the list so they can ease independently: going down, `bottom`
   * leads and `top` follows; going up, the reverse. The first layout is a
   * snap — animating in from 0,0 would stretch the blob down the whole rail.
   */
  useLayoutEffect(() => {
    const list = listRef.current
    const index = items.findIndex((item) => item.id === active)
    const btn = buttonsRef.current[index]
    if (!list || !btn) return

    const listRect = list.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const next = {
      top: btnRect.top - listRect.top,
      bottom: listRect.bottom - btnRect.bottom,
      width: btnRect.width,
    }
    const prev = pillBox.current
    const down = next.top > prev.top + 1
    const up = next.top < prev.top - 1
    const growing = next.width > prev.width + 1
    const stretch = pillReady && (down || up)

    pillBox.current = next
    setPill({
      ...next,
      topDelay: stretch && down ? PILL_STAGGER : '0ms',
      bottomDelay: stretch && up ? PILL_STAGGER : '0ms',
      widthDelay: stretch && !growing ? PILL_STAGGER : '0ms',
      topEase: down ? 'var(--rail-trail-ease)' : 'var(--rail-lead-ease)',
      bottomEase: up ? 'var(--rail-trail-ease)' : 'var(--rail-lead-ease)',
      widthEase: growing ? 'var(--rail-lead-ease)' : 'var(--rail-trail-ease)',
    })
  }, [active, items, pillReady])

  useEffect(() => {
    if (pillReady || pill.width === 0) return
    const id = requestAnimationFrame(() => setPillReady(true))
    return () => cancelAnimationFrame(id)
  }, [pillReady, pill.width])

  useEffect(() => {
    const onResize = () => {
      const list = listRef.current
      const index = items.findIndex((item) => item.id === active)
      const btn = buttonsRef.current[index]
      if (!list || !btn) return
      const listRect = list.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      const next = {
        top: btnRect.top - listRect.top,
        bottom: listRect.bottom - btnRect.bottom,
        width: btnRect.width,
      }
      pillBox.current = next
      setPill((prev) => ({
        ...prev,
        ...next,
        topDelay: '0ms',
        bottomDelay: '0ms',
        widthDelay: '0ms',
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active, items])

  /*
   * Hover-intent guard: leaving the active tab for the content means sweeping
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

  const enterTab = (id: T) => {
    cancelPending()
    if (id === active) return

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
        onEnter(id)
      }, DWELL_MS)
    } else {
      onEnter(id)
    }
  }

  const commitTab = (id: T) => {
    cancelPending()
    onCommit(id)
  }

  return (
    <div
      onMouseMove={recordMove}
      role="group"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
        height: '100%',
        opacity: dimmed ? DIMMED : 1,
        transition: 'opacity 200ms ease',
      }}
    >
      <div aria-hidden style={{ width: spine.width, flexShrink: 0, background: spine.background }} />
      <div
        ref={listRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          boxSizing: 'border-box',
          padding: `${RAIL_PAD}px 0`,
          background: surface?.background,
          borderTopLeftRadius: surface?.radius,
          // Clips the painted column at its corner. Fillets hang into the
          // neighbouring row or the padding, still inside this box.
          overflow: 'hidden',
        }}
      >
        {items.map((item, index) => {
          const isActive = item.id === active
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <button
                ref={(el) => {
                  buttonsRef.current[index] = el
                }}
                type="button"
                onMouseEnter={() => enterTab(item.id)}
                onMouseLeave={cancelPending}
                onClick={() => commitTab(item.id)}
                aria-current={isActive || undefined}
                style={idleStyle(palette)}
              >
                {item.label}
                <span aria-hidden style={slotStyle(item)} />
              </button>
              {isActive && hint}
            </div>
          )
        })}
        {pill.width > 0 && (
          <div
            aria-hidden
            className="rail-pill"
            data-animate={pillReady}
            style={
              {
                position: 'absolute',
                left: 0,
                top: pill.top,
                bottom: pill.bottom,
                width: pill.width,
                pointerEvents: 'none',
                zIndex: 1,
                '--rail-top-delay': pill.topDelay,
                '--rail-bottom-delay': pill.bottomDelay,
                '--rail-width-delay': pill.widthDelay,
                '--rail-top-ease': pill.topEase,
                '--rail-bottom-ease': pill.bottomEase,
                '--rail-width-ease': pill.widthEase,
              } as CSSProperties
            }
          >
            <div
              className="rail-pill-clip"
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                background: palette.pill,
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              }}
            >
              {/*
               * Ink copies of every label, stacked to match the buttons, then
               * offset by -top so they stay world-aligned as the clip moves.
               * The blob is a window onto them: idle type underneath, ink only
               * where the pill covers — including both rows while the arm is
               * stretched. Padded by the same 48 the buttons start under.
               */}
              <div
                className="rail-pill-ink"
                style={{
                  position: 'absolute',
                  top: -pill.top,
                  left: 0,
                  paddingTop: RAIL_PAD,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                {items.map((item) => (
                  <div key={item.id} style={pillStyle(palette)}>
                    {item.label}
                    {item.glyph ?? (
                      <span style={{ color: ORANGE, display: 'flex' }}>
                        <PixelArrow />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Fillet side="top" fill={palette.pill} />
            <Fillet side="bottom" fill={palette.pill} />
          </div>
        )}
      </div>
    </div>
  )
}

const KEY_ICON: CSSProperties = { flexShrink: 0, display: 'block' }

export default function HomeRail({
  active,
  onSelect,
  filter,
  onSelectFilter,
  isMobile,
}: {
  active: HomeTab
  onSelect: (tab: HomeTab) => void
  filter: WorkFilter
  onSelectFilter: (filter: WorkFilter) => void
  isMobile: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  /*
   * Which rail the arrow keys drive while Work is open. Hovering or clicking
   * into Work hands them to the Work rail (the frame's dimmed main rail);
   * arrowing *onto* Work from a neighbour keeps them on the main rail so the
   * next press carries on down it. Left and right move between the two.
   */
  const [subFocus, setSubFocus] = useState(false)
  const showSub = active === 'work' && !isMobile
  const subHasKeys = showSub && subFocus

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      if (showSub && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault()
        setSubFocus(e.key === 'ArrowRight')
        return
      }

      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1

      if (subHasKeys) {
        const i = SUB_TABS.findIndex((item) => item.id === filter)
        onSelectFilter(SUB_TABS[(i + step + SUB_TABS.length) % SUB_TABS.length].id)
        return
      }

      const i = TABS.findIndex((tab) => tab.id === active)
      onSelect(TABS[(i + step + TABS.length) % TABS.length].id)
      setSubFocus(false)
      setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, filter, onSelect, onSelectFilter, showSub, subHasKeys])

  const selectTab = (tab: HomeTab) => {
    onSelect(tab)
    setSubFocus(tab === 'work')
  }

  const selectFilter = (next: WorkFilter) => {
    onSelectFilter(next)
    setSubFocus(true)
  }

  /*
   * Mobile is a dropdown rather than the rail (Figma `325:43995`). Six tabs
   * wrapped into rows ate a third of a phone screen before the panel started,
   * and the rail's whole affordance — hover to preview — has no meaning on
   * touch anyway, so the closed state shows only where you are. The trigger is
   * the active item's pill, carrying the file's stacked caret pair in place of
   * the rail's travel arrow — it stays put on open, since the glyph says
   * unfoldable rather than pointing anywhere. The Work sections stay inside
   * `WorkList` as its pill row here.
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
          aria-label={`${activeLabel}. Open sections`}
          style={{
            ...pillStyle(MAIN_PALETTE),
            width: 'max-content',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {activeLabel}
          <span style={{ color: ORANGE, display: 'flex' }}>
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
                    onSelect(tab.id)
                  }}
                  style={{
                    ...(isActive ? pillStyle(MAIN_PALETTE) : idleStyle(MAIN_PALETTE)),
                    width: '100%',
                    justifyContent: 'space-between',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <span style={{ color: ORANGE, display: 'flex' }}>
                      <PixelArrow />
                    </span>
                  )}
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
      aria-label="Site sections. Up and down arrows to switch."
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
        height: '100%',
      }}
    >
      <RailList
        items={TABS}
        active={active}
        onEnter={selectTab}
        onCommit={selectTab}
        palette={MAIN_PALETTE}
        spine={{ width: SPINE_W, background: PILL }}
        hint={<ArrowSquareDown size={16} color={KEY_HINT} aria-hidden style={KEY_ICON} />}
        label="Sections"
        dimmed={subHasKeys}
      />
      {showSub && (
        // The Work rail: the sheet's left margin, reached across the 16px
        // channel of page the file leaves between the two columns. Left and
        // right arrows hand the keys between the rails, so its pill carries
        // both hints stacked (the file's Frame 1707481694).
        <RailList
          items={SUB_TABS}
          active={filter}
          onEnter={selectFilter}
          onCommit={selectFilter}
          palette={SUB_PALETTE}
          spine={{ width: CHANNEL_W, background: 'transparent' }}
          surface={{ background: SHEET, radius: SHEET_RADIUS }}
          hint={
            <span aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <ArrowSquareLeft size={16} color={KEY_HINT} style={KEY_ICON} />
              <ArrowSquareDown size={16} color={KEY_HINT} style={KEY_ICON} />
            </span>
          }
          label="Work sections. Left and right arrows to move between rails."
        />
      )}
    </nav>
  )
}
