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
  BORDER,
  MUTED,
  useGutter,
} from './storyStyles'

// `SectionCopy` is left-aligned by default, which is what the feature rail wants.

/**
 * Media first. The app runs edge to edge at its full height before you read a
 * word, and the title block sits under it as a two-column masthead. Features put
 * their copy in a narrow rail and let the screenshot bleed off the right edge.
 */
export default function StoryGallery({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const gutter = useGutter()
  const landing = project.landing!
  const heroBody = landing.hero.body ?? [project.summary]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : '80px' }}>
      {/*
        Full bleed and uncropped — the whole screenshot, not the aspect crop the
        other layouts use, so the hero is the product rather than a slice of it.
      */}
      <ShotFrame
        shot={landing.hero.shot}
        uncropped
        style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : '80px', padding: `0 ${gutter}` }}>
        {/* Masthead — title left, the copy it introduces right. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 5fr) minmax(0, 6fr)',
            gap: isMobile ? '24px' : '64px',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, lineHeight: '24px', color: MUTED }}>
              {landing.eyebrow}
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? '38px' : 'clamp(44px, 4.6vw, 64px)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.032em',
              }}
            >
              {project.title}
            </h1>
            <LinkRow links={project.links} />
          </div>

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
        </div>

        <StatBand stats={project.stats} />

        {landing.features.map((feature) => (
          <section
            key={feature.heading}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '280px minmax(0, 1fr)',
              gap: isMobile ? '24px' : '64px',
              alignItems: 'center',
            }}
          >
            <SectionCopy heading={feature.heading} body={feature.body} />
            {/* Runs off the right edge of the page rather than stopping at the gutter. */}
            <div style={{ marginRight: isMobile ? undefined : `-${gutter}`, minWidth: 0 }}>
              <FeatureMedia feature={feature} />
            </div>
          </section>
        ))}

        {landing.feedback && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Heading in the rail, body in the wide column — the same rhythm the features run. */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '280px minmax(0, 1fr)',
                gap: isMobile ? '16px' : '64px',
                alignItems: 'start',
                paddingTop: isMobile ? '0' : '24px',
                borderTop: isMobile ? undefined : `1px solid ${BORDER}`,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? '24px' : 'clamp(26px, 2.6vw, 34px)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                {landing.feedback.heading}
              </h2>
              <p
                style={{
                  margin: 0,
                  maxWidth: '720px',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: 1.4,
                  color: BODY_TEXT,
                }}
              >
                {landing.feedback.body}
              </p>
            </div>
            <FeedbackWall feedback={landing.feedback} />
          </section>
        )}

        <OutroCard outro={landing.outro} />
      </div>
    </div>
  )
}
