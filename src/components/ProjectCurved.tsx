import { createContext, useContext, type ReactNode } from 'react'
import SidebarPlayground from './No3ySidebar'
import ArtGallery from './ArtGallery'
import { CurvedCard, CurvedCluster, CurvedCopy, CurvedFacts, CurvedMedia, CurvedPanel, CurvedSteps } from './Curved'
import CompareSlider from './CompareSlider'
import HeroVideo from './HeroVideo'
import MockThemeSwitch from './MockThemeSwitch'
import Reveal from './Reveal'
import { SheetClip, SheetImg, SheetIntro, SheetPage } from './Sheet'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_BODY_SIZE, CURVED_INNER, LEADING, TEXT_SOFT, accentTheme, curvedInset, sheetGap } from '../sheetStyle'
import type { LandingShot, Project, StorySection } from '../data/projects'
import { NO3Y_INLET, type InletMedia } from '../data/no3yInlet'
import { useMockTheme } from '../mockTheme'

/*
  no3y Code's mockups come in two themes (Nov 14 2026): Glass, as the page was built, and
  Inlet Black. `Swap` hands each mockup the Inlet file in its place when the switch says so;
  a mockup with no Inlet version yet keeps its Glass one. Other projects have no swaps.
*/
const SWAPS: Record<string, Record<string, InletMedia>> = { 'no3y-code': NO3Y_INLET }
type SwapFn = <T extends { src: string }>(media: T) => T
const Swap = createContext<SwapFn>((media) => media)
const useSwap = () => useContext(Swap)

/*
  Every project page with `landing` data (no3y Code, Moonfang Armory, Pixel art, How
  to Build a PC, Nacho Box), built from `Curved.tsx`'s cards with open space between
  sections. A `copy` section takes the media sections after it onto its card, media
  first, so Nacho Box's "copy, then the shots it describes" reads as one shape. Media
  with no copy of its own stands on a plain card, since the intro carries its words.
*/

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

function Rounded({ corner = CURVED_INNER, children }: { corner?: string; children: ReactNode }) {
  return <div style={{ borderRadius: corner, overflow: 'hidden' }}>{children}</div>
}

function Shot({ shot }: { shot: LandingShot }) {
  const s = useSwap()(shot)
  return <SheetImg key={s.src} shot={{ src: s.src, alt: s.alt, aspect: s.aspect }} />
}

/** A clip, or its other theme's; keyed by file so a swap loads the new one. */
function Clip({ video, priority = false }: { video: Parameters<typeof SheetClip>[0]['video']; priority?: boolean }) {
  const v = useSwap()(video)
  return <SheetClip key={v.src} video={v} priority={priority} />
}

/** A still passed through as-is (the grid tiles), or its other theme's. */
function Img({ shot, priority = false }: { shot: Parameters<typeof SheetImg>[0]['shot']; priority?: boolean }) {
  const s = useSwap()(shot)
  return <SheetImg key={s.src} shot={s} priority={priority} />
}

/** A shot with its caption under it, on the card. */
function Figure({ shot, caption }: { shot: LandingShot; caption: string | string[] }) {
  return (
    <figure style={{ margin: 0, minWidth: 0 }}>
      <Rounded>
        <Shot shot={shot} />
      </Rounded>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: space.xs, padding: `${space.sm} ${space.xs} 0` }}>
        {(Array.isArray(caption) ? caption : [caption]).map((line) => (
          <span key={line} style={{ fontSize: '14px', lineHeight: LEADING, color: TEXT_SOFT }}>
            {line}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

function Media({ section }: { section: StorySection }) {
  const isMobile = useIsMobile()
  switch (section.kind) {
    case 'grid':
      // On a card with copy, the tiles sit two to a row on the 16px gap they were baked for.
      return (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: space.lg }}>
          {section.shots.map((shot) => (
            <Rounded key={shot.src} corner={radius.md}>
              <Img shot={shot} />
            </Rounded>
          ))}
        </div>
      )
    case 'shot': {
      // A shot drawn narrower than its row (a font sheet, an icon strip) keeps that share, centred.
      const share = section.frame.width / section.width
      return (
        <div style={{ width: isMobile || share >= 0.99 ? '100%' : `${share * 100}%`, margin: '0 auto' }}>
          <Rounded>
            <Shot shot={section.shot} />
          </Rounded>
        </div>
      )
    }
    case 'columns':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : section.columns.map((column) => `${column.width}fr`).join(' '),
            gap: space.sm,
          }}
        >
          {section.columns.map((column) => (
            <Figure key={column.shot.src} shot={column.shot} caption={column.caption} />
          ))}
        </div>
      )
    case 'row':
      return <Figure shot={section.shot} caption={section.caption} />
    default:
      return null
  }
}

function MediaStack({ sections }: { sections: StorySection[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      {sections.map((section, i) => (
        <Media key={i} section={section} />
      ))}
    </div>
  )
}

/** The sections that stand as their own block. */
function OwnSection({ section }: { section: StorySection }) {
  const isMobile = useIsMobile()
  const mockTheme = useMockTheme()

  // The art carries its own frames, so it floats on the page with no card. The
  // gallery's `heading` stays as its accessible name.
  if (section.kind === 'gallery') return <ArtGallery heading={section.heading} items={section.items} />

  if (section.kind !== 'feature') return null

  // The live sidebar keeps its own layout, copy and controls beside the stage.
  if (section.sidebarPlayground) {
    return (
      <CurvedPanel style={{ padding: curvedInset(isMobile) }}>
        <SidebarPlayground
          options={section.sidebarPlayground}
          copy={
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl }}>
              <CurvedCopy heading={section.heading} body={section.body} />
            </div>
          }
          radius={CURVED_INNER}
          isMobile={isMobile}
        />
      </CurvedPanel>
    )
  }

  const media = section.video ? <Clip video={section.video} /> : section.shot ? <Shot shot={section.shot} /> : null
  // A card's own fill can be held to one of the page's mockup themes (Petals' green is Inlet's).
  const tone = section.card && (!section.card.only || section.card.only === mockTheme) ? section.card : undefined
  return <CurvedCard media={media} tone={tone} copy={<CurvedCopy heading={section.heading} body={section.body} />} />
}

const isCluster = (group: Group) => !group.section && !group.copy && group.media[0]?.kind === 'grid' && !!group.media[0].cluster

function Block({ group }: { group: Group }) {
  const isMobile = useIsMobile()
  if (group.section) return <OwnSection section={group.section} />

  if (group.copy) {
    const copy = <CurvedCopy heading={group.copy.heading} body={group.copy.body} />
    if (group.media.length > 0) return <CurvedCard media={<MediaStack sections={group.media} />} copy={copy} />
    return <CurvedPanel style={{ padding: curvedInset(isMobile), display: 'flex', flexDirection: 'column', gap: space.xl }}>{copy}</CurvedPanel>
  }

  // A lone tile grid: its tiles on separate joined cards, as an uneven cluster or stepping down the column.
  const [only] = group.media
  if (only?.kind === 'grid') {
    // A baked tile's `aspect` is its drawn size, which is what sets its scale beside the others.
    const tiles = only.shots.map((shot) => {
      const [width, height] = shot.aspect.split('/').map(Number)
      return { key: shot.src, media: <Img shot={shot} />, width, height }
    })
    return only.cluster ? (
      <CurvedCluster tiles={tiles} slots={only.cluster} />
    ) : (
      <CurvedSteps ratio={tiles[0].height / tiles[0].width} tiles={tiles} />
    )
  }
  return (
    <CurvedMedia>
      <MediaStack sections={group.media} />
    </CurvedMedia>
  )
}

export default function ProjectCurved({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const mockTheme = useMockTheme()
  const landing = project.landing
  if (!landing) return null
  const { sheet, showcase, hero } = landing
  const facts = sheet?.facts ?? []
  const links = [...(hero.cta ? [{ label: hero.cta.label, href: hero.cta.href }] : []), ...(hero.links ?? [])]
  const swaps = SWAPS[project.slug]
  const swap: SwapFn = (media) =>
    swaps && mockTheme === 'inlet' && swaps[media.src] ? { ...media, ...swaps[media.src] } : media

  const openerMedia = showcase ? (
    <>
      {showcase.compare && (
        <CompareSlider
          before={showcase.compare.before}
          after={showcase.compare.after}
          alt={showcase.compare.alt}
          aspect={showcase.compare.aspect}
          priority
        />
      )}
      {showcase.video && !showcase.compare && <Clip video={showcase.video} priority />}
      {showcase.shot && <Img shot={showcase.shot} priority />}
    </>
  ) : hero.video ? (
    <HeroVideo video={hero.video} maxWidth={hero.shotWidth ?? 1272} radius="0px" style={{ width: '100%' }} />
  ) : hero.shot ? (
    <SheetImg shot={{ src: hero.shot.src, alt: hero.shot.alt, aspect: hero.shot.aspect }} priority />
  ) : null

  const opener =
    openerMedia &&
    (showcase?.copy ? (
      <CurvedCard
        media={openerMedia}
        copy={<CurvedCopy heading={showcase.copy.heading} body={showcase.copy.body} />}
        side={facts.length > 0 ? <CurvedFacts facts={facts} /> : undefined}
      />
    ) : (
      <CurvedMedia>{openerMedia}</CurvedMedia>
    ))

  return (
    <div style={accentTheme(landing.accent)}>
      <SheetPage>
        <SheetIntro
          icon={sheet?.icon}
          // The leaf mark's 23 squares at 2px each.
          iconSize={46}
          title={project.title}
          helper={landing.eyebrow}
          description={hero.body ?? [project.summary]}
          links={links}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        >
          {swaps && <MockThemeSwitch />}
        </SheetIntro>
        <Swap.Provider value={swap}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
            {opener}
            {groupSections(landing.sections).map((group, i) =>
              // With no opener the first block is the hero, which is there from the start. A
              // cluster springs its cards in one by one itself.
              (!opener && i === 0) || isCluster(group) ? (
                <Block key={i} group={group} />
              ) : (
                <Reveal key={i}>
                  <Block group={group} />
                </Reveal>
              ),
            )}
          </div>
        </Swap.Provider>
      </SheetPage>
    </div>
  )
}
