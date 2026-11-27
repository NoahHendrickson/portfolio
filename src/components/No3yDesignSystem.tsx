import { useRef, useState, type CSSProperties } from 'react'
import { CurvedCard, CurvedCopy, CurvedPanel } from './Curved'
import { SheetImg } from './Sheet'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_INNER, LEADING, SHEET_HEADING, TEXT_SOFT, curvedInset, sheetGap } from '../sheetStyle'
import {
  ANATOMY,
  CODE_CONNECT_SNIPPET,
  KIT_FRAMES,
  FIGMA_SUBAGENT,
  KIT_STATS,
  STORYBOOK_SHOT,
  type AnatomyEntry,
  type KitFrame,
} from '../data/no3yDesignSystem'

/*
  The no3y Code page's design-system section (Nov 19 2026): a short intro, a carousel of
  the kit's components, their anatomy, and the Subagent card in Figma, in code and in
  Storybook.
*/

/** The kit's renders are Dark Neutral, so they sit on its background whichever theme the page is in. */
const STAGE_FILL = '#2b2b2b'
/** Figma's own redline pink, for the anatomy's boxes and pins. */
const REDLINE = '#f24e9c'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'
const PIN = 22
/** From the component's edge to a pin's centre. */
const PIN_REACH = 40

const INTRO = [
  'Once the fork had enough UI of its own, I built a Figma kit that mirrors the code. Every colour is a Figma variable named after the CSS variable it stands for, and every component was measured off the running app rather than redrawn from memory.',
  'Storybook renders the real components in every theme, and Code Connect points the Figma components back at the React that draws them.',
]

const pct = (value: number, of: number) => `${(value / of) * 100}%`

/**
 * Frames share one scale, so their type reads at one size, until a big one would pass
 * `maxHeight`. The exports are 1200px tall, so every frame stays sharp at 2×.
 */
const FRAME_FIT = { desktop: { scale: 0.75, maxHeight: 640 }, mobile: { scale: 0.4, maxHeight: 380 } }
/** The frames' own 24px corners, never rounder than this once a frame is scaled down. */
const FRAME_RADIUS = 24
const MIN_RADIUS = 12

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** One component's frame from the kit, whole: its title, notes and every variant, as it is in Figma. */
function KitFrameCard({ frame }: { frame: KitFrame }) {
  const isMobile = useIsMobile()
  const fit = isMobile ? FRAME_FIT.mobile : FRAME_FIT.desktop
  const scale = Math.min(fit.scale, fit.maxHeight / frame.height)
  const width = Math.round(frame.width * scale)
  return (
    <li style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
      <img
        src={frame.src}
        alt={`The ${frame.name} page of the Figma kit: the component, its notes and its variants`}
        width={Math.round((1200 * frame.width) / frame.height)}
        height={1200}
        loading="lazy"
        decoding="async"
        draggable={false}
        // The frame has its own rounded corners; past 88vw it scales down whole rather than cropping.
        style={{
          display: 'block',
          width: `min(${width}px, 88vw)`,
          height: 'auto',
          borderRadius: Math.max(FRAME_RADIUS * scale, MIN_RADIUS),
        }}
      />
    </li>
  )
}

function Arrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === 1 ? 'Next component' : 'Previous component'}
      disabled={disabled}
      onClick={onClick}
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
        <path
          d={dir === 1 ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

/**
 * The kit's component frames, one per card, in a row that runs off both edges of the page.
 * Swipe or scroll it, or step through with the arrows.
 */
function Components() {
  const isMobile = useIsMobile()
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const readEdges = () => {
    const el = trackRef.current
    if (!el) return
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 })
  }

  /** Scroll to the next card past the page's edge, or back to the one before it. */
  const step = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const anchor = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const offsets = Array.from(el.children, (item) => item.getBoundingClientRect().left - anchor)
    const target = dir === 1 ? offsets.find((left) => left > 4) : offsets.filter((left) => left < -4).pop()
    if (target !== undefined) el.scrollBy({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl, containerType: 'inline-size' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.lg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs, maxWidth: 560 }}>
          <h3 style={{ ...SHEET_HEADING, margin: 0 }}>Components</h3>
          <p style={{ ...type['body-s'], margin: 0, color: TEXT_SOFT }}>
            The fork’s own, each on its page in the Figma kit: built to the pixel of the running app.
          </p>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: space.sm, flexShrink: 0 }}>
            <Arrow dir={-1} disabled={edges.start} onClick={() => step(-1)} />
            <Arrow dir={1} disabled={edges.end} onClick={() => step(1)} />
          </div>
        )}
      </div>
      <ul
        ref={trackRef}
        onScroll={readEdges}
        tabIndex={0}
        aria-label="Components from the kit"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space.lg,
          margin: 0,
          listStyle: 'none',
          overflowX: 'auto',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          // Full bleed, with the cards snapping to the page's column. `cqw` is the column (the
          // wrapper is the container); a `%` scroll-padding would be the track's own width.
          marginInline: 'calc(50cqw - 50vw)',
          paddingInline: 'calc(50vw - 50cqw)',
          scrollPaddingInline: 'calc(50vw - 50cqw)',
          paddingBlock: 0,
        }}
      >
        {KIT_FRAMES.map((frame) => (
          <KitFrameCard key={frame.id} frame={frame} />
        ))}
      </ul>
    </div>
  )
}

function Stats() {
  const isMobile = useIsMobile()
  return (
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
        gap: space.xl,
      }}
    >
      {KIT_STATS.map((stat) => (
        <li key={stat.value} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...type['heading-l'] }}>{stat.value}</span>
          <span style={{ ...type['body-s'], color: TEXT_SOFT }}>{stat.label}</span>
        </li>
      ))}
    </ul>
  )
}

function Intro() {
  const isMobile = useIsMobile()
  return (
    <CurvedPanel style={{ padding: curvedInset(isMobile), display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
        <CurvedCopy heading="The design system" body={INTRO} />
      </div>
      <Stats />
    </CurvedPanel>
  )
}

/** A row of pill tabs, the current one filled. */
function PillTabs<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', gap: space.xs, flexWrap: 'wrap' }}>
      {items.map((item) => {
        const on = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(item.id)}
            style={{
              height: 32,
              padding: `0 ${space.md}`,
              borderRadius: radius.full,
              border: `1px solid ${on ? 'transparent' : color.border.default}`,
              background: on ? color.text.primary : 'transparent',
              color: on ? color.bg.primary : color.text.secondary,
              ...type['label-m'],
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/** The component on the dark stage, each part boxed in redline with a numbered pin above or below. */
function AnatomyStage({
  entry,
  active,
  onActive,
}: {
  entry: AnatomyEntry
  active: number | null
  onActive: (index: number | null) => void
}) {
  const isMobile = useIsMobile()
  const W = entry.width
  const H = entry.height
  return (
    <div
      style={{
        background: STAGE_FILL,
        borderRadius: CURVED_INNER,
        padding: `${PIN_REACH + PIN / 2 + 20}px ${isMobile ? 16 : 40}px`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: W * entry.scale }}>
        <img
          src={entry.src}
          alt={`The ${entry.name} component from the Figma kit`}
          width={W * 4}
          height={H * 4}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        {entry.parts.map((part, i) => {
          const [x, y, w, h] = part.box
          const cx = part.pinX ?? x + w / 2
          const lit = active === null || active === i
          const fade: CSSProperties = { opacity: lit ? 1 : 0.2, transition: 'opacity 150ms ease' }
          const top = part.pin === 'top'
          return (
            <div key={part.label} aria-hidden>
              <div
                style={{
                  ...fade,
                  position: 'absolute',
                  left: pct(x, W),
                  top: pct(y, H),
                  width: pct(w, W),
                  height: pct(h, H),
                  outline: `1px dashed ${REDLINE}`,
                  borderRadius: 2,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  ...fade,
                  position: 'absolute',
                  left: pct(cx, W),
                  width: 1,
                  background: REDLINE,
                  pointerEvents: 'none',
                  ...(top
                    ? { top: -PIN_REACH, height: `calc(${pct(y, H)} + ${PIN_REACH}px)` }
                    : { top: pct(y + h, H), height: `calc(${pct(H - y - h, H)} + ${PIN_REACH}px)` }),
                }}
              />
              <span
                onPointerEnter={() => onActive(i)}
                onPointerLeave={() => onActive(null)}
                style={{
                  ...fade,
                  position: 'absolute',
                  left: pct(cx, W),
                  top: top ? -PIN_REACH : `calc(100% + ${PIN_REACH}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: PIN,
                  height: PIN,
                  borderRadius: '50%',
                  background: REDLINE,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {i + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The numbered parts under the stage; hovering one lights its box. */
function PartsList({
  entry,
  active,
  onActive,
}: {
  entry: AnatomyEntry
  active: number | null
  onActive: (index: number | null) => void
}) {
  const isMobile = useIsMobile()
  return (
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
        gap: `${space.lg} ${space['2xl']}`,
      }}
    >
      {entry.parts.map((part, i) => (
        <li
          key={part.label}
          onPointerEnter={() => onActive(i)}
          onPointerLeave={() => onActive(null)}
          style={{
            display: 'flex',
            gap: space.md,
            alignItems: 'flex-start',
            opacity: active === null || active === i ? 1 : 0.45,
            transition: 'opacity 150ms ease',
          }}
        >
          <span
            aria-hidden
            style={{
              flex: `0 0 ${PIN}px`,
              height: PIN,
              borderRadius: '50%',
              background: REDLINE,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {i + 1}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...type['label-m'] }}>{part.label}</span>
            <span style={{ ...type['body-s'], color: TEXT_SOFT }}>{part.spec}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/** One component at a time, picked from tabs, its parts listed under it. */
function Anatomy() {
  const isMobile = useIsMobile()
  const [id, setId] = useState(ANATOMY[0].id)
  const [active, setActive] = useState<number | null>(null)
  const entry = ANATOMY.find((item) => item.id === id) ?? ANATOMY[0]
  return (
    <CurvedPanel style={{ padding: curvedInset(isMobile), display: 'flex', flexDirection: 'column', gap: space.xl }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.lg }}>
        <CurvedCopy heading="Anatomy" caption={entry.summary} />
        <PillTabs
          label="Component"
          items={ANATOMY.map((item) => ({ id: item.id, label: item.name }))}
          value={id}
          onChange={(next) => {
            setId(next)
            setActive(null)
          }}
        />
      </div>
      <AnatomyStage entry={entry} active={active} onActive={setActive} />
      <PartsList entry={entry} active={active} onActive={setActive} />
      <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, lineHeight: LEADING, color: TEXT_SOFT }}>{entry.source}</p>
    </CurvedPanel>
  )
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: CURVED_INNER, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: `${space.sm} ${space.lg}`, borderBottom: '1px solid #ffffff14', fontFamily: MONO, fontSize: 12, color: '#9a9a9a' }}>
        {title}
      </div>
      <pre
        style={{
          margin: 0,
          padding: space.lg,
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.6,
          color: '#e8e8e8',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          flex: 1,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

const MAPPINGS = [
  ['base/card', 'var(--card)'],
  ['composer/chip', 'var(--fork-context-chip-bg)'],
  ['status/working', 'var(--sidebar-v2-status-working)'],
] as const

/** Figma's component, the call Code Connect hands over for it, and the same card in Storybook. */
function ThreePlaces() {
  const isMobile = useIsMobile()
  const label = (text: string) => <p style={{ ...type.eyebrow, margin: 0, color: color.text.secondary }}>{text}</p>
  const step: CSSProperties = { display: 'flex', flexDirection: 'column', gap: space.sm, minWidth: 0 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl, padding: isMobile ? space.sm : space.lg }}>
      <div style={step}>
        {label('1 · Figma component')}
        <div style={{ background: STAGE_FILL, borderRadius: CURVED_INNER, padding: isMobile ? space.lg : space['3xl'], display: 'flex', justifyContent: 'center' }}>
          <img
            src={FIGMA_SUBAGENT.src}
            alt={FIGMA_SUBAGENT.alt}
            width={2208}
            height={342}
            style={{ display: 'block', width: '100%', maxWidth: 736 * 1.15, height: 'auto' }}
          />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: space.lg }}>
        <div style={step}>
          {label('2 · Code Connect')}
          <CodeBlock title="StatusChip.figma.ts" code={CODE_CONNECT_SNIPPET} />
        </div>
        <div style={step}>
          {label('Variables → CSS')}
          <div
            style={{
              background: '#1e1e1e',
              borderRadius: CURVED_INNER,
              padding: space.lg,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: space.md,
            }}
          >
            {MAPPINGS.map(([name, css]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: MONO, fontSize: 13, lineHeight: LEADING }}>
                <span style={{ color: '#e8e8e8' }}>{name}</span>
                <span style={{ color: '#9a9a9a' }}>{css}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={step}>
        {label('3 · Storybook')}
        <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>
          <SheetImg shot={STORYBOOK_SHOT} />
        </div>
      </div>
    </div>
  )
}

export default function No3yDesignSystem() {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
      <Intro />
      <Components />
      <Anatomy />
      <CurvedCard
        media={<ThreePlaces />}
        copy={
          <CurvedCopy
            heading="One component, three places"
            body="The Subagent card in Figma, the call Code Connect hands a developer for it, and the same card in Storybook. Its layers are bound to variables whose code syntax is the CSS the app reads, so Figma and the code agree on every colour."
          />
        }
      />
    </div>
  )
}
