import { ArrowNarrowRight } from '@untitledui/icons/ArrowNarrowRight'
import type { Tab } from './BottomNav'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'
const ORANGE = 'var(--color-orange)'

type Role = {
  name: string
  note?: string
  paragraphs: React.ReactNode[]
}

type Company = {
  name: string
  link?: string
  href?: string
  roles: Role[]
}

const companies: Company[] = [
  {
    name: 'Invisible',
    link: 'View some of my work',
    href: '#/work/invisible',
    roles: [
      {
        name: 'Meridial Marketplace',
        paragraphs: [
          'As the Lead Product Designer for Meridial, I held the bigger picture: shaping product vision, setting the bar for design quality, and building the ops that kept the team moving. That meant bringing in tools like Microsoft Clarity and Mixpanel to ground decisions in real user behavior, and folding AI into my workflow to move faster without losing craft.',
          'A few of the problems I worked on here: Our marketplace onboarding flow was disjointed, delayed, and confusing — experts dropped off, and the business couldn’t scale delivery. I was responsible for the redesign of our sign-up and onboarding, resulting in a 60% reduction in time to be “ready to work.”',
        ],
      },
      {
        name: 'Annotations team',
        paragraphs: [
          'The annotations platform was our proprietary AI training surface. Intentionally built flexibly to support all kinds of different training forms and to adapt to the industry.',
          'I was brought into this project to help give some design direction. I put together high-fidelity designs for high level components, layouts and even specific interfaces for particualr AI training proejcts.',
        ],
      },
    ],
  },
  {
    name: 'About me',
    roles: [
      {
        name: '',
        paragraphs: [
          'I have 4 years of experience taking complex journeys, problems, and systems and turning them into efficient products and features. I\'m a Senior Product Designer who treats design as a technical craft — I care about the conceptual models underneath a product as much as the surface, which means I dive deep into new domains until I actually understand the system I\'m building.',
          'I\'m a collaborator first. I stay composed under pressure, keep the energy steady on tight deadlines, and believe the best work comes from ego-free crits and teams focused on building the right thing — not winning the argument.',
          'I\'ve always been a builder. My first tool was Legos — obsessed with inventing my own creations, turning imagination into something real and tactile. That same impulse drives my work today.',
        ],
      },
    ],
  },
  {
    name: 'Amazon Logistics',
    roles: [
      {
        name: 'Area Manager, Delivery station',
        note: 'This was not a design role',
        paragraphs: [
          'While this wasn’t a design role, my time at amazon was incredibly formative to the person I am today, such that i cannot leave it out.',
        ],
      },
    ],
  },
]

export default function About({ activeTab }: { activeTab: Tab }) {
  const visibleCompanies =
    activeTab === 'about me'
      ? companies.filter((c) => c.name === 'About me')
      : companies.filter((c) => c.name !== 'About me')

  return (
    <section
      id="about"
      style={{
        background: CREAM_BG,
        padding: '120px 160px',
        display: 'flex',
        flexDirection: 'column',
        gap: '80px',
        color: TEXT_DARK,
      }}
    >
      {visibleCompanies.map((company) => (
        <div
          key={company.name}
          style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '40px', flexWrap: 'wrap' }}>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {company.name}
            </h2>
            {company.link && (
              <a
                href={company.href ?? '#'}
                style={{
                  color: ORANGE,
                  fontSize: '20px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {company.link}
                <ArrowNarrowRight width={20} height={20} />
              </a>
            )}
          </div>

          {company.roles.map((role) => (
            <div
              key={role.name}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {(role.name || role.note) && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '40px' }}>
                  {role.name && (
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {role.name}
                    </h3>
                  )}
                  {role.note && (
                    <span
                      style={{
                        color: ORANGE,
                        fontSize: '20px',
                        fontWeight: 500,
                      }}
                    >
                      {role.note}
                    </span>
                  )}
                </div>
              )}

              {role.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: 0,
                    maxWidth: '720px',
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: TEXT_DARK,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
