import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  DotsThreeVertical,
  Plus,
  SlidersHorizontal,
  X,
} from '@phosphor-icons/react'
import AppLink from '../AppLink'
import { projects, STAT_BUILDER_SITE } from '../data/projects'
import { resolvePalette, type ButtonVariant } from '../design-system/buttonStyles'
import { control, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { PROJECT_MOBILE_PAD, shellPad } from '../layout'
import './D2Conflux.css'

/*
  `/work/stat-builder`, hand-built like the Invisible studies but dressed in the app's
  own skin instead of the site's (D2Conflux.css). Every capture is the live app signed
  in with real gear, taken in October 2026 on the Slate theme in a 2560 × 1440 window (a
  27" monitor) at 2×; the close-ups are single panels cut from the same session, with the
  panel's own 1px edge trimmed off so the frame here is the only border.
*/

const project = projects['stat-builder']
const GITHUB = 'https://github.com/NoahHendrickson/d2-stat-builder'
const ASSET = '/work/stat-builder/conflux'

const THEMES = [
  {
    id: 'slate',
    label: 'Slate',
    src: `${ASSET}/loadouts.jpg`,
    alt: 'Saved loadouts on the Slate theme: a blue-grey gradient behind square panels',
  },
  {
    id: 'scene',
    label: 'Scene',
    src: `${ASSET}/theme-scene.jpg`,
    alt: 'Saved loadouts on the Scene theme: frosted panes over blurred in-game key art',
  },
  {
    id: 'normal',
    label: 'Normal',
    src: `${ASSET}/theme-normal.jpg`,
    alt: 'Saved loadouts on the Normal theme: a flat dark page with rounded cards and solid borders',
  },
] as const

export default function D2Conflux() {
  const isMobile = useIsMobile()
  const style = { '--cfx-pad': isMobile ? PROJECT_MOBILE_PAD : shellPad() } as CSSProperties

  return (
    <div className="cfx" style={style}>
      <header className="cfx-bar">
        <div className="cfx-shell cfx-bar-row">
          <PillLink href="/work" aria-label="Back to work">
            <ArrowLeft size={16} aria-hidden />
            Back
          </PillLink>
          <div className="cfx-brand">
            <img src={`${ASSET}/site-icon.svg`} alt="" />
            {project.title}
          </div>
          {/* Wrapped: the pill's inline display would beat the class that hides it on phones. */}
          <span className="cfx-bar-open">
            <PillLink href={STAT_BUILDER_SITE} variant="primary" external>
              Open the app
              <ArrowSquareOut size={16} aria-hidden />
            </PillLink>
          </span>
        </div>
      </header>

      <main className="cfx-shell">
        <Hero />

        <Shot
          src={`${ASSET}/optimizer.jpg`}
          browser={{ path: '/', title: 'Optimizer' }}
          alt="The stat optimizer: Warlock picked, Health, Grenade and Class targets set, Getaway Artist as the exotic, and the top build opened to its armor, mods, tuning and masterwork cost"
          width={3200}
          height={1800}
          eager
        />

        <Section n="01" label="Stat optimizer">
          <Intro heading="Set the stats you want">
            <div className="cfx-copy">
              <p className="cfx-body">
                Build-crafting at the top end is a genuinely messy problem. Six stats, an exotic, set
                bonuses, tuning, fragments, and a vault full of armor, all pulling against each other.
                Most players know roughly what they want and not much more. The optimizer's whole job is
                to take that fuzzy, complicated ask and turn it into a few sliders and picks anyone can
                use.
              </p>
              <p className="cfx-body">
                From there it works three ways. Build with the armor you already have. Find out which
                pieces you'd need to farm for a build you can't make yet. Or switch to Theoretical Builds
                and plan around armor you don't own at all, so you know exactly what to go chase.
              </p>
            </div>
          </Intro>
          <Shot
            src={`${ASSET}/optimizer-columns.jpg`}
            stage="Stat optimizer"
            fade
            alt="The optimizer's two columns: class nameplates, the six stat targets with Health 70, Grenade 150 and Class 100 set, major mods and the exotic grid with Getaway Artist picked on the left; the Builds and Theoretical Builds tabs and ranked build cards on the right, the top one open to its armor, mods, tuning and masterwork cost"
            width={2856}
            height={2400}
          />
        </Section>

        <Section n="02" label="Dream build">
          <Intro heading="Find out what to farm">
            <p className="cfx-body">
              Here is a quick video showing a build with stats you can reach with your current armor,
              then extending those stats to see what armor to farm to achieve them.
            </p>
          </Intro>
          <Browser path="/" title="Optimizer">
            <Clip
              src={`${ASSET}/dream-flow.mp4`}
              hevc={`${ASSET}/dream-flow-hevc.mp4`}
              poster={`${ASSET}/dream-flow-poster.jpg`}
              alt="Screen recording: picking Warlock and Getaway Artist, setting Health 70, Grenade 150 and Class 100, opening the top build, then in Dream build lowering Weapons and raising Super until it suggests replacing the helmet with a Demolitionist helmet"
              width={2560}
              height={1440}
            />
          </Browser>
        </Section>

        <Section n="03" label="Loadouts">
          <Intro heading="Save it, then equip it in one click">
            <p className="cfx-body">
              Any build saves as a loadout with its subclass, mods, weapons and artifact. Equip pulls
              every piece out of the vault, slots the mods and swaps the exotic. Activity sets write a
              whole group of loadouts into the game's own loadout slots at once.
            </p>
          </Intro>
          <Shot
            src={`${ASSET}/save-loadout.jpg`}
            browser={{ path: '/', title: 'Optimizer' }}
            alt="The Save loadout drawer over the optimizer: name and notes, weapon and artifact slots, the Prismatic Warlock subclass picker, and a mod grid for each of the five armor pieces"
            width={3200}
            height={1800}
          />
          <Shot
            src={`${ASSET}/loadouts.jpg`}
            browser={{ path: '/loadouts', title: 'Loadouts' }}
            alt="The Loadouts page: two activity sets with Save in-game buttons, a list of 27 loadout names, and saved loadouts as cards, each with its subclass, aspects and fragments, five armor pieces with their mods, stat totals and an Equip button"
            width={3200}
            height={1800}
          />
        </Section>

        <Section n="04" label="Items">
          <Intro heading="The vault, laid out like the game">
            <p className="cfx-body">
              Items puts each character beside the vault the way the in-game character screen does.
              Search with keywords, drag pieces between characters, and open anything to see its perks
              and stats.
            </p>
          </Intro>
          <div className="cfx-pair">
            <Shot
              src={`${ASSET}/items.jpg`}
              browser={{ path: '/manager', title: 'Items' }}
              alt="The Items page: the Warlock's nameplate and stats, subclass, equipped weapons and armor with spare pieces beside each slot, and the vault grouped by weapon type on the right"
              width={3200}
              height={1800}
            />
            <Shot
              src={`${ASSET}/item-popover.jpg`}
              stage="Item details"
              alt="An item popover for Chroma Rush, an Overload auto rifle at power 550: its perks, mods and full stat bars"
              width={596}
              height={1216}
            />
          </div>
        </Section>

        <Section n="05" label="Weapon search">
          <Intro heading="Find the roll">
            <p className="cfx-body">
              Every weapon in the game, filterable by trait, perk combo, barrel and magazine, or
              champion. Click perks to build a roll and the stat bars move with it. Hover any perk for
              community-tested numbers on what it really does.
            </p>
          </Intro>
          <div className="cfx-pair cfx-pair-2">
            <Shot
              src={`${ASSET}/weapon-search.jpg`}
              browser={{ path: '/weapons', title: 'Weapons' }}
              alt="Weapon search: the full catalog of 1,335 weapons as coloured nameplates by element, and Fatebringer (Timelost) open on the right with a roll picked from its perk grid"
              width={3200}
              height={1800}
            />
            <Shot
              src={`${ASSET}/weapon-perk.jpg`}
              stage="Perk tooltip"
              alt="Fatebringer's perk grid with a tooltip for Explosive Payload: Bungie's description, the enhanced version, and community-tested damage numbers"
              width={1312}
              height={1104}
            />
          </div>
        </Section>

        <Section n="06" label="Armor table">
          <Intro heading="Sort your armor">
            <p className="cfx-body">
              The in-game vault made it hard to search armor or see which pieces were worth chasing, so
              I went back to basics: a table with quick filters and custom sorting. The Searches column
              counts how often each piece made it into a build, which makes the ones that never do easy
              to clean out.
            </p>
          </Intro>
          <Shot
            src={`${ASSET}/armor-table.jpg`}
            browser={{ path: '/armor', title: 'Armor' }}
            alt="The armor table: 973 pieces with name, class, archetype, tertiary and tuned stats, set bonus, a Searches count, and the six stat columns, filters and Cleanup and Duplicates views along the top"
            width={3200}
            height={1800}
          />
        </Section>

        <Section n="07" label="Design">
          <Themes />
        </Section>

        <Section n="08" label="Community feedback">
          <Intro heading="Built for one very picky player, then shared">
            <p className="cfx-body">
              I made it for myself and posted it to a Destiny community. These are some of the messages
              that came back.
            </p>
          </Intro>
          <div className="cfx-wall">
            {project.landing?.feedback?.shots.map((shot) => (
              <figure key={shot.src} className="cfx-panel cfx-quote">
                <img src={shot.src} alt={shot.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </Section>

        <section className="cfx-panel cfx-ticks cfx-close" aria-label="Try it">
          <div className="cfx-copy">
            <p className="cfx-label">d2conflux.com</p>
            <h2 className="cfx-h2">Try it with your own vault</h2>
            <p className="cfx-body">Sign in with Bungie. It's free, and it works on your phone too.</p>
          </div>
          <div className="cfx-actions">
            <PillLink href={STAT_BUILDER_SITE} variant="primary" external>
              Open D2 Conflux
              <ArrowSquareOut size={16} aria-hidden />
            </PillLink>
            <PillLink href="/work">More of my work</PillLink>
          </div>
        </section>
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section className="cfx-hero">
      <div className="cfx-copy cfx-hero-copy">
        <div className="cfx-hero-meta">
          <p className="cfx-label">Side project</p>
          <p className="cfx-label">2026</p>
          <p className="cfx-label">Destiny 2</p>
        </div>
        <h1 className="cfx-h1">{project.title}</h1>
        <p className="cfx-lede">
          Serious Destiny 2 players end up with a bunch of tools open at once: one to optimize stats
          and plan builds, one to clean out their armor and free up vault space, one to look up weapon
          rolls, one to manage loadouts. D2 Conflux pulls all of that into one place. Hence the name.
        </p>
        <p className="cfx-body">
          It's built for power users and expert players, the people grinding the hardest stuff in the
          game. What they need is usually pretty complex, and sometimes pretty vague, so the whole
          thing is made to let them dig in as deep as they want.
        </p>
        <div className="cfx-actions">
          <PillLink href={STAT_BUILDER_SITE} variant="primary" external>
            Open D2 Conflux
            <ArrowSquareOut size={16} aria-hidden />
          </PillLink>
          <PillLink href={GITHUB} external>
            Source
            <ArrowSquareOut size={16} aria-hidden />
          </PillLink>
        </div>
      </div>
    </section>
  )
}

function Themes() {
  const [active, setActive] = useState<(typeof THEMES)[number]['id']>('slate')

  return (
    <>
      <div className="cfx-intro">
        <div className="cfx-copy">
          <h2 className="cfx-h2">Made to look like the game</h2>
          <div className="cfx-tabs" role="tablist" aria-label="Theme">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`cfx-theme-${t.id}`}
                aria-selected={active === t.id}
                aria-controls="cfx-theme-panel"
                className="cfx-tab"
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <p className="cfx-body">
          The UI borrows Destiny's own language: square panels, hairline frames, small tracked labels
          and the green Equip button. Settings offer three looks. Slate is the default, Scene frosts the
          panes over in-game key art, and Normal is a plain rounded UI for anyone who'd rather not.
        </p>
      </div>
      <div className="cfx-themes" id="cfx-theme-panel" role="tabpanel" aria-labelledby={`cfx-theme-${active}`}>
        {THEMES.map((t) => (
          <Browser key={t.id} path="/loadouts" title="Loadouts" data-on={active === t.id} aria-hidden={active !== t.id}>
            <img src={t.src} alt={t.alt} width={3200} height={1800} loading="lazy" />
          </Browser>
        ))}
      </div>
    </>
  )
}

function Section({ n, label, children }: { n: string; label: string; children: ReactNode }) {
  return (
    <section className="cfx-section" aria-label={label}>
      <p className="cfx-label cfx-rule">
        <span className="cfx-num">{n}</span>
        {label}
      </p>
      {children}
    </section>
  )
}

function Intro({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="cfx-intro">
      <h2 className="cfx-h2">{heading}</h2>
      {children}
    </div>
  )
}

function Shot({
  src,
  alt,
  width,
  height,
  eager = false,
  browser,
  stage,
  fade = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  eager?: boolean
  /** A full-window capture: framed in a browser window open on this route. */
  browser?: { path: string; title: string }
  /** A single panel cut from the app: set on its own stage, under this label. */
  stage?: string
  /** The capture runs on past its bottom edge, so it fades out into the stage. */
  fade?: boolean
}) {
  const img = <img src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} />
  if (browser) return <Browser {...browser}>{img}</Browser>
  const shot = <figure className="cfx-shot">{img}</figure>
  return stage ? (
    <Stage label={stage} fade={fade}>
      {shot}
    </Stage>
  ) : (
    shot
  )
}

/**
 * A close-up's ground: a tile of the app's own Slate backdrop, so a panel cut out of
 * the app sits on the surface it was designed for rather than floating on the page.
 * Rounded like the browser windows, so the two read as one set of plates.
 */
function Stage({ label, fade = false, children }: { label: string; fade?: boolean; children: ReactNode }) {
  return (
    <div className={fade ? 'cfx-stage cfx-stage-fade' : 'cfx-stage'}>
      <p className="cfx-label cfx-stage-label">{label}</p>
      <div className="cfx-stage-body">{children}</div>
    </div>
  )
}

/**
 * A dark Chrome window around a full-window capture, open on the app's own tab title
 * (`D2 Conflux - <page>`) and route, so the screenshots read as the live site.
 */
function Browser({
  path,
  title,
  children,
  ...rest
}: { path: string; title: string; children: ReactNode } & ComponentProps<'figure'>) {
  return (
    <figure className="cfx-browser" {...rest}>
      <div className="cfx-browser-chrome" aria-hidden>
        <div className="cfx-browser-tabs">
          <span className="cfx-browser-lights">
            <i />
            <i />
            <i />
          </span>
          <span className="cfx-browser-tab">
            <img src={`${ASSET}/site-icon.svg`} alt="" />
            <span className="cfx-browser-title">{project.title} - {title}</span>
            <X size={12} />
          </span>
          <Plus size={14} className="cfx-browser-new" />
        </div>
        <div className="cfx-browser-toolbar">
          <ArrowLeft size={16} />
          <ArrowRight size={16} className="cfx-browser-off" />
          <ArrowClockwise size={16} />
          <span className="cfx-browser-omnibox">
            <SlidersHorizontal size={14} />
            <span>
              d2conflux.com<span className="cfx-browser-path">{path === '/' ? '' : path}</span>
            </span>
          </span>
          <DotsThreeVertical size={16} weight="bold" />
        </div>
      </div>
      {children}
    </figure>
  )
}

/**
 * The page wears the app's skin, but its actions are the portfolio's own: Button's pill
 * chrome on an `<a>`, the same way ProjectStory's OutLink does it, with the palette from
 * `resolvePalette` so it can't drift from the real Button. `external` opens a new tab;
 * otherwise it routes in-app.
 */
function PillLink({
  href,
  variant = 'ghost',
  external = false,
  children,
  'aria-label': ariaLabel,
}: {
  href: string
  variant?: ButtonVariant
  external?: boolean
  children: ReactNode
  'aria-label'?: string
}) {
  const [hovered, setHovered] = useState(false)
  const palette = resolvePalette(variant, hovered ? 'hover' : 'default')
  const props = {
    'aria-label': ariaLabel,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: space.sm,
      height: control.sm,
      boxSizing: 'border-box',
      padding: `0 ${space.lg}`,
      borderRadius: radius.full,
      border: `1px solid ${palette.borderColor}`,
      background: palette.background,
      color: palette.color,
      fontSize: type['label-m'].fontSize,
      fontWeight: type['label-m'].fontWeight,
      lineHeight: type['label-m'].lineHeight,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'background 150ms ease, border-color 150ms ease',
    } satisfies CSSProperties,
  }

  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  return (
    <AppLink href={href} {...props}>
      {children}
    </AppLink>
  )
}

/**
 * A looping screen recording, after ProjectStory's StoryClip: muted and inline so mobile
 * Safari plays it, started only once it scrolls into view (and paused when it leaves), HEVC
 * first with H.264 behind it, and the poster alone under `prefers-reduced-motion`.
 */
function Clip({
  src,
  hevc,
  poster,
  alt,
  width,
  height,
}: {
  src: string
  hevc: string
  poster: string
  alt: string
  width: number
  height: number
}) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stillOnly])

  if (stillOnly) return <img src={poster} alt={alt} width={width} height={height} loading="lazy" />
  return (
    <video ref={ref} poster={poster} aria-label={alt} width={width} height={height} loop muted playsInline preload="metadata">
      <source src={hevc} type='video/mp4; codecs="hvc1"' />
      <source src={src} type="video/mp4" />
    </video>
  )
}
