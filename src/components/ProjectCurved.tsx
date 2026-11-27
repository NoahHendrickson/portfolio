import { type ComponentProps, type ReactNode } from 'react'
import SidebarPlayground from './No3ySidebar'
import ArtGallery from './ArtGallery'
import { CurvedCard, CurvedCluster, CurvedCopy, CurvedFacts, CurvedMedia, CurvedPanel, CurvedSteps } from './Curved'
import CompareSlider from './CompareSlider'
import HeroVideo from './HeroVideo'
import No3yDesignSystem from './No3yDesignSystem'
import No3yDesignSystemStory from './No3yDesignSystemStory'
import { ComposerShowcase, ParallelWorkflowCard, PhoneShowcase, type ComposerStateItem, type PhoneScreen, type WorkflowFeature } from './No3yStoryExtras'
import Reveal from './Reveal'
import { SheetClip, SheetImg, SheetIntro, SheetPage } from './Sheet'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useNo3yPrototype } from '../hooks/useNo3yPrototype'
import { CURVED_BODY_SIZE, CURVED_INNER, LEADING, TEXT_SOFT, accentTheme, curvedInset, sheetGap } from '../sheetStyle'
import type { LandingShot, Project, StorySection } from '../data/projects'

/*
  no3y Code's mockups are Flat Glass only (Nov 26 2026). The page used to switch every mockup
  between Basic, Glass and Inlet Black with a floating pill (`MockThemeSwitch`, the `SWAPS` lists in
  `no3yBasic.ts` / `no3yInlet.ts`, `SwapClip`); the user simplified it away, keeping the three themes
  only on the design-system chapter's slider. Those files are gone; the Basic and Inlet media stay in
  `public/work/no3y-basic/` and `public/work/no3y-inlet/`.
*/

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
  return <SheetImg shot={{ src: shot.src, alt: shot.alt, aspect: shot.aspect }} />
}

function Clip({ video, priority = false }: { video: Parameters<typeof SheetClip>[0]['video']; priority?: boolean }) {
  return <SheetClip video={video} priority={priority} />
}

function Img({ shot, priority = false }: { shot: Parameters<typeof SheetImg>[0]['shot']; priority?: boolean }) {
  return <SheetImg shot={shot} priority={priority} />
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
  // A card's own fill can be held to one mockup theme (Petals' green was Inlet's); the page is Glass now.
  const tone = section.card && (!section.card.only || section.card.only === 'glass') ? section.card : undefined
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

/** Prototype B's hero (Nov 22 2026): the new agent screen on Flat Glass (3D off), retaken Nov 25 2026 off custom a4881c2dce for the launchpad's new rows (the project now picked from the composer's chip), the composer empty on its placeholder and the draft unassigned (UNASSIGNED=1, a capture-only switch: the app's New agent now starts on No project), in Cinnabar Sans; before that off custom 0456ab91b4 in Cinnabar Sans, the fork's default interface font since #492 (Interface 15px, Sidebar font size 14px, the dev house look's; retaken Nov 24 2026 evening, after an Inter take off 3bb4547bd1 that morning; first taken off 84afbb479a),
    in the user's own names (the seed's SEED_PERSONAL=1: their projects' titles and icons, thread titles
    and Petals, D2 Conflux bot completed, Job hunt idle, Gym bro working),
    with the Petals in the sidebar's grid, compact cards, threads by status, the bead ring and the same
    typed prompt, no project picked so the launchpad shows its project picker beside "Start something
    new" (LUMEN_GIT=1, no PICK), on the Jolly Petal background, the window standing on the same piece
    mirrored. The sidebar is AppKit's Liquid Glass sidebar (an NSGlassEffectView), which shows what's
    behind the window only while the window is active (a background window's goes to a flat fill), so
    the capture app is brought forward for the shots (System Events, its keyboard locked out). The
    sidebar's tint comes from the desktop picture, and only a whole-display capture (`screencapture -D`)
    records it: window (-l) and screen-area (-R) captures both drop it to the flat fill, so the display
    is captured and cropped to the window. Its tint is the user's Jolly Petal 6 wallpaper behind it. Flat Glass's sidebar, composer and launchpad glass and the screen's Jolly
    Petal are macOS's own (NSGlassEffectView behind Chromium), which a CDP capture can't see, so the
    window is taken three ways from one staged state (inlet/takes/hero-flat-capture.mjs, the capture app
    launched with T3CODE_SHOWCASE_SIZE=1300x834 and T3CODE_SHOWCASE_FLAG, which shows the window only for
    each capture): the real window through `screencapture -l` (2x, Display P3), the same with the page
    hidden (the native layers alone), and the page alone at 4x over CDP. hero/hero-flat-float.mjs smooths
    the native glass in float where it's already smooth (the capture's 1-level steps contoured), upscales
    it, lays the 4x page over it in P3 as macOS composites it, converts to sRGB, paints the traffic lights
    (a background window's are grey) and dithers once per size; at 2x it matches the real window to a
    mean 0.75 of 255. Running screencapture needs Screen Recording for the app this session runs in.

    Before it (Nov 20 2026): the new agent screen in Glass with lumen picked from its launchpad
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
  src: '/work/no3y-code/hero-flat-solo.webp',
  srcSet: '/work/no3y-code/hero-flat-solo-1280.webp 1280w, /work/no3y-code/hero-flat-solo-1920.webp 1920w, /work/no3y-code/hero-flat-solo.webp 2560w, /work/no3y-code/hero-flat-solo-3840.webp 3840w',
  alt: 'The new agent screen in no3y Code on the Flat Glass theme: the sidebar with three Petals in a grid (D2 Conflux bot with a new report, Job hunt idle, Gym bro working) and threads grouped by status in compact cards, and the empty glass composer reading "Choose a project to start a thread", with Choose a project on its project chip, over a card of suggestions to start something new as rows (fix checks on #401, address review on #214, review #109, review 1 open PR), on the Jolly Petal background, the window standing on the same piece mirrored',
  aspect: '16 / 9',
}

/** A composer close-up's srcSet: its 1020 and 1360 cuts and the 2040 (3x) bake, drawn 680 wide. */
const composerCuts = (name: string) =>
  `/work/no3y-code/composer/${name}-1020.webp 1020w, /work/no3y-code/composer/${name}-1360.webp 1360w, /work/no3y-code/composer/${name}.webp 2040w`
const composerShot = (name: string, alt: string, height: number) => ({
  src: `/work/no3y-code/composer/${name}.webp`,
  srcSet: composerCuts(name),
  alt,
  aspect: `680 / ${height}`,
})

/** The "Inside the composer" close-ups, laid out as a grid (`ComposerShowcase`). All seven retaken
    Nov 25 2026 off custom 94a057ca34 in the app's Cinnabar font, each with the usage ring at the
    composer's bottom right, and a new one with its menu open: the offline capture app has no live
    limits, so the scenes carry made-up ones for Claude, Codex and Antigravity (`usage` in the mock
    studio's scenes, shown through a capture-only stand-in). The model picker is #506's era (no
    provider labels) and dictation #506's white capsule. Retaken Nov 24 2026
    off custom d01b458341 with the updated colours: the composer whole at a thin 590 (the window at
    680, sidebar collapsed), shot at 4x on Flat Glass in Inter 15px with the conversation above it
    hidden, each cropped plain to its own content on the app's panel (no backdrop). The mock studio's
    scenes `composer` and `composer-queue` take them (`~/.t3-fork/scratch/no3y-capture/mock/`).
    Usage gave way to background work: the capture profile has no live usage limits. Every theme
    shows these (no Basic or Inlet versions). The first set (the same morning, off d0a25f8702) stood
    on a Jolly Petal band and shared one height for a cross-fade. */
const NO3Y_COMPOSER = {
  background: composerShot(
    'background-tasks',
    'The composer with its background work popover open over the chips: a dev server (vp dev --filter=@acme/web) and a watch on pull request #401, beside the green #401 pill and the Monitoring pill, over the empty composer on chore/bundle-audit with Opus 5.5 High and the usage ring',
    303,
  ),
  model: composerShot(
    'model',
    'The model menu open over the composer: provider tabs with Claude selected, a model search, then Fable 5.2, Opus 5.5 checked with its reasoning at High in its row, Sonnet 5.5 and Haiku 5.5, and ten legacy models folded away',
    342,
  ),
  usage: composerShot(
    'usage',
    'The usage menu open from the ring at the composer’s bottom right: Codex with 78% of its session and 53% of its week left, Claude with 66% of its session, 42% of its week and 59% of its Fable week left, each with when it resets, and Antigravity folded to one row at 38%',
    403,
  ),
  queue: composerShot(
    'queue',
    'A follow-up queued above the composer while the agent works: "once it\'s green, split out the stripe step" in the Queued card, with promote, edit, stash and remove buttons, under the green #412 pill and a "2 subagents" pill',
    258,
  ),
  question: composerShot(
    'question',
    'An agent question in place of the composer: fix just the test, or the store too, with two options, a Submit button and a field for your own answer, on fix/cart-hydration-test',
    437,
  ),
  pullRequests: composerShot(
    'pr-pills',
    'The composer’s pull request pill in its four states: open #412 in green, draft #431 in grey, merged #186 in purple and closed #395 in red',
    166,
  ),
  dictation: composerShot(
    'dictation',
    'The composer while dictating: a white capsule with a live level meter and a blue check to finish, beside a close button, under the green #409 pill and a Babysit PR pill',
    170,
  ),
}

/** The iPhone app (Nov 26 2026), off a simulator build of the capture checkout (custom 25984b41b7)
    paired to the offline mock studio's server, scene `ios-thread`: lumen's working checkout thread
    with its #412 pill, two subagents and a queued follow-up, then a recording of the model picker
    (Opus 5.5 picked, its effort raised to High; `ios/model-take.sh` in the capture folder), which
    replaced the picker's and the slider's stills the same day. Files in `public/work/no3y-code/ios/`. */
const IOS_DIR = '/work/no3y-code/ios'
const phone = (id: string, label: string, caption: string, alt: string): PhoneScreen => ({
  id,
  label,
  caption,
  alt,
  src: `${IOS_DIR}/${id}.webp`,
  srcHalf: `${IOS_DIR}/${id}-603.webp`,
})
const NO3Y_IOS: PhoneScreen[] = [
  phone(
    'thread',
    'A thread in flight',
    'The pull request and the subagents sit over the composer, and a follow-up waits its turn in the queue.',
    'The iPhone app in the Migrate checkout to server actions thread: the agent working on the checkout suite, the green #412 pill and a 2 subagents pill over the composer, and a Queued card holding "once it\'s green, split out the stripe step", with Fable 5.1 High and a stop button in the composer',
  ),
  {
    ...phone(
      'model-picker',
      'Model & reasoning',
      'Pick from your favorite models, then set the effort right in the model’s row.',
      'The model sheet rising over the thread from the composer’s Fable 5.1 High chip: Opus 5.5 picked from the favorites, its effort chip turned into a slider and moved from Medium to High, saved, and the sheet closed, the composer now reading Opus 5.5 High',
    ),
    video: {
      src: `${IOS_DIR}/model-picker.mp4`,
      hevc: `${IOS_DIR}/model-picker-hevc.mp4`,
      poster: `${IOS_DIR}/model-picker-poster.jpg`,
      alt: 'The model sheet rising over the thread from the composer’s Fable 5.1 High chip: Opus 5.5 picked from the favorites, its effort chip turned into a slider and moved from Medium to High, saved, and the sheet closed, the composer now reading Opus 5.5 High',
      aspect: '804 / 1748',
    },
  },
]

/** Prototype B's cohesive story layout for `/work/no3y-code`, reusing the page's existing media and copy. */
function No3yStorySections({ sections, compare }: { sections: StorySection[]; compare?: ComponentProps<typeof CompareSlider> }) {
  const features = sections.filter((s): s is Extract<StorySection, { kind: 'feature' }> => s.kind === 'feature')
  const byHeading = (heading: string) => features.find((s) => s.heading === heading)
  const grid = sections.find((s): s is Extract<StorySection, { kind: 'grid' }> => s.kind === 'grid')

  const petals = byHeading('Petals')
  const sidebar = byHeading('Customize your sidebar')
  const focus = byHeading('Focus mode')
  const split = byHeading('Quickly start a new agent in the same branch or worktree')
  const scheduled = byHeading('Scheduled tasks')
  const designMode = byHeading('Design mode')

  // Screenshots, not clips (Nov 19 2026): each clip's end state as a still, Flat Glass (the Basic and
  // Inlet versions went with the page's theme switch, Nov 26 2026). Focus mode left the grid
  // on Nov 24 2026 for its own card with the drag-to-split clip (above the grid).
  // Split agent left the grid on Nov 25 2026 for its own card with the split-drop clip (above it).
  // Since Nov 27 2026 Focus mode and Split agent are back in the bento, laid out like Scheduled tasks
  // (the user's ask): each its clip wide on the left with its copy beside it, Focus mode, then Split agent,
  // then Scheduled, in place of their own cards, each in a bento of its own.
  const workflowFeatures: WorkflowFeature[] = []
  for (const [id, section] of [['focus', focus], ['split', split], ['scheduled', scheduled]] as const) {
    if (!section || !(section.video || section.shot)) continue
    // Scheduled is a clip since Nov 26 2026 (the scheduled-drop feature drop); a still still works.
    const media = section.video ? <Clip video={section.video} /> : <Shot shot={section.shot!} />
    workflowFeatures.push({ id, heading: section.heading, body: section.body ?? '', media, wide: true })
  }

  // The composer close-ups (NO3Y_COMPOSER) stand in for the grid's Glass composer tiles, which the
  // older cluster layout still uses. Two to a row in related pairs (Nov 25 2026): work in flight, the two
  // menus, then the tall question beside pull requests over dictation.
  const composerStates: ComposerStateItem[] = grid
    ? [
        {
          id: 'background',
          label: 'Background work',
          caption: 'Dev servers and pull request watches keep running after a turn, one pill away.',
          media: <Img shot={NO3Y_COMPOSER.background} />,
        },
        {
          id: 'queue',
          label: 'Queue & steer',
          caption: 'Line up your next thought while the agent and its subagents work. Edit it, drop it, or steer mid-turn.',
          media: <Img shot={NO3Y_COMPOSER.queue} />,
        },
        {
          id: 'model',
          label: 'Model & reasoning',
          caption: 'Provider tabs, searchable models, and each model’s reasoning effort right in its row.',
          media: <Img shot={NO3Y_COMPOSER.model} />,
        },
        {
          id: 'usage',
          label: 'Usage limits',
          caption: 'The ring in the corner shows how much of your session is left. Open it for every provider’s limits and when they reset.',
          media: <Img shot={NO3Y_COMPOSER.usage} />,
        },
        {
          id: 'question',
          label: 'Agent questions',
          caption: 'Clarifying prompts replace the composer with quick picks and a custom fallback.',
          media: <Img shot={NO3Y_COMPOSER.question} />,
          tall: true,
        },
        {
          id: 'pull-requests',
          label: 'Pull requests',
          caption: 'The thread’s PR sits on the composer, from draft to open, merged or closed.',
          media: <Img shot={NO3Y_COMPOSER.pullRequests} />,
        },
        {
          id: 'dictation',
          label: 'Local dictation',
          caption: 'Built-in speech-to-text with a live level meter right inside the input bar.',
          media: <Img shot={NO3Y_COMPOSER.dictation} />,
        },
      ]
    : []

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
      {/* Each its own bento, like Scheduled tasks: in one bento the three copy cells merged into one tall
          column, and it read unclear which copy went with which clip. */}
      {workflowFeatures.map((feature) => (
        <Reveal key={feature.id}>
          <ParallelWorkflowCard features={[feature]} />
        </Reveal>
      ))}
      {composerStates.length > 0 && (
        <Reveal>
          <ComposerShowcase states={composerStates} />
        </Reveal>
      )}
      <Reveal>
        <PhoneShowcase screens={NO3Y_IOS} />
      </Reveal>
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
          lockup={sheet?.lockup}
          title={project.title}
          helper={landing.eyebrow}
          description={hero.body ?? [project.summary]}
          links={links}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />
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
      </SheetPage>
    </div>
  )
}
