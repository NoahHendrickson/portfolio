import { color, radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { pageGutter, shellPad } from '../layout'

const TEXT = color.text.primary
const MUTED = color.text.muted
const ORANGE = color.accent.default
const BORDER = color.border.default
const TINT = color.bg.tint

type Clipping = {
  src: string
  alt: string
  width: number
  aspect: string
  crop: { width: string; left: string; height: string; top: string }
}

const clippings: Clipping[] = [
  {
    src: '/work/llm-wall-claude.jpeg',
    alt: 'Claude replying “Hell yes — that’s the fix.”',
    width: 153,
    aspect: '153 / 46',
    crop: { width: '110.46%', left: '-10.46%', height: '130.43%', top: '-30.43%' },
  },
  {
    src: '/work/llm-wall-protected-by-luck.png',
    alt: 'An LLM declaring “You were protected by luck:”',
    width: 240,
    aspect: '636 / 92',
    crop: { width: '100%', left: '0%', height: '100%', top: '0%' },
  },
  {
    src: '/work/llm-wall-close-to-fatal.png',
    alt: 'An LLM saying “The review was right about the thing that mattered, and it was close to fatal.”',
    width: 360,
    aspect: '914 / 118',
    crop: { width: '100%', left: '0%', height: '100%', top: '0%' },
  },
]

function QuoteCard({ clipping }: { clipping: Clipping }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '4px',
        borderRadius: radius.md,
        background: TINT,
        width: clipping.width + 8,
        maxWidth: '100%',
        flex: `1 1 ${clipping.width + 8}px`,
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: space.sm,
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: `1px solid ${BORDER}`,
          background: '#181818',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: clipping.aspect,
            overflow: 'hidden',
          }}
        >
          <img
            src={clipping.src}
            alt={clipping.alt}
            style={{
              position: 'absolute',
              width: clipping.crop.width,
              left: clipping.crop.left,
              height: clipping.crop.height,
              top: clipping.crop.top,
              maxWidth: 'none',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * A résumé bullet. Amazon's are plain lines; the Invisible role's each land on
 * a measured outcome, which takes the orange the case studies mark their
 * results in rather than reading as another peer bullet under the same dot.
 */
type Bullet = string | { text: string; result: string }

type Entry = {
  role: string
  detail: string
  paragraphs: string[]
  bullets?: Bullet[]
}

const nowParagraphs = [
  "I have been spending a lot of time in different AI coding and design tools, trying to suss out what works for me when it comes to building. This is the most fun I've had as a designer/builder in my whole life. As a kid, Legos were my go-to toy and pastime because I loved making my own things. 80% of the time I wasn't building from an instruction set — I was making my own creations. That's why I was drawn to Product Design later in life, and now building my own things and trying crazy ideas is suddenly possible.",
  'The rise of AI slop has made the job of a designer even more important. Despite all the amazing new tools out there, I still find myself in Figma to nail down precise details of a design. I do a lot of back and forth from Figma to Claude or Cursor when building. I’ve been experimenting with design systems and Storybook, and using AI to automate tedious work.',
]

const entries: Entry[] = [
  {
    role: 'Senior Product Designer @',
    detail: 'Invisible Technologies / Aug 2022 - July 2026',
    paragraphs: [
      'I joined Invisible as an Associate Product Designer, working across a range of surfaces and products with very different users. I grew into owning design for one of our core platforms, contributing to our design ops, driving adoption of new AI tools and workflows and serving as the connective tissue for 5+ teams.',
      "As Design Lead on Meridial, Invisible's talent marketplace for AI training projects, I owned end-to-end user flows, research, wireframes, and high-fidelity specs alongside multiple PMs and engineers. The product cut across the business, so I partnered closely with Legal, Compliance, Hiring & Recruiting, and Operations.",
      'I got to lead the design effort for launching our new AI training interfaces. The team had already built the foundation in a scrappy sprint and pulled me in to own the UX and visual design. I provided a set of re-usable standard components and high fidelity mockups for a few AI training use cases.',
    ],
    bullets: [
      {
        text: 'Users were stuck in our initial assessment stage for days, bottlenecking the businesses ability to scale. I designed our in app assessment flow to address this bottleneck',
        result: '72 hrs → Less than 24hrs to complete assessments',
      },
      {
        text: 'Led the research and redesign of our onboarding funnel',
        result: 'Doubled the overall conversion rate',
      },
      {
        text: 'Redesigned the mobile experience for onboarding',
        result: '50% increase in profile completion on mobile',
      },
    ],
  },
  {
    role: 'Area Manager L5 @',
    detail: 'Amazon Logistics / 2019 - 2021',
    paragraphs: [
      "I started at Amazon just to get a job after college. I didn't really have any expectations, but my work ethic said otherwise and I left as an L5 Area Manager. What got me there was learning to make calls off data instead of vibes, and finding out I could pick up something completely foreign and get good at it fast. That's the confidence I still run on. I had mentors who invested in me, and I learned to pass that down as well, helping four members of my team earn promotions.",
    ],
    bullets: [
      'Led nightly shifts of 30 to 150 associates unloading, sorting, and staging 20,000 to 100,000 packages for driver dispatch.',
      'Coached and promoted 4 associates and shift assistants into higher-level roles.',
      'Responsible for hard deadlines where every miss is a customer who does not get their package.',
      "Increased my Sort shift's productivity by 29% (42 to 55 Units per Hour) in summer 2020.",
      'Maintained 62 UPH against a goal of 58, approximately 7% above target, for the first 18 weeks of 2021.',
    ],
  },
]

function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      style={{
        margin: 0,
        width: '100%',
        maxWidth: '700px',
        paddingBottom: '8px',
        borderBottom: `1px solid ${ORANGE}`,
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.2px',
        color: TEXT,
      }}
    >
      {title}
    </h2>
  )
}

/**
 * Below the fold on the Me tab — how I'm designing now, previous roles, and
 * the LLM quotes. Drawn from the July 2026 file (node `265:33458`).
 */
export default function Experience() {
  const isMobile = useIsMobile()

  const heading: React.CSSProperties = {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.2px',
  }

  const body: React.CSSProperties = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: '-0.2px',
    color: TEXT,
  }

  return (
    <section
      id="about"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '48px' : '56px',
        // Shared left edge with the rest of the page; the right side stays on
        // the plain gutter because this block sits inside the Me column (see
        // `App`), which is narrower than the viewport the inset centres on.
        padding: isMobile ? '32px 20px 60px' : `80px ${pageGutter()} 80px ${shellPad()}`,
      }}
    >
      <SectionHeading title="How I’m designing now" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '700px',
        }}
      >
        <p style={{ ...heading, color: MUTED }}>Vibe coding, design engineering, agent orchestrating?</p>
        {nowParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} style={body}>
            {paragraph}
          </p>
        ))}
      </div>

      <SectionHeading title="Previous roles" />

      {entries.map((entry) => (
        <div
          key={entry.role}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '16px' : '24px',
            maxWidth: '700px',
            width: '100%',
            paddingBottom: '24px',
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ ...heading, color: TEXT }}>{entry.role}</h3>
            <p style={{ ...heading, color: MUTED }}>{entry.detail}</p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // One rhythm for everything in the entry — paragraph to
              // paragraph, and the last paragraph to the bullet list that
              // closes it.
              gap: isMobile ? '16px' : '24px',
            }}
          >
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph} style={body}>
                {paragraph}
              </p>
            ))}
            {entry.bullets && (
              <ul
                style={{
                  margin: 0,
                  paddingInlineStart: '24px',
                  listStyleType: 'disc',
                }}
              >
                {entry.bullets.map((item, i) => {
                  const text = typeof item === 'string' ? item : item.text
                  return (
                    <li
                      key={text}
                      style={{
                        ...body,
                        // A plain list runs its lines together, which is right
                        // for Amazon's. Bullets that carry an outcome need air
                        // between them so each result groups with its own
                        // bullet — as a margin rather than the list turning
                        // into a flex column, which would blockify the items
                        // and drop their markers.
                        ...(i > 0 && typeof item !== 'string' ? { marginTop: space.md } : null),
                      }}
                    >
                      {text}
                      {typeof item !== 'string' && (
                        <span
                          style={{
                            display: 'block',
                            marginTop: space.xs,
                            color: ORANGE,
                            fontWeight: 500,
                          }}
                        >
                          {item.result}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space.xl,
          width: '100%',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: '-0.2px',
            color: MUTED,
          }}
        >
          Enjoy my favorite LLM quotes
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: space.lg,
            width: '100%',
            minWidth: 0,
            alignItems: 'flex-start',
          }}
        >
          {clippings.map((clipping) => (
            <QuoteCard key={clipping.src} clipping={clipping} />
          ))}
        </div>
      </div>
    </section>
  )
}
