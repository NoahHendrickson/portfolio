import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { color, radius } from '../design-system/tokens'
import type { HomeTab } from '../homeTab'
import { WORK_FILTERS, type WorkFilter } from '../data/workCards'

const ORANGE = color.accent.default
/** The file paints the spine, the active pill and the Work card white, not `--color-bg-inverse`. */
const PILL = '#ffffff'
/**
 * The spine runs the full height of the viewport, flush with its left edge,
 * at the file's 48 (Figma `365:6122`).
 */
const SPINE_W = 48
/** Inner radius at the spine join, up from 8 — the pill's own corners stay 8. */
const FILLET = 16
/** The file's 48 above the first row and below the last. */
const RAIL_PAD = 48

/**
 * The Work card (Figma `373:12447`): 16 off the spine and off the rows either
 * side, 8 inside, the rows on the tabs' own rhythm and 10 apart.
 */
const MENU_INSET = 16
const MENU_PAD = 8
const MENU_GAP = 10

type RailItem<T extends string> = {
  id: T
  label: string
  /** What the active pill carries in place of the arrow — one of the pixel faces. */
  glyph?: ReactNode
}

/**
 * A pixel-art mark: 2px squares at `dots` (each a top-left corner) inside a
 * `width` × `height` box, on `currentColor` so the parent recolours it with
 * the label. Every glyph on the rail is one of these, its dots read straight
 * off the frame's rects rather than shipped as the export, which bakes the
 * canvas, page and pill fills in around the squares.
 */
function PixelGlyph({ dots, width, height }: { dots: [number, number][]; width: number; height: number }) {
  return (
    <span
      aria-hidden
      style={{ position: 'relative', width: `${width}px`, height: `${height}px`, flexShrink: 0, display: 'block' }}
    >
      {dots.map(([x, y]) => (
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
 * The 16px pixel faces the frame seats where a pill otherwise carries the
 * orange arrow: the Hi tab's (Figma `371:12378`) and the three in section
 * `372:12388`. Each is two eyes over a mouth, drawn on the 2px grid.
 */
const FACE_DOTS = {
  /** `371:12378` — a smile that turns up at its right end. */
  smirk: [
    [5, 2],
    [9, 2],
    [5, 4],
    [9, 4],
    [11, 8],
    [5, 10],
    [7, 10],
    [9, 10],
  ],
  /** `371:12355` — an open grin. */
  grin: [
    [5, 4],
    [9, 4],
    [3, 8],
    [11, 8],
    [3, 10],
    [5, 10],
    [7, 10],
    [9, 10],
    [11, 10],
  ],
  /** `371:12365` — laughing, eyes up and the mouth wide open. */
  laugh: [
    [5, 2],
    [9, 2],
    [3, 6],
    [5, 6],
    [7, 6],
    [9, 6],
    [11, 6],
    [3, 8],
    [11, 8],
    [5, 10],
    [7, 10],
    [9, 10],
  ],
  /** `371:12346` — a typed `:)`, turned upright to match the other faces. */
  emoticon: [
    [5, 4],
    [9, 4],
    [12, 8],
    [10, 10],
    [8, 10],
    [6, 10],
    [4, 10],
    [2, 8],
  ],
} satisfies Record<string, [number, number][]>

const face = (name: keyof typeof FACE_DOTS) => (
  <span style={{ color: ORANGE, display: 'flex' }}>
    <PixelGlyph dots={FACE_DOTS[name]} width={16} height={16} />
  </span>
)

/**
 * Hi takes its own face; the other three cycle down the rest of the rail, so
 * every pill carries a face and none of them the arrow.
 */
const TABS: RailItem<HomeTab>[] = [
  { id: 'me', label: 'Hi', glyph: face('smirk') },
  { id: 'work', label: 'Work', glyph: face('grin') },
  { id: 'been', label: 'Where I’ve been', glyph: face('laugh') },
  { id: 'design', label: 'How I design', glyph: face('emoticon') },
  { id: 'contact', label: 'Contact', glyph: face('grin') },
  { id: 'lols', label: 'LOLs', glyph: face('laugh') },
]

/** The Work card's mark is the Work pill's own face (Figma `373:12494`). */
const WORK_MARK = TABS.find((tab) => tab.id === 'work')?.glyph

/**
 * The rail's 12 × 10 arrow, drawn as 2px squares the way the file builds it —
 * a shaft on the middle row and a two-step head.
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
  return <PixelGlyph dots={ARROW_DOTS} width={12} height={10} />
}

/**
 * The mobile trigger's glyph (Figma `325:44006`): an up chevron over a down
 * one, the pair that marks a control you unfold rather than a direction you
 * travel. Read off the exported frame — two 10 × 6 chevrons with a 4px
 * channel between them.
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
  return <PixelGlyph dots={CARET_PAIR_DOTS} width={10} height={16} />
}

/** The rail's colours: a white pill reaching off a white spine onto the dark page. */
type RailPalette = {
  pill: string
  ink: string
  idle: string
}

const MAIN_PALETTE: RailPalette = { pill: PILL, ink: color.text.inverse, idle: color.text.secondary }

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
 * deferred row must be dwelled on before it switches anyway. The trail window
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
 * Hover-intent guard, shared by the rail and the Work menu: leaving the active
 * row for the content means sweeping rightward across the rows below it, and a
 * naive mouseenter would swap the panel mid-flight. So the list keeps a short
 * trail of pointer positions, and a row entered while the pointer is heading
 * rightward (toward the content) only commits after a dwell — crossing it
 * does nothing, stopping on it still selects. Vertical movement along the
 * list switches instantly, and click always commits.
 */
function useHoverIntent<T>(active: T, onEnter: (id: T) => void, onCommit: (id: T) => void) {
  const trail = useRef<{ x: number; y: number; t: number }[]>([])
  const pending = useRef<number | null>(null)

  const cancel = () => {
    if (pending.current !== null) {
      clearTimeout(pending.current)
      pending.current = null
    }
  }

  useEffect(() => cancel, [])

  const move = (e: React.MouseEvent) => {
    const now = performance.now()
    trail.current.push({ x: e.clientX, y: e.clientY, t: now })
    while (trail.current.length && now - trail.current[0].t > TRAIL_WINDOW_MS) {
      trail.current.shift()
    }
  }

  const enter = (id: T) => {
    cancel()
    if (id === active) return

    const now = performance.now()
    const fresh = trail.current.filter((p) => now - p.t <= TRAIL_WINDOW_MS)
    let headingToContent = false
    if (fresh.length >= 2) {
      const dx = fresh[fresh.length - 1].x - fresh[0].x
      const dy = fresh[fresh.length - 1].y - fresh[0].y
      // Rightward within a wide cone (~76° either side of horizontal): the
      // pointer is probably aiming at the content, not this row. Anything
      // steeper is reading down the list.
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

  const commit = (id: T) => {
    cancel()
    onCommit(id)
  }

  return { move, enter, leave: cancel, commit }
}

/**
 * The Work menu (Figma `373:12447`): the white card that unfolds under the
 * Work pill, its mark at the top and a row per section — label and count.
 * The active row is the file's 8% ink wash; hover and click select the way
 * the rail's own rows do.
 */
function FilterMenu({
  active,
  onEnter,
  onCommit,
}: {
  active: WorkFilter
  onEnter: (id: WorkFilter) => void
  onCommit: (id: WorkFilter) => void
}) {
  const hover = useHoverIntent(active, onEnter, onCommit)
  return (
    <div
      role="group"
      aria-label="Work sections"
      onMouseMove={hover.move}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: MENU_GAP,
        padding: MENU_PAD,
        background: PILL,
        borderRadius: radius.md,
        width: 'max-content',
      }}
    >
      {WORK_MARK}
      {WORK_FILTERS.map((filter) => {
        const isActive = filter.id === active
        return (
          <button
            key={filter.id}
            type="button"
            data-rail-filter={filter.id}
            onMouseEnter={() => hover.enter(filter.id)}
            onMouseLeave={hover.leave}
            onClick={() => hover.commit(filter.id)}
            aria-pressed={isActive}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: radius.md,
              background: isActive ? `color-mix(in srgb, ${color.ink.default} 8%, transparent)` : 'transparent',
              color: color.text.inverse,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: 0,
              whiteSpace: 'nowrap',
              transition: 'background 120ms ease',
            }}
          >
            {filter.label}
            {/* The file's count at 45% ink; tabular so a wider digit can't nudge the row. */}
            <span
              style={{
                color: `color-mix(in srgb, ${color.ink.default} 45%, transparent)`,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {filter.cards.length}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type Seat = { top: number; bottom: number; width: number; rows: number[] }

type MenuBox = { wrap: HTMLElement | null; card: HTMLElement | null; index: number; open: boolean }

/** The height the menu is about to gain (or, negative, lose) from where it stands now. */
function menuDelta(menu: MenuBox) {
  if (!menu.wrap || !menu.card) return 0
  const target = menu.open ? menu.card.getBoundingClientRect().height : 0
  return target - menu.wrap.getBoundingClientRect().height
}

/** The list's top offset as it is painted right now — mid-slide, the interpolated value. */
function renderedOffset(list: HTMLElement) {
  return parseFloat(getComputedStyle(list).paddingTop) - RAIL_PAD
}

/**
 * The most the list can be pushed down before its last row would leave the
 * rail's bottom pad, once the menu has reached its target height.
 */
function maxOffset(list: HTMLElement, buttons: (HTMLElement | null)[], menu: MenuBox) {
  const first = buttons[0]
  const last = buttons[buttons.length - 1]
  if (!first || !last) return 0
  const content = last.getBoundingClientRect().bottom - first.getBoundingClientRect().top + menuDelta(menu)
  return Math.max(0, list.getBoundingClientRect().height - RAIL_PAD * 2 - content)
}

/**
 * Where the pill and every row's ink copy sit, as insets of the list — which
 * is the rail's full height, so `bottom` doesn't drift while the menu
 * unfolds. The menu is measured where it is *going*, not where it is: the
 * layout effect runs before the unfold's first frame, when the rows under
 * the menu still stand at their old positions, so they (and a pill headed
 * for one) are shifted by the height the menu is about to gain or lose, and
 * the pill and the rows arrive together instead of the pill chasing them.
 */
function seatFor(
  list: HTMLElement | null,
  buttons: (HTMLElement | null)[],
  activeIndex: number,
  menu: MenuBox,
  /** How far the list's top offset is still going to move every row. */
  offsetDelta = 0,
): Seat | null {
  const btn = buttons[activeIndex]
  if (!list || !btn) return null

  const delta = menuDelta(menu)
  const shift = (i: number) => (menu.index >= 0 && i > menu.index ? delta : 0) + offsetDelta

  const listRect = list.getBoundingClientRect()
  const rows = buttons.map((b, i) => (b ? b.getBoundingClientRect().top - listRect.top + shift(i) : 0))
  const btnRect = btn.getBoundingClientRect()
  return {
    top: rows[activeIndex],
    bottom: listRect.bottom - btnRect.bottom - shift(activeIndex),
    width: btnRect.width,
    rows,
  }
}

/**
 * The rail: a spine beside a column of rows, with the active row's pill
 * sliding along the spine. `menu` is a card that unfolds in the flow under
 * one row while that row is active.
 */
function RailList<T extends string>({
  items,
  active,
  onEnter,
  onCommit,
  palette,
  spine,
  menu,
  label,
}: {
  items: RailItem<T>[]
  active: T
  onEnter: (id: T) => void
  onCommit: (id: T) => void
  palette: RailPalette
  spine: { width: number; background: string }
  menu?: { at: T; node: ReactNode }
  label: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const menuWrapRef = useRef<HTMLDivElement>(null)
  const menuCardRef = useRef<HTMLDivElement>(null)
  const pillBox = useRef({ top: 0, bottom: 0, width: 0 })
  const [pillReady, setPillReady] = useState(false)
  /*
   * How far the whole list is pushed down from the rail's top pad. The rail
   * is top-anchored, so a closing menu would lift every row under it — and
   * the row the pointer just landed on with them. When the menu closes for a
   * row *below* it, the list is pushed down by the height the menu gives up
   * instead, on the same curve, so those rows hold still and Hi and Work
   * slide down to close the gap. Opening never moves the offset (Work is
   * above the menu and stays put), so it only ever grows on those closes;
   * `maxOffset` stops it pushing the last row off the rail. Leaving the rail
   * for the page releases it — the list slides home so the next visit starts
   * from the top pad again.
   */
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)
  const wasOpen = useRef(false)
  /** The slide back to the top pad, after the pointer leaves the rail. */
  const [homing, setHoming] = useState(false)
  const [pill, setPill] = useState({
    top: 0,
    bottom: 0,
    width: 0,
    rows: [] as number[],
    topDelay: '0ms',
    bottomDelay: '0ms',
    widthDelay: '0ms',
    topEase: 'var(--rail-trail-ease)',
    bottomEase: 'var(--rail-trail-ease)',
    widthEase: 'var(--rail-trail-ease)',
  })

  const menuOpen = menu !== undefined && menu.at === active
  const menuIndex = menu ? items.findIndex((item) => item.id === menu.at) : -1
  const activeIndex = items.findIndex((item) => item.id === active)

  /*
   * Seat the sliding pill on the active row. `top` and `bottom` are measured
   * as insets of the list so they can ease independently: going down, `bottom`
   * leads and `top` follows; going up, the reverse. The first layout is a
   * snap — animating in from 0,0 would stretch the blob down the whole rail.
   */
  useLayoutEffect(() => {
    const list = listRef.current
    const menuBox = { wrap: menuWrapRef.current, card: menuCardRef.current, index: menuIndex, open: menuOpen }
    let offsetDelta = 0
    if (list) {
      const rendered = renderedOffset(list)
      let desired = offsetRef.current
      if (wasOpen.current && !menuOpen && activeIndex > menuIndex) {
        // Closing under a row below the menu: take up what the menu gives up.
        desired = rendered - menuDelta(menuBox)
      } else if (activeIndex <= menuIndex) {
        // A row above the menu (or Work itself) is the target: if the list is
        // mid-slide, hold it where it is so that row stops under the pointer.
        desired = rendered
      }
      desired = Math.min(desired, maxOffset(list, buttonsRef.current, menuBox))
      offsetRef.current = desired
      setOffset(desired)
      setHoming(false)
      offsetDelta = desired - rendered
    }
    wasOpen.current = menuOpen

    const next = seatFor(list, buttonsRef.current, activeIndex, menuBox, offsetDelta)
    if (!next) return
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
  }, [activeIndex, menuIndex, menuOpen, pillReady])

  useEffect(() => {
    if (pillReady || pill.width === 0) return
    const id = requestAnimationFrame(() => setPillReady(true))
    return () => cancelAnimationFrame(id)
  }, [pillReady, pill.width])

  // A plain re-seat, for layout that moved under the pill (a resize, or the
  // menu finishing its unfold) rather than a row change: no stagger.
  const reseat = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const menuBox = { wrap: menuWrapRef.current, card: menuCardRef.current, index: menuIndex, open: menuOpen }
    const clamped = Math.min(offsetRef.current, maxOffset(list, buttonsRef.current, menuBox))
    if (clamped !== offsetRef.current) {
      offsetRef.current = clamped
      setOffset(clamped)
    }
    const next = seatFor(list, buttonsRef.current, activeIndex, menuBox, clamped - renderedOffset(list))
    if (!next) return
    pillBox.current = next
    setPill((prev) => ({ ...prev, ...next, topDelay: '0ms', bottomDelay: '0ms', widthDelay: '0ms' }))
  }, [activeIndex, menuIndex, menuOpen])

  useEffect(() => {
    window.addEventListener('resize', reseat)
    return () => window.removeEventListener('resize', reseat)
  }, [reseat])

  /*
   * The offset exists so a closing menu doesn't pull the row out from under
   * the pointer. Once the pointer has left the rail, nothing is under it —
   * slide the list back to the top pad (a little springier than the close)
   * and take the pill with it so it stays seated on the active row.
   */
  const releaseOffset = useCallback(() => {
    const list = listRef.current
    if (!list || offsetRef.current === 0) return
    const menuBox = { wrap: menuWrapRef.current, card: menuCardRef.current, index: menuIndex, open: menuOpen }
    const rendered = renderedOffset(list)
    offsetRef.current = 0
    setOffset(0)
    setHoming(true)
    const next = seatFor(list, buttonsRef.current, activeIndex, menuBox, -rendered)
    if (!next) return
    pillBox.current = next
    setPill((prev) => ({
      ...prev,
      ...next,
      topDelay: '0ms',
      bottomDelay: '0ms',
      widthDelay: '0ms',
      topEase: 'var(--rail-home-ease)',
      bottomEase: 'var(--rail-home-ease)',
      widthEase: 'var(--rail-home-ease)',
    }))
  }, [activeIndex, menuIndex, menuOpen])

  const hover = useHoverIntent(active, onEnter, onCommit)

  return (
    <div
      onMouseMove={hover.move}
      onMouseLeave={releaseOffset}
      role="group"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
        height: '100%',
      }}
    >
      <div aria-hidden style={{ width: spine.width, flexShrink: 0, background: spine.background }} />
      <div
        ref={listRef}
        className="rail-list"
        data-animate={pillReady}
        data-homing={homing}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && e.propertyName === 'padding-top') reseat()
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          boxSizing: 'border-box',
          padding: `${RAIL_PAD + offset}px 0 ${RAIL_PAD}px`,
          // Fillets hang into the neighbouring row or the padding, still
          // inside this box.
          overflow: 'hidden',
        }}
      >
        {items.map((item, index) => {
          const isActive = item.id === active
          const hasMenu = menu !== undefined && item.id === menu.at
          return (
            <div key={item.id} style={{ display: 'contents' }}>
              <button
                ref={(el) => {
                  buttonsRef.current[index] = el
                }}
                type="button"
                data-rail-tab={item.id}
                onMouseEnter={() => hover.enter(item.id)}
                onMouseLeave={hover.leave}
                onClick={() => hover.commit(item.id)}
                aria-current={isActive || undefined}
                style={idleStyle(palette)}
              >
                {item.label}
                <span aria-hidden style={slotStyle(item)} />
              </button>
              {hasMenu && (
                <div
                  ref={menuWrapRef}
                  className="rail-menu"
                  data-open={isActive}
                  inert={!isActive}
                  onTransitionEnd={(e) => {
                    if (e.target === e.currentTarget) reseat()
                  }}
                  style={{ display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr' }}
                >
                  <div style={{ overflow: 'hidden', minHeight: 0 }}>
                    <div ref={menuCardRef} className="rail-menu-card" style={{ padding: MENU_INSET }}>
                      {menu.node}
                    </div>
                  </div>
                </div>
              )}
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
               * Ink copies of every label, each seated at its button's measured
               * top and the whole stack offset by -top so they stay
               * world-aligned as the clip moves. The blob is a window onto
               * them: idle type underneath, ink only where the pill covers —
               * including both rows while the arm is stretched. Measured
               * rather than stacked in flow because the menu sits between two
               * of the buttons.
               */}
              <div className="rail-pill-ink" style={{ position: 'absolute', top: -pill.top, left: 0 }}>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rail-pill-row"
                    style={{ ...pillStyle(palette), position: 'absolute', top: pill.rows[index] ?? 0, left: 0 }}
                  >
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
  const railRef = useRef<HTMLElement | null>(null)
  /** Set by the arrow walk so focus follows the row after React commits — hover must not steal it. */
  const pendingFocus = useRef<'trigger' | { tab: HomeTab } | { filter: WorkFilter } | null>(null)

  const menuOpen = active === 'work' && !isMobile

  useLayoutEffect(() => {
    const pending = pendingFocus.current
    pendingFocus.current = null
    const root = railRef.current
    if (!pending || !root) return
    const sel =
      pending === 'trigger'
        ? '[data-rail-trigger]'
        : 'filter' in pending
          ? `[data-rail-filter="${pending.filter}"]`
          : `[data-rail-tab="${pending.tab}"]`
    const el = root.querySelector(sel)
    if (el instanceof HTMLElement) el.focus({ preventScroll: true })
  }, [active, filter])

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (railRef.current && !railRef.current.contains(e.target as Node)) setIsOpen(false)
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
   * The arrow keys walk one list, and only while focus is in the rail — Hi,
   * Work/All … Work/Graphic design, Where I've been, and so on. Stepping onto
   * Work from above lands on its first section and from below on its last, so
   * the walk is linear; hover and click keep whatever section was set. A press
   * from the panel (or anywhere else) is left alone so the scroller can move.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      if (!(e.target instanceof Node) || !railRef.current?.contains(e.target)) return
      e.preventDefault()

      const step = e.key === 'ArrowDown' ? 1 : -1
      const i = TABS.findIndex((tab) => tab.id === active)
      const neighbour = TABS[(i + step + TABS.length) % TABS.length].id
      setIsOpen(false)

      if (isMobile) {
        pendingFocus.current = 'trigger'
        onSelect(neighbour)
        return
      }

      if (menuOpen) {
        const fi = WORK_FILTERS.findIndex((entry) => entry.id === filter)
        const next = WORK_FILTERS[fi + step]
        if (next) {
          pendingFocus.current = { filter: next.id }
          onSelectFilter(next.id)
          return
        }
        pendingFocus.current = { tab: neighbour }
        onSelect(neighbour)
        return
      }

      if (neighbour === 'work') {
        const entry = step === 1 ? WORK_FILTERS[0] : WORK_FILTERS[WORK_FILTERS.length - 1]
        pendingFocus.current = { filter: entry.id }
        onSelectFilter(entry.id)
      } else {
        pendingFocus.current = { tab: neighbour }
      }
      onSelect(neighbour)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, filter, isMobile, menuOpen, onSelect, onSelectFilter])

  /*
   * Mobile is a dropdown rather than the rail (Figma `325:43995`). Six tabs
   * wrapped into rows ate a third of a phone screen before the panel started,
   * and the rail's whole affordance — hover to preview — has no meaning on
   * touch anyway, so the closed state shows only where you are. The trigger is
   * the active item's pill, carrying the file's stacked caret pair in place of
   * the rail's travel arrow — it stays put on open, since the glyph says
   * unfoldable rather than pointing anywhere. The Work sections live inside
   * `WorkList` as its pill row here.
   */
  if (isMobile) {
    const activeLabel = TABS.find((tab) => tab.id === active)?.label ?? TABS[0].label
    return (
      <div
        ref={(el) => {
          railRef.current = el
        }}
        style={{ position: 'relative', alignSelf: 'flex-start' }}
      >
        <button
          type="button"
          data-rail-trigger
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
      ref={railRef}
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
        onEnter={onSelect}
        onCommit={onSelect}
        palette={MAIN_PALETTE}
        spine={{ width: SPINE_W, background: PILL }}
        menu={{
          at: 'work',
          node: <FilterMenu active={filter} onEnter={onSelectFilter} onCommit={onSelectFilter} />,
        }}
        label="Sections"
      />
    </nav>
  )
}
