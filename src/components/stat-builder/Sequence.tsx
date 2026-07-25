import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { BrandMark, CtaRow, Eyebrow, FeatureMedia, QuoteStrip, ShotFrame, SoftClose } from './parts'
import { BODY_TEXT, BORDER, MUTED, TEXT, useGutter } from './styles'

/**
 * Product walkthrough. Hero is brand + CTA only; then two screenshot steps
 * walk the flow — set targets, filter the vault — and a pull quote closes it.
 */
export default function Sequence({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const feature = landing.features[0]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '64px' : '104px',
        padding: `0 ${gutter}`,
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2xl)',
          maxWidth: '640px',
          paddingTop: isMobile ? '8px' : '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrandMark size={22} />
          <Eyebrow>{landing.eyebrow}</Eyebrow>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? '40px' : 'clamp(48px, 5.2vw, 68px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.034em',
          }}
        >
          Armor optimizer for the vault you already have.
        </h1>

        <p style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', lineHeight: 1.5, color: BODY_TEXT }}>
          {project.tagline}
        </p>

        <CtaRow />
      </section>

      <Step
        index="01"
        title="Set the build"
        body="Six Armor 3.0 stats, class, exotic, set bonuses, fragments, mods. Tell it what you want."
        flip={false}
      >
        <ShotFrame
          shot={landing.hero.shot}
          uncropped
          style={{ boxShadow: '0 28px 56px -18px rgba(0,0,0,0.5)' }}
        />
      </Step>

      {feature && (
        <Step
          index="02"
          title="Search what you own"
          body="The table is built for large screens — filter, pin, and custom-sort the pieces sitting in your vault."
          flip
        >
          <FeatureMedia feature={feature} />
        </Step>
      )}

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
          maxWidth: '720px',
          paddingTop: isMobile ? 0 : '8px',
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: MUTED, paddingTop: isMobile ? 0 : '40px' }}>
          03
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? '26px' : 'clamp(28px, 3vw, 36px)',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: TEXT,
          }}
        >
          Trust the math
        </h2>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: BODY_TEXT, maxWidth: '480px' }}>
          Every result is cross-checkable against tools this audience already trusts. The UI shows
          its work.
        </p>
        <QuoteStrip count={2} />
      </section>

      <SoftClose />
    </div>
  )
}

function Step({
  index,
  title,
  body,
  flip,
  children,
}: {
  index: string
  title: string
  body: string
  flip: boolean
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.9fr) minmax(0, 1.3fr)',
        gap: isMobile ? '24px' : '56px',
        alignItems: 'center',
        paddingTop: isMobile ? 0 : '8px',
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          order: isMobile ? 0 : flip ? 1 : 0,
          paddingTop: isMobile ? 0 : '32px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: MUTED }}>
          {index}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? '26px' : 'clamp(28px, 3vw, 36px)',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: BODY_TEXT, maxWidth: '360px' }}>
          {body}
        </p>
      </div>
      <div style={{ order: isMobile ? 1 : flip ? 0 : 1, minWidth: 0, paddingTop: isMobile ? 0 : '32px' }}>
        {children}
      </div>
    </section>
  )
}
