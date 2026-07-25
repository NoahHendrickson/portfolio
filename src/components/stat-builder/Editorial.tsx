import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { BrandMark, CtaRow, Eyebrow, FeatureMedia, QuoteStrip, ShotFrame, SoftClose } from './parts'
import { BODY_TEXT, BORDER, MUTED, useGutter } from './styles'

/**
 * Type-led editorial. The brand and a single sentence carry the first viewport;
 * the product shot follows. Features become numbered beats — one job each.
 */
export default function Editorial({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const feature = landing.features[0]

  const beats = [
    {
      n: '01',
      title: 'Set six targets',
      body: 'Dial the Armor 3.0 stats you need. Feasibility feedback stays live as you move.',
    },
    {
      n: '02',
      title: 'Constrain the search',
      body: 'Exotic, set bonuses, fragments, mods — folded into the search, not bolted on after.',
    },
    {
      n: '03',
      title: 'Equip what you own',
      body: 'Results come from your vault. No wishlist of gear you can’t use.',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '56px' : '96px',
        padding: `0 ${gutter}`,
      }}
    >
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: isMobile ? '36px' : '64px',
          alignItems: 'center',
          minHeight: isMobile ? undefined : 'min(70vh, 640px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrandMark size={22} />
            <Eyebrow>{landing.eyebrow}</Eyebrow>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '42px' : 'clamp(48px, 5.5vw, 72px)',
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: '400px',
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: '-0.015em',
              color: BODY_TEXT,
            }}
          >
            {project.tagline}
          </p>

          <CtaRow />
        </div>

        <ShotFrame
          shot={landing.hero.shot}
          style={{
            boxShadow: '0 32px 64px -20px rgba(0,0,0,0.5)',
            animation: 'sb-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        />
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: isMobile ? '32px' : '40px',
          paddingTop: isMobile ? 0 : '8px',
          borderTop: isMobile ? undefined : `1px solid ${BORDER}`,
        }}
      >
        {beats.map((beat) => (
          <div
            key={beat.n}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              paddingTop: isMobile ? 0 : '32px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', color: MUTED }}>
              {beat.n}
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '20px' : '22px',
                fontWeight: 500,
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
              }}
            >
              {beat.title}
            </h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: BODY_TEXT }}>{beat.body}</p>
          </div>
        ))}
      </section>

      {feature && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'baseline',
              gap: '12px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '24px' : '30px',
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              {feature.heading}
            </h2>
            <p style={{ margin: 0, maxWidth: '360px', fontSize: '15px', lineHeight: 1.5, color: BODY_TEXT }}>
              Designed for large screens — the audience this tool is for.
            </p>
          </div>
          <FeatureMedia feature={feature} />
        </section>
      )}

      <QuoteStrip count={1} />
      <SoftClose />
    </div>
  )
}
