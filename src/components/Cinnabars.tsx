import type { CSSProperties, ReactNode } from 'react'
import { Interlock, Piece } from './Interlock'
import Reveal from './Reveal'
import { Chip, SheetClip, SheetLinks, SheetPage } from './Sheet'
import { useIsMobile } from '../hooks/useIsMobile'

/*
  `/work/cinnabars` (Nov 16 2026), hand-built with no `projects` entry. Cinnabars is the
  user's iOS workout log (~/Developer/cinnabars).

  The page is one framed bento, after a reference the user shared (a dark frame, tiles on
  8px gutters, a blue stat tile with a big number): an `Interlock` inside a charcoal frame.
  The Paper tiles (the copy) are the surface, so where two of them touch they merge into one
  shape, and where that shape turns round a tile it turns concave (the user circled those
  turns in the reference: the title running down into the copy beside the stat tile, round
  the icon tile's corner). The electric blue tiles are `bare` pieces cut out of it a gutter
  clear, every tile rounded 24 and every notch 32, concentric with them; the phones stand on
  those, the screens being the same blue. A full-width phone tile splits the surface in two;
  below it the copy tiles zigzag, each overlapping the next by a column, so they stay one shape.

  The screens are the app's own web build captured by its App Store script
  (`ios/store/screenshots/capture.mjs`, 440 × 956 @3x with a drawn status bar and home
  indicator) in the app's Blue background with Paper ink, as lossless WebP in
  `public/work/cinnabars/`. The clips (one take of the ½ / 1 bubbles and the reps and miles
  dial, and the theme picker) are the same build frame-stepped on a virtual clock at 3x, a translucent dot for the
  finger, as 880-wide H.264.
*/

const BLUE = '#2f5bff'
const PAPER = '#f2f0eb'
const CHARCOAL = '#141414'
const INK = '#141414'
const INK_SOFT = 'rgb(20 20 20 / 0.6)'

const GAP = 8
const TILE = 24

/** The app's electric blue on Contact, with its Paper ink. */
const THEME = {
  '--color-orange': BLUE,
  '--color-orange-hover': '#2449d9',
  '--color-on-accent': PAPER,
} as CSSProperties

const FACTS = [
  { heading: 'Tools', items: ['Claude Code', 'React', 'Capacitor', 'Supabase'] },
  { heading: 'Skills', items: ['iOS app design', 'Design engineering', 'Motion design'] },
]

const SITE = 'https://cinnabars.vercel.app'

type Screen = 'log' | 'history' | 'timer' | 'timer-setup' | 'trend-pink' | 'logging' | 'themes'

/** Recorded rather than still: a looping clip with a poster of its first frame. */
const CLIPS = new Set<Screen>(['logging', 'themes'])

const ALT: Record<Screen, string> = {
  log: "Cinnabars’ Today screen: a week of dates, then muscle-group pills, the logged ones filled in and the rest showing how many days since they were last hit",
  history: 'The History screen’s Summary page: this week’s totals by group (Chest 1, Run 3.1 mi), then last week’s',
  timer: 'The interval timer mid-workout: 0:27 left in round 2 of 6, a ring counting down, Pause and Skip under it',
  'timer-setup': 'The Timer screen before starting: 6 rounds of 0:40 work and 0:20 rest, each round listed, and a Start button',
  'trend-pink': 'The History screen’s Trend page on Paper with Pink ink: sessions a day over the last 28 days as a line chart',
  logging:
    'Tapping Back, then Triceps: each time a half and a full bubble stretch out of the pill like gum, and the one picked flows back in, so the pills read Back | 1 and Triceps | ½. Then Pull-ups pulls out a rep dial, scrolled to 18, and Run a miles dial, scrolled to 7.7',
  themes:
    'Settings, tapping through background and ink swatches: pink, yellow, green, orange, paper, charcoal, and back to blue, the whole screen recoloring each time',
}

/*
  Rows, 12 columns. The title runs down into the copy beside the stat tile and round the
  icon tile's corner; under the phones, each copy tile overlaps the next by a column.
*/
const DESKTOP_AREAS = [
  'title title title title title title title title title icon icon icon',
  'stat stat stat why why why why why why why why why',
  'hero hero hero hero hero hero hero hero hero hero hero hero',
  'taps taps taps taps taps taps taps logging logging logging logging logging',
  'themes themes themes themes themes themes yours yours yours yours yours yours',
  'clock clock clock clock clock clock clock timer timer timer timer timer',
]
const MOBILE_AREAS = [
  'title title',
  'why why',
  'icon stat',
  'hero hero',
  'taps taps',
  'logging logging',
  'yours yours',
  'themes themes',
  'clock clock',
  'timer timer',
]

export default function Cinnabars() {
  const isMobile = useIsMobile()
  const pad = isMobile ? 20 : 36

  return (
    <div style={THEME}>
      <SheetPage>
        <Wide>
          <div
            style={{
              marginTop: isMobile ? 16 : 24,
              padding: GAP,
              background: CHARCOAL,
              borderRadius: TILE + GAP,
              boxShadow: '0 0 0 1px rgb(255 255 255 / 0.06), 0 30px 80px -20px rgb(0 0 0 / 0.35)',
            }}
          >
            <Interlock
              areas={isMobile ? MOBILE_AREAS : DESKTOP_AREAS}
              columns={isMobile ? 'repeat(2, minmax(0, 1fr))' : undefined}
              gap={GAP}
              fill={PAPER}
              theme="light"
              radius={TILE}
              bareRadius={TILE}
            >
              <Piece area="title" pad={pad} style={{ color: INK, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 12 }}>
                <Mono>Side project / 2026 / iOS app</Mono>
                <h1
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '56px' : 'clamp(80px, 8vw, 128px)',
                    fontWeight: 600,
                    lineHeight: 0.95,
                    letterSpacing: '-0.045em',
                  }}
                >
                  Cinnabars<span style={{ color: BLUE }}>.</span>
                </h1>
              </Piece>

              <Piece area="icon" bare>
                <Tile color={CHARCOAL} style={{ display: 'grid', placeItems: 'center', minHeight: isMobile ? 140 : 0 }}>
                  <LogoMark />
                </Tile>
              </Piece>

              <Piece area="stat" bare>
                <Tile color={BLUE} style={{ padding: pad, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, color: PAPER }}>
                  <Mono style={{ color: 'rgb(242 240 235 / 0.7)' }}>Last leg day</Mono>
                  <div aria-label="Legs, five days ago" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                    <span aria-hidden style={{ fontSize: isMobile ? '64px' : '104px', fontWeight: 500, lineHeight: 0.85, letterSpacing: '-0.05em' }}>
                      5d
                    </span>
                    <span
                      aria-hidden
                      style={{ background: PAPER, color: BLUE, borderRadius: 999, padding: '6px 14px', fontSize: '15px', fontWeight: 600 }}
                    >
                      Legs
                    </span>
                  </div>
                </Tile>
              </Piece>

              <Piece
                area="why"
                pad={pad}
                style={{
                  color: INK,
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 3fr) minmax(0, 2fr)',
                  gap: isMobile ? 28 : 48,
                  alignItems: 'end',
                }}
              >
                <Copy
                  heading="Low effort on purpose"
                  body={[
                    "A super simple way to track my workouts. I’m not chasing PRs, I just want a well-rounded week, and I kept forgetting what I’d trained and how long ago.",
                    'So you tap what you did today, and everything else shows how many days it’s been.',
                  ]}
                >
                  <SheetLinks links={[{ label: 'Website', href: SITE }]} />
                </Copy>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {FACTS.map((fact) => (
                    <div key={fact.heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <Mono>{fact.heading}</Mono>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {fact.items.map((item) => (
                          <li key={item}>
                            <Chip filled>{item}</Chip>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Piece>

              {/* Log out front, History and the running timer either side. */}
              <Piece area="hero" bare>
                <Tile color={BLUE} style={{ padding: isMobile ? '28px 12px' : '56px 40px' }}>
                  <PhoneRow
                    priority
                    phones={
                      isMobile
                        ? [
                            { screen: 'history', width: '34%', margin: '0 -7% 0 0', lift: 6 },
                            { screen: 'log', width: '46%', front: true },
                            { screen: 'timer', width: '34%', margin: '0 0 0 -7%', lift: 6 },
                          ]
                        : [
                            { screen: 'history', width: 'min(24%, 290px)', lift: 5 },
                            { screen: 'log', width: 'min(29%, 350px)', front: true },
                            { screen: 'timer', width: 'min(24%, 290px)', lift: 5 },
                          ]
                    }
                  />
                </Tile>
              </Piece>

              <Piece area="taps" pad={pad} style={{ color: INK, display: 'flex', alignItems: 'flex-end' }}>
                <Copy
                  heading="Two taps"
                  body={[
                    'Tap a group, then pick a full or half session. Push-ups and pull-ups get a dial for reps, cardio gets one for miles. It saves as you go.',
                  ]}
                />
              </Piece>

              <Piece area="logging" bare>
                <Tile color={BLUE} style={{ padding: isMobile ? '28px 12px' : '48px 32px' }}>
                  <Reveal>
                    <PhoneRow phones={[{ screen: 'logging', width: isMobile ? '56%' : 'min(62%, 300px)' }]} />
                  </Reveal>
                </Tile>
              </Piece>

              <Piece area="themes" bare>
                <Tile color={BLUE} style={{ padding: isMobile ? '28px 12px' : '48px 32px' }}>
                  <Reveal>
                    <PhoneRow
                      phones={[
                        { screen: 'themes', width: isMobile ? '46%' : 'min(44%, 300px)' },
                        { screen: 'trend-pink', width: isMobile ? '46%' : 'min(44%, 300px)', lift: isMobile ? 0 : 8 },
                      ]}
                    />
                  </Reveal>
                </Tile>
              </Piece>

              <Piece area="yours" pad={pad} style={{ color: INK, display: 'flex', alignItems: 'flex-end' }}>
                <Copy heading="Make it yours" body={['Pick any background and ink. I keep mine on blue.']} />
              </Piece>

              <Piece area="clock" pad={pad} style={{ color: INK, display: 'flex', alignItems: 'flex-end' }}>
                <Copy
                  heading="And a timer"
                  body={['Rounds, work and rest. It keeps going with the phone locked, on the lock screen and in the Dynamic Island.']}
                />
              </Piece>

              <Piece area="timer" bare>
                <Tile color={BLUE} style={{ padding: isMobile ? '28px 12px' : '48px 32px' }}>
                  <Reveal>
                    <PhoneRow phones={[{ screen: 'timer-setup', width: isMobile ? '56%' : 'min(62%, 300px)' }]} />
                  </Reveal>
                </Tile>
              </Piece>
            </Interlock>
          </div>
        </Wide>
      </SheetPage>
    </div>
  )
}

/** Wider than the column on a big screen, centred on it (the brand page's breakout). */
function Wide({ children }: { children: ReactNode }) {
  const width = 'max(100%, min(1560px, calc(100vw - 96px)))'
  return <div style={{ width, marginLeft: `calc((100% - ${width}) / 2)` }}>{children}</div>
}

/** A tile cut out of the surface: its own fill, the bento's corner, the whole cell. */
function Tile({ color, style, children }: { color: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div style={{ height: '100%', boxSizing: 'border-box', background: color, borderRadius: TILE, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

/** The reference's small monospaced labels. */
function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: '12px',
        letterSpacing: '0.02em',
        color: INK_SOFT,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/** A copy tile's words, sat at its foot: the heading, the paragraphs. */
function Copy({ heading, body, children }: { heading: string; body: string[]; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
      <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{heading}</h2>
      {body.map((paragraph) => (
        <p key={paragraph} style={{ margin: 0, fontSize: '16px', lineHeight: 1.45, color: INK_SOFT }}>
          {paragraph}
        </p>
      ))}
      {children}
    </div>
  )
}

/**
 * The Cinnabars mark: four leaves, each a circle squared off at the corner facing the middle
 * ("05 / Full range" in the logo file, Figma `57oTKOP293tfEjotKZTBGF` node `8:3`, its large mark
 * exported as is).
 */
function LogoMark() {
  return (
    <svg viewBox="21 21 126 126" width="40%" style={{ maxWidth: 112 }} fill={PAPER} role="img" aria-label="The Cinnabars logo, four leaves">
      <path d="M74.2 74.2H47.6C42.339 74.2 37.1962 72.6399 32.8218 69.7171C28.4475 66.7942 25.0381 62.6399 23.0248 57.7794C21.0115 52.9189 20.4848 47.5705 21.5111 42.4106C22.5375 37.2507 25.0709 32.511 28.791 28.791C32.5111 25.0709 37.2507 22.5375 42.4106 21.5111C47.5705 20.4847 52.9189 21.0115 57.7794 23.0248C62.6399 25.0381 66.7943 28.4475 69.7171 32.8218C72.64 37.1962 74.2 42.339 74.2 47.6V74.2Z" />
      <path d="M93.8 74.2V47.6C93.8 42.339 95.36 37.1962 98.2829 32.8218C101.206 28.4475 105.36 25.0381 110.221 23.0248C115.081 21.0115 120.429 20.4847 125.589 21.5111C130.749 22.5375 135.489 25.0709 139.209 28.791C142.929 32.511 145.463 37.2507 146.489 42.4106C147.515 47.5705 146.988 52.9189 144.975 57.7794C142.962 62.6399 139.553 66.7942 135.178 69.7171C130.804 72.6399 125.661 74.2 120.4 74.2H93.8Z" />
      <path d="M93.8 93.8H120.4C125.661 93.8 130.804 95.36 135.178 98.2829C139.553 101.206 142.962 105.36 144.975 110.221C146.988 115.081 147.515 120.429 146.489 125.589C145.463 130.749 142.929 135.489 139.209 139.209C135.489 142.929 130.749 145.463 125.589 146.489C120.429 147.515 115.081 146.988 110.221 144.975C105.36 142.962 101.206 139.553 98.2829 135.178C95.36 130.804 93.8 125.661 93.8 120.4V93.8Z" />
      <path d="M74.2 93.8V120.4C74.2 125.661 72.64 130.804 69.7171 135.178C66.7943 139.553 62.6399 142.962 57.7794 144.975C52.9189 146.988 47.5705 147.515 42.4106 146.489C37.2507 145.463 32.5111 142.929 28.791 139.209C25.0709 135.489 22.5375 130.749 21.5111 125.589C20.4848 120.429 21.0115 115.081 23.0248 110.221C25.0381 105.36 28.4475 101.206 32.8218 98.2829C37.1962 95.36 42.339 93.8 47.6 93.8H74.2Z" />
    </svg>
  )
}

type RowPhone = {
  screen: Screen
  /** The phone's width, as a share of the row (or a length). */
  width: string
  /** Sits over its neighbours, where they overlap. */
  front?: boolean
  /** Drops it down this share of the row's width, so the row steps. */
  lift?: number
  margin?: string
}

/** Phones side by side on the blue, centred, each whole. */
function PhoneRow({ phones, priority = false }: { phones: RowPhone[]; priority?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '4%' }}>
      {phones.map((p) => (
        <div
          key={p.screen}
          style={{
            width: p.width,
            flexShrink: 0,
            position: 'relative',
            zIndex: p.front ? 1 : 0,
            margin: p.margin,
            // Padding resolves against the row's width, so a lift scales with the row.
            paddingTop: p.lift ? `${p.lift}%` : undefined,
          }}
        >
          <Phone screen={p.screen} priority={priority} />
        </div>
      ))}
    </div>
  )
}

/*
  An iPhone drawn round a capture, every length a share of the phone's width (cqw): the
  screen is 94.8 of it inside a 2.6 bezel, its corner 55pt of the 440pt screen, and the
  Dynamic Island 125 × 37pt, 11pt down, over the capture's drawn status bar.
*/
const BEZEL = 2.6
const SCREEN_RADIUS = 11.9

function Phone({ screen, priority }: { screen: Screen; priority: boolean }) {
  return (
    <div style={{ containerType: 'inline-size' }}>
      <div
        style={{
          position: 'relative',
          padding: `${BEZEL}cqw`,
          borderRadius: `${SCREEN_RADIUS + BEZEL}cqw`,
          background: '#0c0c0f',
          boxShadow: `inset 0 0 0 0.6cqw #3b3b42, 0 4cqw 10cqw rgb(5 10 60 / 0.35)`,
        }}
      >
        {CLIPS.has(screen) ? (
          <div style={{ borderRadius: `${SCREEN_RADIUS}cqw`, overflow: 'hidden' }}>
            <SheetClip
              video={{
                src: `/work/cinnabars/${screen}.mp4`,
                poster: `/work/cinnabars/${screen}-poster.jpg`,
                alt: ALT[screen],
                aspect: '880 / 1912',
              }}
            />
          </div>
        ) : (
          <img
            src={`/work/cinnabars/${screen}.webp`}
            alt={ALT[screen]}
            width={1320}
            height={2868}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: `${SCREEN_RADIUS}cqw` }}
          />
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: `${BEZEL + 2.4}cqw`,
            left: '50%',
            width: '26.9cqw',
            height: '8cqw',
            transform: 'translateX(-50%)',
            borderRadius: 999,
            background: '#000',
          }}
        />
      </div>
    </div>
  )
}
