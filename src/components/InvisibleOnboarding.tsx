import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ChartLineUp, DeviceMobile, Lightning, type Icon } from '@phosphor-icons/react'
import Header from './Header'
import WorkGate from './WorkGate'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PROJECT_MOBILE_PAD } from '../layout'
import { isUnlocked } from '../workGate'

/*
  This study takes its colour from the product it describes rather than from
  the dark shell — a white page, Meridial's pale-blue panel, soft greys and its
  magenta — so the screenshots sit in their own light instead of being cut into
  a different site. It borrows the palette, not the product's UI: the chrome,
  type and layout are still the portfolio's.

  The palette was read straight off the prototype captures (`prototype-*.png`),
  so like `ProjectStory`'s screenshot chrome it stays as hexes here rather than
  theme tokens — it is this page's colour, not the site's.
*/
const MERIDIAL = {
  canvas: '#ffffff',
  /** The product's left-hand info panel. */
  panel: '#dff2fe',
  pill: '#f1f1f1',
  surface: '#f7f7f7',
  border: '#ececec',
  ink: '#141414',
  body: '#4a4a4a',
  muted: '#7c7c7c',
  accent: '#cb52b9',
  accentHover: '#b5449f',
  /** The disabled "Next" button. */
  accentSoft: '#e5a8dc',
  accentWash: '#f9ecf7',
} as const

/** The two plates the screenshots stand on: the panel's blue easing into the magenta's wash. */
const PLATE = `linear-gradient(135deg, ${MERIDIAL.panel} 0%, #eef2fd 50%, ${MERIDIAL.accentWash} 100%)`

/**
 * The site's theme vars, re-pointed for this page. Everything that reads a
 * token — `Header`'s Back pill, `ContactMenu`'s button and dropdown, the
 * copied toast — picks up the palette without the shared components knowing.
 */
const THEME = {
  '--color-bg-primary': MERIDIAL.canvas,
  '--color-bg-raised': MERIDIAL.canvas,
  '--color-bg-inverse': MERIDIAL.ink,
  '--color-text-primary': MERIDIAL.ink,
  '--color-text-secondary': MERIDIAL.body,
  '--color-text-muted': MERIDIAL.muted,
  '--color-border-subtle': MERIDIAL.pill,
  '--color-border-default': MERIDIAL.border,
  '--color-orange': MERIDIAL.accent,
  '--color-orange-hover': MERIDIAL.accentHover,
  '--color-on-accent': '#ffffff',
} as CSSProperties

/**
 * One capped column for the whole page — copy, charts and screenshots share
 * its edges, so nothing runs out to the viewport on a big screen while the text
 * stays on a narrow measure.
 */
const PAGE_MAX = 1160
/**
 * The measure for every block of copy. Each section stacks its number, heading
 * and copy flush left on this measure; anything visual spans the whole of
 * `PAGE_MAX` — a visual that would blow up at that width (the charts, the
 * research board) is centred on a full-width `Plate` instead, so every
 * visual block shares the same edges.
 */
const COPY_MAX = 720
/** The opening showcase runs wider than the column, up to this. */
const SHOWCASE_MAX = 1320
const SHOWCASE_WIDTH = `min(${SHOWCASE_MAX}px, calc(100vw - 96px))`

const MOCKUP_RADIUS = radius.xl

const media = {
  research: '/work/invisible/onboarding/research.png',
  journey: '/work/invisible/onboarding/journey.png',
  prototypeProfile: '/work/invisible/onboarding/prototype-profile.png',
  prototypeAddress: '/work/invisible/onboarding/prototype-address.png',
  next: '/work/invisible/onboarding/next.png',
} as const

/** The exports' own ratios. */
const BOARD_ASPECT = '1515 / 844'
const RESEARCH_ASPECT = '1742 / 1622'
const PROTOTYPE_ASPECT = '1620 / 1089'
/**
 * The research board is 1742px wide, so half that is the widest it renders at
 * a clean 2×; the prototype windows are 2× captures of an 810 frame. Holding
 * them there keeps the UI text sharp.
 */
const RESEARCH_MAX = 871
/** The charts' card on its plate — wide enough to read, narrow enough not to sprawl. */
const CHART_MAX = 760
const PROTOTYPE_MAX = 960

/** The study's sections, in order — each one's number is its place here. */
const STEPS = ['problem', 'process', 'design', 'outcomes', 'next'] as const

type StepId = (typeof STEPS)[number]

const bodyStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.6,
  color: MERIDIAL.body,
}

export default function InvisibleOnboarding() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)

  /*
    The shell paints the body dark; on an overscroll bounce that would show
    above and below a white page, so the body takes the canvas while it's up.
  */
  useEffect(() => {
    if (!unlocked) return
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = MERIDIAL.canvas
    return () => {
      document.body.style.backgroundColor = previous
    }
  }, [unlocked])

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  const pad = isMobile ? PROJECT_MOBILE_PAD : '48px'
  /** Back and Contact sit on the column's edges rather than the viewport's. */
  const inset = isMobile ? pad : `max(${pad}, calc((100vw - ${PAGE_MAX}px) / 2))`

  return (
    <div
      style={{
        ...THEME,
        minHeight: '100vh',
        background: MERIDIAL.canvas,
        color: MERIDIAL.ink,
      }}
    >
      <Header leading="back" showProfile={false} barInset={inset} />

      <main style={{ padding: isMobile ? `0 ${pad} 96px` : `0 ${pad} 160px` }}>
        <div
          style={{
            maxWidth: PAGE_MAX,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '96px' : '160px',
          }}
        >
          <Hero />

          <Section
            id="problem"
            title="The problem"
            body={
              <p style={{ ...bodyStyle, color: MERIDIAL.ink }}>
                Meridial’s onboarding conversion rate was severely underperforming. Its many
                high-friction steps caused significant drop-off. This strained operations as teams
                tried to staff projects on time and deliver results to clients.
              </p>
            }
          >
            <Plate maxWidth={CHART_MAX}>
              <FunnelCard />
            </Plate>
          </Section>

          <Section
            id="process"
            title="The process"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  We needed to identify the highest-impact friction quickly and improve onboarding
                  conversion.
                </p>
                <p style={bodyStyle}>
                  One of our marketing designers and I began by researching competitors and
                  creating a FigJam board that became the initiative’s foundation. We collaborated
                  closely with the marketing team because the marketing site was a major entry
                  point into the product.
                </p>
              </Paragraphs>
            }
          >
            <Shot
              src={media.research}
              alt="Competitive research and onboarding references organized in FigJam"
              aspect={RESEARCH_ASPECT}
              plateWidth={RESEARCH_MAX}
              caption="Competitor onboarding flows, collected and grouped in FigJam."
            />

            <Copy>
              <Paragraphs>
                <p style={bodyStyle}>
                  Next, we mapped the user journey and annotated high-risk areas, questions, and
                  ideas, then combined those risks with drop-off data to show where design
                  attention would be most valuable.
                </p>
                <p style={bodyStyle}>
                  We worked on two fronts: improving the overall flow and sequence, and removing
                  unnecessary friction by homing in on the steps with the most drop-off.
                </p>
              </Paragraphs>
            </Copy>

            <Shot
              src={media.journey}
              alt="Annotated onboarding journey, risks and user flow in FigJam"
              aspect={BOARD_ASPECT}
              caption="The journey as it stood, with high-risk areas, questions and ideas pinned to each step."
            />

            <Findings />
          </Section>

          <Section
            id="design"
            title="The design"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  Once research and brainstorming identified the right focus areas, I moved into
                  design.
                </p>
                <p style={bodyStyle}>
                  I designed a more directive, sequential flow: instead of dropping users on the
                  homepage with “optional” setup steps, I put them through a standard onboarding
                  wizard. At each step I identified the details that were actually required and
                  stripped everything else.
                </p>
                <p style={bodyStyle}>
                  Given the short timeline, I suggested a new workflow in which a vibe-coded
                  prototype served as the design source of truth. We could iterate quickly, then
                  hand engineers working frontend code to accelerate the build.
                </p>
              </Paragraphs>
            }
          >
            <PrototypeViewer />
          </Section>

          <Section
            id="outcomes"
            title="Measurable outcomes"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  We placed the new flow behind a feature flag and ran a 50/50 experiment against
                  the existing onboarding experience, tracking results with Mixpanel and Microsoft
                  Clarity.
                </p>
                <p style={bodyStyle}>
                  After three weeks, the results supported our original hypotheses about the
                  high-risk areas we targeted.
                </p>
              </Paragraphs>
            }
          >
            <Results />
            <Plate maxWidth={CHART_MAX}>
              <ExperimentCard />
            </Plate>
          </Section>

          <Section
            id="next"
            title="What’s next?"
            body={
              <p style={bodyStyle}>
                I wanted to carry the experiment’s momentum into the next onboarding improvements. I
                reviewed both variants and documented why one outperformed the other. The flow still
                contained legacy requirements we could not address in this release, so I returned to
                research to identify the next risks that needed design attention.
              </p>
            }
          >
            <Shot
              src={media.next}
              alt="Updated onboarding source-of-flow map in FigJam"
              aspect={BOARD_ASPECT}
              caption="The updated source-of-flow map, used to find the next risks to design for."
            />
          </Section>
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Layout                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * The page's opening: the title and a short overview, then `Showcase`. The
 * overview is the pitch in three sentences; the detail is in the steps below.
 */
function Hero() {
  const isMobile = useIsMobile()

  const meta = [
    { label: 'Role', value: 'Design Lead' },
    { label: 'Team', value: '1.5 designers, 1 PM, 5 engineers' },
    { label: 'Partners', value: 'Legal, Compliance, Hiring, Operations' },
  ]

  return (
    <section
      style={{
        paddingTop: isMobile ? '48px' : '64px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '24px' : '32px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
        <span
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: space.sm,
            height: '30px',
            padding: '0 12px',
            borderRadius: radius.full,
            background: MERIDIAL.pill,
            fontSize: '13px',
            fontWeight: 500,
            color: MERIDIAL.ink,
          }}
        >
          <span
            aria-hidden
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: MERIDIAL.accent }}
          />
          Meridial by Invisible
        </span>

        <h1
          style={{
            margin: 0,
            maxWidth: '12em',
            fontSize: isMobile ? '40px' : 'clamp(48px, 5vw, 64px)',
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            textWrap: 'balance',
          }}
        >
          Revitalizing Meridial’s onboarding flow
        </h1>
      </div>

      {/* Stacked flush left like every section below: the overview, then the facts. */}
      <div
        style={{
          maxWidth: `${COPY_MAX}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '24px' : '32px',
        }}
      >
        <p style={{ ...bodyStyle, fontSize: isMobile ? '18px' : '20px', color: MERIDIAL.ink }}>
          Meridial is where Invisible onboards the people behind its AI training work, and its
          fragmented onboarding was losing most of them before they finished. I led the research
          and design that turned a scatter of optional setup steps into one guided flow, and
          doubled conversion.
        </p>
        <dl
          style={{
            margin: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '14px' : '14px 48px',
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          {meta.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <dt style={{ color: MERIDIAL.muted }}>{label}</dt>
              <dd style={{ margin: 0, color: MERIDIAL.ink }}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/*
        The showcase breaks out of the text column: up to `SHOWCASE_MAX`,
        centred on it, and never closer than the page gutter to the viewport.
      */}
      <div
        style={{
          marginTop: isMobile ? '16px' : '24px',
          ...(isMobile
            ? {}
            : {
                width: SHOWCASE_WIDTH,
                marginLeft: `calc((100% - ${SHOWCASE_WIDTH}) / 2)`,
              }),
        }}
      >
        <Showcase />
      </div>
    </section>
  )
}

/** The page's entrance: the windows rise into place and the callouts pop in after. */
const SHOWCASE_KEYFRAMES = `
@keyframes onb-rise {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
@keyframes onb-pop {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .onb-enter { animation: none !important; }
}
`

const enter = (name: 'rise' | 'pop', delay: number): CSSProperties => ({
  animation: `onb-${name} ${name === 'rise' ? 900 : 500}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms both`,
})

/**
 * The shipped flow on its plate: the profile step in front, address
 * verification behind it, and the three results as callouts over the corner.
 *
 * Positions are shares of a 1160 × 660 stage, so the composition scales with
 * the stage; both windows run off its edges — the front one past the foot,
 * the back one past the right — and are clipped there, so no window ever shows
 * its lower corners floating short of the edge.
 */
function Showcase() {
  const isMobile = useIsMobile()
  const stageRef = useRef<HTMLDivElement>(null)
  /*
    The windows scale with the stage as shares of it; the callouts are real
    type, so they shrink by the same factor rather than staying full size and
    swallowing the windows on a narrower stage.
  */
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => setScale(Math.min(1, stage.clientWidth / 1160)))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [isMobile])

  const callouts: { icon: Icon; figure: string; label: string }[] = [
    { icon: ChartLineUp, figure: '2×', label: 'overall funnel conversion' },
    { icon: Lightning, figure: '4×', label: 'at the highest-friction step' },
    { icon: DeviceMobile, figure: '+50%', label: 'profile completion on mobile' },
  ]

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <style>{SHOWCASE_KEYFRAMES}</style>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: radius['2xl'],
            background: PLATE,
            padding: '24px 16px 0',
          }}
        >
          <div className="onb-enter" style={{ position: 'relative', marginBottom: '-12%', ...enter('rise', 0) }}>
            <BrowserWindow src={media.prototypeProfile} alt={SHOWCASE_ALT.profile} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {callouts.map((callout, index) => (
            <Callout key={callout.label} {...callout} delay={500 + index * 120} />
          ))}
        </div>
      </div>
    )
  }

  const at = (left: number, top: number, width?: number): CSSProperties => ({
    position: 'absolute',
    left: `${(left / 1160) * 100}%`,
    top: `${(top / 660) * 100}%`,
    width: width ? `${(width / 1160) * 100}%` : undefined,
  })

  return (
    <div
      ref={stageRef}
      style={{
        position: 'relative',
        aspectRatio: '1160 / 660',
        overflow: 'hidden',
        borderRadius: radius['2xl'],
        background: PLATE,
      }}
    >
      <style>{SHOWCASE_KEYFRAMES}</style>

      <div className="onb-enter" style={{ ...at(540, 52, 700), ...enter('rise', 120) }}>
        <BrowserWindow src={media.prototypeAddress} alt={SHOWCASE_ALT.address} />
      </div>
      <div className="onb-enter" style={{ ...at(40, 120, 880), ...enter('rise', 0) }}>
        <BrowserWindow src={media.prototypeProfile} alt={SHOWCASE_ALT.profile} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: '3.5%',
          bottom: '6%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transform: `scale(${scale})`,
          transformOrigin: 'bottom right',
        }}
      >
        {callouts.map((callout, index) => (
          <Callout key={callout.label} {...callout} delay={600 + index * 120} />
        ))}
      </div>
    </div>
  )
}

const SHOWCASE_ALT = {
  profile: 'The redesigned Meridial onboarding: the profile details step, with resume upload, skills and languages',
  address: 'The redesigned Meridial onboarding: the address verification step, with tips for the documents to have ready',
} as const

/**
 * The screenshot windows' lift: a tight contact shadow, a soft ambient one that
 * shows on every edge, and a deeper drop below, all tinted toward the plate's
 * blue rather than grey so they read as light on the plate, not dirt on it.
 * The hairline ring keeps a white window's edge off a white canvas.
 */
const WINDOW_SHADOW = [
  '0 1px 3px rgba(20, 40, 60, 0.08)',
  '0 8px 24px -4px rgba(30, 70, 100, 0.14)',
  '0 28px 56px -16px rgba(30, 70, 100, 0.22)',
  '0 0 0 1px rgba(20, 20, 20, 0.06)',
].join(', ')

/** A screenshot in a plain window frame — three dots and nothing product-specific. */
function BrowserWindow({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderRadius: radius.lg,
        background: MERIDIAL.canvas,
        boxShadow: WINDOW_SHADOW,
      }}
    >
      <div
        style={{
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          background: MERIDIAL.surface,
          borderBottom: `1px solid ${MERIDIAL.border}`,
        }}
      >
        <div aria-hidden style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map((dot) => (
            <span key={dot} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dcdcdc' }} />
          ))}
        </div>
      </div>
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', aspectRatio: PROTOTYPE_ASPECT }}
      />
    </div>
  )
}

function Callout({
  icon: CalloutIcon,
  figure,
  label,
  delay,
}: {
  icon: Icon
  figure: string
  label: string
  delay: number
}) {
  return (
    <div
      className="onb-enter"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 18px 10px 10px',
        borderRadius: radius.xl,
        background: MERIDIAL.canvas,
        boxShadow: '0 12px 28px -10px rgba(30, 70, 100, 0.3), 0 0 0 1px rgba(20, 20, 20, 0.05)',
        ...enter('pop', delay),
      }}
    >
      <span
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          borderRadius: radius.md,
          background: MERIDIAL.accentWash,
          display: 'grid',
          placeItems: 'center',
          color: MERIDIAL.accent,
        }}
      >
        <CalloutIcon size={20} />
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.02em', color: MERIDIAL.ink }}>
          {figure}
        </span>
        <span style={{ fontSize: '14px', color: MERIDIAL.body }}>{label}</span>
      </span>
    </div>
  )
}

/**
 * One step of the study: its number, heading and copy stacked flush left on
 * the copy measure, and whatever follows (`children`) underneath at full width.
 */
function Section({
  id,
  title,
  body,
  children,
}: {
  id: StepId
  title: string
  body: ReactNode
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  const index = STEPS.indexOf(id)

  return (
    <section
      id={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '40px' : '64px',
      }}
    >
      <div
        style={{
          maxWidth: `${COPY_MAX}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            color: MERIDIAL.accent,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h2>
        <div style={{ marginTop: isMobile ? '8px' : '12px' }}>{body}</div>
      </div>
      {children}
    </section>
  )
}

/** Copy that continues a section further down, on the same measure as its opening copy. */
function Copy({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: `${COPY_MAX}px` }}>{children}</div>
}

/**
 * The full-width ground for a visual that shouldn't run the whole column: the
 * palette's gradient, with the visual centred on it at `maxWidth`.
 */
function Plate({ maxWidth, children }: { maxWidth: number; children: ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        borderRadius: radius['2xl'],
        background: PLATE,
        padding: isMobile ? '16px' : '48px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: `${maxWidth}px`, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function Paragraphs({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>{children}</div>
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption style={{ fontSize: '14px', lineHeight: 1.5, color: MERIDIAL.muted }}>
      {children}
    </figcaption>
  )
}

function Shot({
  src,
  alt,
  aspect,
  plateWidth,
  caption,
}: {
  src: string
  alt: string
  aspect: string
  /** Centre the shot on a `Plate` at this width instead of running the column. */
  plateWidth?: number
  caption?: string
}) {
  const image = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: aspect,
        borderRadius: MOCKUP_RADIUS,
        outline: `1px solid ${MERIDIAL.border}`,
        outlineOffset: '-1px',
      }}
    />
  )
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {plateWidth ? <Plate maxWidth={plateWidth}>{image}</Plate> : image}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  )
}

/** A white card on the product's border — the charts' frame. */
function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: `1px solid ${MERIDIAL.border}`,
        borderRadius: MOCKUP_RADIUS,
        background: MERIDIAL.canvas,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Section media                                                             */
/* ------------------------------------------------------------------------ */

function Findings() {
  const isMobile = useIsMobile()
  const findings = [
    {
      title: 'Too much profile',
      body: 'We asked for far more on the profile than our internal teams used. None of it played a major role in our sourcing tools.',
    },
    {
      title: 'Under-explained verification',
      body: 'ID and address verification weren’t explained, and some of the copy set a false expectation.',
    },
    {
      title: 'A barrier, not a filter',
      body: 'The initial assessment was the largest barrier and, like the profile details, barely useful to the business.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ margin: 0, fontSize: '16px', color: MERIDIAL.muted }}>Key findings</p>
      <ol
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        {findings.map(({ title, body }, index) => (
          <li
            key={title}
            style={{
              padding: '28px',
              borderRadius: radius['2xl'],
              background: MERIDIAL.panel,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: MERIDIAL.canvas,
                display: 'grid',
                placeItems: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: MERIDIAL.accent,
              }}
            >
              {index + 1}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 500, lineHeight: 1.3 }}>{title}</span>
            <span style={{ fontSize: '16px', lineHeight: 1.55, color: MERIDIAL.body }}>{body}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * The two prototype screens, one at a time behind a two-way toggle. The two
 * windows share one grid cell and cross-fade, so the plate never changes
 * height as the screen changes.
 */
function PrototypeViewer() {
  const isMobile = useIsMobile()
  const screens = [
    {
      label: 'Profile details',
      src: media.prototypeProfile,
      alt: 'Meridial onboarding prototype: the profile details step, with resume upload, skills and languages',
      caption: 'Profile details, cut back to what our sourcing tools actually read: a resume, skills and languages.',
    },
    {
      label: 'Address verification',
      src: media.prototypeAddress,
      alt: 'Meridial onboarding prototype: the address verification step, with the tips panel beside it',
      caption: 'Address verification now says why it’s asked for and what to have ready before it starts.',
    },
  ]
  const [current, setCurrent] = useState(0)

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius['2xl'],
          background: PLATE,
          padding: isMobile ? '20px 12px 12px' : '32px 48px 56px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '16px' : '28px',
        }}
      >
        <div
          role="tablist"
          aria-label="Prototype screens"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: space.xs,
            padding: '4px',
            borderRadius: radius.full,
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {screens.map((screen, index) => (
            <button
              key={screen.label}
              type="button"
              role="tab"
              aria-selected={current === index}
              onClick={() => setCurrent(index)}
              onMouseEnter={() => setCurrent(index)}
              style={{
                height: '32px',
                padding: '0 14px',
                border: 'none',
                borderRadius: radius.full,
                background: current === index ? MERIDIAL.canvas : 'transparent',
                boxShadow: current === index ? '0 1px 3px rgba(20, 20, 20, 0.12)' : 'none',
                color: current === index ? MERIDIAL.ink : MERIDIAL.muted,
                fontFamily: 'inherit',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: current === index ? 500 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 200ms ease, color 200ms ease',
              }}
            >
              {screen.label}
            </button>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: `${PROTOTYPE_MAX}px`,
            display: 'grid',
            borderRadius: radius.lg,
            overflow: 'hidden',
            background: MERIDIAL.canvas,
            boxShadow: WINDOW_SHADOW,
          }}
        >
          {screens.map((screen, index) => (
            <img
              key={screen.src}
              src={screen.src}
              alt={screen.alt}
              aria-hidden={current !== index}
              style={{
                gridArea: '1 / 1',
                display: 'block',
                width: '100%',
                aspectRatio: PROTOTYPE_ASPECT,
                opacity: current === index ? 1 : 0,
                transition: 'opacity 280ms ease',
              }}
            />
          ))}
        </div>
      </div>
      <Caption>{screens[current].caption}</Caption>
    </figure>
  )
}

/**
 * The original funnel: four steps, each bar the share of users still in the
 * flow. Heights are the old frame's (357 / 232 / 132 / 28 of 357), unlabelled
 * there and here — it shows the shape of the drop, not a reported number.
 */
function FunnelCard() {
  const isMobile = useIsMobile()
  const fills = [357, 232, 132, 28]

  return (
    <figure style={{ margin: 0 }}>
      <Card style={{ padding: isMobile ? '20px' : '28px 32px 24px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: isMobile ? '2px' : space.lg,
            marginBottom: '24px',
          }}
        >
          <figcaption style={{ fontSize: '15px', fontWeight: 500 }}>Original onboarding funnel</figcaption>
          <span style={{ fontSize: '13px', color: MERIDIAL.muted }}>Users remaining</span>
        </div>
        <div
          role="img"
          aria-label="Onboarding conversion falling sharply across four steps"
          style={{
            height: isMobile ? '180px' : '240px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: isMobile ? '10px' : '16px',
          }}
        >
          {fills.map((fill) => (
            <div
              key={fill}
              style={{
                position: 'relative',
                borderRadius: radius.md,
                background: MERIDIAL.accentWash,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 'auto 0 0',
                  height: `${(fill / fills[0]) * 100}%`,
                  borderRadius: radius.md,
                  background: MERIDIAL.accent,
                }}
              />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: isMobile ? '10px' : '16px',
            fontSize: '13px',
            color: MERIDIAL.muted,
          }}
        >
          {fills.map((fill, index) => (
            <span key={fill}>Step {index + 1}</span>
          ))}
        </div>
      </Card>
    </figure>
  )
}

function Results() {
  const isMobile = useIsMobile()
  const results = [
    {
      figure: '4×',
      title: 'Conversion at our highest-friction step',
      body: 'Research showed the largest drop-off at the required initial assessment. We completed it ourselves and met with teams to learn whether they used the results meaningfully. They didn’t, so we removed the step entirely.',
    },
    {
      figure: '+50%',
      title: 'Profile completion for mobile users',
      body: 'Roughly 35% of our users were onboarding on mobile, so I took a close look at our mobile screens and redesigned them.',
    },
    {
      figure: '2×',
      title: 'Overall funnel conversion',
      body: 'The new design increased the number of users completing the flow by 100%.',
    },
  ]

  /*
    Each card spans three rows of the outer grid and lays its figure, title and
    body on them through `subgrid`, so a title that wraps to two lines pushes
    every card's body down together instead of staggering them.
  */
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
        columnGap: '16px',
        rowGap: isMobile ? '16px' : 0,
      }}
    >
      {results.map(({ figure, title, body }) => (
        <Card
          key={title}
          style={{
            padding: '28px',
            display: 'grid',
            gridRow: 'span 3',
            gridTemplateRows: 'subgrid',
            rowGap: '12px',
            alignContent: 'start',
          }}
        >
          <span
            style={{
              fontSize: isMobile ? '48px' : '56px',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: MERIDIAL.accent,
            }}
          >
            {figure}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 500, lineHeight: 1.3, marginTop: '8px' }}>
            {title}
          </span>
          <span style={{ fontSize: '15px', lineHeight: 1.55, color: MERIDIAL.body }}>{body}</span>
        </Card>
      ))}
    </div>
  )
}

/**
 * The 50/50 experiment: the old flow against the new, at the old frame's
 * 132 / 288 bar heights.
 */
function ExperimentCard() {
  const isMobile = useIsMobile()
  const bars = [
    { label: 'Existing flow', value: 132, fill: '#d9d9d9' },
    { label: 'New flow', value: 288, fill: MERIDIAL.accent },
  ]

  return (
    <figure style={{ margin: 0 }}>
      <Card style={{ padding: isMobile ? '20px' : '28px 32px 24px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: isMobile ? '2px' : space.lg,
            marginBottom: '24px',
          }}
        >
          <figcaption style={{ fontSize: '15px', fontWeight: 500 }}>
            Funnel conversion, after three weeks
          </figcaption>
          <span style={{ fontSize: '13px', color: MERIDIAL.muted }}>50/50 experiment</span>
        </div>
        <div
          role="img"
          aria-label="New onboarding conversion substantially outperforming the old flow"
          style={{
            height: isMobile ? '180px' : '240px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 180px))',
            justifyContent: 'center',
            gap: isMobile ? '24px' : '64px',
            alignItems: 'end',
          }}
        >
          {bars.map(({ label, value, fill }) => (
            <div
              key={label}
              style={{
                position: 'relative',
                height: `${(value / 288) * 100}%`,
                borderRadius: radius.md,
                background: fill,
              }}
            >
              {fill === MERIDIAL.accent && (
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '16px',
                    fontSize: '28px',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                  }}
                >
                  2×
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          aria-hidden
          style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 180px))',
            justifyContent: 'center',
            gap: isMobile ? '24px' : '64px',
            fontSize: '13px',
            color: MERIDIAL.muted,
          }}
        >
          {bars.map(({ label }) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </Card>
    </figure>
  )
}
