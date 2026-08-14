import { color, radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PAGE_GUTTER, shellPad } from '../layout'

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

type Entry = {
  role: string
  detail: string
  paragraphs: string[]
  bullets?: string[]
}

const nowParagraphs = [
  "I have been spending a lot of time in different AI coding and design tools, trying to suss out what works for me when it comes to building. This is the most fun I've had as a designer/builder in my whole life. As a kid, Legos were my go-to toy and pastime because I loved making my own things. 80% of the time I wasn't building from an instruction set — I was making my own creations. That's why I was drawn to Product Design later in life, and now building my own things and trying crazy ideas is suddenly possible.",
  'The rise of AI slop has made the job of a designer even more important. Despite all the amazing new tools out there, I still find myself in Figma when I am nailing down precise details of a design. I do a lot of back and forth from Figma to Claude or Cursor when building. I’ve been experimenting with design systems and Storybook, and using AI to automate tedious work.',
]

const entries: Entry[] = [
  {
    role: 'Senior Product Designer @',
    detail: 'Invisible Technologies / Aug 2022 - July 2026',
    paragraphs: [
      'I joined Invisible as an Associate Product Designer, working across a range of surfaces and products with very different users. I grew into owning design for Meridial, one of our core platforms.',
      "As Design Lead on Meridial, Invisible's talent marketplace for AI training projects, I owned end-to-end user flows, research, wireframes, and high-fidelity specs alongside multiple PMs and engineers. The product cut across the business, so I partnered closely with Legal, Compliance, Hiring & Recruiting, and Operations.",
      "I also supported the 0-1 launch of Invisible's Annotations platform, building reusable components for AI training tasks and leading design direction through high-fidelity mockups tailored to specific client requirements.",
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
        // Shared left edge with the rest of the page; the right gutter stays
        // fixed because this block sits inside the Me column (see `App`).
        padding: isMobile ? '32px 20px 60px' : `80px ${PAGE_GUTTER}px 80px ${shellPad()}`,
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
              gap: entry.bullets ? 0 : isMobile ? '16px' : '24px',
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
                {entry.bullets.map((item) => (
                  <li key={item} style={body}>
                    {item}
                  </li>
                ))}
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
