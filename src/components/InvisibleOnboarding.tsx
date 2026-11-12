import { useState, type CSSProperties, type ReactNode } from 'react'
import { ChartLineUp, DeviceMobile, Lightning, type Icon } from '@phosphor-icons/react'
import Reveal from './Reveal'
import { CurvedCard, CurvedCopy, CurvedFacts, CurvedPanel } from './Curved'
import { SheetIntro, SheetPage } from './Sheet'
import WorkGate from './WorkGate'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PROJECT_MAX, PROJECT_MOBILE_PAD } from '../layout'
import { CURVED_BODY_SIZE, LEADING, RULE, SHEET_BODY, SHEET_HEADING, TEXT, TEXT_SOFT, curvedInset, sheetGap } from '../sheetStyle'
import { MERIDIAL_ACCENT, MERIDIAL_ACCENT_HOVER, MERIDIAL_PLATE, MERIDIAL_THEME } from '../meridialTheme'
import { isUnlocked } from '../workGate'

/*
  `/work/invisible/onboarding`, on the curved cards no3y Code runs (`Curved.tsx`,
  Nov 9 2026): the intro, then each step of the study as its media on a rounded
  card with its copy on a tab hanging off the card's foot. Role / Team / Partners
  the process's four steps and the key findings stand apart as cards of their own
  under the media they sit beside, and the process is split into two cards, its first half under the
  research board and its second under the journey map it describes.

  The page is the site's like every other, but what it shows takes its
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
  surface: '#f7f7f7',
  border: '#ececec',
  ink: '#141414',
  body: '#4a4a4a',
  muted: '#7c7c7c',
  accent: MERIDIAL_ACCENT,
  accentHover: MERIDIAL_ACCENT_HOVER,
  accentWash: '#f9ecf7',
} as const

const PLATE = MERIDIAL_PLATE

/**
 * The site's accent, re-pointed to the product's magenta. The page keeps the
 * sheet's dark surfaces and text; only what reads the accent — `ContactMenu`'s
 * button — picks up Meridial's colour.
 */
const THEME = MERIDIAL_THEME

/** Chrome inside a plate (the charts' cards, the research board) keeps its corner. */
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
 * The research board is held to what fits on a laptop's screen with its copy, since it
 * is nearly square. The prototype windows are 2× captures of an 810 frame, so they
 * stay sharp up to 960; they run as wide as the plate allows (640 read too small).
 */
const RESEARCH_MAX = 560
/** The charts' card on its plate — wide enough to read, narrow enough not to sprawl. */
const CHART_MAX = 760
const PROTOTYPE_MAX = 960

/** The intro's Role / Team / Partners, as the card beside the problem. */
const FACTS = [
  { heading: 'Role', items: ['Design Lead'] },
  { heading: 'Team', items: ['1.5 designers', '1 PM', '5 engineers'] },
  { heading: 'Partners', items: ['Legal', 'Compliance', 'Hiring', 'Operations'] },
]

/** Tools and Skills, as the card beside the opener's results (no3y Code and D2 Conflux carry theirs the same way). */
const TOOLS_AND_SKILLS = [
  { heading: 'Tools', items: ['Figma', 'Cursor', 'Claude Code', 'Mixpanel', 'Microsoft Clarity'] },
  {
    heading: 'Skills',
    items: [
      'A/B testing',
      'User research',
      'User testing',
      'Journey mapping',
      'Wireframes',
      'Data interpretation',
      'Competitor analysis',
      'Cross-functional facilitation',
    ],
  },
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
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          <CurvedCard media={<Showcase />} copy={<ShowcaseResults />} side={<CurvedFacts facts={TOOLS_AND_SKILLS} />} />

          <div id="problem">
            <Reveal>
              <CurvedCard
                media={
                  <Plate maxWidth={CHART_MAX}>
                    <FunnelCard />
                  </Plate>
                }
                copy={
                  <CurvedCopy
                    heading="The problem"
                    body="Meridial’s onboarding conversion rate was severely underperforming. Its many high-friction steps caused significant drop-off. This strained operations as teams tried to staff projects on time and deliver results to clients."
                  />
                }
                side={<CurvedFacts facts={FACTS} />}
              />
            </Reveal>
          </div>

          <div id="process" style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
            <Reveal>
              <CurvedCard
                media={
                  <Plate maxWidth={RESEARCH_MAX}>
                    <Board
                      src={media.research}
                      alt="Competitive research and onboarding references organized in FigJam"
                      aspect={RESEARCH_ASPECT}
                      onPlate
                    />
                  </Plate>
                }
                copy={
                  <CurvedCopy
                    heading="The process"
                    caption="Competitor onboarding flows, collected and grouped in FigJam."
                    body={[
                      'We needed to move fast to identify where users were getting stuck and improve our onboarding conversion. To figure out where the biggest opportunities were, one of our marketing designers and I kicked things off by studying how our competitors handled their own onboarding. Because the marketing site served as the primary front door to our product, we partnered closely with the marketing team right from the start. We documented and dissected competitor flows inside a shared FigJam board that quickly became the foundation for the entire initiative.',
                      'As we analyzed each competitor, we wanted to understand what made their experiences work well or feel painful. We looked closely at the exact information they asked for upfront, how they ordered and paced the steps, and how long it realistically took to finish. We also evaluated how easy or forgiving the experience felt, paying attention to how strict they were with mandatory requirements and form validation versus letting users get into the product with less upfront friction.',
                    ]}
                  />
                }
                side={<NumberedList heading="The steps" items={STEPS} />}
              />
            </Reveal>
            <Reveal>
              <CurvedCard
                media={<Board src={media.journey} alt="Annotated onboarding journey, risks and user flow in FigJam" aspect={BOARD_ASPECT} />}
                copy={
                  <CurvedCopy
                    caption="The journey as it stood, with high-risk areas, questions and ideas pinned to each step."
                    body={[
                      'With that baseline in place, it was time to turn the mirror on ourselves and map out what our own process actually looked like. As we walked through the end-to-end user journey, we annotated friction points, open questions, and early ideas. What immediately stood out was how fragmented our entry points were. Instead of a single, coherent path, users coming from different campaigns or pages were dropped into completely different experiences. Right from their first interaction, the journey felt disjointed, confusing, and inconsistent.',
                      'To make sure we spent our design energy where it would move the needle most, we layered those journey-map risks over our quantitative drop-off data. This gave us a clear, evidence-backed strategy to tackle on two fronts: zooming out to clean up the overall flow and sequence across entry points, while simultaneously zooming in to strip away friction on the specific steps where we were losing the most people.',
                    ]}
                  />
                }
                side={<NumberedList heading="Key findings" items={FINDINGS} />}
              />
            </Reveal>
          </div>

          <div id="design">
            <Reveal>
              <CurvedCard
                media={<PrototypeViewer />}
                copy={
                  <CurvedCopy
                    heading="The design"
                    body={[
                      'Once the research and journey mapping showed us where to focus, I moved into design. Each decision went back to a question we’d asked in the process.',
                      'First, the order and pacing. People were landing in different places depending on how they came in, then dropped on the homepage with a list of “optional” setup steps. I replaced that with a directive, sequential flow: a standard onboarding wizard that takes everyone through the same steps in the same order.',
                      'Next, what we asked for upfront. The profile asked for far more than our teams used, so I cut profile details back to what our sourcing tools actually read: a resume, skills, and languages. Everything else came out of the flow.',
                      'Verification was the strictest part of the flow, and it showed up with no warning. We asked for ID and proof of address without saying why. Now each of those steps starts with a short tip on why we need it and what to have ready, so people can gather everything before they begin.',
                      'Given the short timeline, I suggested a new workflow in which a vibe-coded prototype served as the design source of truth. We could iterate quickly, then hand engineers working frontend code to accelerate the build.',
                    ]}
                  />
                }
              />
            </Reveal>
          </div>

          <div id="outcomes" style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
            <Reveal>
              <CurvedCard
                media={
                  <Plate maxWidth={CHART_MAX}>
                    <ExperimentCard />
                  </Plate>
                }
                copy={
                  <CurvedCopy
                    heading="Measurable outcomes"
                    body={[
                      'We placed the new flow behind a feature flag and ran a 50/50 experiment against the existing onboarding experience, tracking results with Mixpanel and Microsoft Clarity.',
                      'After three weeks, the results supported our original hypotheses about the high-risk areas we targeted.',
                    ]}
                  />
                }
              />
            </Reveal>
            <Reveal>
              <Results />
            </Reveal>
          </div>

          <div id="next">
            <Reveal>
              <CurvedCard
                media={<Board src={media.next} alt="Updated onboarding source-of-flow map in FigJam" aspect={BOARD_ASPECT} />}
                copy={
                  <CurvedCopy
                    heading="What’s next?"
                    caption="The updated source-of-flow map, used to find the next risks to design for."
                    body="I wanted to carry the experiment’s momentum into the next onboarding improvements. I reviewed both variants and documented why one outperformed the other. The flow still contained legacy requirements we could not address in this release, so I returned to research to identify the next risks that needed design attention."
                  />
                }
              />
            </Reveal>
          </div>
        </div>
      </SheetPage>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Layout                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * The ground for a visual that shouldn't run the whole card: the palette's
 * gradient across it, with the visual centred on it at `maxWidth`.
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

/** A FigJam board: across its card, or with its own corner when it floats on a plate. */
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
 * The shipped flow on its plate: the profile step in front, address
 * verification behind it. On a phone the front window stands alone.
 *
 * Positions are shares of a 1160 × 660 stage, so the composition scales with
 * the stage; both windows run off its edges — the front one past the foot,
 * the back one past the right — and are clipped there, so no window ever shows
 * its lower corners floating short of the edge.
 */
function Showcase() {
  const isMobile = useIsMobile()

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
    </div>
  )
}

/** The three headline results, on the stage's tab. */
function ShowcaseResults() {
  const isMobile = useIsMobile()
  const callouts: { icon: Icon; figure: string; label: string }[] = [
    { icon: ChartLineUp, figure: '2×', label: 'overall funnel conversion' },
    { icon: Lightning, figure: '4×', label: 'at the highest-friction step' },
    { icon: DeviceMobile, figure: '+50%', label: 'profile completion on mobile' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: space.xl }}>
      {callouts.map((callout, index) => (
        <Callout key={callout.label} {...callout} delay={500 + index * 120} />
      ))}
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
  // A result on the tab: the product's magenta icon well, the figure on the
  // card's ink, the label soft.
  return (
    <div className="onb-enter" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', ...enter('pop', delay) }}>
      <span
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          borderRadius: radius.md,
          // The magenta at 18%, not the product's pale wash, which all but vanished on the cream card.
          background: `color-mix(in srgb, ${MERIDIAL.accent} 18%, transparent)`,
          display: 'grid',
          placeItems: 'center',
          color: MERIDIAL.accent,
        }}
      >
        <CalloutIcon size={20} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <span style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', color: TEXT }}>{figure}</span>
        <span style={{ fontSize: '14px', color: TEXT_SOFT }}>{label}</span>
      </span>
    </div>
  )
}
/* ------------------------------------------------------------------------ */
/* Section media                                                             */
/* ------------------------------------------------------------------------ */

/** The process in five steps, for the card beside the research board: the study's process, design and outcomes boiled down. */
const STEPS = [
  { title: 'Break down competitors', body: 'What they asked for, in what order, and how strict they were.' },
  { title: 'Map our own journey', body: 'Friction points, open questions and early ideas at every step.' },
  { title: 'Layer in the data', body: 'Mixpanel and Clarity for the conversion rate at each step, to measure where people dropped off.' },
  { title: 'Prototype and test', body: 'A coded prototype as the design source of truth, quick to iterate on and ready to hand to engineers.' },
  { title: 'A/B test', body: 'The new flow behind a feature flag, 50/50 against the old one for three weeks.' },
]

/** The three findings, for the card beside the journey map's tab. */
const FINDINGS = [
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

/** A heading over numbered items, each a short title and a line under it: a side card's content. */
function NumberedList({ heading, items }: { heading: string; items: { title: string; body: string }[] }) {
  return (
    <>
      <CurvedCopy heading={heading} />
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: space.xl }}>
        {items.map(({ title, body }, index) => (
          <li key={title} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
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
            <span style={{ fontSize: CURVED_BODY_SIZE, fontWeight: 500, lineHeight: LEADING, color: TEXT }}>{title}</span>
            <span style={{ ...SHEET_BODY, fontSize: '14px', color: TEXT_SOFT }}>{body}</span>
          </li>
        ))}
      </ol>
    </>
  )
}

/**
 * The two prototype screens, one at a time behind a two-way toggle, on a plate
 * across the card, the current one's caption under the toggle. The two windows share one grid cell and cross-fade, so
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
    <figure style={{ margin: 0 }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: PLATE,
          padding: isMobile ? '20px 12px 12px' : '32px 32px 40px',
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

        {/* On the pale plate at every theme, so it sets the product's ink. */}
        <figcaption style={{ fontSize: '14px', lineHeight: LEADING, color: MERIDIAL.body, textAlign: 'center' }}>
          {screens[current].caption}
        </figcaption>

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
    </figure>
  )
}

/** The three results, a row of cards under the outcomes (stacked on a phone). */
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
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(3, minmax(0, 1fr))',
        columnGap: space.xl,
        rowGap: isMobile ? space.md : 0,
      }}
    >
      {results.map(({ figure, title, body }) => (
        <CurvedPanel
          as="li"
          key={title}
          style={{
            padding: curvedInset(isMobile),
            display: 'grid',
            ...(isMobile ? {} : { gridRow: 'span 3', gridTemplateRows: 'subgrid' }),
            rowGap: space.md,
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
          <span style={{ ...SHEET_HEADING, fontSize: '18px', marginTop: space.sm }}>{title}</span>
          <span style={{ ...SHEET_BODY, fontSize: CURVED_BODY_SIZE, color: TEXT_SOFT }}>{body}</span>
        </CurvedPanel>
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
