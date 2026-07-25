import { useIsMobile } from '../hooks/useIsMobile'
import type { Project } from '../data/projects'
import {
  FeatureMedia,
  FeedbackWall,
  LinkRow,
  OutroCard,
  SectionCopy,
  ShotFrame,
  StatBand,
} from './storyParts'
import {
  BODY_TEXT,
  MUTED,
  useGutter,
} from './storyStyles'

/**
 * The launch-page shape: everything stacked and centred on one axis, the app
 * presented head-on under the title with a wash of the project's accent behind
 * it, then stats, then each feature as centred copy over a full-width shot.
 */
export default function StoryCentered({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const heroBody = landing.hero.body ?? [project.summary]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '56px' : '96px',
        padding: `0 ${gutter}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '32px' : '48px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
            alignItems: isMobile ? 'flex-start' : 'center',
            textAlign: isMobile ? 'left' : 'center',
            maxWidth: '760px',
            margin: isMobile ? undefined : '0 auto',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
            {landing.eyebrow}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '38px' : 'clamp(48px, 5.2vw, 72px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.032em',
              textWrap: 'balance',
            }}
          >
            {project.title}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {heroBody.map((paragraph) => (
              <p
                key={paragraph}
                style={{
                  margin: 0,
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

          <LinkRow links={project.links} align="center" />
        </div>

        {/*
          The accent wash sits behind the shot and is clipped by nothing — it is a
          radial gradient on a padded wrapper, so it reads as light coming off the
          screenshot rather than a box around it.
        */}
        <div
          style={{
            position: 'relative',
            padding: isMobile ? '0' : '40px 0 0',
          }}
        >
          {!isMobile && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '0 -10% auto',
                height: '70%',
                // Alpha is generous because two of the accents are dark (the
                // Destiny green especially) and a lighter wash vanishes on #171615.
                background: `radial-gradient(60% 100% at 50% 0%, ${project.accent}66, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
          )}
          <ShotFrame shot={landing.hero.shot} style={{ position: 'relative' }} />
        </div>
      </div>

      <StatBand stats={project.stats} align="center" />

      {landing.features.map((feature) => (
        <section
          key={feature.heading}
          style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}
        >
          <SectionCopy heading={feature.heading} body={feature.body} align="center" />
          <FeatureMedia feature={feature} />
        </section>
      ))}

      {landing.feedback && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
          <SectionCopy heading={landing.feedback.heading} body={landing.feedback.body} align="center" />
          <FeedbackWall feedback={landing.feedback} />
        </section>
      )}

      <OutroCard outro={landing.outro} />
    </div>
  )
}
