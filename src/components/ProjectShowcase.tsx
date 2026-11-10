import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import ScrubbableClip from './ScrubbableClip'
import { CurvedCard, CurvedChain, CurvedCopy, CurvedSoftInDark } from './Curved'
import Reveal from './Reveal'
import { SheetIntro, SheetPage } from './Sheet'
import IconButton from '../design-system/IconButton'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CURVED_BODY_SIZE, TEXT, TEXT_SOFT, accentTheme, sheetGap } from '../sheetStyle'
import type { GalleryImage, LandingVideo, Project, ProjectShowcaseContent } from '../data/projects'

/*
  `/work/crisp`, on the curved cards no3y Code runs (`Curved.tsx`, Nov 9 2026): the
  intro (the tagline as its description, the `meta` as its helper, the download as a
  label-only link), then the editor, each pass of the timeline and each card as their
  media on a rounded card with the copy on a tab hanging off its foot. Stills open in
  the lightbox; clips keep their scrub bar.
*/

/** The page: a short overview and the product captures, each over its copy. */
export default function ProjectShowcase({ project, content }: { project: Project; content: ProjectShowcaseContent }) {
  const isMobile = useIsMobile()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<GalleryImage>(content.hero)
  const cta = project.landing?.hero.cta
  const evolution = content.evolution

  function enlarge(shot: GalleryImage) {
    setSelected(shot)
    dialog.current?.showModal()
  }

  const theme = accentTheme(content.accent)

  return (
    <div style={theme}>
      <SheetPage>
        <SheetIntro
          title={project.title}
          helper={content.meta.split(' · ')}
          description={[project.tagline]}
          links={cta && [{ label: cta.label, href: cta.href }]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <CurvedSoftInDark>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          <CurvedCard
            media={<Enlargeable shot={content.hero} onEnlarge={enlarge} priority />}
            copy={<CurvedCopy heading={content.heading} body={content.body} />}
          />

          {/* The passes as one shape, the second hanging off the first's copy. */}
          {evolution && (
            <Reveal>
              <CurvedChain
                steps={evolution.steps.map((step) => ({
                  key: step.label,
                  media: <Enlargeable shot={step.shot} onEnlarge={enlarge} />,
                  copy: (
                    <CurvedCopy
                      heading={
                        <>
                          {evolution.heading}
                          <span style={{ color: TEXT_SOFT }}> / {step.label}</span>
                        </>
                      }
                      body={step.body}
                    />
                  ),
                }))}
              />
            </Reveal>
          )}

          {content.cards.map((card) => (
            <Reveal key={card.heading}>
              <CurvedCard
                holdClip
                media={card.video ? <ShowcaseClip video={card.video} /> : <Enlargeable shot={card.shot} onEnlarge={enlarge} />}
                copy={<CurvedCopy heading={card.heading} body={card.body} />}
              />
            </Reveal>
          ))}
        </div>
        </CurvedSoftInDark>

        <dialog
          ref={dialog}
          data-theme="dark"
          className="showcase-lightbox"
          aria-label="Screenshot detail"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close()
          }}
          style={{ margin: 'auto', padding: 0, border: 0, background: 'transparent', color: TEXT, maxWidth: '94vw', maxHeight: '94vh', overflow: 'visible' }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: space.md }}>
            <IconButton label="Close screenshot" icon={<X weight="regular" />} size="lg" variant="secondary" onClick={() => dialog.current?.close()} />
          </div>
          <img
            src={selected.src}
            alt={selected.alt}
            width={selected.width}
            height={selected.height}
            style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '94vw', maxHeight: '80vh' }}
          />
        </dialog>
      </SheetPage>
    </div>
  )
}

/** A still that opens in the lightbox, filling its card's media box, which rounds it. */
function Enlargeable({
  shot,
  onEnlarge,
  priority = false,
}: {
  shot: GalleryImage
  onEnlarge: (shot: GalleryImage) => void
  priority?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <button
      type="button"
      aria-label={`Enlarge: ${shot.alt}`}
      onClick={() => onEnlarge(shot)}
      onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block',
        padding: 0,
        border: 0,
        background: 'none',
        width: '100%',
        cursor: 'zoom-in',
        // Inside the shot: the media box clips anything outside it.
        outline: focused ? '3px solid var(--color-orange)' : 'none',
        outlineOffset: '-6px',
      }}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </button>
  )
}

/**
 * A looping clip across its box, with its scrub bar (`ScrubbableClip`) — the
 * recording's own wallpaper is the backdrop. Reduced motion gets the poster.
 */
function ShowcaseClip({ video }: { video: LandingVideo }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const fill: React.CSSProperties = {
    display: 'block',
    width: '100%',
    objectFit: 'cover',
    aspectRatio: video.aspect.replace(/\s/g, ''),
  }

  return stillOnly ? (
    <img src={video.poster} alt={video.alt} loading="lazy" decoding="async" style={fill} />
  ) : (
    <ScrubbableClip poster={video.poster} aria-label={video.alt} style={fill}>
      {video.hevc && <source src={video.hevc} type='video/mp4; codecs="hvc1"' />}
      <source src={video.src} type="video/mp4" />
    </ScrubbableClip>
  )
}
