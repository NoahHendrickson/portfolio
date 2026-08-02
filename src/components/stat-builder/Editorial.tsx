import { useIsMobile } from '../../hooks/useIsMobile'
import type { Project } from '../../data/projects'
import { formatEyebrow, getFeatures } from './content'
import {
  FeatureMedia,
  FeedbackWall,
  OutroCard,
  SectionCopy,
  ShotFrame,
} from './parts'
import { BODY_TEXT, MUTED, useGutter } from './styles'

/**
 * Type-led editorial layout of the original `landing` content — same copy,
 * shots, feedback wall, and orange outro as `ProjectStory`, rearranged.
 * No new copy.
 */
export default function Editorial({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const heroBody = landing.hero.body ?? [project.summary]
  const features = getFeatures(landing)
  const heroShot = landing.hero.shot
  const eyebrow = formatEyebrow(landing.eyebrow)

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
            {eyebrow}
          </p>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {heroBody.map((paragraph) => (
              <p
                key={paragraph}
                style={{
                  margin: 0,
                  maxWidth: '480px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: BODY_TEXT,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {heroShot && (
          <ShotFrame
            shot={heroShot}
            style={{
              boxShadow: '0 32px 64px -20px rgba(0,0,0,0.5)',
              animation: 'sb-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          />
        )}
      </section>

      {features.map((feature) => (
        <section
          key={feature.heading}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.9fr) minmax(0, 1.2fr)',
            gap: isMobile ? '24px' : '48px',
            alignItems: 'center',
          }}
        >
          <SectionCopy heading={feature.heading} body={feature.body} />
          <FeatureMedia feature={feature} />
        </section>
      ))}

      {landing.feedback && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          <SectionCopy heading={landing.feedback.heading} body={landing.feedback.body} />
          <FeedbackWall feedback={landing.feedback} />
        </section>
      )}

      <OutroCard outro={landing.outro} />
    </div>
  )
}
