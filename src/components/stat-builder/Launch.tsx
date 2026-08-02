import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { formatEyebrow, getFeatures } from './content'
import { BrandMark, CtaRow, Eyebrow, FeatureMedia, QuoteStrip, ShotFrame, SoftClose } from './parts'
import { BODY_TEXT, MUTED, useGutter } from './styles'

/**
 * Classic product launch. Brand first, one line, CTAs, then the app head-on
 * with a soft accent wash — Linear / Raycast shape. One feature, one quote.
 */
export default function Launch({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const feature = getFeatures(landing)[0]
  const heroShot = landing.hero.shot
  const eyebrow = formatEyebrow(landing.eyebrow)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '56px' : '88px',
        padding: `0 ${gutter}`,
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '32px' : '48px',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
            alignItems: isMobile ? 'flex-start' : 'center',
            textAlign: isMobile ? 'left' : 'center',
            maxWidth: '720px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BrandMark size={isMobile ? 24 : 28} />
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '40px' : 'clamp(52px, 6vw, 80px)',
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              textWrap: 'balance',
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: '540px',
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.5,
              color: BODY_TEXT,
              textWrap: 'balance',
            }}
          >
            {project.tagline}
          </p>

          <CtaRow align="center" />
        </div>

        <div style={{ position: 'relative', width: '100%', paddingTop: isMobile ? 0 : 24 }}>
          {!isMobile && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '0 -8% auto',
                height: '65%',
                background: `radial-gradient(55% 100% at 50% 0%, ${project.accent}59, transparent 72%)`,
                pointerEvents: 'none',
              }}
            />
          )}
          {heroShot && (
            <ShotFrame
              shot={heroShot}
              uncropped
              style={{ position: 'relative', boxShadow: '0 40px 80px -24px rgba(0,0,0,0.55)' }}
            />
          )}
        </div>
      </section>

      {feature && (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '24px' : '36px',
            alignItems: isMobile ? 'flex-start' : 'center',
            textAlign: isMobile ? 'left' : 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '560px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '24px' : 'clamp(28px, 3vw, 36px)',
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              {feature.heading}
            </h2>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: BODY_TEXT }}>
              Search and filter the armor you own across the parameters that matter — class,
              archetype, tertiary, set bonus — with custom sorts you can pin.
            </p>
          </div>
          <div style={{ width: '100%', maxWidth: '960px' }}>
            <FeatureMedia feature={feature} />
          </div>
        </section>
      )}

      <QuoteStrip count={1} align="center" />

      <SoftClose />

      <p style={{ margin: 0, fontSize: '13px', color: MUTED, textAlign: isMobile ? 'left' : 'center' }}>
        Built for Armor 3.0 · Next.js · Bungie API
      </p>
    </div>
  )
}
