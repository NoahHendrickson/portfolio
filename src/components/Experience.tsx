import { ArrowUpRight } from '@phosphor-icons/react'
import { color, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'

const TEXT = color.text.primary
const MUTED = color.text.muted
const ORANGE = color.accent.default

/**
 * One block of the résumé. `rail` is the muted left-hand label, broken into the
 * lines it should wrap onto; `caption` is the underlined role line above the copy.
 */
type Entry = {
  rail: string[]
  caption?: string
  link?: { label: string; href: string }
  paragraphs: React.ReactNode[]
}

const entries: Entry[] = [
  {
    rail: ['most', 'recently'],
    caption: 'Invisible Technologies | Senior Product Designer | Aug 2022 - July 2026',
    link: { label: 'View some of my work', href: '#/work/invisible' },
    paragraphs: [
      'I started my time at Invisible as an Associate Product Designer and had the opportunity to work on many surfaces and products with very different users. I grew to owning the design for one of our core platforms, Meridial.',
      'As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft.',
      'Our marketplace onboarding flow was disjointed, delayed, and confusing — experts dropped off, and the business couldn’t scale delivery. I was responsible for the redesign of our sign-up and onboarding, resulting in a 60% reduction in time to be “ready to work.”',
      'I also provided design support for the 0-1 launch of Invisible’s Annotations platform, creating reusable custom components built for AI training tasks. I led design direction through high-fidelity mockups and custom interface designs tailored to specific client requirements.',
    ],
  },
  {
    rail: ['about', 'me'],
    paragraphs: [
      'I have 4 years of experience taking complex journeys, problems, and systems and turning them into efficient products and features. I’m a Senior Product Designer who treats design as a technical craft — I care about the conceptual models underneath a product as much as the surface, which means I dive deep into new domains until I actually understand the system I’m building.',
      'I’m a collaborator first. I stay composed under pressure, keep the energy steady on tight deadlines, and believe the best work comes from ego-free crits and teams focused on building the right thing — not winning the argument.',
      'I’ve always been a builder. My first tool was Legos — obsessed with inventing my own creations, turning imagination into something real and tactile. That same impulse drives my work today.',
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
      'Lately I’ve been having a lot of fun bouncing between AI tools and seeing how far I can push things. I’ll sketch in Figma, poke around in pencil.dev or paper, then hop into Claude Code and build the thing. The line between designer and front-end dev is getting blurry, and I’m having a great time living in the blur.',
      'Figma isn’t going anywhere. It’s still where I think fast and get things pixel perfect. But a mock doesn’t have to sit there as a picture of the thing anymore. I can hand it to Claude, point it at the components I’ve already built, and watch it show up in the actual product. It also spits out way less slop when it’s working with your own pieces. Sometimes I still have to go in and delete the purple myself.',
      'Building in the real product also means I catch the weird stuff while I’m designing, like edge cases and awkward states, instead of hearing about it in QA. Devs get working code instead of a static handoff, so they’re not starting from zero.',
      'I don’t think this is designers replacing engineers. The genuinely hard problems still need engineers. But the small stuff like micro-interactions, polish, and little component details? I can just do that now.',
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

            {entry.link && (
              <a
                href={entry.link.href}
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  color: ORANGE,
                  fontSize: type['label-m'].fontSize,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {entry.link.label}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
