import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowClockwise, ArrowLeft, ArrowRight, DotsThreeVertical, Plus, SlidersHorizontal, Star, X } from '@phosphor-icons/react'
import { CurvedCard, CurvedCopy, CurvedFacts, CurvedPanel } from './Curved'
import Reveal from './Reveal'
import ScrubbableClip from './ScrubbableClip'
import BuildCard from './conflux/BuildCard'
import ItemDetails from './conflux/ItemDetails'
import { EmptyTile, ItemTile, ItemTileSet } from './conflux/ItemTile'
import { ARMOR_TILES, ITEM_TILE_SET } from './conflux/itemData'
import LoadoutCard from './conflux/LoadoutCard'
import PopularityCard from './conflux/PopularityCard'
import StatTargets from './conflux/StatTargets'
import WeaponList from './conflux/WeaponList'
import { SheetImg, SheetIntro, SheetLinks, SheetPage } from './Sheet'
import { projects, STAT_BUILDER_SITE } from '../data/projects'
import { radius, space } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CURVED_BODY_SIZE, SHEET_BODY, curvedInset, sheetGap } from '../sheetStyle'
import './D2Conflux.css'

/*
  `/work/stat-builder`, on the curved cards no3y Code runs (`Curved.tsx`, Nov 9
  2026): the intro, the optimizer in its browser frame with the overview on a tab
  and Tools / Skills as a card of its own, then each feature as its media on a
  rounded card with its copy on a tab. The Slate stays only behind the live
  components, which are the app's own surface.

  Every capture is the live app signed in with real gear, taken in October 2026 on the
  Slate theme in a 2560 × 1440 window (a 27" monitor) at 2×.
*/

const project = projects['stat-builder']

/**
 * The page re-points the accent to a gold off the app's exotic colour
 * (`--exotic` #ceae33 in D2 Conflux's globals.css, which read brown on the
 * button; an orange gold #d69e1f came next, then a pastel #f0d27a, then this yellower one), so Contact matches the product, as
 * onboarding does with Meridial's magenta (Nov 5 2026). Dark ink: white on a
 * pastel is unreadable.
 */
const THEME = {
  '--color-orange': '#f6de62',
  '--color-orange-hover': '#ebd047',
  // Fixed dark ink, not the theme's inverse text, which turns cream in light mode.
  '--color-on-accent': '#0f0e0e',
} as React.CSSProperties
/** Copy that needs more than `Prose` carries (the game's title in italics). */
const PARAGRAPH: React.CSSProperties = { ...SHEET_BODY, fontSize: CURVED_BODY_SIZE }
const GITHUB = 'https://github.com/NoahHendrickson/d2-stat-builder'
const ASSET = '/work/stat-builder/conflux'
/**
 * The app's component playground, live: /components/embed is the bare copy the app lets
 * this site frame. `VITE_CONFLUX_ORIGIN` points it at a local app server while working on it.
 */
const CONFLUX = import.meta.env.VITE_CONFLUX_ORIGIN ?? STAT_BUILDER_SITE
const PLAYGROUND_EMBED = new URL('/components/embed#button', CONFLUX).href
const PLAYGROUND = new URL('/components', STAT_BUILDER_SITE).href
/** The app's Slate backdrop (its globals.css), the ground for its own surfaces. */
const SLATE = 'linear-gradient(241.87deg, #374358 2.15%, #2f3841 93.13%)'

/**
 * Tools are what the work was made with, not the code stack (`project.stack`, cut from
 * here Nov 5 2026); skills are what the page shows off.
 */
const FACTS = [
  { heading: 'Tools', items: ['Figma', 'Cursor', 'shadcn/ui'] },
  {
    heading: 'Skills',
    items: ['Product design', 'Interaction design', 'Design systems', 'Design engineering', 'Information architecture'],
  },
]

export default function D2Conflux() {
  const isMobile = useIsMobile()

  return (
    <div style={THEME}>
      <SheetPage>
        <SheetIntro
          icon={`${ASSET}/site-icon.svg`}
          title={project.title}
          helper={project.eyebrow}
          description={[
            "Hardcore Destiny 2 players rely heavily on third-party tools and websites while playing. Finding armor, finding weapons and build-crafting aren't supported well in-game.",
          ]}
          links={[
            { label: 'Website', href: STAT_BUILDER_SITE },
            { label: 'Repo', href: GITHUB },
          ]}
          inset={0}
          bodySize={CURVED_BODY_SIZE}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: sheetGap(isMobile) }}>
          <CurvedCard
            media={
              <Browser path="/" title="Optimizer">
                <SheetImg
                  priority
                  shot={{
                    src: `${ASSET}/optimizer.jpg`,
                    alt: 'The stat optimizer: Warlock picked, Health, Grenade and Class targets set, Getaway Artist as the exotic, and the top build opened to its armor, mods, tuning and masterwork cost',
                    aspect: '3200 / 1800',
                  }}
                />
              </Browser>
            }
            copy={
              <CurvedCopy heading="What it does">
                <p style={PARAGRAPH}>
                  D2 Conflux is a web companion app I built for <em>Destiny 2</em> to give players a faster, smarter way to
                  manage their gear while actively playing the game.
                </p>
                <p style={PARAGRAPH}>
                  Beyond basic inventory management, it introduces tools that simply aren’t possible within the game’s native
                  UI. The standout feature is the build optimizer: in <em>Destiny 2</em>, hitting specific armor stat tiers
                  requires complex math that’s virtually impossible to calculate in your head, so the tool runs those
                  combinations automatically to tell you exactly which pieces to equip.
                </p>
                <p style={PARAGRAPH}>
                  Alongside the optimizer, players can audit their vault to filter duplicates and clear out junk rolls, search
                  the full database of in-game weapons to inspect possible perks and plan what to farm, and assemble custom
                  loadouts that can be saved and swapped on the fly. It also includes a dedicated items view that gives
                  players a complete look at their character inventory and vault, making it effortless to organize and
                  transfer gear seamlessly in real time.
                </p>
              </CurvedCopy>
            }
            side={<CurvedFacts facts={FACTS} />}
          />

          <UpClose />

          <Reveal>
            <CurvedCard
              media={
                <Browser path="/" title="Optimizer">
                  <Clip
                    src={`${ASSET}/dream-flow.mp4`}
                    hevc={`${ASSET}/dream-flow-hevc.mp4`}
                    poster={`${ASSET}/dream-flow-poster.jpg`}
                    alt="Screen recording: picking Warlock and Getaway Artist, setting Health 70, Grenade 150 and Class 100, opening the top build, then in Dream build lowering Weapons and raising Super until it suggests replacing the helmet with a Demolitionist helmet"
                  />
                </Browser>
              }
              copy={
                <CurvedCopy
                  heading="Find the stats you can reach or what armor pieces you should replace to reach them"
                  body="Here is a quick video showing a build with stats you can reach with your current armor, then extending those stats to see what armor to farm to achieve them."
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <Browser path="/armor" title="Armor">
                  <SheetImg
                    shot={{
                      src: `${ASSET}/armor-table.jpg`,
                      alt: 'The armor table: 973 pieces with name, class, archetype, tertiary and tuned stats, set bonus, a Searches count, and the six stat columns, filters and Cleanup and Duplicates views along the top',
                      aspect: '3200 / 1800',
                    }}
                  />
                </Browser>
              }
              copy={
                <CurvedCopy
                  heading="Sort your armor"
                  body="Armor 3.0 simplified how stats are distributed on a piece of armor, with finite combinations. That changed how players thought about armor, but none of the previous armor management tools accounted for it. A table view with quick filters that matched players' mental model made it easy and intuitive to search, filter and delete the armor you own."
                />
              }
            />
          </Reveal>

          <Reveal>
            {/*
              Recaptured Oct 28 2026 after the details pane split into Stats / Perks / Popularity
              cards: the app's own verify-d2 harness (stubbed sign-in, its full fixture vault), the
              same 2560 × 1440 window at 2×, with Fatebringer (Timelost) on its most popular roll.
            */}
            <CurvedCard
              media={
                <Browser path="/weapons" title="Weapons">
                  <SheetImg
                    shot={{
                      src: `${ASSET}/weapon-search.jpg`,
                      alt: 'Weapon search: the full catalog of 1,335 weapons as coloured nameplates by element, and Fatebringer (Timelost) open in three cards: its stats, its perk grid with the most popular roll picked, and how popular each perk and combo is',
                      aspect: '3200 / 1800',
                    }}
                  />
                </Browser>
              }
              copy={
                <CurvedCopy
                  heading="Find the roll"
                  body="Every weapon in the game, filterable by trait, perk combo, barrel and magazine, or champion. Click perks to build a roll and the stat bars move with it. Hover any perk for community-tested numbers on what it really does. The popularity card shows how often players run each perk and combo, and one click tries the most popular roll."
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <Browser path="/loadouts" title="Loadouts">
                  <SheetImg
                    shot={{
                      src: `${ASSET}/loadouts.jpg`,
                      alt: 'The Loadouts page: two activity sets with Save in-game buttons, a list of 27 loadout names, and saved loadouts as cards, each with its subclass, aspects and fragments, five armor pieces with their mods, stat totals and an Equip button',
                      aspect: '3200 / 1800',
                    }}
                  />
                </Browser>
              }
              copy={
                <CurvedCopy
                  heading="Save it, then equip it in one click"
                  body="Any build saves as a loadout with its subclass, mods, weapons and artifact. Equip pulls every piece out of the vault, slots the mods and swaps the exotic. Activity sets write a whole group of loadouts into the game's own loadout slots at once."
                />
              }
            />
          </Reveal>

          <Reveal>
            <Wide>
              <CurvedCard
                media={<ComponentStrip />}
                copy={
                  <CurvedCopy
                    heading="Component library"
                    body="The app's own components, running live from d2conflux.com. Change their props, force hover, focus and pressed states, switch themes, and copy the code."
                  >
                    <SheetLinks links={[{ label: 'Open full screen', href: PLAYGROUND }]} />
                  </CurvedCopy>
                }
              />
            </Wide>
          </Reveal>

          <Reveal>
            <CurvedCard
              media={
                <div style={{ padding: `${space.sm} ${space.sm} 0`, columns: isMobile ? 1 : '3 240px', columnGap: space.lg }}>
                  {project.landing?.feedback?.shots.map((shot) => (
                    <figure
                      key={shot.src}
                      style={{ breakInside: 'avoid', margin: `0 0 ${space.lg}`, borderRadius: radius.md, overflow: 'hidden' }}
                    >
                      <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: 'auto' }} />
                    </figure>
                  ))}
                </div>
              }
              copy={
                <CurvedCopy
                  heading="Built for one very picky player, then shared"
                  body="I made it for myself and posted it to a Destiny community. These are some of the messages that came back."
                />
              }
            />
          </Reveal>

          <Reveal>
            <CurvedPanel style={{ padding: curvedInset(isMobile), display: 'flex', flexDirection: 'column', gap: space.xl }}>
              <CurvedCopy heading="Try it with your own vault" body="Sign in with Bungie. It's free, and it works on your phone too.">
                <SheetLinks
                  links={[
                    { label: 'Open D2 Conflux', href: STAT_BUILDER_SITE },
                    { label: 'More of my work', href: '/work' },
                  ]}
                />
              </CurvedCopy>
            </CurvedPanel>
          </Reveal>
        </div>
      </SheetPage>
    </div>
  )
}

/**
 * The app's component playground across the column: not a mockup but the app itself,
 * whose Slate backdrop is the band's colour (switching its theme repaints it).
 * The embed posts its content height and the frame takes it, so it never scrolls. Back
 * the other way goes the slice of the frame that's on screen, so the app's dialogs,
 * drawers and toasts open in view rather than halfway down a frame taller than the
 * window (the app's embed-bridge.ts has the other end).
 */
function ComponentStrip() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const origin = new URL(CONFLUX).origin
    let raf = 0
    const sendViewport = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = frame.getBoundingClientRect()
        const top = Math.max(0, -rect.top)
        const bottom = Math.min(rect.height, window.innerHeight - rect.top)
        frame.contentWindow?.postMessage(
          { type: 'd2-components:viewport', top, height: Math.max(0, bottom - top) },
          origin,
        )
      })
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== origin || e.source !== frame.contentWindow) return
      if (e.data?.type !== 'd2-components:height' || typeof e.data.height !== 'number') return
      setHeight(e.data.height)
      sendViewport()
    }
    window.addEventListener('message', onMessage)
    // Capture: the page may scroll in a container rather than the window.
    window.addEventListener('scroll', sendViewport, { capture: true, passive: true })
    window.addEventListener('resize', sendViewport)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('message', onMessage)
      window.removeEventListener('scroll', sendViewport, { capture: true })
      window.removeEventListener('resize', sendViewport)
    }
  }, [])

  return (
    // The ground shows only while the app loads; the frame paints its own Slate.
    <div style={{ background: SLATE }}>
      <iframe
        ref={frameRef}
        src={PLAYGROUND_EMBED}
        title="D2 Conflux component library"
        loading="lazy"
        style={{ display: 'block', width: '100%', height: height ?? 1100, border: 0 }}
      />
    </div>
  )
}

/**
 * The app's own components, live, on its Slate (Nov 5 2026) — not pictures of
 * them: the coded replicas in `components/conflux/` (stat targets you can drag
 * and type into, an expanded build card that collapses, the popularity card's
 * picks, the Weapon search list's search and sort, a full loadout card with its
 * actions menu, and single item tiles), every value read off the running app.
 * They replaced 3× element captures, which were sharp but couldn't be touched.
 * Two columns at the app's own widths (popularity 384 beside the build card's
 * 649, so each draws at about its own size), the loadout card across the foot,
 * one column on mobile. Under the tiles, the item details card (`ItemDetails`)
 * for whichever tile is picked — clicking a tile opens its card, as on Items.
 */
function Collage() {
  const isMobile = useIsMobile()
  // The tile whose details card shows under the grid; clicking a tile picks it. Opens on
  // Mint Retrograde (Nov 5 2026), the tier 5 roll with alternatives to preview.
  const [item, setItem] = useState('mint-retrograde')
  const selectedTile = ITEM_TILE_SET.find((t) => t.id === item) ?? ITEM_TILE_SET[0]
  const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: space.lg, minWidth: 0 }
  return (
    <div data-theme="dark" style={{ ...stack, background: SLATE, padding: isMobile ? '16px' : '48px' }}>
      {isMobile ? (
        <>
          <StatTargets />
          <BuildCard />
          <WeaponList />
          <PopularityCard />
          <ItemTileSet size={72} selected={item} onSelect={setItem} />
          <ItemDetails item={selectedTile} />
          <LoadoutCard />
        </>
      ) : (
        <ScaledLayout>
          {(three) =>
            three ? (
              <>
                <div style={{ display: 'grid', gap: space.lg, gridTemplateColumns: COLUMNS_3, alignItems: 'start' }}>
                  <div style={stack}>
                    <PopularityCard style={{ width: '100%' }} />
                    <FitItemTiles selected={item} onSelect={setItem} />
                  </div>
                  <div style={stack}>
                    <BuildCard width="100%" />
                    <WeaponList style={{ width: '100%' }} />
                  </div>
                  <div style={stack}>
                    {/* The item card at its own 384, flush right, with the loadout's armor
                        stacked in the strip left of it; the stat targets under both take the
                        column's full width. */}
                    <div style={{ display: 'flex', gap: space.lg, alignItems: 'start' }}>
                      <div role="group" aria-label="Armor" style={{ display: 'flex', flexDirection: 'column', gap: 8 * (ARMOR_STACK / 60), flexShrink: 0 }}>
                        {ARMOR_TILES.map((tile) => (
                          <ItemTile key={tile.id} item={tile} size={ARMOR_STACK} />
                        ))}
                        {/* The app's empty cell, closing the stack out to the item card's foot. */}
                        <EmptyTile size={ARMOR_STACK} />
                      </div>
                      <ItemDetails item={selectedTile} style={{ width: 384, flexShrink: 0 }} />
                    </div>
                    <StatTargets width="100%" />
                  </div>
                </div>
                <LoadoutCard />
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gap: space.lg, gridTemplateColumns: COLUMNS_2, alignItems: 'start' }}>
                  <div style={stack}>
                    <PopularityCard style={{ width: '100%' }} />
                    <FitItemTiles selected={item} onSelect={setItem} />
                    <ItemDetails item={selectedTile} />
                  </div>
                  {/* One width down the column: the list's own 560 stopped short of the cards above it. */}
                  <div style={stack}>
                    <BuildCard width="100%" />
                    <StatTargets width="100%" />
                    <WeaponList style={{ width: '100%' }} />
                  </div>
                </div>
                <LoadoutCard />
              </>
            )
          }
        </ScaledLayout>
      )}
    </div>
  )
}


/**
 * The collage drawn like a picture of the app (Nov 5 2026): laid out at the app's own
 * card widths — popularity 384, the build card 649, the search list's 560 — and scaled
 * as a whole (CSS `zoom`) to the room it has, never past 1:1. Stretching the cards to
 * fill a wide column instead blew them up on a laptop (and zooming the type alone left
 * them stretched). Where the scaled three-column layout still reads (`THREE_COL_MIN`,
 * the wide band) it runs three columns, split so they end about level: popularity over
 * the tiles 3×2 (384), the build card over the search list at 624 — the narrowest the
 * build card's header holds one line at (560, the list's own, wrapped it; 649, the card's,
 * left the list mostly empty; at 384 the list's names cut off) — the item card over the
 * stat targets, the column 472 so the stat targets (its full width) jut out past the
 * item card (its own 384, flush right), the loadout's five armor pieces stacked as tiles in
 * the strip that leaves left of the card (`ARMOR_STACK`) — the weapon tiles stacked beside the item card, with it zoomed to their
 * height and the stat targets wider under both, was tried and backed out the same day;
 * narrower, two
 * (popularity and the tiles beside the build card), as before. The cards' tooltips and menus are portalled out and
 * placed off `getBoundingClientRect`, which reports the zoomed boxes, so they still
 * land on their triggers.
 */
const COLUMNS_2 = '384fr 649fr'
/** The armor tiles' size in the strip left of the item card: the column's 472 less the card's 384 and a gap. */
const ARMOR_STACK = 472 - 384 - 16
const COLUMNS_3 = '384fr 624fr 472fr'
/** The layouts' design widths: the columns' own widths and the 16 gaps between them. */
const DESIGN_2 = 384 + 649 + 16
const DESIGN_3 = 384 + 624 + 472 + 32
/**
 * How much smaller than a room-filling fit the collage draws (Nov 5 2026: "scale them
 * down even more" — 1 filled the room, ~0.87× on a 16-inch MacBook; 1.25 gives ~0.70×).
 * The cards keep their own widths — the layout isn't stretched to fill the band — so
 * the collage sits centred on the band at that size, the Slate running on either side.
 */
const SCALE_DOWN = 1.25
/** Below this much room (CSS px) the three columns would scale too small; two instead. */
const THREE_COL_MIN = 1200

function ScaledLayout({ children }: { children: (three: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setRoom(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const three = room >= THREE_COL_MIN
  const design = three ? DESIGN_3 : DESIGN_2
  const zoom = room ? Math.min(1, room / (design * SCALE_DOWN)) : 1
  return (
    <div ref={ref}>
      {/* The layout at its cards' own widths, scaled, centred in the room. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg, zoom, width: design, maxWidth: '100%', margin: '0 auto' }}>
        {children(three)}
      </div>
    </div>
  )
}

/** Past this the collage breaks out of the column (Nov 5 2026). */
const WIDE_QUERY = '(min-width: 1440px)'
/** Across the window, less a margin so the card keeps its rounded corners. */
const WIDE_CARD = 'calc(100vw - 32px)'

/**
 * Spreads a card holding live UI across the window on a wide screen (`WIDE_QUERY`),
 * centred on the column. Past the collage's own widths its content stays centred on
 * the Slate.
 */
function Wide({ children }: { children: ReactNode }) {
  const wide = useMediaQuery(WIDE_QUERY)
  return wide ? <div style={{ width: WIDE_CARD, marginLeft: `calc(50% - ${WIDE_CARD} / 2)` }}>{children}</div> : children
}

/** The "Up close" block: the collage needs more room than the column to draw at its cards' own widths. */
function UpClose() {
  return (
    <Reveal>
      <Wide>
        <CurvedCard
          media={<Collage />}
          copy={
            <CurvedCopy
              heading="Up close"
              body="A few of the app’s components, live: drag the stat targets, open and close the build, pick perks, search the list, and open a loadout’s actions."
            />
          }
        />
      </Wide>
    </Reveal>
  )
}

/**
 * The tile grid sized to its column, so its edges meet the popularity card's above
 * it: three tiles and two of the app's gaps (8 at a 60 tile, scaling with it) across
 * the measured width.
 */
function FitItemTiles({
  columns = 3,
  selected,
  onSelect,
}: {
  columns?: number
  selected: string
  onSelect: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(96)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => setSize(Math.floor((el.clientWidth / (columns + ((columns - 1) * 8) / 60)) * 10) / 10)
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [columns])
  return (
    <div ref={ref}>
      <ItemTileSet size={size} columns={columns} selected={selected} onSelect={onSelect} />
    </div>
  )
}

/**
 * A dark Chrome window around a full-window capture, open on the app's own tab title
 * (`D2 Conflux - <page>`) and route, so the screenshots read as the live site in a
 * browser rather than floating mocks. It fills its card's media box, which rounds it
 * (`D2Conflux.css`).
 */
function Browser({ path, title, children }: { path: string; title: string; children: ReactNode }) {
  // Regular weight throughout: the site's duotone tint reads as a filled blob at
  // Chrome's small icon sizes.
  return (
    <figure className="cfx-browser">
      <div className="cfx-browser-window" data-theme="dark">
        <div className="cfx-browser-chrome" aria-hidden>
          <div className="cfx-browser-tabs">
            <span className="cfx-browser-lights">
              <i />
              <i />
              <i />
            </span>
            <span className="cfx-browser-tab">
              <img src={`${ASSET}/site-icon.svg`} alt="" />
              <span className="cfx-browser-title">
                {project.title} - {title}
              </span>
              <X size={12} weight="regular" />
            </span>
            <Plus size={14} weight="regular" className="cfx-browser-new" />
          </div>
          <div className="cfx-browser-toolbar">
            <ArrowLeft size={16} weight="regular" />
            <ArrowRight size={16} weight="regular" className="cfx-browser-off" />
            <ArrowClockwise size={16} weight="regular" />
            <span className="cfx-browser-omnibox">
              <SlidersHorizontal size={14} weight="regular" />
              <span className="cfx-browser-url">
                d2conflux.com<span className="cfx-browser-path">{path === '/' ? '' : path}</span>
              </span>
              <Star size={14} weight="regular" />
            </span>
            <span className="cfx-browser-avatar" />
            <DotsThreeVertical size={16} weight="bold" />
          </div>
        </div>
        {children}
      </div>
    </figure>
  )
}

/**
 * A looping screen recording across the column with a seek bar (`ScrubbableClip`): muted
 * and inline so mobile Safari plays it, started only once it scrolls into view (and paused
 * when it leaves), HEVC first with H.264 behind it, and the poster alone under
 * `prefers-reduced-motion`.
 */
function Clip({ src, hevc, poster, alt }: { src: string; hevc: string; poster: string; alt: string }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const fill: React.CSSProperties = { display: 'block', width: '100%', height: 'auto', aspectRatio: '2560 / 1440' }

  if (stillOnly) return <img src={poster} alt={alt} loading="lazy" decoding="async" style={fill} />
  return (
    <ScrubbableClip threshold={0.35} poster={poster} aria-label={alt} style={fill}>
      <source src={hevc} type='video/mp4; codecs="hvc1"' />
      <source src={src} type="video/mp4" />
    </ScrubbableClip>
  )
}
