import { color, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const TEXT = color.text.primary
const MUTED = color.text.muted
const SECONDARY = color.text.secondary
const ORANGE = color.accent.default

/**
 * One block of the résumé. `rail` is the muted left-hand label, broken into the
 * lines it should wrap onto; `caption` is the underlined role line above the copy.
 */
type Entry = {
  rail: string[]
  caption?: string
  paragraphs: React.ReactNode[]
  /** Impact lines under the copy — setup in white, result in orange. */
  quickHits?: { setup: string; result: string }[]
}

const entries: Entry[] = [
  {
    rail: ['most', 'recently'],
    caption: 'Invisible Technologies | Senior Product Designer | Aug 2022 - July 2026',
    paragraphs: [
      'I started my time at Invisible as an Associate Product Designer and had the opportunity to work on many surfaces and products with very different users. I grew to owning the design for one of our core platforms, Meridial.',
      <>
        I led Product Design for Meridial, Invisible’s talent marketplace for AI training
        projects. I was responsible for end-to-end user flows, research, wireframes, high
        fidelity specs and collaborated closely with multiple Product Managers and
        Engineers. This product cut across many functions and it was necessary for me to
        partner with our Legal, Compliance, Hiring & Recruiting and Operations teams. I
        immerse myself in the user journey to validate assumptions and ideas with proven
        results.
      </>,
      'I provided design support for the 0-1 launch of Invisible’s Annotations platform, creating reusable custom components built for AI training tasks. I led design direction through high-fidelity mockups and custom interface designs tailored to specific client requirements.',
    ],
    quickHits: [
      {
        setup:
          'Users were stuck in our initial assessment stage for days, bottlenecking the businesses ability to scale. I designed our in app assessment flow to address this bottleneck',
        result: '72 hrs → Less than 24hrs to complete assessments',
      },
      {
        setup: 'Led the research and redesign of our onboarding funnel',
        result: 'Doubled the overall conversion rate',
      },
      {
        setup: 'Redesigned the mobile experience for onboarding',
        result: '50% increase in profile completion on mobile',
      },
    ],
  },
]

/**
 * The résumé below the hero on the Me tab — a muted rail label beside a column
 * of copy, per the July 2026 Figma file. Mobile drops the rail into a heading
 * above the copy, since there is no 140px gutter to spend.
 */
export default function Experience() {
  const isMobile = useIsMobile()

  return (
    <section
      id="about"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '48px' : '80px',
        padding: isMobile ? '32px 20px 0' : '80px',
      }}
    >
      {entries.map((entry) => (
        <div
          key={entry.rail.join('-')}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'flex-start',
            gap: isMobile ? '16px' : '32px',
          }}
        >
          <h2
            style={{
              margin: 0,
              flexShrink: 0,
              width: isMobile ? undefined : '140px',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-1.6px',
              color: MUTED,
            }}
          >
            {entry.rail.map((line) => (
              <span key={line} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </h2>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {entry.caption && (
              <span
                style={{
                  alignSelf: 'flex-start',
                  paddingBottom: '8px',
                  borderBottom: `1px solid ${color.border.default}`,
                  fontSize: type['body-s'].fontSize,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: TEXT,
                }}
              >
                {entry.caption}
              </span>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {entry.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: 0,
                    maxWidth: '720px',
                    fontSize: type['body-l'].fontSize,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: TEXT,
                  }}
                >
                  {paragraph}
                </p>
              ))}

              {entry.quickHits && entry.quickHits.length > 0 && (
                <>
                  <p
                    style={{
                      margin: 0,
                      fontSize: type['body-l'].fontSize,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      letterSpacing: '-0.16px',
                      color: SECONDARY,
                    }}
                  >
                    Quick hits
                  </p>
                  {entry.quickHits.map((hit) => (
                    <div
                      key={hit.result}
                      style={{
                        maxWidth: '495px',
                        fontSize: type['body-l'].fontSize,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        letterSpacing: '-0.16px',
                      }}
                    >
                      <p style={{ margin: 0, color: TEXT }}>{hit.setup}</p>
                      <p style={{ margin: 0, color: ORANGE }}>{hit.result}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
