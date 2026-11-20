import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react'
import CompareSlider from './CompareSlider'
import { CurvedCard, CurvedCopy } from './Curved'
import { Interlock, Piece } from './Interlock'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_INNER, TEXT_SOFT, curvedInset } from '../sheetStyle'
import { CODE_CONNECT_SNIPPET, STORYBOOK_SHOT } from '../data/no3yDesignSystem'

/*
  Prototype B's design-system chapter, on the page's curved cards (Nov 19 2026):
  1. `Themes & the design system`: a card holding the page's three-theme slider (the new agent
     screen in Basic, Glass and Inlet), with the story on its tab: the themes, and why one system
     sits under Figma and the code.
  2. `The kit, wired to code`: its numbers, then Figma (a carousel of the kit's components running
     off the page), Code Connect and Storybook as plain rows on the page, a heading and a sentence
     beside each picture (Nov 19 2026; a chain of curved cards, then a framed bento, before). The
     kit's frames open full size in a lightbox.
*/

const DS = '/work/no3y-code/design-system'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/** The themes card's copy: the themes, then why one system sits under Figma and the code. */
const STORY_INTRO = [
  'no3y Code ships with three themes: Basic in five tones from light to dark, Glass letting the wallpaper show through, and Inlet in six colors. Keeping multiple themes alive used to be a maintenance headache. With agents doing the heavy lifting, it became a playground. I could feed them visual references, build out a component library, and test whole UI directions in real code on the fly instead of leaving them stuck in static mocks.',
  'I go back and forth between Figma and code a lot, so it was important to have one shared system under both. A change I make in Figma carries over to the code, and a change in the code carries back to Figma.',
]

const PROOF_STATS = [
  { value: '170', label: 'Basic color variables' },
  { value: '8', label: 'tone modes + Glass & Inlet' },
  { value: '272', label: 'icons synced from code' },
  { value: '326', label: 'live Storybook stories' },
] as const

type CuratedFrame = {
  id: string
  label: string
  caption: string
  src: string
  width: number
  height: number
  /** The component in a 680 square of the kit's fill (`kit-squares.mjs`, 2x): its title and a few
      of its variants, at a size that reads in the carousel. Inspect opens the full frame. */
  square: string
  alt: string
}

const CURATED_FRAMES: CuratedFrame[] = [
  {
    id: 'thread-card',
    label: 'Thread card',
    caption: '60 variants: 10 statuses × default, hover, selected, and compact cards in one Figma matrix.',
    src: `${DS}/frame-thread-card.webp`,
    width: 1870,
    height: 1738,
    square: `${DS}/square-thread-card.webp`,
    alt: 'The Thread card Figma component matrix showing 10 statuses across default, hover, selected, and compact states',
  },
  {
    id: 'petal-card',
    label: 'Petal card',
    caption: 'A Petal in the sidebar: its mascot on a tile in its own color, its name and report, in every status.',
    src: `${DS}/frame-petal-card.webp`,
    width: 1008,
    height: 480,
    square: `${DS}/square-petal-card.webp`,
    alt: 'The Petal card Figma component frame showing a Petal in each status, default, hover and selected',
  },
  {
    id: 'model-picker',
    label: 'Model picker & slider',
    caption: 'Provider rail, searchable models, segmented tiers, and every step of the dithered effort slider.',
    src: `${DS}/frame-model-picker.webp`,
    width: 1008,
    height: 719,
    square: `${DS}/square-model-picker.webp`,
    alt: 'The Model picker Figma component frame showing the provider rail, model list, and dithered reasoning effort slider steps',
  },
  {
    id: 'petal-mascots',
    label: 'Petal mascots',
    caption: '14 pixel-art leaf shapes × 5 moods, tile-on and tile-off, bound to per-mascot body tokens.',
    src: `${DS}/frame-petal-mascots.webp`,
    width: 1008,
    height: 935,
    square: `${DS}/square-petal-mascots.webp`,
    alt: 'The Petal mascots Figma frame displaying 14 pixel-art leaf shapes across 5 moods with and without tinted tiles',
  },
  {
    id: 'thread-status',
    label: 'Thread status marks',
    caption: 'Completed, idle, needs attention, failed, plus the Rain and Bead animated working loops.',
    src: `${DS}/frame-thread-status.webp`,
    width: 1164,
    height: 406,
    square: `${DS}/square-thread-status.webp`,
    alt: 'The Thread status Figma frame showing completed, idle, needs attention, failed, and the Rain and Bead working states',
  },
  {
    id: 'subagent-card',
    label: 'Subagent card',
    caption: '4 lifecycle states, folded and expanded, plus grouped subagent batches for the transcript.',
    src: `${DS}/frame-subagent-card.webp`,
    width: 1624,
    height: 1242,
    square: `${DS}/square-subagent-card.webp`,
    alt: 'The Subagent card Figma component frame showing working, done, failed, and stopped states folded and expanded',
  },
]


/**
 * The Basic tones the carousel can show (Nov 19 2026): the kit's Basic collection's modes, each
 * frame exported in it and built into squares (`kit-squares.mjs <dir> <out> <tone>`). Dark Neutral
 * is the kit's own and the default; the "Darker" modes are left out as near twins.
 */
const KIT_TONES = [
  { id: 'light', label: 'Light' },
  { id: 'cream', label: 'Cream' },
  { id: 'dark-warm', label: 'Dark Warm' },
  { id: 'dark-cool', label: 'Dark Cool' },
  { id: 'dark-neutral', label: 'Dark Neutral' },
] as const
type KitTone = (typeof KIT_TONES)[number]['id']
/** A frame's square in a tone: Dark Neutral's are the originals, the rest `square-<tone>-<id>`. */
const squareFor = (frame: CuratedFrame, tone: KitTone) => (tone === 'dark-neutral' ? frame.square : `${DS}/square-${tone}-${frame.id}.webp`)

/** The kit frames' fill (Dark Neutral's background), which the Figma canvas tile takes too. */
const KIT_FILL = '#2b2b2b'

/** The kit's numbers in one row under its heading, two to a row on a phone. */
function ProofStats() {
  const isMobile = useIsMobile()
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
        gap: `${space.xl} ${space.lg}`,
      }}
    >
      {PROOF_STATS.map((stat) => (
        <li key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...type['heading-l'], color: color.text.primary, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</span>
          <span style={{ ...type['body-s'], color: TEXT_SOFT }}>{stat.label}</span>
        </li>
      ))}
    </ul>
  )
}

type Zoom = { title: string; caption: string; src: string; alt: string }

function Lightbox({ item, onClose }: { item: Zoom | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    else if (!item && dialog.open) dialog.close()
  }, [item])

  return (
    <dialog
      ref={ref}
      data-theme="dark"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      style={{
        padding: 0,
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: radius.xl,
        background: '#1c1c1e',
        color: '#f2f2f2',
        maxWidth: 'min(94vw, 1280px)',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.65)',
      }}
    >
      {item && (
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space.md,
              padding: `${space.md} ${space.lg}`,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ ...type['label-m'], color: '#f2f2f2' }}>{item.title}</span>
              <span style={{ ...type['body-s'], color: 'rgba(255, 255, 255, 0.65)' }}>{item.caption}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              style={{
                height: 32,
                padding: `0 ${space.md}`,
                borderRadius: radius.full,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'transparent',
                color: '#f2f2f2',
                ...type['label-m'],
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Close
            </button>
          </div>
          <div
            style={{
              padding: space.lg,
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#161618',
            }}
          >
            {/* The frames carry their own rounded corners; nothing here clips them. */}
            <img
              src={item.src}
              alt={item.alt}
              style={{ display: 'block', maxWidth: '100%', maxHeight: 'calc(90vh - 110px)', width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </dialog>
  )
}

const InspectTag = () => (
  <span
    aria-hidden
    style={{
      position: 'absolute',
      right: space.sm,
      bottom: space.sm,
      fontFamily: MONO,
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.78)',
      background: 'rgba(0, 0, 0, 0.56)',
      backdropFilter: 'blur(8px)',
      padding: '4px 10px',
      borderRadius: radius.full,
      border: '1px solid rgba(255, 255, 255, 0.12)',
    }}
  >
    Inspect ↗
  </span>
)

/** Where the carousel stands: at either end, and which square leads it. */
type CarouselState = { start: boolean; end: boolean; index: number }

/** The carousel's squares: 560 across on a laptop and up, 300 on a phone, 8 apart (the bento's gutter). */
const SQUARE = { desktop: 560, mobile: 300 }
const SQUARE_GAP = 8

/**
 * The kit's components as a row of squares (`kit-squares.mjs`), each in the kit's own fill,
 * rounded concentric with the surface they sit on, from the band's left edge and snapping square by
 * square (the browser's own scroll and snap); swipe or scroll it, or flip with `CarouselArrows`.
 * A square opens its full Figma frame.
 */
function KitCarousel({
  trackRef,
  onEdges,
  onZoom,
  inset = 0,
  tone = 'dark-neutral',
}: {
  trackRef: RefObject<HTMLDivElement | null>
  onEdges: (edges: CarouselState) => void
  onZoom: (item: Zoom) => void
  /** Where the first square starts and every square snaps to: the band's visible left edge, plus its inset. */
  inset?: number
  tone?: KitTone
}) {
  const isMobile = useIsMobile()
  const size = isMobile ? SQUARE.mobile : SQUARE.desktop
  // Told only when the square on show or an end changes, never on every scroll event: a re-render
  // per event re-measured the surface under it and fought the scroll.
  const last = useRef('')
  const readEdges = () => {
    const el = trackRef.current
    if (!el) return
    const index = Math.min(CURATED_FRAMES.length - 1, Math.max(0, Math.round(el.scrollLeft / (size + SQUARE_GAP))))
    const next = { start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4, index }
    const key = `${next.start}${next.end}${next.index}`
    if (key === last.current) return
    last.current = key
    onEdges(next)
  }
  return (
    <div
      ref={trackRef}
      onScroll={readEdges}
      tabIndex={0}
      aria-label="Components from the Figma kit"
      style={{
        display: 'flex',
        gap: SQUARE_GAP,
        overflowX: 'auto',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        boxSizing: 'border-box',
        paddingLeft: inset,
        scrollPaddingLeft: inset,
        // The same at the right end, so the last square can finish the inset off the window's edge.
        paddingRight: inset,
      }}
    >
      {CURATED_FRAMES.map((frame) => (
        <button
          key={frame.id}
          type="button"
          onClick={() => onZoom({ title: `${frame.label} · Figma kit`, caption: frame.caption, src: frame.src, alt: frame.alt })}
          aria-label={`${frame.label}: inspect the whole Figma frame`}
          style={{
            position: 'relative',
            flex: `0 0 ${size}px`,
            height: size,
            padding: 0,
            border: 'none',
            borderRadius: CURVED_INNER,
            overflow: 'hidden',
            background: KIT_FILL,
            scrollSnapAlign: 'start',
            cursor: 'zoom-in',
          }}
        >
          <img
            key={tone}
            src={squareFor(frame, tone)}
            alt={frame.alt}
            width={1360}
            height={1360}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
          <InspectTag />
        </button>
      ))}
    </div>
  )
}

/**
 * Back and forward through the carousel, a square at a time, with a dot per square between them
 * (the one on show a dash, as the digest's pager draws it); a dot jumps to its square.
 */
function CarouselArrows({ trackRef, state }: { trackRef: RefObject<HTMLDivElement | null>; state: CarouselState }) {
  const isMobile = useIsMobile()
  const pitch = (isMobile ? SQUARE.mobile : SQUARE.desktop) + SQUARE_GAP
  const behavior = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
  const step = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * pitch, behavior: behavior() })
  const go = (index: number) => trackRef.current?.scrollTo({ left: index * pitch, behavior: behavior() })
  const arrow = (dir: 1 | -1) => {
    const disabled = dir === 1 ? state.end : state.start
    return (
      <button
        type="button"
        aria-label={dir === 1 ? 'Next component' : 'Previous component'}
        disabled={disabled}
        onClick={() => step(dir)}
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          border: `1px solid ${color.border.default}`,
          background: 'transparent',
          color: color.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.35 : 1,
          transition: 'opacity 150ms ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d={dir === 1 ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
      {arrow(-1)}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {CURATED_FRAMES.map((frame, i) => {
          const on = i === state.index
          return (
            <button
              key={frame.id}
              type="button"
              aria-label={`${frame.label}, ${i + 1} of ${CURATED_FRAMES.length}`}
              aria-current={on ? 'true' : undefined}
              onClick={() => go(i)}
              style={{
                width: on ? 18 : 6,
                height: 6,
                padding: 0,
                border: 'none',
                borderRadius: radius.full,
                background: on ? color.text.primary : `color-mix(in srgb, ${color.text.primary} 28%, transparent)`,
                cursor: 'pointer',
                transition: 'width 200ms ease, background-color 200ms ease',
              }}
            />
          )
        })}
      </div>
      {arrow(1)}
    </div>
  )
}

/** Step 2's media: the Code Connect template, on its own fixed dark, filling its cell. */
function CodeConnectPane() {
  return (
    <div style={{ background: KIT_FILL, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: `${space.md} ${space.xl}`,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: MONO,
          fontSize: 12,
          color: '#9a9a9a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>SubagentCard.figma.ts</span>
        <span style={{ color: '#24fe8a' }}>Synced</span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: space.xl,
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.6,
          color: '#e8e8e8',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <code>{CODE_CONNECT_SNIPPET}</code>
      </pre>
    </div>
  )
}

/** Step 3's media: the Storybook window whole, at its own size; click to inspect it. */
function StorybookPane({ onZoom }: { onZoom: (item: Zoom) => void }) {
  return (
    <button
      type="button"
      onClick={() =>
        onZoom({
          title: 'Storybook · Fork / Subagent card',
          caption: 'Real React components rendered in Basic · Dark Neutral with live Controls.',
          src: STORYBOOK_SHOT.src,
          alt: STORYBOOK_SHOT.alt,
        })
      }
      aria-label="Inspect Storybook screenshot full size"
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, border: 'none', background: '#1b1b1d', cursor: 'zoom-in' }}
    >
      <img src={STORYBOOK_SHOT.src} alt={STORYBOOK_SHOT.alt} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: STORYBOOK_SHOT.aspect }} />
      <InspectTag />
    </button>
  )
}

/** Between the kit's rows: apart enough to read as separate steps, close enough to read as one run. */
const STEP_GAP = { desktop: 72, mobile: 48 }

/** How far the tone pills sit off the tab and the band: the carousel's gutter. */
const STEP_INSET_GAP = 8
/** Each tone pill's corner: the cutout's concave 24 less the 8 the row keeps off it, so the first
    pill's corner runs concentric with the curve where the tab meets the band. */
const TONE_RADIUS = 24 - STEP_INSET_GAP

/**
 * The Basic tone pills, tucked into the corner of the cutout beside the Figma tab, 8 off the tab
 * and 8 above the band, rounded to stay concentric with the curve between them; the picked one
 * filled. Picking one swaps every square in the carousel to that tone.
 */
function TonePills({ value, onChange }: { value: KitTone; onChange: (tone: KitTone) => void }) {
  return (
    <div role="radiogroup" aria-label="Basic tone" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: STEP_INSET_GAP }}>
      {KIT_TONES.map((tone) => {
        const on = tone.id === value
        return (
          <button
            key={tone.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(tone.id)}
            style={{
              height: 48,
              padding: `0 ${space.xl}`,
              borderRadius: TONE_RADIUS,
              border: `1px solid ${on ? 'transparent' : 'color-mix(in srgb, var(--color-text-primary) 18%, transparent)'}`,
              background: on ? color.text.primary : 'transparent',
              color: on ? color.bg.primary : color.text.secondary,
              ...type['label-m'],
              fontSize: 15,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 150ms ease, color 150ms ease',
            }}
          >
            {tone.label}
          </button>
        )
      })}
    </div>
  )
}

/** The picture's inset on its surface, as the curved cards hold their media. */
const STEP_INSET = 8
/** The widest a step's tab runs: its heading and one sentence. */
const TAB_MAX = 440
/** How far a wide band runs past each window edge, so its rounded ends are off screen. */
const EDGE_OVERHANG = 48
/** Fixed, so the surface's trace isn't redone on every render (`Interlock` measures on `areas`). */
const STEP_AREAS = { mobile: ['tab', 'pic'], desktop: ['. tab .', 'pic pic pic'] }
const STEP_AREAS_ASIDE = { mobile: ['tab', 'aside', 'pic'], desktop: ['. tab aside', 'pic pic pic'] }

/**
 * One step of the kit as one surface, like the page's curved cards with the tab on top: the
 * heading and a sentence on a tab above the picture, joined to it and turning concave where it
 * meets the picture's top edge (`Interlock`). `wide` runs the picture's surface edge to edge across
 * the window, the tab kept on the column's left edge (so it turns concave on both sides) and the
 * picture told how far the window's edge is into the band, so its content starts the same inset off
 * the visible edge as off the band's foot. `below` sits under the picture on the page, centred.
 */
function KitStep({
  heading,
  body,
  wide = false,
  below,
  aside,
  children,
}: {
  heading: string
  body: string
  wide?: boolean
  below?: ReactNode
  /** On the page in the cutout right of the tab, sitting on the picture's top edge (the tone pills). */
  aside?: ReactNode
  /** The picture; for `wide`, a function given how far into the band the window's edge is, so its
      content can start the inset off the visible edge. */
  children: ReactNode | ((columnInset: number) => ReactNode)
}) {
  const isMobile = useIsMobile()
  const boxRef = useRef<HTMLDivElement>(null)
  // Where the column sits in the window, to run the band edge to edge and seat the tab on the column.
  const [box, setBox] = useState({ column: 0, left: 0, view: 0 })
  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => {
      // Layout offsets, not getBoundingClientRect: the chapter springs in on a transform
      // (`Reveal`), and measuring mid-spring read the column scaled down, so the band was
      // placed too far left and its first square met the window's edge.
      let left = 0
      for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) left += node.offsetLeft
      const next = { column: el.offsetWidth, left, view: document.documentElement.clientWidth }
      setBox((prev) => (prev.column === next.column && prev.left === next.left && prev.view === next.view ? prev : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])
  // A wide band runs from past the window's left edge to past its right (its rounded ends off
  // screen, so the dark reads end to end); `offset` is where the column starts inside it.
  const runOff = wide && !isMobile
  const offset = runOff ? box.left + EDGE_OVERHANG : 0
  const band = runOff ? box.view + EDGE_OVERHANG * 2 : box.column
  const tab = Math.round(Math.min(TAB_MAX, box.column * 0.5))
  return (
    <div ref={boxRef} style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
      <div style={{ width: band || '100%', marginLeft: -offset }}>
        <Interlock
          areas={aside ? (isMobile ? STEP_AREAS_ASIDE.mobile : STEP_AREAS_ASIDE.desktop) : isMobile ? STEP_AREAS.mobile : STEP_AREAS.desktop}
          columns={isMobile ? 'minmax(0, 1fr)' : `${offset}px ${tab}px minmax(0, 1fr)`}
          gap={0}
        >
          <Piece area="tab" pad={curvedInset(isMobile)} style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
            <CurvedCopy heading={heading} body={body} />
          </Piece>
          {aside && (
            // Off the surface: the page in the cutout, its pills sitting just above the band.
            <Piece
              area="aside"
              off
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                padding: isMobile ? `${space.lg} 0` : `0 0 ${STEP_INSET_GAP}px ${STEP_INSET_GAP}px`,
              }}
            >
              {aside}
            </Piece>
          )}
          <Piece area="pic" pad={STEP_INSET}>
            {/* The band runs EDGE_OVERHANG past the window, so content starting that far in sits the
                inset (8) off the window's edge, the same as off the band's foot. */}
            {typeof children === 'function' ? children(runOff ? EDGE_OVERHANG : 0) : children}
          </Piece>
        </Interlock>
      </div>
      {below && <div style={{ display: 'flex', justifyContent: 'center' }}>{below}</div>}
    </div>
  )
}

/**
 * `The kit, wired to code` (Nov 19 2026): a heading with the kit's numbers under it, then Figma,
 * Code Connect and Storybook as plain rows on the page, each a heading and a sentence beside its
 * picture. Figma's picture is the components' carousel, running off the window's right edge with
 * its arrows and dots under it. (The bento it replaced is kept in
 * ~/.t3-fork/scratch/no3y-capture/design-system/No3yDesignSystemStory.kit-bento.tsx.)
 */
function KitSteps({ onZoom }: { onZoom: (item: Zoom) => void }) {
  const isMobile = useIsMobile()
  const trackRef = useRef<HTMLDivElement>(null)
  const [carousel, setCarousel] = useState<CarouselState>({ start: true, end: false, index: 0 })
  const [tone, setTone] = useState<KitTone>('dark-neutral')
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? STEP_GAP.mobile : STEP_GAP.desktop }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
        <CurvedCopy heading="The kit, wired to code" />
        <ProofStats />
      </div>
      <KitStep
        heading="Figma"
        body="I mirrored every CSS token into multi-mode Figma variables and rebuilt the components to the pixel of the running app."
        wide
        aside={<TonePills value={tone} onChange={setTone} />}
        below={<CarouselArrows trackRef={trackRef} state={carousel} />}
      >
        {(inset) => <KitCarousel trackRef={trackRef} onEdges={setCarousel} onZoom={onZoom} inset={inset} tone={tone} />}
      </KitStep>
      <KitStep heading="Code Connect" body="Selecting a component in Figma's Dev Mode shows the real React call behind it.">
        <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>
          <CodeConnectPane />
        </div>
      </KitStep>
      <KitStep heading="Storybook" body="326 stories render the real React components in every theme.">
        <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>
          <StorybookPane onZoom={onZoom} />
        </div>
      </KitStep>
    </section>
  )
}

/**
 * The design-system chapter. The opening curved card holds the three-theme slider with the story on
 * its tab; then the kit's heading and numbers, and Figma, Code Connect and Storybook as plain rows
 * (`KitSteps`).
 */
export default function No3yDesignSystemStory({ compare }: { compare?: ComponentProps<typeof CompareSlider> }) {
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState<Zoom | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 48 : 96 }}>
      {/* The page's three-theme slider (Nov 19 2026; the opener until then) leads the chapter, where
          the themes are talked about. The live token bridge it replaced is kept in
          ~/.t3-fork/scratch/no3y-capture/design-system/No3yDesignSystemStory.with-token-bridge.tsx. */}
      <CurvedCard
        media={compare ? <CompareSlider {...compare} /> : null}
        copy={<CurvedCopy heading="Themes & the design system" body={STORY_INTRO} />}
      />

      <KitSteps onZoom={setZoom} />

      <Lightbox item={zoom} onClose={() => setZoom(null)} />
    </div>
  )
}
