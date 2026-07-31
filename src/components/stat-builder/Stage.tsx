import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { BrandMark, CtaRow, Eyebrow, FeatureMedia, QuoteStrip, ShotFrame, SoftClose } from './parts'
import { BODY_TEXT, BORDER, MUTED, useGutter } from './styles'

/**
 * Media-first product page. A one-line brand masthead sits above a full-bleed
 * product shot so the name still reads as the hero, then the rest of the page
 * stays sparse — stats, one feature bleeding off the edge, two quotes.
 */
export default function Stage({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const feature = landing.features[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : '72px' }}>
      <div style={{ padding: `0 ${gutter}`, display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto',
            gap: isMobile ? '16px' : '32px',
            alignItems: 'end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrandMark size={20} />
              <Eyebrow>{landing.eyebrow}</Eyebrow>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? '36px' : 'clamp(40px, 4.2vw, 56px)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.032em',
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: '420px',
                fontSize: '15px',
                lineHeight: 1.45,
                color: BODY_TEXT,
              }}
            >
              {project.tagline}
            </p>
          </div>
          <CtaRow size="sm" />
        </header>
      </div>

      <ShotFrame
        shot={landing.hero.shot}
        uncropped
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          animation: 'sb-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '48px' : '72px',
          padding: `0 ${gutter}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '16px 28px' : '16px 48px',
            padding: isMobile ? '20px 0' : '24px 0',
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {project.stats.map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: '13px', color: MUTED }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {feature && (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '240px minmax(0, 1fr)',
              gap: isMobile ? '20px' : '48px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? '24px' : '30px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                {feature.heading}
              </h2>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: BODY_TEXT }}>
                Filter the vault you actually own. Pin the sorts you reuse.
              </p>
            </div>
            <div style={{ marginRight: isMobile ? undefined : `-${gutter}`, minWidth: 0 }}>
              <FeatureMedia feature={feature} />
            </div>
          </section>
        )}

        <QuoteStrip count={2} />
        <SoftClose />
      </div>
    </div>
  )
}
