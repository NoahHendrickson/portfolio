import { useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import ScrubbableClip from './ScrubbableClip'
import { CopyCell, SheetBlock, SheetGap, SheetIntro, SheetPage } from './Sheet'
import IconButton from '../design-system/IconButton'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { COPY_MEASURE, FILL, RULE, SHEET_BODY, SHEET_HEADING, TEXT, TEXT_SOFT, accentTheme, cellStyle } from '../sheetStyle'
import type { GalleryImage, LandingVideo, Project, ProjectShowcaseContent, ShowcaseCard } from '../data/projects'

/*
  `/work/crisp`, on the ruled sheet no3y Code and D2 Conflux run (`Sheet.tsx`,
  Nov 4 2026): the intro (the tagline as its description, the `meta` as its
  helper, the download as a label-only link), a ruled gap, the editor shot
  across the column with the overview copy under it, then the timeline's two
  passes and each card as their media, square and edge to edge between the
  rules, over a copy cell. Stills still open in the lightbox; clips keep their
  scrub bar. It ran rounded, shadowed cards on tinted wells out to the hero's
  1320 before.
*/

/** The page: a short overview and the product captures, each over its copy. */
export default function ProjectShowcase({ project, content }: { project: Project; content: ProjectShowcaseContent }) {
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
        />

        <SheetGap top />

        {/* The opener: the editor, then the overview under it. */}
        <div style={{ borderBottom: RULE }}>
          <Enlargeable shot={content.hero} onEnlarge={enlarge} priority />
          <CopyCell heading={content.heading} body={content.body} />
        </div>

        {evolution && (
          <SheetBlock>
            {/*
              Each pass's copy over its shot, the passes on one fill with no rule
              between them (Nov 5 2026): the copy sits a shot's padding above the
              shot it describes, and twice that from the pass before it.
            */}
            {evolution.steps.map((step) => (
              <div key={step.label}>
                <StepCell heading={evolution.heading} label={step.label} body={step.body} />
                <Enlargeable shot={step.shot} onEnlarge={enlarge} />
              </div>
            ))}
          </SheetBlock>
        )}

        {cardRows(content.cards).map((row) => (
          <SheetBlock key={row[0].heading}>
            {row.length === 1 ? <Card card={row[0]} onEnlarge={enlarge} /> : <CardPair cards={row} onEnlarge={enlarge} />}
          </SheetBlock>
        ))}

        <dialog
          ref={dialog}
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

/**
 * Wide cards stand alone; normal ones pair up two to a row (a lone one at the
 * end of a run stands alone too).
 */
function cardRows(cards: ShowcaseCard[]): ShowcaseCard[][] {
  const rows: ShowcaseCard[][] = []
  for (const card of cards) {
    const last = rows[rows.length - 1]
    if (card.layout !== 'wide' && last?.length === 1 && last[0].layout !== 'wide') last.push(card)
    else rows.push([card])
  }
  return rows
}

/** A card's media (a still or a clip), then its copy cell. */
function Card({ card, onEnlarge }: { card: ShowcaseCard; onEnlarge: (shot: GalleryImage) => void }) {
  return (
    <>
      {card.video ? <ShowcaseClip video={card.video} /> : <Enlargeable shot={card.shot} onEnlarge={onEnlarge} />}
      <CopyCell heading={card.heading} body={card.body} />
    </>
  )
}

/**
 * Two normal cards side by side, split by a rule; each one's media on the
 * first row and its copy on the second, so the copy cells line up. Stacked on a
 * phone.
 */
function CardPair({ cards, onEnlarge }: { cards: ShowcaseCard[]; onEnlarge: (shot: GalleryImage) => void }) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return cards.map((card, i) => (
      <div key={card.heading} style={i > 0 ? { borderTop: RULE } : undefined}>
        <Card card={card} onEnlarge={onEnlarge} />
      </div>
    ))
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'auto 1fr' }}>
      {cards.map((card, i) => {
        const side: React.CSSProperties = { gridColumn: i + 1, ...(i > 0 && { borderLeft: RULE }) }
        return (
          <div key={card.heading} style={{ display: 'contents' }}>
            {/* A shorter still leaves the cell fill under it rather than the page. */}
            <div style={{ ...side, gridRow: 1, background: FILL }}>
              {card.video ? (
                <ShowcaseClip video={card.video} />
              ) : (
                <Enlargeable shot={card.shot} onEnlarge={onEnlarge} filled={false} />
              )}
            </div>
            <CopyCell heading={card.heading} body={card.body} style={{ ...side, gridRow: 2 }} />
          </div>
        )
      })}
    </div>
  )
}

/** A timeline pass's copy: the section's heading with the pass after it, " / "-split like the intro's helper. */
function StepCell({ heading, label, body }: { heading: string; label: string; body: string }) {
  const isMobile = useIsMobile()
  return (
    // No bottom padding: the shot under it brings its own.
    <div style={{ ...cellStyle(isMobile), paddingBottom: 0 }}>
      <h2 style={SHEET_HEADING}>
        {heading}
        <span style={{ color: TEXT_SOFT }}> / {label}</span>
      </h2>
      <p style={{ ...SHEET_BODY, maxWidth: COPY_MEASURE }}>{body}</p>
    </div>
  )
}

/**
 * A still that opens in the lightbox, padded on the cell fill so an app
 * window's rounded corners never meet the column's rules (Nov 5 2026; it ran
 * edge to edge until then). A capture with its corners baked onto a dark ground
 * (`corner`) is clipped just inside them, so the ground doesn't show on the fill.
 * `filled={false}` leaves the fill to a parent that already paints it.
 */
function Enlargeable({
  shot,
  onEnlarge,
  priority = false,
  filled = true,
}: {
  shot: GalleryImage
  onEnlarge: (shot: GalleryImage) => void
  priority?: boolean
  filled?: boolean
}) {
  const isMobile = useIsMobile()
  const [focused, setFocused] = useState(false)
  const corner = shot.corner && `${(shot.corner / shot.width) * 100}% / ${(shot.corner / shot.height) * 100}%`
  return (
    <div style={{ background: filled ? FILL : undefined, padding: isMobile ? '16px' : '32px' }}>
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
          borderRadius: corner || 0,
          background: 'none',
          width: '100%',
          cursor: 'zoom-in',
          outline: focused ? `3px solid ${TEXT}` : 'none',
          outlineOffset: '3px',
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
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: corner || undefined }}
        />
      </button>
    </div>
  )
}

/**
 * A looping clip across its box, square and edge to edge, with its scrub bar
 * (`ScrubbableClip`) — the recording's own wallpaper is the backdrop. Reduced
 * motion gets the poster.
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
