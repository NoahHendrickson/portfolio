import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { CurvedCopy } from './Curved'
import { Interlock, Piece } from './Interlock'
import { color, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_INNER, LEADING, TEXT_SOFT, curvedInset } from '../sheetStyle'
import type { LandingVideo, Prose } from '../data/projects'
import { SheetClip } from './Sheet'
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
  /** Spans two rows of the grid (desktop), for a tall shot with two short ones stacked beside it. */
  tall?: boolean
}

/** The bento's gutter and corners, as on the Cinnabars page: every corner 24, every notch 32. */
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

/** The app's own panel colour, read off the close-ups, so a shorter shot's box fills in unseen. */
const COMPOSER_PANEL = '#1d1d1d'

/**
 * "Inside the composer" (Nov 24 2026): the composer close-ups as a plain grid, two to a row (one on
 * a phone), each shot in a rounded box of the app's panel colour with its label and caption under
 * it. A row's boxes match heights, the shorter shot sitting on the box's floor so the composers in
 * a row line up. It replaced a cross-fading stage with a list of states beside it.
 */
export function ComposerShowcase({ states }: { states: ComposerStateItem[] }) {
  const isMobile = useIsMobile()
  if (states.length === 0) return null
  return (
    <Interlock areas={['top']} columns="minmax(0, 1fr)">
      <Piece area="top" pad={curvedInset(isMobile)} style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
        <CurvedCopy
          heading="Inside the composer"
          body="Most of your day in an agent app happens inside one bar, so I sweated the micro-interactions around it: keeping an eye on background work, subagents and pull requests, picking models, checking usage limits, queuing follow-ups, answering clarifying questions inline, and dictating locally."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
            gap: isMobile ? space.xl : `${space['2xl']} ${space.lg}`,
          }}
        >
          {states.map((item) => (
            <figure
              key={item.id}
              style={{ margin: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space.md, gridRow: item.tall && !isMobile ? 'span 2' : undefined }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  background: COMPOSER_PANEL,
                  borderRadius: CURVED_INNER,
                  overflow: 'hidden',
                }}
              >
                {item.media}
              </div>
              <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: `0 ${space.xs}` }}>
                <span style={{ ...type['label-m'], color: color.text.primary, lineHeight: LEADING }}>{item.label}</span>
                <span style={{ ...type['body-s'], color: TEXT_SOFT, lineHeight: LEADING }}>{item.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Piece>
    </Interlock>
  )
}

export type PhoneScreen = {
  id: string
  label: string
  caption: string
  /** A full iPhone screenshot (1206 × 2622 at 3x), with a half-width cut beside it. */
  src: string
  srcHalf: string
  alt: string
  /** A screen recording in place of the still (the still's `src` is then unused). */
  video?: LandingVideo
}

/** The iPhone 18 Pro's screen: 402 × 874 points, its corners about 55 points round. */
const PHONE_ASPECT = '1206 / 2622'
const PHONE_CORNER = '13.7% / 6.3%'

/**
 * "On your phone" (Nov 26 2026): the iPhone app's thread screen and its model picker, captured off
 * a simulator build of the capture checkout paired to the offline mock studio (scene `ios-thread`),
 * screens side by side (one at a time on a phone), each cut to the screen's own corners with its
 * label and caption under it, like the composer grid. A screen can be a recording (the model picker
 * since the same day, in place of its two stills).
 */
export function PhoneShowcase({ screens }: { screens: PhoneScreen[] }) {
  const isMobile = useIsMobile()
  if (screens.length === 0) return null
  return (
    <Interlock areas={['top']} columns="minmax(0, 1fr)">
      <Piece area="top" pad={curvedInset(isMobile)} style={{ display: 'flex', flexDirection: 'column', gap: space['2xl'] }}>
        <CurvedCopy
          heading="On your phone"
          body="The iPhone app carries the same threads. The pills over the composer show the pull request and the subagents at a glance, follow-ups queue while the agent works, and the model and its reasoning are one sheet away."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : `repeat(${screens.length}, minmax(0, 1fr))`,
            gap: space['2xl'],
            justifyItems: 'center',
          }}
        >
          {screens.map((screen) => (
            <figure key={screen.id} style={{ margin: 0, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: space.md }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: PHONE_ASPECT,
                  borderRadius: PHONE_CORNER,
                  overflow: 'hidden',
                  boxShadow: '0 0 0 1px rgb(255 255 255 / 0.08), 0 18px 40px -16px rgb(0 0 0 / 0.45)',
                  background: COMPOSER_PANEL,
                }}
              >
                {screen.video ? (
                  <SheetClip video={screen.video} />
                ) : (
                  <img
                    src={screen.src}
                    srcSet={`${screen.srcHalf} 603w, ${screen.src} 1206w`}
                    sizes="auto, (max-width: 700px) 90vw, 340px"
                    alt={screen.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  />
                )}
              </div>
              <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: `0 ${space.xs}` }}>
                <span style={{ ...type['label-m'], color: color.text.primary, lineHeight: LEADING }}>{screen.label}</span>
                <span style={{ ...type['body-s'], color: TEXT_SOFT, lineHeight: LEADING }}>{screen.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Piece>
    </Interlock>
  )
}
