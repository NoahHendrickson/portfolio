import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { CurvedCopy } from './Curved'
import { Interlock, Piece } from './Interlock'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_INNER, LEADING, TEXT_SOFT, curvedInset } from '../sheetStyle'
import type { Prose } from '../data/projects'
import { getTheme, subscribeToTheme } from '../theme'

export type WorkflowFeature = {
  id: string
  heading: string
  body: Prose
  /** A screenshot, in whichever theme the page's switch says. */
  media: ReactNode
  /** Steps down under the others, its screenshot wide on the left (the Scheduled tasks still). */
  wide?: boolean
}

export type ComposerStateItem = {
  id: string
  label: string
  caption: string
  media: ReactNode
}

/** The bento's gutter and corners, as on the Cinnabars page: every corner 24, every notch 32. */
/** How far (in 24ths of the column) the composer card's two pieces sit off each other. */
const COMPOSER_SHIFT = 3
const BENTO_GAP = 8
const BENTO_RADIUS = 24
/** The frame: the dark page's ink-black on the cream page, a lighter charcoal on the dark page so the box still stands off it. */
const FRAME = { light: '#171615', dark: '#2c2b28' } as const

/** Out of the text column to the brand and Cinnabars pages' width, 48 clear of the window either side. */
function Wide({ children }: { children: ReactNode }) {
  const width = 'max(100%, min(1560px, calc(100vw - 96px)))'
  return <div style={{ width, marginLeft: `calc((100% - ${width}) / 2)` }}>{children}</div>
}

/**
 * Prototype B's framed bento (Nov 19 2026), after the Cinnabars page: one dark box round a cream
 * surface (`Interlock`) that carries the copy, with the media cut out of it and standing on the
 * dark, the surface turning concave round each. The surface stays cream in both page themes; the
 * frame lightens on the dark page so the box still stands off it. Out of the text column, so the
 * media can run larger. Its pieces are `Piece`s; media goes in `BentoMedia`.
 */
export function Bento({ areas, columns, children }: { areas: string[]; columns?: string; children: ReactNode }) {
  const pageTheme = useSyncExternalStore(subscribeToTheme, getTheme)
  return (
    <Wide>
      <div
        style={{
          padding: BENTO_GAP,
          background: FRAME[pageTheme],
          borderRadius: BENTO_RADIUS + BENTO_GAP,
          boxShadow: '0 0 0 1px rgb(255 255 255 / 0.06)',
        }}
      >
        <Interlock areas={areas} columns={columns} gap={BENTO_GAP} theme="light" radius={BENTO_RADIUS} bareRadius={BENTO_RADIUS}>
          {children}
        </Interlock>
      </div>
    </Wide>
  )
}

/** A bare piece's media, rounded to the bento's corner and filling its cell. */
export function BentoMedia({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ height: '100%', borderRadius: BENTO_RADIUS, overflow: 'hidden', ...style }}>{children}</div>
}

/**
 * Prototype B's parallel-workflow section (Nov 19 2026), a `Bento`: each feature's heading and
 * explanation on the surface, its screenshot cut out of it. Two features run side by side, their
 * screenshots over a band of their copy; a `wide` one steps down under them, its screenshot on the
 * left and its copy on the right, so the band and that copy are one shape. One column on a phone.
 * Every screenshot follows the page's theme switch.
 */
export function ParallelWorkflowCard({ features }: { features: WorkflowFeature[] }) {
  const isMobile = useIsMobile()
  if (features.length === 0) return null
  const regular = features.filter((f) => !f.wide)
  const wide = features.filter((f) => f.wide)
  const shot = (id: string) => `${id}-shot`
  const copy = (id: string) => `${id}-copy`
  const span = (name: string, n: number) => Array(n).fill(name).join(' ')

  const areas: string[] = []
  if (isMobile) {
    for (const f of features) areas.push(shot(f.id), copy(f.id))
  } else {
    for (let i = 0; i < regular.length; i += 2) {
      const [a, b] = regular.slice(i, i + 2)
      areas.push(b ? `${span(shot(a.id), 6)} ${span(shot(b.id), 6)}` : span(shot(a.id), 12))
      areas.push(b ? `${span(copy(a.id), 6)} ${span(copy(b.id), 6)}` : span(copy(a.id), 12))
    }
    for (const f of wide) areas.push(`${span(shot(f.id), 8)} ${span(copy(f.id), 4)}`)
  }

  return (
    <Bento areas={areas} columns={isMobile ? 'minmax(0, 1fr)' : undefined}>
      {features.map((feature) => [
        <Piece key={shot(feature.id)} area={shot(feature.id)} bare>
          <BentoMedia>{feature.media}</BentoMedia>
        </Piece>,
        <Piece
          key={copy(feature.id)}
          area={copy(feature.id)}
          pad={curvedInset(isMobile)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            // The wide one's copy sits at the foot of its step, as the Cinnabars copy tiles do.
            justifyContent: feature.wide && !isMobile ? 'flex-end' : 'flex-start',
            gap: space.lg,
          }}
        >
          <CurvedCopy heading={feature.heading} body={feature.body} />
        </Piece>,
      ])}
    </Bento>
  )
}

function RadioDot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        flex: '0 0 14px',
        width: 14,
        height: 14,
        borderRadius: '50%',
        border: `1.5px solid ${on ? color.text.primary : color.border.default}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
        transition: 'border-color 150ms ease',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color.text.primary,
          opacity: on ? 1 : 0,
          transform: on ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 150ms ease, transform 150ms ease',
        }}
      />
    </span>
  )
}

/**
 * Prototype B's rethink of the 6-tile micro-UX collage: focuses on the composer — the one bar
 * you touch every minute — with a locked 680:380 stage that cross-fades cleanly across its four
 * interactive popover/prompt states, with local dictation under it, the two offset on one surface.
 */
export function ComposerShowcase({
  states,
  dictation,
}: {
  states: ComposerStateItem[]
  dictation?: { media: ReactNode; caption: string }
}) {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(states[0]?.id ?? '')
  const current = states.find((item) => item.id === activeId) ?? states[0]
  if (!current) return null

  const stage = (
    <div
      style={{
        display: 'grid',
        borderRadius: CURVED_INNER,
        overflow: 'hidden',
      }}
    >
      {states.map((item) => {
        const on = item.id === current.id
        return (
          <div
            key={item.id}
            aria-hidden={!on}
            style={{
              gridArea: '1 / 1',
              opacity: on ? 1 : 0,
              pointerEvents: on ? 'auto' : 'none',
              transition: 'opacity 180ms ease',
            }}
          >
            {item.media}
          </div>
        )
      })}
    </div>
  )

  const controls = (
    <div role="tablist" aria-label="Composer states" style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      {states.map((item) => {
        const on = item.id === current.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setActiveId(item.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: space.md,
              padding: `${space.md} ${space.lg}`,
              borderRadius: radius.lg,
              border: `1px solid ${on ? color.border.default : 'transparent'}`,
              background: on ? 'color-mix(in srgb, var(--color-text-primary) 7%, transparent)' : 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit',
              transition: 'background-color 150ms ease, border-color 150ms ease',
            }}
          >
            <RadioDot on={on} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span
                style={{
                  ...type['label-m'],
                  color: on ? color.text.primary : color.text.secondary,
                  lineHeight: LEADING,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  ...type['body-s'],
                  color: TEXT_SOFT,
                  opacity: on ? 1 : 0.78,
                  lineHeight: LEADING,
                }}
              >
                {item.caption}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )

  const pad = curvedInset(isMobile)
  // Two pieces of one surface (Nov 19 2026): the composer's states nudged right, dictation nudged
  // left, overlapping in the middle, so the surface steps between them on concave curves.
  const span = (name: string, n: number) => Array(n).fill(name).join(' ')
  const areas = isMobile
    ? ['top', ...(dictation ? ['dict'] : [])]
    : [`${span('.', COMPOSER_SHIFT)} ${span('top', 24 - COMPOSER_SHIFT)}`, ...(dictation ? [`${span('dict', 24 - COMPOSER_SHIFT)} ${span('.', COMPOSER_SHIFT)}`] : [])]
  return (
    <Interlock areas={areas} columns={isMobile ? 'minmax(0, 1fr)' : 'repeat(24, minmax(0, 1fr))'}>
      <Piece area="top" pad={pad} style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
        <CurvedCopy
          heading="Inside the composer"
          body="Most of your day in an agent app happens inside one bar, so I sweated the micro-interactions around it: checking limits, picking models, queuing follow-ups, answering clarifying questions inline, and dictating locally."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1.55fr) minmax(0, 1fr)',
            gap: isMobile ? space.lg : space['2xl'],
            alignItems: 'center',
          }}
        >
          {stage}
          {controls}
        </div>
      </Piece>
      {dictation && (
        <Piece area="dict" pad={pad} style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm }}>
            <span style={{ ...type['label-m'], color: color.text.primary }}>Local dictation</span>
            <span style={{ ...type['body-s'], color: TEXT_SOFT }}>{dictation.caption}</span>
          </div>
          <div style={{ borderRadius: CURVED_INNER, overflow: 'hidden' }}>{dictation.media}</div>
        </Piece>
      )}
    </Interlock>
  )
}
