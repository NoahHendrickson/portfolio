import { useRef, useState } from 'react'
import { ArrowSquareOut, X } from '@phosphor-icons/react'
import Header from './Header'
import IconButton from '../design-system/IconButton'
import { VARIANTS } from '../design-system/buttonStyles'
import { color, control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { PROJECT_MOBILE_PAD, shellPad } from '../layout'
import type { Project, ProjectShowcaseContent } from '../data/projects'

type ShowcaseImage = { src: string; alt: string; width: number; height: number }

const SHADOW = '0 24px 64px rgba(15, 14, 14, 0.28), 0 4px 12px rgba(15, 14, 14, 0.18)'

/** A short overview and a tightly spaced gallery of real product captures. */
export default function ProjectShowcase({ project, content }: { project: Project; content: ProjectShowcaseContent }) {
  const isMobile = useIsMobile()
  const gutter = isMobile ? PROJECT_MOBILE_PAD : shellPad()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<ShowcaseImage>(content.hero)
  const cta = project.landing?.hero.cta

  function enlarge(shot: ShowcaseImage) {
    setSelected(shot)
    dialog.current?.showModal()
  }

  function imageButton(shot: ShowcaseImage, hero = false) {
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
      <div style={{ padding: `${isMobile ? space.xl : space['2xl']} ${gutter} ${space['5xl']}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space.xl, marginBottom: isMobile ? space['2xl'] : space['3xl'] }}>
          <div>
            <h1 style={{ margin: 0, ...type['display-l'], fontSize: isMobile ? '34px' : '48px' }}>{project.title}</h1>
            <p style={{ margin: `${space.sm} 0 0`, ...type['body-s'], color: color.text.muted }}>{content.meta}</p>
          </div>
          {cta && (
            <a href={cta.href} target="_blank" rel="noopener noreferrer" className="showcase-cta" style={{
              display: 'inline-flex', alignItems: 'center', gap: space.sm,
              height: control.lg, padding: `0 ${space.lg}`, borderRadius: radius.full,
              ...type['label-m'], textDecoration: 'none',
              background: VARIANTS.secondary.default.background,
              color: VARIANTS.secondary.default.color,
              border: `1px solid ${VARIANTS.secondary.default.borderColor}`,
            }}>
              {cta.label}<ArrowSquareOut size={16} aria-hidden="true" />
            </a>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', gap: space.lg }}>
          <section aria-labelledby="showcase-overview" style={{
            position: 'relative', overflow: 'hidden',
            gridColumn: '1 / -1', borderRadius: radius.xl,
            display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : '40% 60%',
            alignItems: 'center', minHeight: isMobile ? undefined : '640px',
            background: color.bg.tint,
            border: `1px solid ${color.border.subtle}`,
          }}>
            <div style={{ padding: isMobile ? space['2xl'] : 'clamp(32px, 4vw, 64px)', paddingRight: isMobile ? space['2xl'] : space['3xl'] }}>
              <p style={{ margin: `0 0 ${space.lg}`, ...type.eyebrow, color: color.text.muted }}>Crisp for macOS</p>
              <h2 id="showcase-overview" style={{ margin: `0 0 ${space.xl}`, ...type['heading-l'], fontSize: isMobile ? '28px' : 'clamp(28px, 2.6vw, 38px)', lineHeight: 1.12, color: color.text.primary, textWrap: 'balance' }}>{content.heading}</h2>
              {content.body.map((paragraph, i) => <p key={paragraph} style={{ margin: i ? `${space.lg} 0 0` : 0, ...type['body-l'], lineHeight: 1.5, color: color.text.secondary }}>{paragraph}</p>)}
            </div>
            <div style={{ minWidth: 0, padding: isMobile ? `0 ${space['2xl']} ${space['2xl']}` : `${space['4xl']} 0`, width: isMobile ? '100%' : 'max(900px, 130%)', boxSizing: 'border-box' }}>
              {imageButton(content.hero, true)}
            </div>
          </section>

          {content.cards.map((card) => {
            const wide = card.layout === 'wide'
            return (
              <figure key={card.src} style={{
                position: 'relative', overflow: 'hidden', margin: 0,
                gridColumn: wide ? '1 / -1' : undefined,
                borderRadius: radius.xl, background: color.bg.tint,
                border: `1px solid ${color.border.subtle}`,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1,
                  minHeight: isMobile ? '210px' : wide ? undefined : '340px',
                  padding: isMobile ? space.xl : wide ? `${space['4xl']} ${space['5xl']} ${space['3xl']}` : space['2xl'],
                }}>
                  {imageButton(card)}
                </div>
                <figcaption style={{
                  position: 'relative', padding: isMobile ? space.xl : space['2xl'],
                  paddingTop: wide ? space.xl : space.lg,
                  color: color.text.primary,
                }}>
                  <h2 style={{ margin: 0, ...type['heading-m'], textWrap: 'balance' }}>{card.heading}</h2>
                  <p style={{ margin: `${space.sm} 0 0`, ...type['body-m'], maxWidth: '580px', lineHeight: 1.5, color: color.text.secondary }}>{card.body}</p>
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
