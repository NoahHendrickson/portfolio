import { useState, type CSSProperties, type ReactNode } from 'react'
import Header from './Header'
import WorkGate from './WorkGate'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { copyPad, PROJECT_MOBILE_PAD, shellPad } from '../layout'
import { isUnlocked } from '../workGate'

/*
  The page runs no3y Code's stacked rhythm (`ProjectStory`'s `continuous` flow
  with `stack` rows): a centred 700px copy column with the media below it at the
  full width of the content column, rather than the copy-left / media-right
  1225 grid this page opened on. The measures below are that frame's — 1272 for
  the content column, 700 for the copy, 80 from a heading's copy to its media.
*/
/** The content column at the 1512 frame, which every media width is a share of. */
const CONTENT_WIDTH = 1272
/** The centred copy column — the title block and every row's heading + body. */
const COPY_WIDTH = 700
/**
 * The two charts are drawn at their own width rather than filling the column:
 * they are CSS boxes on a fixed 766 × 430, so stretching them to the column
 * would stand a 590px-tall orange block between two paragraphs.
 */
const CHART_WIDTH = 766
/** Copy to media inside one row. */
const STACK_GAP = 80
/**
 * The space above a row. A row opening its own heading stands clear of the one
 * before it; one continuing the heading above it (the three "process" beats)
 * sits closer, so the group still reads as one section.
 */
const LEAD = { title: 120, section: 200, tight: 120 } as const
const LEAD_MOBILE = { title: 64, section: 120, tight: 64 } as const

/** Outer clip on the mockups — `ProjectStory`'s `MOCKUP_RADIUS`. */
const MOCKUP_RADIUS = radius.xl

/**
 * The study's own accent. The August 2026 frame recoloured this page off the
 * site's orange onto a magenta — the hero's outcome rows and the plate behind
 * both charts — and the prototype band's export bakes the same family in. It is
 * this page's colour rather than a theme surface, so like the screenshots' own
 * chrome it stays a hex here instead of reaching for `--color-orange`.
 */
const STUDY_ACCENT = '#cb52b9'

/**
 * A media width. Holds the designed px until the column reaches the frame's
 * width, then takes the same share of it — the same curve `ProjectStory` runs,
 * so a fixed-px chart doesn't stay pinned while the screenshots grow.
 */
const mediaWidth = (px: number) => `min(100%, max(${px}px, ${(px / CONTENT_WIDTH) * 100}%))`

const media = {
  research: '/work/invisible/onboarding/research.png',
  journey: '/work/invisible/onboarding/journey.png',
  prototypeProfile: '/work/invisible/onboarding/prototype-profile.png',
  prototypeAddress: '/work/invisible/onboarding/prototype-address.png',
  next: '/work/invisible/onboarding/next.png',
} as const

const bodyStyle: CSSProperties = {
  margin: 0,
  fontSize: type['body-l'].fontSize,
  fontWeight: type['body-l'].fontWeight,
  lineHeight: type['body-l'].lineHeight,
  letterSpacing: 'normal',
  color: color.text.secondary,
}

export default function InvisibleOnboarding() {
  const isMobile = useIsMobile()
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const pad = isMobile ? PROJECT_MOBILE_PAD : shellPad()

  if (!unlocked) return <WorkGate onUnlock={() => setUnlocked(true)} />

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        color: color.text.primary,
      }}
    >
      <Header
        leading="back"
        showProfile={false}
        barInset={isMobile ? pad : copyPad(COPY_WIDTH)}
        trailingInset={pad}
      />

      <main
        style={{
          boxSizing: 'border-box',
          /*
            The gutter is symmetric now that the column is centred inside it —
            `shellPad()` is itself viewport-centred, so a full-width row still
            resolves the same left edge as every other page (see `layout.ts`).
          */
          padding: isMobile ? `24px ${pad} 64px` : `32px ${pad} 80px`,
        }}
      >
        {/*
          One track, no gap — the hero and every row carry their own lead, so a
          continuation row can sit closer than one opening a heading.
        */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Hero isMobile={isMobile} />

          <StoryRow
            lead="title"
            heading="The problem"
            width={CHART_WIDTH}
            body={
              <p style={{ ...bodyStyle, color: color.text.primary }}>
                Meridial’s onboarding conversion rate was severely underperforming. Its many
                high-friction steps caused significant drop-off. This strained operations as teams
                tried to staff projects on time and deliver results to clients.
              </p>
            }
          >
            <FunnelChart />
          </StoryRow>

          <StoryRow
            heading="The process"
            width={RESEARCH_WIDTH}
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  We needed to identify the highest-impact friction quickly and improve onboarding
                  conversion.
                </p>
                <p style={bodyStyle}>
                  One of our marketing designers and I began by researching competitors and
                  creating a FigJam board that became the initiative’s foundation.
                </p>
                <p style={bodyStyle}>
                  We collaborated closely with the marketing team because the marketing site was a
                  major entry point into the product.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.research}
              alt="Competitive research and onboarding references organized in FigJam"
              aspect={RESEARCH_ASPECT}
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  Next, we mapped the user journey and annotated high-risk areas, questions, and
                  ideas.
                </p>
                <p style={bodyStyle}>
                  We combined those risks with drop-off data to show where design attention would be
                  most valuable.
                </p>
                <p style={bodyStyle}>
                  We worked on two fronts: improving the overall flow and sequence, and removing
                  unnecessary friction by homing in on the steps with the most drop-off. Key findings
                  included:
                </p>
                {/*
                  Tailwind's preflight strips list markers, so the numbers are
                  set back on explicitly — the same fix Synapse's list needs.
                */}
                <ol
                  style={{
                    ...bodyStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: space.sm,
                    margin: 0,
                    paddingLeft: space.xl,
                    listStyleType: 'decimal',
                  }}
                >
                  <li>
                    We asked for way too much information on the profile. Our internal teams were
                    not using this information and it was not playing a major role in any of our
                    internal sourcing tools.
                  </li>
                  <li>
                    Our ID and Address verification steps were under-explained, and we were setting
                    a false expectation with some of the copy.
                  </li>
                  <li>
                    Our Initial Assessment step was the largest barrier and, like the profile
                    details, was barely useful to the business.
                  </li>
                </ol>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.journey}
              alt="Annotated onboarding journey, risks and user flow in FigJam"
            />
          </StoryRow>

          <StoryRow
            lead="tight"
            width={PROTOTYPE_WIDTH}
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
                  prototype served as the design source of truth. We could iterate quickly, then hand
                  engineers working frontend code to accelerate the build.
                </p>
              </Paragraphs>
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${PROTOTYPE_GAP}px`,
              }}
            >
              <MediaPanel
                src={media.prototypeProfile}
                alt="Meridial onboarding prototype: the profile details step, with resume upload, skills and languages"
                aspect={PROTOTYPE_ASPECT}
              />
              <MediaPanel
                src={media.prototypeAddress}
                alt="Meridial onboarding prototype: the address verification step, with the tips panel beside it"
                aspect={PROTOTYPE_ASPECT}
              />
            </div>
          </StoryRow>

          <StoryRow
            heading="Measureable outcomes"
            width={CHART_WIDTH}
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
                <ResultCopy>
                  4× increase in conversion at our highest-friction step.{' '}
                  <span style={{ color: color.text.muted, fontWeight: 400 }}>
                    During research, we saw the largest drop-off at the required initial assessment.
                    We completed it ourselves and met with teams to learn whether they used the
                    results meaningfully. They didn’t, so we removed the step entirely.
                  </span>
                </ResultCopy>
                <ResultCopy>
                  50% increase in profile completion for mobile users.{' '}
                  <span style={{ color: color.text.muted, fontWeight: 400 }}>
                    Roughly 35% of our users were using mobile to onboard, so I took a close look at
                    our mobile screens and redesigned them.
                  </span>
                </ResultCopy>
                <ResultCopy>
                  Doubled overall funnel conversion.{' '}
                  <span style={{ color: color.text.muted, fontWeight: 400 }}>
                    The new design increased the number of users completing the flow by 100%.
                  </span>
                </ResultCopy>
              </Paragraphs>
            }
          >
            <ExperimentChart />
          </StoryRow>

          <StoryRow
            heading="What’s next?"
            body={
              <p style={bodyStyle}>
                I wanted to carry the experiment’s momentum into the next onboarding improvements. I
                reviewed both variants and documented why one outperformed the other. The flow still
                contained legacy requirements we could not address in this release, so I returned to
                research to identify the next risks that needed design attention.
              </p>
            }
          >
            <MediaPanel src={media.next} alt="Updated onboarding source-of-flow map in FigJam" />
          </StoryRow>
        </div>
      </main>
    </div>
  )
}

function Hero({ isMobile }: { isMobile: boolean }) {
  const outcomes = [
    '50% increase in profile completion on mobile.',
    '4× increase by removing the step causing the most friction.',
    'Doubled the overall conversion rate.',
  ]

  return (
    <section
      style={{
        width: '100%',
        maxWidth: `${COPY_WIDTH}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
      }}
    >
      {/*
        The title wraps inside the 700 column now rather than running out past
        it on one line, which is what seats it over the stacked rows.
      */}
      <h1
        style={{
          margin: 0,
          fontSize: isMobile ? '34px' : 'clamp(40px, 4vw, 56px)',
          fontWeight: 600,
          lineHeight: 'normal',
          letterSpacing: '-0.029em',
        }}
      >
        Revitalizing Meridial’s onboarding flow
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          The team for this initiative was 1.5 Designers, 1 Product Manager and 5 Engineers. The
          business relied on Meridial to onboard users to scale our AI training business and meet the
          requirements set by our clients. I was the Design Lead for this team and worked closely
          with our Product Manager and many other teams such as Legal, Compliance, Hiring and
          Operations to ensure the Product didn’t have any blind spots.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
          <p style={{ ...bodyStyle, color: color.text.primary }}>
            TL;DR
            <br />
            I led the research and design to address Meridial’s fragmented onboarding flow.
          </p>

          {outcomes.map((outcome) => (
            <div
              key={outcome}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: space.sm,
                color: STUDY_ACCENT,
              }}
            >
              <img
                src="/work/invisible/onboarding/arrow-up-right.svg"
                alt=""
                style={{ display: 'block', width: '24px', height: '24px', flexShrink: 0 }}
              />
              <p
                style={{
                  margin: 0,
                  maxWidth: '495px',
                  ...type['label-l'],
                  color: STUDY_ACCENT,
                }}
              >
                {outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * One stacked row: heading + copy on the centred 700 column, media below it at
 * the full width of the content column unless `width` names its own. `lead` is
 * the space above the row — `section` for one opening a heading, `tight` for
 * one continuing the heading above it, `title` for the first row under the hero.
 */
function StoryRow({
  heading,
  body,
  children,
  width,
  lead = 'section',
}: {
  heading?: string
  body: ReactNode
  children: ReactNode
  width?: number
  lead?: keyof typeof LEAD
}) {
  const isMobile = useIsMobile()

  return (
    <section
      style={{
        width: '100%',
        marginTop: `${(isMobile ? LEAD_MOBILE : LEAD)[lead]}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? space['2xl'] : `${STACK_GAP}px`,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: `${COPY_WIDTH}px`,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
        }}
      >
        {heading && (
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: '-0.067em',
              color: color.text.primary,
            }}
          >
            {heading}
          </h2>
        )}
        {body}
      </div>
      <div style={{ width: width ? mediaWidth(width) : '100%' }}>{children}</div>
    </section>
  )
}

function Paragraphs({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>{children}</div>
}

function ResultCopy({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...bodyStyle, fontWeight: 500, color: color.text.primary }}>
      {children}
    </p>
  )
}

/**
 * The exports' own ratio, now that they run the width of the column. The
 * prototype band is drawn across the whole 1225 column rather than the 757.5
 * the FigJam boards sit on, so it names its own.
 */
const MEDIA_ASPECT = '1515 / 844'
/**
 * The two prototype windows (nodes `331:50353` / `331:50585`). The frame used
 * to sit them side by side on a magenta band; it now stacks them at 810 on the
 * page's own `#171615`, so they are exported as the bare windows and the page
 * shows through, rather than as one image carrying a ground we already have.
 */
const PROTOTYPE_ASPECT = '1620 / 1089'
const PROTOTYPE_WIDTH = 810
/** The frame's space between the stacked windows. */
const PROTOTYPE_GAP = 56
/**
 * The research board is the bare capture (node `332:51387`) rather than the
 * crop the frame's plate used to hold, so it carries its own portrait ratio.
 * Its width is the one thing the source dictates: the file is 1742px wide, so
 * half of that is the widest it renders at a clean 2× and the last width that
 * still reads sharp. The frame draws it on the 700 copy column, which is 2.5×
 * — this runs a step past that rather than out to the content column, where it
 * would drop under 1.4× and go soft again.
 */
const RESEARCH_ASPECT = '1742 / 1622'
const RESEARCH_WIDTH = 871

function MediaPanel({
  src,
  alt,
  aspect = MEDIA_ASPECT,
}: {
  src: string
  alt: string
  aspect?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: aspect,
        borderRadius: MOCKUP_RADIUS,
      }}
    />
  )
}

function FunnelChart() {
  const fills = [357, 232, 132, 28]

  return (
    <div
      role="img"
      aria-label="Onboarding conversion falling sharply across four steps"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '766 / 430',
        overflow: 'hidden',
        borderRadius: MOCKUP_RADIUS,
        background: STUDY_ACCENT,
      }}
    >
      {fills.map((height, index) => {
        const left = [104, 245, 396, 548][index]
        return (
          <div
            key={height}
            style={{
              position: 'absolute',
              left: `${(left / 766) * 100}%`,
              top: `${(48 / 430) * 100}%`,
              width: `${(80 / 766) * 100}%`,
              height: `${(357 / 430) * 100}%`,
              overflow: 'hidden',
              borderRadius: radius.md,
              background: index === 0 ? '#ffffff' : 'rgba(255,255,255,0.3)',
            }}
          >
            {index > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 'auto 0 0',
                  height: `${(height / 357) * 100}%`,
                  borderRadius: radius.md,
                  background: '#ffffff',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ExperimentChart() {
  return (
    <div
      role="img"
      aria-label="New onboarding conversion substantially outperforming the old flow"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '766 / 430',
        overflow: 'hidden',
        borderRadius: MOCKUP_RADIUS,
        background: STUDY_ACCENT,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${(265 / 766) * 100}%`,
          top: `${(245.333 / 430) * 100}%`,
          width: `${(80 / 766) * 100}%`,
          height: `${(132 / 430) * 100}%`,
          borderRadius: radius.md,
          background: '#222222',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${(395 / 766) * 100}%`,
          top: `${(89.333 / 430) * 100}%`,
          width: `${(80 / 766) * 100}%`,
          height: `${(288 / 430) * 100}%`,
          borderRadius: radius.md,
          background: '#ffffff',
        }}
      />
    </div>
  )
}
