import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'
import SidebarPlayground from './No3ySidebar'
import ArtGallery from './ArtGallery'
import { CurvedCard, CurvedCluster, CurvedCopy, CurvedFacts, CurvedMedia, CurvedPanel, CurvedSteps } from './Curved'
import CompareSlider from './CompareSlider'
import HeroVideo from './HeroVideo'
import MockThemeSwitch from './MockThemeSwitch'
import No3yDesignSystem from './No3yDesignSystem'
import No3yDesignSystemStory from './No3yDesignSystemStory'
import { ComposerShowcase, ParallelWorkflowCard, type ComposerStateItem, type WorkflowFeature } from './No3yStoryExtras'
import Reveal from './Reveal'
import SwapClip from './SwapClip'
import { SheetClip, SheetImg, SheetIntro, SheetPage } from './Sheet'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useNo3yPrototype } from '../hooks/useNo3yPrototype'
import { CURVED_BODY_SIZE, CURVED_INNER, LEADING, TEXT_SOFT, accentTheme, curvedInset, sheetGap } from '../sheetStyle'
import type { LandingShot, Project, StorySection } from '../data/projects'
import { NO3Y_BASIC } from '../data/no3yBasic'
import { NO3Y_INLET, type InletMedia } from '../data/no3yInlet'
import { MOCK_THEMES, useMockTheme, type MockTheme } from '../mockTheme'

/*
  no3y Code's mockups come in themes (Nov 14 2026): Glass, as the page was built, Inlet Black,
  and since Nov 16 2026 Basic (Neutral Dark). `Swap` resolves each mockup to its version in each
  theme it has, and `Themed` shows whichever the switch says; a theme with no version yet shows
  the Glass one. Other projects have no swaps.
*/
const SWAPS: Record<string, Partial<Record<MockTheme, Record<string, InletMedia>>>> = { 'no3y-code': { basic: NO3Y_BASIC, inlet: NO3Y_INLET } }
type Versions<T> = { glass: T } & Partial<Record<MockTheme, T>>
type Resolve = <T extends { src: string }>(media: T) => Versions<T>
const Swap = createContext<Resolve>((media) => ({ glass: media }))

function Themed<T extends { src: string }>({ media, render }: { media: T; render: (media: T) => ReactNode }) {
  const theme = useMockTheme()
  const versions = useContext(Swap)(media)
  return <>{render(versions[theme] ?? versions.glass)}</>
}

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
  return <Themed media={shot} render={(s) => <SheetImg key={s.src} shot={{ src: s.src, alt: s.alt, aspect: s.aspect }} />} />
}

/**
 * A clip in every version the switch can pick, the picked one showing (`SwapClip`: the others
 * play along unseen, so a switch is instant and carries on from the same moment).
 */
function Clip({ video, priority = false }: { video: Parameters<typeof SheetClip>[0]['video']; priority?: boolean }) {
  const theme = useMockTheme()
  const versions = useContext(Swap)(video)
  const videos = MOCK_THEMES.map((t) => versions[t]).filter((v, i, all): v is typeof video => !!v && all.findIndex((w) => w?.src === v.src) === i)
  return <SwapClip videos={videos} active={(versions[theme] ?? versions.glass).src} priority={priority} />
}

/** A still passed through as-is (the grid tiles), or its other theme's. */
function Img({ shot, priority = false }: { shot: Parameters<typeof SheetImg>[0]['shot']; priority?: boolean }) {
  return <Themed media={shot} render={(s) => <SheetImg key={s.src} shot={s} priority={priority} />} />
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

  if (section.kind === 'designSystem') return <No3yDesignSystem />

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

const NO3Y_STORY_OPENER_BODY = [
  'As I moved into using LLMs and agentic coding tools more and more for design work, I wanted to design my own. I forked an open source project I really liked but couldn’t stand to look at, around a few pillars I wanted to push.',
  'First, how I actually work as a designer: I wanted more context at a glance across threads—project, model, worktree—though as models got better I abstracted a lot of that away into long-running bots. I also have multiple edits in my head at once instead of waiting turn by turn, and sometimes I still want the precision of Figma’s editor.',
  'The other pillar was the UI and system itself. I wanted to embrace liquid glass with a touch of old-school iOS nostalgia, explore multiple themes and a real component library on the fly with agents, and sweat the everyday micro-UX—usage limits, customizing the sidebar, local dictation, and more.',
]

/** Prototype B's hero (Nov 20 2026): the new agent screen in Glass with lumen picked from its launchpad
    (the launchpad's project list and suggestions before the pick were the first take), on its Jolly
    Petal background, 3D on
    "Selected items only", the bead ring, compact cards and threads by status, the whole window on the
    user's Jolly Petal piece (~/Noey Brand/jolly-petal-6-2-3456x2234.png) mirrored, its glass blended over
    a frost baked from that same piece (blur 48, saturate 1.35, brightness .55, as bake.mjs does).
    Built off custom 8a1c055a30 plus the user's uncommitted dev-only showcase PRs in DraftLaunchpad.tsx
    (applied to the scratch worktree from their dev checkout, ../devapp-uncommitted.patch).
    Capture: inlet/takes/hero-capture.mjs LUMEN_GIT=1 TYPE="Do an audit of our Storybook and Figma
    and look for any discrepancies" ONLY=glass PICK=lumen GLASS_BACKDROP=jollyPetal
    HERO_NAME=glass-launchpad-lumen (LUMEN_GIT gives lumen the dev home's git story, hero/lumen-git-state.mjs,
    so "Start something new" lists its git suggestions; run it with --reset afterwards; TYPE types the
    prompt, unsent, behind the send-blocking puppet, then steps to another thread and back so the
    sidebar's draft card takes the prompt as its title, as it does in the app once you click away); compose: SRC=glass-launchpad-lumen.png BACKDROP=<that png> FLIP=1 WIN_W=1940 SHADOW=deep
    hero/hero-glass-solo.mjs (the window a touch smaller than the 2070 it filled, on a heavier drop) (both in ~/.t3-fork/scratch/no3y-capture/).
    The Basic version (basic-launchpad.png through hero-basic-solo.mjs glass, hero-basic-solo*.webp)
    came first the same day. Tried Nov 19 and dropped: the Dither backdrop on the screen, white, the
    Cool fade, a flat sky blue and the user's Dither Studio piece behind it (over white, then dark), a
    window running off the frame's foot, the opener wider than the column, and the bare window
    floating on the page. */
const NO3Y_STORY_HERO = {
  src: '/work/no3y-code/hero-glass-solo.webp',
  srcSet: '/work/no3y-code/hero-glass-solo-1280.webp 1280w, /work/no3y-code/hero-glass-solo-1920.webp 1920w, /work/no3y-code/hero-glass-solo.webp 2560w, /work/no3y-code/hero-glass-solo-3840.webp 3840w',
  alt: 'The new agent screen in no3y Code on the Glass theme: the frosted sidebar with three Petals and threads grouped by status, the draft titled with the typed prompt, and the composer on the lumen project\'s feat/pricing-v2 branch with "Do an audit of our Storybook and Figma and look for any discrepancies" typed in, over suggestions to commit 3 changed files, pull 2 new commits and open a pull request, on the Jolly Petal background, the window standing on the same piece mirrored',
  aspect: '16 / 9',
}

/** Prototype B's cohesive story layout for `/work/no3y-code`, reusing the page's existing media and copy. */
function No3yStorySections({ sections, compare }: { sections: StorySection[]; compare?: ComponentProps<typeof CompareSlider> }) {
  const features = sections.filter((s): s is Extract<StorySection, { kind: 'feature' }> => s.kind === 'feature')
  const byHeading = (heading: string) => features.find((s) => s.heading === heading)
  const grid = sections.find((s): s is Extract<StorySection, { kind: 'grid' }> => s.kind === 'grid')
  const shotBy = (suffix: string) => grid?.shots.find((shot) => shot.src.endsWith(suffix))

  const petals = byHeading('Petals')
  const sidebar = byHeading('Customize your sidebar')
  const focus = byHeading('Focus mode')
  const split = byHeading('Quickly start a new agent in the same branch or worktree')
  const scheduled = byHeading('Scheduled tasks')
  const designMode = byHeading('Design mode')

  // Screenshots, not clips (Nov 19 2026): each clip's end state as a still, in every theme
  // (`no3yInlet.ts` / `no3yBasic.ts` hold the Inlet and Basic versions).
  const workflowFeatures: WorkflowFeature[] = []
  if (focus) {
    workflowFeatures.push({
      id: 'focus',
      heading: focus.heading,
      body: focus.body ?? '',
      media: (
        <Shot
          shot={{
            src: '/work/no3y-code/focus-mode-still.jpg',
            alt: 'Focus mode in no3y Code on the Glass theme: the sidebar collapsed into a row of thread tabs, and two threads split side by side, the second asking a question',
            aspect: '16 / 9',
          }}
        />
      ),
    })
  }
  if (split) {
    workflowFeatures.push({
      id: 'split',
      heading: split.heading,
      body: split.body ?? '',
      media: (
        <Shot
          shot={{
            src: '/work/no3y-code/split-agent-still.jpg',
            alt: 'Split agent in no3y Code on the Glass theme: the pricing cards thread still working beside a second agent on the same branch that added a savings badge, the sidebar pairing the two on one row',
            aspect: '16 / 9',
          }}
        />
      ),
    })
  }
  if (scheduled?.shot) {
    workflowFeatures.push({ id: 'scheduled', heading: scheduled.heading, body: scheduled.body ?? '', media: <Shot shot={scheduled.shot} />, wide: true })
  }

  const usageShot = shotBy('/usage.webp')
  const modelShot = shotBy('/model.webp')
  const queueShot = shotBy('/queue.webp')
  const questionShot = shotBy('/question.webp')
  const dictationShot = shotBy('/dictation-wide.webp')

  const composerStates: ComposerStateItem[] = []
  if (usageShot) {
    composerStates.push({
      id: 'usage',
      label: 'Usage limits',
      caption: 'Session and weekly quotas for Codex and Claude right off the composer’s meter.',
      media: <Img shot={usageShot} />,
    })
  }
  if (modelShot) {
    composerStates.push({
      id: 'model',
      label: 'Model & reasoning',
      caption: 'A provider rail, searchable models, a reasoning effort slider, and an Ultracode toggle.',
      media: <Img shot={modelShot} />,
    })
  }
  if (queueShot) {
    composerStates.push({
      id: 'queue',
      label: 'Queue & steer',
      caption: 'Line up your next thought while the agent works—edit it, drop it, or steer mid-turn.',
      media: <Img shot={queueShot} />,
    })
  }
  if (questionShot) {
    composerStates.push({
      id: 'question',
      label: 'Agent questions',
      caption: 'Clarifying prompts replace the composer with quick picks and a custom fallback.',
      media: <Img shot={questionShot} />,
    })
  }

  return (
    <>
      {petals && (
        <Reveal>
          <OwnSection section={petals} />
        </Reveal>
      )}
      <Reveal>
        <No3yDesignSystemStory compare={compare} />
      </Reveal>
      {sidebar && (
        <Reveal>
          <OwnSection section={sidebar} />
        </Reveal>
      )}
      {workflowFeatures.length > 0 && (
        <Reveal>
          <ParallelWorkflowCard features={workflowFeatures} />
        </Reveal>
      )}
      {composerStates.length > 0 && (
        <Reveal>
          <ComposerShowcase
            states={composerStates}
            dictation={
              dictationShot
                ? {
                    media: <Img shot={dictationShot} />,
                    caption: 'Built-in speech-to-text with a live level timeline right inside the input bar.',
                  }
                : undefined
            }
          />
        </Reveal>
      )}
      {designMode && (
        <Reveal>
          <OwnSection section={designMode} />
        </Reveal>
      )}
    </>
  )
}

export default function ProjectCurved({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const no3yPrototype = useNo3yPrototype()
  const landing = project.landing
  if (!landing) return null
  const isNo3yStory = project.slug === 'no3y-code' && no3yPrototype === 'story'
  const { sheet, showcase, hero } = landing
  const facts = sheet?.facts ?? []
  const links = [...(hero.cta ? [{ label: hero.cta.label, href: hero.cta.href }] : []), ...(hero.links ?? [])]
  const swaps = SWAPS[project.slug]
  const resolve: Resolve = (media) => {
    const versions: Versions<typeof media> = { glass: media }
    for (const theme of MOCK_THEMES) {
      const other = theme === 'glass' ? undefined : swaps?.[theme]?.[media.src]
      // A theme's clip takes only its own HEVC (Nov 20 2026): spread over the Glass one, it would
      // otherwise inherit Glass's `hevc` and play the Glass video wherever HEVC is supported.
      if (other) versions[theme] = { ...media, ...other, ...('hevc' in media ? { hevc: other.hevc } : {}) }
    }
    return versions
  }

  const openerMedia = isNo3yStory ? (
    // Prototype B (Nov 19 2026): one Basic still, the theme slider having moved to the design-system
    // section. Basic is the fork's default, so it isn't switched with the page's theme pill.
    <img
      src={NO3Y_STORY_HERO.src}
      srcSet={NO3Y_STORY_HERO.srcSet}
      // Eager, so the browser can't size it by its box: the column's width (CURVED_MAX's 1280 cap).
      sizes="(max-width: 900px) 100vw, 1280px"
      alt={NO3Y_STORY_HERO.alt}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: NO3Y_STORY_HERO.aspect }}
    />
  ) : showcase ? (
    <>
      {/* The hero isn't switched: it shows every theme on dividers of its own. */}
      {showcase.compare && (
        <CompareSlider layers={showcase.compare.layers} alt={showcase.compare.alt} aspect={showcase.compare.aspect} priority />
      )}
      {showcase.video && !showcase.compare && <Clip video={showcase.video} priority />}
      {showcase.shot && <Img shot={showcase.shot} priority />}
    </>
  ) : hero.video ? (
    <HeroVideo video={hero.video} maxWidth={hero.shotWidth ?? 1272} radius="0px" style={{ width: '100%' }} />
  ) : hero.shot ? (
    <SheetImg shot={{ src: hero.shot.src, alt: hero.shot.alt, aspect: hero.shot.aspect }} priority />
  ) : null

  const openerCard =
    openerMedia &&
    (showcase?.copy ? (
      <CurvedCard
        media={openerMedia}
        copy={
          <CurvedCopy
            heading={showcase.copy.heading}
            body={isNo3yStory ? NO3Y_STORY_OPENER_BODY : showcase.copy.body}
          />
        }
        side={facts.length > 0 ? <CurvedFacts facts={facts} /> : undefined}
      />
    ) : (
      <CurvedMedia>{openerMedia}</CurvedMedia>
    ))
  // Prototype B's opener sits on the column like the rest of the page (it ran wider, to 1320 and then
  // 75% of the window, which read far too big).
  const opener = openerCard

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
          after={swaps && <MockThemeSwitch />}
        />
        <Swap.Provider value={resolve}>
          <div key={isNo3yStory ? 'story' : 'current'} style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
            {opener}
            {isNo3yStory ? (
              <No3yStorySections sections={landing.sections} compare={showcase?.compare} />
            ) : (
              groupSections(landing.sections).map((group, i) =>
                // With no opener the first block is the hero, which is there from the start. A
                // cluster springs its cards in one by one itself.
                (!opener && i === 0) || isCluster(group) ? (
                  <Block key={i} group={group} />
                ) : (
                  <Reveal key={i}>
                    <Block group={group} />
                  </Reveal>
                ),
              )
            )}
          </div>
        </Swap.Provider>
      </SheetPage>
    </div>
  )
}
