import { useIsMobile } from '../hooks/useIsMobile'
import type { Project } from '../data/projects'
import {
  FeatureMedia,
  FeedbackWall,
  OutroCard,
  SectionCopy,
  ShotFrame,
  StatBand,
} from './storyParts'
import {
  BODY_TEXT,
  MUTED,
  splitStyle,
  useGutter,
} from './storyStyles'

/**
 * Asymmetric, editorial. The title block holds a narrow left column and the app
 * sits beside it at the width the Figma file gives it; features repeat that
 * split. This is the layout the page shipped with, plus the stat band.
 */
export default function StorySplit({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const heroBody = landing.hero.body ?? [project.summary]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '56px' : '80px',
        padding: `0 ${gutter}`,
      }}
    >
      <div
        style={
          isMobile
            ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }
            : splitStyle(landing.hero.split, landing.hero.alignEnd)
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
            {landing.eyebrow}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '34px' : 'clamp(40px, 4vw, 56px)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.029em',
            }}
          >
            {project.title}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {heroBody.map((paragraph) => (
              <p
                key={paragraph}
                style={{ margin: 0, fontSize: '16px', fontWeight: 400, lineHeight: 1.4, color: BODY_TEXT }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ShotFrame shot={landing.hero.shot} />
      </div>

      <StatBand stats={project.stats} />

      {landing.features.map((feature) => (
        <section
          key={feature.heading}
          style={
            isMobile
              ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }
              : splitStyle(feature.split)
          }
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
