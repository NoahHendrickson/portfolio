import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import Header from './Header'
import ProjectIntro, { OutLink, SectionHeading } from './ProjectIntro'
import IconButton from '../design-system/IconButton'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import ScrubbableClip from './ScrubbableClip'
import { PROJECT_MOBILE_PAD, projectPad, projectWide } from '../layout'
import type { GalleryImage, LandingVideo, Project, ProjectShowcaseContent } from '../data/projects'

const SHADOW = '0 24px 64px rgba(15, 14, 14, 0.28), 0 4px 12px rgba(15, 14, 14, 0.18)'

/** A short overview and a tightly spaced gallery of real product captures. */
export default function ProjectShowcase({ project, content }: { project: Project; content: ProjectShowcaseContent }) {
  const isMobile = useIsMobile()
  const gutter = isMobile ? PROJECT_MOBILE_PAD : projectPad()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<GalleryImage>(content.hero)
  const cta = project.landing?.hero.cta

  function enlarge(shot: GalleryImage) {
    setSelected(shot)
    dialog.current?.showModal()
  }

  function imageButton(shot: GalleryImage, hero = false) {
    return (
      <button
        type="button"
        className="showcase-image"
        aria-label={`Enlarge: ${shot.alt}`}
        onClick={() => enlarge(shot)}
        style={{
          display: 'block',
          padding: 0,
          border: 0,
          borderRadius: radius.xl,
          background: color.bg.raised,
          width: '100%',
          cursor: 'zoom-in',
          boxShadow: SHADOW,
          overflow: 'hidden',
        }}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading={hero ? 'eager' : 'lazy'}
          fetchPriority={hero ? 'high' : 'auto'}
          decoding="async"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </button>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: color.bg.primary, color: color.text.primary }}>
      <Header leading="back" showProfile={false} barInset={gutter} />
      <div style={{ padding: `0 ${gutter} ${space['5xl']}` }}>
        <div style={{ marginBottom: isMobile ? space['3xl'] : space['5xl'] }}>
          <ProjectIntro
            title={project.title}
            helper={content.meta.split(' · ')}
            description={project.tagline}
            actions={cta && <OutLink href={cta.href} label={cta.label} variant="primary" />}
          />
        </div>

        {/* The cards run wider than the intro, out to the hero's 1320, as every project page's media does. */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', gap: space.lg, ...(isMobile ? null : projectWide()) }}>
          <section aria-labelledby="showcase-overview" style={{
            position: 'relative', overflow: 'hidden',
            gridColumn: '1 / -1', borderRadius: radius.xl,
            display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '40% 60%',
            alignItems: 'center', minHeight: isMobile ? undefined : '640px',
            background: color.bg.tint,
          }}>
            <div style={{ padding: isMobile ? space['2xl'] : 'clamp(32px, 4vw, 64px)', paddingRight: isMobile ? space['2xl'] : space['3xl'] }}>
              <p style={{ margin: `0 0 ${space.lg}`, ...type.eyebrow, color: color.text.muted }}>Crisp for macOS</p>
              <h2 id="showcase-overview" style={{ margin: `0 0 ${space.xl}`, ...type['heading-l'], fontSize: isMobile ? '28px' : 'clamp(28px, 2.6vw, 38px)', lineHeight: 1.12, color: color.text.primary, textWrap: 'balance' }}>{content.heading}</h2>
              {content.body.map((paragraph, i) => <p key={paragraph} style={{ margin: i ? `${space.lg} 0 0` : 0, ...type['body-xl'], color: color.text.secondary }}>{paragraph}</p>)}
            </div>
            {/* Stacked on mobile, the shot leads so the page still opens on its hero. */}
            <div style={{ minWidth: 0, order: isMobile ? -1 : undefined, padding: isMobile ? `${space['2xl']} ${space['2xl']} 0` : `${space['4xl']} 0`, width: isMobile ? '100%' : 'max(900px, 130%)', boxSizing: 'border-box' }}>
              {imageButton(content.hero, true)}
            </div>
          </section>

          {content.evolution && (
            <section aria-labelledby="showcase-evolution" style={{
              gridColumn: '1 / -1', borderRadius: radius.xl, background: color.bg.tint,
              padding: isMobile ? space['2xl'] : 'clamp(32px, 4vw, 64px)',
              display: 'flex', flexDirection: 'column', gap: isMobile ? space['2xl'] : space['4xl'],
            }}>
              <SectionHeading id="showcase-evolution" style={{ color: color.text.primary }}>{content.evolution.heading}</SectionHeading>
              {content.evolution.steps.map((step) => (
                <div key={step.label} style={{
                  display: 'grid', alignItems: 'center',
                  gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 4fr) minmax(0, 7fr)',
                  gap: isMobile ? space.xl : space['4xl'],
                }}>
                  <div>
                    <p style={{ margin: `0 0 ${space.md}`, ...type.eyebrow, color: color.text.muted }}>{step.label}</p>
                    <p style={{ margin: 0, ...type['body-xl'], color: color.text.secondary }}>{step.body}</p>
                  </div>
                  {imageButton(step.shot)}
                </div>
              ))}
            </section>
          )}

          {content.cards.map((card) => {
            const wide = card.layout === 'wide'
            return (
              <figure key={card.heading} style={{
                position: 'relative', overflow: 'hidden', margin: 0,
                gridColumn: wide ? '1 / -1' : undefined,
                borderRadius: radius.xl, background: color.bg.tint,
                display: 'flex', flexDirection: 'column',
              }}>
                {card.video ? <ShowcaseClip video={card.video} /> : (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1,
                    minHeight: isMobile ? '210px' : wide ? undefined : '340px',
                    padding: isMobile ? space.xl : wide ? `${space['4xl']} ${space['5xl']} ${space['3xl']}` : space['2xl'],
                  }}>
                    {imageButton(card.shot)}
                  </div>
                )}
                <figcaption style={{
                  position: 'relative',
                  padding: `${card.video || wide ? space.xl : space.lg} ${isMobile ? space.xl : space['2xl']} ${isMobile ? space.xl : space['2xl']}`,
                  color: color.text.primary,
                }}>
                  <h2 style={{ margin: 0, ...type['heading-m'], textWrap: 'balance' }}>{card.heading}</h2>
                  <p style={{ margin: `${space.sm} 0 0`, ...type['body-xl'], maxWidth: '580px', color: color.text.secondary }}>{card.body}</p>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>

      <dialog ref={dialog} className="showcase-lightbox" aria-label="Screenshot detail" onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }} style={{ margin: 'auto', padding: 0, border: 0, background: 'transparent', color: color.text.primary, maxWidth: '94vw', maxHeight: '94vh', overflow: 'visible' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: space.md }}>
          <IconButton label="Close screenshot" icon={<X />} size="lg" variant="secondary" onClick={() => dialog.current?.close()} />
        </div>
        <img src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '94vw', maxHeight: '80vh', borderRadius: radius.xl, boxShadow: SHADOW }} />
      </dialog>
    </main>
  )
}

/**
 * A looping clip filling the top of its card, edge to edge — the recording's
 * own wallpaper is the backdrop, so it needs no well around it. Reduced motion
 * gets the poster.
 */
function ShowcaseClip({ video }: { video: LandingVideo }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const fill: React.CSSProperties = {
    display: 'block', width: '100%', objectFit: 'cover',
    aspectRatio: video.aspect.replace(/\s/g, ''),
  }

  return stillOnly ? (
    <img src={video.poster} alt={video.alt} loading="lazy" style={fill} />
  ) : (
    <ScrubbableClip poster={video.poster} aria-label={video.alt} style={fill}>
      {video.hevc && <source src={video.hevc} type='video/mp4; codecs="hvc1"' />}
      <source src={video.src} type="video/mp4" />
    </ScrubbableClip>
  )
}
