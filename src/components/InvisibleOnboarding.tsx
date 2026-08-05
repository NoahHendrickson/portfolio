import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import Header from './Header'
import { VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import AppLink from '../AppLink'
import { navigate } from '../navigation'

const UNLOCK_KEY = 'work-pages-unlocked'
const CONTENT_WIDTH = 1225
const COPY_WIDTH = 387.5
const MEDIA_WIDTH = 757.5
const ROW_GAP = 80

const media = {
  research: '/work/invisible/onboarding/research.png',
  journey: '/work/invisible/onboarding/journey.png',
  prototype: '/work/invisible/onboarding/prototype.png',
  next: '/work/invisible/onboarding/next.png',
} as const

const bodyStyle: CSSProperties = {
  margin: 0,
  fontSize: type['body-l'].fontSize,
  fontWeight: type['body-l'].fontWeight,
  lineHeight: '21px',
  letterSpacing: 'normal',
  color: color.text.secondary,
}

export default function InvisibleOnboarding() {
  const isMobile = useIsMobile()
  const [unlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true')

  useEffect(() => {
    if (!unlocked) navigate('/work/invisible')
  }, [unlocked])

  if (!unlocked) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.bg.primary,
        color: color.text.primary,
      }}
    >
      <Header active="work" showProfile={false} />

      <main
        style={{
          boxSizing: 'border-box',
          padding: isMobile ? '40px 20px 64px' : '80px 0 80px 120px',
        }}
      >
        <div
          style={{
            width: isMobile ? '100%' : `min(${CONTENT_WIDTH}px, calc(100vw - 240px))`,
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? space['4xl'] : '120px',
          }}
        >
          <Hero isMobile={isMobile} />

          <StoryRow
            heading="the problem"
            wideMedia
            body={
              <p style={{ ...bodyStyle, color: color.text.primary }}>
                Meridial’s onboarding flow was sitting at a terrifying 2% conversion rate from
                account creation to setting up their bank details. There were multiple steps with
                tons of friction and huge drop-off. This was causing an operational strain on
                staffing projects on-time and delivering results to clients.
              </p>
            }
          >
            <FunnelChart />
          </StoryRow>

          <StoryRow
            heading="the process"
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  We needed to move quickly and intelligently to solve these points of friction and
                  increase our onboarding conversion ASAP.
                </p>
                <p style={bodyStyle}>
                  Myself and one of our Marketing Designers started by gathering information on our
                  competitors and creating a large Figjam that served as the foundation for this
                  initiative.
                </p>
                <p style={bodyStyle}>
                  I felt strongly that we needed to collaborate with the Marketing team because our
                  Marketing site was one of the larger entry points into the product.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.research}
              alt="Competitive research and onboarding references organized in FigJam"
            />
          </StoryRow>

          <StoryRow
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  Next we mapped our user journey and annotated high risk areas, questions and
                  idea’s.
                </p>
                <p style={bodyStyle}>
                  We focused heavily on high risk areas and crossed that with drop-off data to make
                  a strong case about where design focus would be most valuable.
                </p>
                <p style={bodyStyle}>
                  We worked across 2 vectors: overall flow and order of steps and removing
                  unnecessary friction &amp; honing in on certain steps that caused the most
                  dropoff.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.journey}
              alt="Annotated onboarding journey, risks and user flow in FigJam"
            />
          </StoryRow>

          <StoryRow
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  Once we felt our research and brainstorming were solid, and we had targeted the
                  correct areas to focus on, I moved into the design phase.
                </p>
                <p style={bodyStyle}>
                  Due to the short timeline, the team decided to try a new workflow where a vibe
                  coded prototype would serve as the source of truth for the designs. We needed to
                  iterate fast and wanted to handover the protoype to the engineers to use that
                  frontend code to accelerate the build.
                </p>
              </Paragraphs>
            }
          >
            <MediaPanel
              src={media.prototype}
              alt="Meridial onboarding prototype with resume, skills and language fields"
            />
          </StoryRow>

          <StoryRow
            heading="the experiment"
            wideMedia
            body={
              <Paragraphs>
                <p style={bodyStyle}>
                  We built this flow behind a feature flag with the intent to run an experiment.
                  Our new onboarding versus the old one. We set up a 50/50 split between the old
                  and new versions and tracked the data using Mixpanel and Microsoft Clarity.
                </p>
                <p style={bodyStyle}>
                  After 3 weeks of the experiment the numbers were in, and supported our original
                  hypothesis for the high risk areas we targeted.
                </p>
                <ResultCopy>
                  4x increased conversion for our highest friction step.{' '}
                  <span style={{ color: color.text.muted, fontWeight: 400 }}>
                    During the research phase we saw the largest drop off during the initial
                    assessment that users must complete. We took the assessment ourselves, met with
                    various teams to understand if they used those results in a meaningful way..
                    they didn’t. So we completely cut that step out. The largest impact didn’t
                    actually require designs.
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
                  Doubled overall funnel conversion{' '}
                  <span style={{ color: color.text.muted, fontWeight: 400 }}>
                    The new designs resulted in 100% increase in users getting all the way through
                    the flow.
                  </span>
                </ResultCopy>
              </Paragraphs>
            }
          >
            <ExperimentChart />
          </StoryRow>

          <StoryRow
            heading="what’s next?"
            body={
              <p style={bodyStyle}>
                I wanted to carry the momentum from the experiment and continue to improve our
                onboarding. I made sure to go through both experiments to document why I thought
                one performed better than the other. Our onboarding flow was still full of legacy
                requirements that we couldn’t get to in this new version. I was once again
                researching to find the next risk areas that needed designs attention.
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
    '4x increase by removing the step causing the most friction.',
    'Doubled overall conversion rate.',
  ]

  return (
    <section
      style={{
        width: isMobile ? '100%' : '720px',
        display: 'flex',
        flexDirection: 'column',
        gap: space.lg,
      }}
    >
      <AppLink
        href="/work/invisible"
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          height: control.sm,
          boxSizing: 'border-box',
          padding: `0 ${space.lg}`,
          borderRadius: radius.full,
          border: `1px solid ${VARIANTS.ghost.default.borderColor}`,
          background: VARIANTS.ghost.default.background,
          color: VARIANTS.ghost.default.color,
          fontSize: type['label-m'].fontSize,
          fontWeight: type['label-m'].fontWeight,
          lineHeight: type['label-m'].lineHeight,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back
      </AppLink>

      <h1
        style={{
          margin: 0,
          width: isMobile ? '100%' : '980px',
          fontSize: isMobile ? '36px' : '56px',
          fontWeight: 600,
          lineHeight: 'normal',
          letterSpacing: '-1.6px',
          whiteSpace: isMobile ? undefined : 'nowrap',
        }}
      >
        Revitalizing Meridial’s onboarding flow
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
        <p style={{ ...bodyStyle, color: color.text.primary }}>
          The team for this project was 1.5 Designers, 1 Product Manager and 5 Engineers. The
          business relied on Meridial to onboard users to scale our AI training business and meet the
          demand of our clients. I was the Design Lead for this team and worked closely
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
                color: color.accent.default,
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
                  color: color.accent.default,
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

function StoryRow({
  heading,
  body,
  children,
  wideMedia = false,
}: {
  heading?: string
  body: ReactNode
  children: ReactNode
  wideMedia?: boolean
}) {
  const isMobile = useIsMobile()
  const copyWidth = wideMedia ? 379 : COPY_WIDTH
  const mediaWidth = wideMedia ? 766 : MEDIA_WIDTH

  return (
    <section
      style={
        isMobile
          ? {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: space['2xl'],
            }
          : {
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `${copyWidth}fr ${mediaWidth}fr`,
              columnGap: `${(ROW_GAP / CONTENT_WIDTH) * 100}%`,
              alignItems: 'start',
            }
      }
    >
      <div
        style={{
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
              letterSpacing: '-1.6px',
              color: color.text.muted,
            }}
          >
            {heading}
          </h2>
        )}
        {body}
      </div>
      {children}
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

function MediaPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: `${MEDIA_WIDTH} / 421.6667`,
        borderRadius: '13.333px',
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
        borderRadius: radius.xl,
        background: color.accent.default,
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
        borderRadius: radius.xl,
        background: color.accent.default,
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
