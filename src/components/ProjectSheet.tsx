import type { ReactNode } from 'react'
import SidebarPlayground from './No3ySidebar'
import ArtGallery from './ArtGallery'
import HeroVideo from './HeroVideo'
import { Runs } from './ProjectIntro'
import { CopyCell, CopyWithFacts, SheetClip, SheetGap, SheetImg, SheetIntro, SheetLinks, SheetPage } from './Sheet'
import { space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { FILL, RULE, SHEET_BODY, SHEET_HEADING, TEXT_SOFT, accentTheme, cellStyle, toParagraphs } from '../sheetStyle'
import type { LandingShot, Project, StorySection } from '../data/projects'

/**
 * The ruled-sheet project page (Figma `461:14182`, Nov 4 2026) — every page
 * with `landing` data: no3y Code, Moonfang Armory, Pixel art, How to Build a
 * PC, Nacho Box. One 1128 column between two hairlines, the page built as
 * stacked cells: the header, the intro on a faint fill, the media running edge
 * to edge between the rules with no corner, and each block's copy in a cell of
 * its own under it, a ruled gap between blocks. The user drew no3y Code's
 * opening (intro, clip, "What I wanted" beside Tools / Skills); the rest
 * carries its style. The pieces are `Sheet.tsx`'s, shared with the hand-built
 * pages.
 *
 * `landing.sheet` adds no3y Code's icon and Tools / Skills; the other pages
 * run without. A `copy` section takes the media sections after it into its
 * block — media first, then its copy, the sheet's order — so Nacho Box's
 * "copy, then the shots it describes" reads as one block each.
 */
export default function ProjectSheet({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const landing = project.landing
  if (!landing) return null
  const { sheet, showcase, hero } = landing
  const facts = sheet?.facts ?? []

  const links = [...(hero.cta ? [{ label: hero.cta.label, href: hero.cta.href }] : []), ...(hero.links ?? [])]

  // The opener: the hero media, then (no3y Code) its copy beside the facts.
  const openerMedia = showcase ? (
    <>
      {showcase.video && <SheetClip video={showcase.video} priority />}
      {showcase.shot && <SheetImg shot={showcase.shot} priority />}
    </>
  ) : hero.video ? (
    <HeroVideo video={hero.video} maxWidth={hero.shotWidth ?? 1272} radius="0px" style={{ width: '100%' }} />
  ) : hero.shot ? (
    <SheetImg shot={{ src: hero.shot.src, alt: hero.shot.alt, aspect: hero.shot.aspect }} priority />
  ) : null
  const openerCopy =
    showcase?.copy || facts.length > 0 ? (
      <CopyWithFacts
        copy={showcase?.copy && <CopyCell heading={showcase.copy.heading} body={showcase.copy.body} style={{ flex: 1 }} />}
        facts={facts}
      />
    ) : null

  const blocks: ReactNode[] = []
  if (openerMedia || openerCopy)
    blocks.push(
      <>
        {openerMedia}
        {openerCopy}
      </>,
    )
  for (const group of groupSections(landing.sections)) blocks.push(<SectionBlock group={group} isMobile={isMobile} />)
  if (landing.feedback) {
    blocks.push(
      <div style={{ borderBottom: RULE }}>
        <div style={{ background: FILL, padding: space.lg, columns: isMobile ? 1 : '3 240px', columnGap: space.lg }}>
          {landing.feedback.shots.map((shot) => (
            <figure key={shot.src} style={{ breakInside: 'avoid', margin: `0 0 ${space.lg}`, padding: '10px', border: RULE, background: FILL }}>
              <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: 'auto' }} />
            </figure>
          ))}
        </div>
        <CopyCell heading={landing.feedback.heading} body={landing.feedback.body} />
      </div>,
    )
  }
  if (landing.outro) {
    blocks.push(
      <div style={{ borderBottom: RULE }}>
        <CopyCell heading={landing.outro.heading}>
          {landing.outro.command && <p style={{ ...SHEET_BODY, fontFamily: 'ui-monospace, monospace' }}>{landing.outro.command}</p>}
          {!!landing.outro.links?.length && <SheetLinks links={landing.outro.links} />}
        </CopyCell>
      </div>,
    )
  }

  return (
    <div style={accentTheme(landing.accent)}>
      <SheetPage>
        <SheetIntro
          icon={sheet?.icon}
          title={project.title}
          helper={landing.eyebrow}
          description={hero.body ?? [project.summary]}
          links={links}
        />
        {blocks.map((block, i) => (
          <div key={i}>
            {/* The first gap carries a top rule too: the intro above it has none. */}
            <SheetGap top={i === 0} />
            {block}
          </div>
        ))}
      </SheetPage>
    </div>
  )
}

/** A block: one section, or a `copy` section with the media sections after it. */
type Group = { copy?: Extract<StorySection, { kind: 'copy' }>; media: StorySection[]; section?: StorySection }

const isMedia = (section: StorySection) =>
  section.kind === 'shot' || section.kind === 'columns' || section.kind === 'grid' || section.kind === 'row'

function groupSections(sections: StorySection[]): Group[] {
  const groups: Group[] = []
  for (const section of sections) {
    const last = groups[groups.length - 1]
    if (section.kind === 'copy') groups.push({ copy: section, media: [] })
    else if (isMedia(section) && last?.copy) last.media.push(section)
    else if (isMedia(section)) groups.push({ media: [section] })
    else groups.push({ media: [], section })
  }
  return groups
}

function SectionBlock({ group, isMobile }: { group: Group; isMobile: boolean }) {
  if (group.section) return <OwnSection section={group.section} isMobile={isMobile} />
  return (
    <div style={{ borderBottom: RULE }}>
      {group.media.map((section, i) => (
        // Stacked media are ruled apart.
        <div key={i} style={i > 0 ? { borderTop: RULE } : undefined}>
          <Media section={section} isMobile={isMobile} />
        </div>
      ))}
      {group.copy && (
        <div style={group.media.length > 0 ? { borderTop: RULE } : undefined}>
          <CopyCell heading={group.copy.heading} body={group.copy.body} />
        </div>
      )}
    </div>
  )
}

/** The media sections, square and across the column. */
function Media({ section, isMobile }: { section: StorySection; isMobile: boolean }) {
  switch (section.kind) {
    case 'grid':
      // The tiles are baked off one wallpaper on a 16px gap, so they keep it.
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: space.lg,
            padding: space.lg,
            background: FILL,
          }}
        >
          {section.shots.map((shot) => (
            <SheetImg key={shot.src} shot={shot} />
          ))}
        </div>
      )
    case 'shot': {
      // A shot drawn narrower than its row (a tall poster, a font sheet) keeps
      // that share, centred on the cell fill; a full-width one runs edge to edge.
      const share = section.frame.width / section.width
      if (share >= 0.99) return <Shot shot={section.shot} />
      return (
        <div style={{ background: FILL, padding: isMobile ? '20px' : '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: isMobile ? '100%' : `${share * 100}%` }}>
            <Shot shot={section.shot} />
          </div>
        </div>
      )
    }
    case 'columns':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : section.columns.map((column) => `${column.width}fr`).join(' '),
          }}
        >
          {section.columns.map((column, i) => (
            <div
              key={column.shot.src}
              style={i > 0 ? (isMobile ? { borderTop: RULE } : { borderLeft: RULE }) : undefined}
            >
              <Shot shot={column.shot} />
              <Caption text={column.caption} />
            </div>
          ))}
        </div>
      )
    case 'row':
      return (
        <>
          <Shot shot={section.shot} />
          <Caption text={section.caption} />
        </>
      )
    default:
      return null
  }
}

/** The sections that stand as their own block. */
function OwnSection({ section, isMobile }: { section: StorySection; isMobile: boolean }) {
  if (section.kind === 'gallery') {
    return (
      <div style={{ borderBottom: RULE }}>
        <div style={{ background: FILL, padding: isMobile ? '20px' : '32px' }}>
          <ArtGallery heading={section.heading} items={section.items} />
        </div>
        <div style={{ borderTop: RULE }}>
          <CopyCell heading={section.heading} />
        </div>
      </div>
    )
  }

  if (section.kind !== 'feature') return null

  // The live sidebar keeps its own layout — copy and controls beside the stage
  // — inside one cell.
  if (section.sidebarPlayground) {
    return (
      <div style={{ ...cellStyle(isMobile), borderBottom: RULE }}>
        <SidebarPlayground
          options={section.sidebarPlayground}
          copy={
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
              <h2 style={SHEET_HEADING}>{section.heading}</h2>
              {toParagraphs(section.body ?? []).map((paragraph, i) => (
                <p key={i} style={SHEET_BODY}>
                  {typeof paragraph === 'string' ? paragraph : <Runs runs={paragraph} />}
                </p>
              ))}
            </div>
          }
          radius="0px"
          isMobile={isMobile}
        />
      </div>
    )
  }

  // Media first, edge to edge, then its copy — the opener's order.
  return (
    <div style={{ borderBottom: RULE }}>
      {section.video && <SheetClip video={section.video} />}
      {!section.video && section.shot && <Shot shot={section.shot} />}
      <CopyCell heading={section.heading} body={section.body} />
    </div>
  )
}

function Shot({ shot }: { shot: LandingShot }) {
  return <SheetImg shot={{ src: shot.src, alt: shot.alt, aspect: shot.aspect }} />
}

/** A caption strip under a shot: 14px in the soft ink, on the cell fill. */
function Caption({ text }: { text: string | string[] }) {
  const isMobile = useIsMobile()
  return (
    <div style={{ background: FILL, padding: isMobile ? '12px 20px' : '16px 32px', display: 'flex', flexDirection: 'column', gap: space.sm }}>
      {(Array.isArray(text) ? text : [text]).map((line) => (
        <p key={line} style={{ ...SHEET_BODY, fontSize: '14px', color: TEXT_SOFT }}>
          {line}
        </p>
      ))}
    </div>
  )
}
