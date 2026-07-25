import { ArrowNarrowLeft } from '@untitledui/icons/ArrowNarrowLeft'
import { ArrowNarrowRight } from '@untitledui/icons/ArrowNarrowRight'
import Header from './Header'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Project, Section, Shot } from '../data/projects'

const CREAM_BG = 'var(--color-bg-cream)'
const TEXT_DARK = 'var(--color-ink)'
const ORANGE = 'var(--color-orange)'
const LIGHT_CARD_BG = '#e5e5e5'
const BUTTON_LIGHT = 'var(--color-bg-inverse)'
const MUTED = 'var(--color-ink-muted)'
const HAIRLINE = 'var(--color-border-ink)'

const STATUS_COPY: Record<'shipped' | 'building' | 'next', string> = {
  shipped: 'shipped',
  building: 'in progress',
  next: 'next',
}

export default function ProjectLanding({ project }: { project: Project }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM_BG,
        color: TEXT_DARK,
        padding: isMobile ? '0 20px 60px' : '0 80px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '24px' : '40px',
      }}
    >
      <Header active="work" barInset="0" contentInset="0" />

      <a
        href="#/work"
        style={{
          color: ORANGE,
          fontSize: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          width: 'fit-content',
        }}
      >
        <ArrowNarrowLeft width={16} height={16} />
        Back
      </a>

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {project.eyebrow.map((item, idx) => (
            <span
              key={item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 500,
                color: MUTED,
              }}
            >
              {idx > 0 && (
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: project.accent,
                    display: 'inline-block',
                  }}
                />
              )}
              {item}
            </span>
          ))}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(28px, 8vw, 80px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {project.title}
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: '900px',
            fontSize: isMobile ? '20px' : 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 500,
            lineHeight: 1.25,
            textWrap: 'balance',
          }}
        >
          {project.tagline}
        </p>

        <p
          style={{
            margin: 0,
            maxWidth: '720px',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--color-ink-secondary)',
          }}
        >
          {project.summary}
        </p>

        <div style={{ display: 'flex', gap: isMobile ? '16px' : '24px', flexWrap: 'wrap' }}>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: ORANGE,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}
            >
              {link.label}
              <ArrowNarrowRight width={18} height={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Hero shot */}
      <ShotCard shot={project.heroShot} accent={project.accent} hero />

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '20px' : '0',
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
          padding: isMobile ? '24px 0' : '32px 0',
        }}
      >
        {project.stats.map((stat, idx) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              paddingLeft: !isMobile && idx > 0 ? '40px' : 0,
              borderLeft: !isMobile && idx > 0 ? `1px solid ${HAIRLINE}` : 'none',
            }}
          >
            <span
              style={{
                fontSize: isMobile ? '32px' : 'clamp(32px, 4vw, 48px)',
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: project.accent,
              }}
            >
              {stat.value}
            </span>
            <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: 500, color: MUTED }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '56px' : '96px',
          marginTop: isMobile ? '8px' : '24px',
        }}
      >
        {project.sections.map((section) => (
          <SectionBlock key={section.label} section={section} accent={project.accent} />
        ))}
      </div>

      {/* Stack + status */}
      <div
        style={
          isMobile
            ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)', marginTop: '16px' }
            : {
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 'var(--space-5xl)',
                marginTop: '32px',
              }
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <RailLabel>built with</RailLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {project.stack.map((item) => (
              <span
                key={item}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${HAIRLINE}`,
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: 500,
                  color: 'var(--color-ink-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <RailLabel>where it&rsquo;s at</RailLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {project.status.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 'var(--space-xl)',
                  padding: '14px 0',
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                <span
                  style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: item.state === 'next' ? MUTED : TEXT_DARK,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    color: item.state === 'shipped' ? project.accent : MUTED,
                  }}
                >
                  {STATUS_COPY[item.state]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div
        style={{
          marginTop: isMobile ? '32px' : '56px',
          background: project.accent,
          borderRadius: isMobile ? 'var(--radius-3xl)' : 'var(--radius-4xl)',
          padding: isMobile ? '32px 24px' : '56px 60px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '24px' : '40px',
          boxShadow:
            '0px 32px 64px -12px rgba(0,0,0,0.14), 0px 5px 5px -2.5px rgba(0,0,0,0.04)',
        }}
      >
        <h2
          style={{
            margin: 0,
            maxWidth: '640px',
            fontSize: 'clamp(24px, 3vw, 40px)',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            color: '#ffffff',
            textWrap: 'balance',
          }}
        >
          {project.cta.heading}
        </h2>
        <a
          href={project.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            background: BUTTON_LIGHT,
            color: TEXT_DARK,
            padding: isMobile ? '10px 18px' : '12px 24px',
            borderRadius: 'var(--radius-full)',
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {project.cta.label}
        </a>
      </div>

      <a
        href="#/work"
        style={{
          color: ORANGE,
          fontSize: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          width: 'fit-content',
        }}
      >
        <ArrowNarrowLeft width={16} height={16} />
        Back to all the work
      </a>
    </div>
  )
}

function RailLabel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <span
      style={{
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: 500,
        lineHeight: 1.2,
        color: MUTED,
      }}
    >
      {children}
    </span>
  )
}

function SectionBlock({ section, accent }: { section: Section; accent: string }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={
        isMobile
          ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }
          : {
              display: 'grid',
              gridTemplateColumns: '160px minmax(0, 1fr)',
              gap: 'var(--space-4xl)',
              alignItems: 'start',
            }
      }
    >
      <RailLabel>{section.label}</RailLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '24px' }}>
        {section.heading && (
          <h2
            style={{
              margin: 0,
              maxWidth: '800px',
              fontSize: isMobile ? '22px' : 'clamp(24px, 2.6vw, 34px)',
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              textWrap: 'balance',
            }}
          >
            {section.heading}
          </h2>
        )}

        {section.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            style={{
              margin: 0,
              maxWidth: '720px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {paragraph}
          </p>
        ))}

        {section.bullets && (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              maxWidth: '720px',
            }}
          >
            {section.bullets.map((bullet) => (
              <li
                key={bullet}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-md)',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: '6px',
                    height: '6px',
                    marginTop: '10px',
                    background: accent,
                    transform: 'rotate(45deg)',
                  }}
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {section.shots && (
          <div
            style={{
              marginTop: isMobile ? '8px' : '16px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
              gap: isMobile ? '24px' : '32px',
            }}
          >
            {section.shots.map((shot) => (
              <ShotCard key={shot.label} shot={shot} accent={accent} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ShotCard({
  shot,
  accent,
  hero = false,
}: {
  shot: Shot
  accent: string
  hero?: boolean
}) {
  const isMobile = useIsMobile()
  const radius = hero ? (isMobile ? '32px' : '56px') : isMobile ? '24px' : '32px'
  const surface = hero ? accent : LIGHT_CARD_BG

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div
        style={{
          background: surface,
          borderRadius: radius,
          aspectRatio: shot.tall ? '3 / 4' : hero ? '16 / 9' : '793 / 456',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: hero && shot.src ? (isMobile ? '16px' : '40px') : 0,
          boxShadow: hero
            ? '0px 32px 64px -12px rgba(0,0,0,0.14), 0px 5px 5px -2.5px rgba(0,0,0,0.04)'
            : 'none',
        }}
      >
        {shot.src ? (
          <img
            src={shot.src}
            alt={shot.alt ?? shot.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: hero ? 'contain' : 'cover',
              borderRadius: hero ? (isMobile ? 'var(--radius-lg)' : 'var(--radius-xl)') : 0,
              display: 'block',
              filter: hero
                ? 'drop-shadow(0 22px 27px rgba(0,0,0,0.14)) drop-shadow(0 9px 9px rgba(0,0,0,0.05))'
                : 'none',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: '24px',
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: hero ? 'var(--color-text-secondary)' : MUTED,
              }}
            >
              screenshot
            </span>
            <span
              style={{
                fontSize: hero ? (isMobile ? '18px' : '24px') : isMobile ? '15px' : '17px',
                fontWeight: 500,
                lineHeight: 1.35,
                color: hero ? '#ffffff' : 'var(--color-ink-muted)',
                textWrap: 'balance',
              }}
            >
              {shot.label}
            </span>
          </div>
        )}
      </div>

      {shot.caption && (
        <figcaption
          style={{
            fontSize: isMobile ? '14px' : '15px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: MUTED,
          }}
        >
          {shot.caption}
        </figcaption>
      )}
    </figure>
  )
}
