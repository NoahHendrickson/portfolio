import { useState, type CSSProperties, type ReactNode } from 'react'
import { ChartLineUp, DeviceMobile, Lightning, type Icon } from '@phosphor-icons/react'
import { CopyCell, CopyWithFacts, SheetBlock, SheetGap, SheetIntro, SheetPage } from './Sheet'
import WorkGate from './WorkGate'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PROJECT_MAX, PROJECT_MOBILE_PAD } from '../layout'
import { FILL, LEADING, RULE, SHEET_BODY, SHEET_HEADING, TEXT, TEXT_SOFT, cellStyle } from '../sheetStyle'
import { MERIDIAL_ACCENT, MERIDIAL_ACCENT_HOVER, MERIDIAL_THEME } from '../meridialTheme'
import { isUnlocked } from '../workGate'

/*
  `/work/invisible/onboarding`, on the ruled sheet no3y Code and D2 Conflux run
  (`Sheet.tsx`, Nov 4 2026): the intro, a ruled gap, the shipped flow's stage
  across the column, then each step of the study as its media — square and edge
  to edge between the rules — over its copy cell, a ruled gap between steps.
  Role / Team / Partners sit beside the problem's copy as the facts cell.

  The page is the dark sheet like every other, but what it shows takes its
  colour from the product it describes — Meridial's pale-blue panel, white
  cards, soft greys and its magenta — so the screenshots stand on their own
  light rather than being cut into a different one. It borrows the palette, not
  the product's UI: the chrome, type and layout are the portfolio's.

  The palette was read straight off the prototype captures (`prototype-*.webp`),
  so like `ProjectStory`'s screenshot chrome it stays as hexes here rather than
  theme tokens — it is this page's colour, not the site's.
*/
const MERIDIAL = {
  canvas: '#ffffff',
  /** The product's left-hand info panel. */
  panel: '#dff2fe',
  surface: '#f7f7f7',
  border: '#ececec',
  ink: '#141414',
  body: '#4a4a4a',
  muted: '#7c7c7c',
  accent: MERIDIAL_ACCENT,
  accentHover: MERIDIAL_ACCENT_HOVER,
  accentWash: '#f9ecf7',
} as const

/** The plates the screenshots stand on: the panel's blue easing into the magenta's wash. */
const PLATE = `linear-gradient(135deg, ${MERIDIAL.panel} 0%, #eef2fd 50%, ${MERIDIAL.accentWash} 100%)`

/**
 * The site's accent, re-pointed to the product's magenta. The page keeps the
 * sheet's dark surfaces and text; only what reads the accent — `ContactMenu`'s
 * button — picks up Meridial's colour.
 */
const THEME = MERIDIAL_THEME

/** Chrome inside a plate (the charts' cards, the research board) keeps its corner; the plates don't. */
const MOCKUP_RADIUS = radius.xl

const media = {
  research: '/work/invisible/onboarding/research.webp',
  journey: '/work/invisible/onboarding/journey.webp',
  prototypeProfile: '/work/invisible/onboarding/prototype-profile.webp',
  prototypeAddress: '/work/invisible/onboarding/prototype-address.webp',
  next: '/work/invisible/onboarding/next.webp',
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

/** The intro's Role / Team / Partners, as the facts cell beside the problem. */
const FACTS = [
  { heading: 'Role', items: ['Design Lead'] },
  { heading: 'Team', items: ['1.5 designers', '1 PM', '5 engineers'] },
  { heading: 'Partners', items: ['Legal', 'Compliance', 'Hiring', 'Operations'] },
]

export default function InvisibleOnboarding() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)

  if (!unlocked) {
    /** The gate's Back and Contact, as they were. */
    const inset = isMobile ? PROJECT_MOBILE_PAD : `max(48px, calc((100vw - ${PROJECT_MAX}px) / 2))`
    return <WorkGate onUnlock={() => setUnlocked(true)} barInset={inset} />
  }

  return (
    <div style={THEME}>
      <SheetPage>
        <SheetIntro
          title="Revitalizing Meridial’s onboarding flow"
          helper="Invisible Technologies"
          description={[
            'Meridial is Invisible’s talent marketplace for AI training projects. It’s where users sign up and onboard and actually complete tasks. I led the research and redesign of this platform to improve our onboarding metrics as they were straining business and operational needs.',
          ]}
        />

        <SheetGap top />

        <div style={{ borderBottom: RULE }}>
          <Showcase />
        </div>

        {/* The problem: the old funnel, then its copy beside Role / Team / Partners. */}
        <section id="problem">
          <SheetGap />
          <Plate maxWidth={CHART_MAX}>
            <FunnelCard />
          </Plate>
          <CopyWithFacts
            copy={
              <CopyCell
                heading="The problem"
                body="Meridial’s onboarding conversion rate was severely underperforming. Its many high-friction steps caused significant drop-off. This strained operations as teams tried to staff projects on time and deliver results to clients."
                style={{ flex: 1 }}
              />
            }
            facts={FACTS}
          />
        </section>

        <SheetBlock id="process">
          {/*
            Copy left, the two boards stacked right (Nov 5 2026): the section's
            copy reads as one run beside the boards it describes. Not sticky: the
            copy can run taller than a laptop's window. Stacked on mobile, copy first.
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '2fr 3fr',
              borderBottom: RULE,
            }}
          >
            <div style={{ background: FILL, minWidth: 0 }}>
              <CopyCell
                heading="The process"
                body={[
                  'We needed to move fast to identify where users were getting stuck and improve our onboarding conversion. To figure out where the biggest opportunities were, one of our marketing designers and I kicked things off by studying how our competitors handled their own onboarding. Because the marketing site served as the primary front door to our product, we partnered closely with the marketing team right from the start. We documented and dissected competitor flows inside a shared FigJam board that quickly became the foundation for the entire initiative.',
                  'As we analyzed each competitor, we wanted to understand what made their experiences work well or feel painful. We looked closely at the exact information they asked for upfront, how they ordered and paced the steps, and how long it realistically took to finish. We also evaluated how easy or forgiving the experience felt—paying attention to how strict they were with mandatory requirements and form validation versus letting users get into the product with less upfront friction.',
                  'With that baseline in place, it was time to turn the mirror on ourselves and map out what our own process actually looked like. As we walked through the end-to-end user journey, we annotated friction points, open questions, and early ideas. What immediately stood out was how fragmented our entry points were. Instead of a single, coherent path, users coming from different campaigns or pages were dropped into completely different experiences. Right from their first interaction, the journey felt disjointed, confusing, and inconsistent.',
                  'To make sure we spent our design energy where it would move the needle most, we layered those journey-map risks over our quantitative drop-off data. This gave us a clear, evidence-backed strategy to tackle on two fronts: zooming out to clean up the overall flow and sequence across entry points, while simultaneously zooming in to strip away friction on the specific steps where we were losing the most people.',
                ]}
                style={{ background: 'transparent' }}
              />
            </div>
            <div style={{ minWidth: 0, ...(isMobile ? { borderTop: RULE } : { borderLeft: RULE }) }}>
              <Figure caption="Competitor onboarding flows, collected and grouped in FigJam.">
                <Plate maxWidth={RESEARCH_MAX}>
                  <Board
                    src={media.research}
                    alt="Competitive research and onboarding references organized in FigJam"
                    aspect={RESEARCH_ASPECT}
                    onPlate
                  />
                </Plate>
              </Figure>
              <div style={{ borderTop: RULE }}>
                <Figure caption="The journey as it stood, with high-risk areas, questions and ideas pinned to each step.">
                  <Board src={media.journey} alt="Annotated onboarding journey, risks and user flow in FigJam" aspect={BOARD_ASPECT} />
                </Figure>
              </div>
            </div>
          </div>
          <Findings />
        </SheetBlock>

        <SheetBlock id="design">
          <PrototypeViewer />
          <CopyCell
            heading="The design"
            body={[
              'Once the research and journey mapping showed us where to focus, I moved into design. Each decision went back to a question we’d asked in the process.',
              'First, the order and pacing. People were landing in different places depending on how they came in, then dropped on the homepage with a list of “optional” setup steps. I replaced that with a directive, sequential flow: a standard onboarding wizard that takes everyone through the same steps in the same order.',
              'Next, what we asked for upfront. The profile asked for far more than our teams used, so I cut profile details back to what our sourcing tools actually read: a resume, skills, and languages. Everything else came out of the flow.',
              'Verification was the strictest part of the flow, and it showed up with no warning. We asked for ID and proof of address without saying why. Now each of those steps starts with a short tip on why we need it and what to have ready, so people can gather everything before they begin.',
              'Given the short timeline, I suggested a new workflow in which a vibe-coded prototype served as the design source of truth. We could iterate quickly, then hand engineers working frontend code to accelerate the build.',
            ]}
          />
        </SheetBlock>

        <SheetBlock id="outcomes">
          <Plate maxWidth={CHART_MAX}>
            <ExperimentCard />
          </Plate>
          <CopyCell
            heading="Measurable outcomes"
            body={[
              'We placed the new flow behind a feature flag and ran a 50/50 experiment against the existing onboarding experience, tracking results with Mixpanel and Microsoft Clarity.',
              'After three weeks, the results supported our original hypotheses about the high-risk areas we targeted.',
            ]}
          />
          <Results />
        </SheetBlock>

        <SheetBlock id="next">
          <Figure caption="The updated source-of-flow map, used to find the next risks to design for.">
            <Board src={media.next} alt="Updated onboarding source-of-flow map in FigJam" aspect={BOARD_ASPECT} />
          </Figure>
          <CopyCell
            heading="What’s next?"
            body="I wanted to carry the experiment’s momentum into the next onboarding improvements. I reviewed both variants and documented why one outperformed the other. The flow still contained legacy requirements we could not address in this release, so I returned to research to identify the next risks that needed design attention."
          />
        </SheetBlock>
      </SheetPage>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Layout                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * The ground for a visual that shouldn't run the whole column: the palette's
 * gradient across the column, square and edge to edge, with the visual
 * centred on it at `maxWidth`.
 */
function Plate({ maxWidth, children }: { maxWidth: number; children: ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
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

/**
 * Media with its caption over it, on the copy cells' inset and ruled off from
 * the media, so the media runs straight into its copy below (Nov 5 2026; the
 * caption sat under the media until then and split it from its copy).
 */
function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <figure style={{ margin: 0 }}>
      <figcaption
        style={{
          padding: isMobile ? '12px 20px' : '12px 32px',
          fontSize: '14px',
          lineHeight: LEADING,
          color: TEXT_SOFT,
          borderBottom: RULE,
        }}
      >
        {caption}
      </figcaption>
      {children}
    </figure>
  )
}

/** A FigJam board: square across the column, or with its own corner when it floats on a plate. */
function Board({ src, alt, aspect, onPlate = false }: { src: string; alt: string; aspect: string; onPlate?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        aspectRatio: aspect,
        ...(onPlate && {
          borderRadius: MOCKUP_RADIUS,
          outline: `1px solid ${MERIDIAL.border}`,
          outlineOffset: '-1px',
        }),
      }}
    />
  )
}

/** A white card on the product's border — the charts' frame. It sets its own ink, since the page's is light. */
function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: `1px solid ${MERIDIAL.border}`,
        borderRadius: MOCKUP_RADIUS,
        background: MERIDIAL.canvas,
        color: MERIDIAL.ink,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * A row of cells ruled apart — three across, stacked on a phone — for the
 * findings and the results.
 */
function cellRowStyle(isMobile: boolean): CSSProperties {
  return {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'grid',
    gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
  }
}

/** Each cell after the first takes the rule on its leading edge (its top on a phone). */
function cellRule(isMobile: boolean, index: number): CSSProperties {
  if (index === 0) return {}
  return isMobile ? { borderTop: RULE } : { borderLeft: RULE }
}

/* ------------------------------------------------------------------------ */
/* Opening                                                                   */
/* ------------------------------------------------------------------------ */

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
 * The shipped flow on its plate, square and edge to edge across the column:
 * the profile step in front, address verification behind it, and the three
 * results as callouts over the corner. On a phone the front window stands
 * alone, the callouts stacked under it.
 *
 * Positions are shares of a 1160 × 660 stage, so the composition scales with
 * the stage; both windows run off its edges — the front one past the foot,
 * the back one past the right — and are clipped there, so no window ever shows
 * its lower corners floating short of the edge.
 */
function Showcase() {
  const isMobile = useIsMobile()

  const callouts: { icon: Icon; figure: string; label: string }[] = [
    { icon: ChartLineUp, figure: '2×', label: 'overall funnel conversion' },
    { icon: Lightning, figure: '4×', label: 'at the highest-friction step' },
    { icon: DeviceMobile, figure: '+50%', label: 'profile completion on mobile' },
  ]

  /*
    The results run as a row of cells under the stage, ruled apart (stacked on
    a phone), rather than floating over the windows (Nov 4 2026) — they had to
    shrink with the stage there, and covered the windows' lower right.
  */
  const results = (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', borderTop: RULE }}>
      {callouts.map((callout, index) => (
        <div
          key={callout.label}
          style={{
            ...cellStyle(isMobile),
            justifyContent: 'center',
            ...(index > 0 && (isMobile ? { borderTop: RULE } : { borderLeft: RULE })),
          }}
        >
          <Callout {...callout} delay={500 + index * 120} />
        </div>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <div>
        <style>{SHOWCASE_KEYFRAMES}</style>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: PLATE,
            padding: '24px 16px 0',
          }}
        >
          <div className="onb-enter" style={{ position: 'relative', marginBottom: '-12%', ...enter('rise', 0) }}>
            <BrowserWindow src={media.prototypeProfile} alt={SHOWCASE_ALT.profile} />
          </div>
        </div>
        {results}
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
    <div>
      <style>{SHOWCASE_KEYFRAMES}</style>
      <div
        style={{
          position: 'relative',
          aspectRatio: '1160 / 660',
          overflow: 'hidden',
          background: PLATE,
        }}
      >
        <div className="onb-enter" style={{ ...at(540, 52, 700), ...enter('rise', 120) }}>
          <BrowserWindow src={media.prototypeAddress} alt={SHOWCASE_ALT.address} />
        </div>
        <div className="onb-enter" style={{ ...at(40, 120, 880), ...enter('rise', 0) }}>
          <BrowserWindow src={media.prototypeProfile} alt={SHOWCASE_ALT.profile} />
        </div>
      </div>
      {results}
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
 * The hairline ring keeps a white window's edge off the pale plate.
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
  // A result on its cell: the product's magenta icon well, the figure on the
  // page's ink, the label soft. No card of its own now it sits in a cell.
  return (
    <div className="onb-enter" style={{ display: 'flex', alignItems: 'center', gap: '12px', ...enter('pop', delay) }}>
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
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.02em', color: TEXT }}>{figure}</span>
        <span style={{ fontSize: '14px', color: TEXT_SOFT }}>{label}</span>
      </span>
    </div>
  )
}
/* ------------------------------------------------------------------------ */
/* Section media                                                             */
/* ------------------------------------------------------------------------ */

/** The three findings as a row of cells under their heading. */
function Findings() {
  const isMobile = useIsMobile()
  const findings = [
    {
      title: 'We asked for data no one used',
      body: 'The profile asked for far more than our internal teams needed, and almost none of it fed into how we sourced people for projects.',
    },
    {
      title: 'Verification came out of nowhere',
      body: 'We asked for ID and proof of address without explaining why, and some of the copy set the wrong expectation.',
    },
    {
      title: 'The assessment lost the most people',
      body: 'The initial assessment had the biggest drop-off in the flow, and like the profile details, teams barely used the results.',
    },
  ]

  return (
    <div>
      <div style={{ ...cellStyle(isMobile), borderBottom: RULE }}>
        <h3 style={SHEET_HEADING}>Key findings</h3>
      </div>
      <ol style={cellRowStyle(isMobile)}>
        {findings.map(({ title, body }, index) => (
          <li key={title} style={{ ...cellStyle(isMobile), gap: space.md, ...cellRule(isMobile, index) }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                boxSizing: 'border-box',
                borderRadius: '50%',
                border: RULE,
                display: 'grid',
                placeItems: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: TEXT,
              }}
            >
              {index + 1}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, lineHeight: LEADING, color: TEXT }}>{title}</span>
            <span style={{ ...SHEET_BODY, color: TEXT_SOFT }}>{body}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * The two prototype screens, one at a time behind a two-way toggle, on a plate
 * across the column. The two windows share one grid cell and cross-fade, so
 * the plate never changes height as the screen changes.
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
    <Figure caption={screens[current].caption}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
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
              loading="lazy"
              decoding="async"
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
    </Figure>
  )
}

/** The three results as a row of cells, ruled off from the outcomes' copy above. */
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
    Each cell spans three rows of the outer grid and lays its figure, title and
    body on them through `subgrid`, so a title that wraps to two lines pushes
    every cell's body down together instead of staggering them.
  */
  return (
    <ul style={{ ...cellRowStyle(isMobile), borderTop: RULE }}>
      {results.map(({ figure, title, body }, index) => (
        <li
          key={title}
          style={{
            background: FILL,
            padding: isMobile ? '20px' : '32px',
            display: 'grid',
            gridRow: 'span 3',
            gridTemplateRows: 'subgrid',
            rowGap: space.md,
            alignContent: 'start',
            ...cellRule(isMobile, index),
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
          <span style={{ ...SHEET_HEADING, marginTop: space.sm }}>{title}</span>
          <span style={{ ...SHEET_BODY, color: TEXT_SOFT }}>{body}</span>
        </li>
      ))}
    </ul>
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
