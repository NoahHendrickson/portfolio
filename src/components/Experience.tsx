import { color, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const TEXT = color.text.primary
const MUTED = color.text.muted

/**
 * One block of the résumé. `rail` is the muted left-hand label, broken into the
 * lines it should wrap onto; `caption` is the underlined role line above the copy.
 */
type Entry = {
  rail: string[]
  caption?: string
  paragraphs: React.ReactNode[]
}

const entries: Entry[] = [
  {
    rail: ['most', 'recently'],
    caption: 'Invisible Technologies | Senior Product Designer | Aug 2022 - July 2026',
    paragraphs: [
      'I started my time at Invisible as an Associate Product Designer and had the opportunity to work on many surfaces and products with very different users. I grew to owning the design for one of our core platforms, Meridial.',
      <>
        I led Product Design for Meridial, Invisible’s talent marketplace for AI training
        projects. I owned end-to-end user flows, research, wireframes, high fidelity specs
        and collaborated with Product managers and Engineers for A/B testing. I was
        responsible for a mobile redesign of our profile completion flow that increased
        conversion by <strong>50%</strong> for mobile users. I conducted a deep dive into
        our user journey to identify key fall off points that resulted in focused designs
        that improved conversion by 4x for one step, and doubled the conversion of the
        full funnel.
      </>,
      'Provided design support for the 0-1 launch of Invisible’s Annotations platform, creating reusable custom components built for AI training tasks. I led design direction through high-fidelity mockups and custom interface designs tailored to specific client requirements.',
    ],
  },
  {
    rail: ['before', 'that'],
    caption: 'Amazon Logistics | Area Manager, Delivery Station | Not a design role',
    paragraphs: [
      'While this wasn’t a design role, my time at Amazon was incredibly formative to the person I am today, such that I cannot leave it out.',
    ],
  },
  {
    rail: ['yapping'],
    paragraphs: [
      "didn't like the original yap , new yap in progress",
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
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
