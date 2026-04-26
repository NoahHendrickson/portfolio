import { ArrowNarrowRight } from '@untitledui/icons/ArrowNarrowRight'

const CREAM_BG = '#f5efe0'
const TEXT_DARK = '#0f0e0e'
const ORANGE = 'var(--color-orange)'

type Role = {
  name: string
  link?: string
  href?: string
  note?: string
  paragraphs: React.ReactNode[]
}

type Company = {
  name: string
  roles: Role[]
}

const companies: Company[] = [
  {
    name: 'Invisible',
    roles: [
      {
        name: 'Marketplace team',
        link: 'View some of my work',
        href: '#/work/marketplace',
        paragraphs: [
          'The problem this team was solving was the inefficient, manual and unscalable processes our delivery team used to deliver on Ai training projects for our clients. We needed to enable growth and scale in the fast pace and constant evolution environment of AI training.',
          <>
            I was responsible for clear and efficient designs for{' '}
            <strong style={{ fontWeight: 600 }}>sign up</strong> to{' '}
            <strong style={{ fontWeight: 600 }}>verified for work</strong>{' '}
            which resulted in a 60% reduction in time to get verified for work.
          </>,
          'I needed to coordinate and work with cross functional teams to ensure our delivery team, legal team, compliance team and marketing team were in sync.',
        ],
      },
      {
        name: 'Annotations team',
        link: 'View some of my work',
        href: '#/work/annotations',
        paragraphs: [
          'The annotations platform was our proprietary AI training surface. Intentionally built flexibly to support all kinds of different training forms and to adapt to the industry.',
          'I was brought into this project to help give some design direction. I put together high-fidelity designs for high level components, layouts and even specific interfaces for particualr AI training proejcts.',
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

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: CREAM_BG,
        padding: '120px 280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '80px',
        color: TEXT_DARK,
      }}
    >
      {companies.map((company) => (
        <div
          key={company.name}
          style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
        >
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

          {company.roles.map((role) => (
            <div
              key={role.name}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '40px' }}>
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
                {role.link && (
                  <a
                    href={role.href ?? '#'}
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
                    {role.link}
                    <ArrowNarrowRight width={20} height={20} />
                  </a>
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

              {role.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: 0,
                    maxWidth: '560px',
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
