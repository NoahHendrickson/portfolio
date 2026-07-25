import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { BrandMark, CtaRow, Eyebrow, FeatureMedia, QuoteStrip, ShotFrame, SoftClose } from './parts'
import { BODY_TEXT, BORDER, MUTED, useGutter } from './styles'

/**
 * Media-first product page. The app fills the first viewport; brand and copy
 * sit under it as a tight masthead. Feature media bleeds off the right edge.
 */
export default function Stage({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const feature = landing.features[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : '72px' }}>
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
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 5fr) minmax(0, 6fr)',
            gap: isMobile ? '20px' : '56px',
            alignItems: 'end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrandMark size={22} />
              <Eyebrow>{landing.eyebrow}</Eyebrow>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? '38px' : 'clamp(44px, 4.8vw, 64px)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.032em',
              }}
            >
              {project.title}
            </h1>
            <CtaRow size="sm" />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.5,
              color: BODY_TEXT,
              maxWidth: '420px',
            }}
          >
            {project.tagline}
          </p>
        </header>

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
