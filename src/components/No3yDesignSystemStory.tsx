import { Fragment, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import CompareSlider from './CompareSlider'
import { CurvedCard, CurvedCopy } from './Curved'
import { color, radius, space, type } from '../design-system/tokens'
import { useIsMobile } from '../hooks/useIsMobile'
import { CURVED_INNER, TEXT_SOFT } from '../sheetStyle'
import { CODE_CONNECT_SNIPPET, STORYBOOK_SHOT } from '../data/no3yDesignSystem'
import { KitGlassComposer, KitGlassPetals, KitGlassPicker, KitGlassThreads } from './No3yKitGlass'

/*
  Prototype B's design-system chapter, on the page's curved cards (Nov 19 2026, reworked Nov 24):
  1. `Themes & the design system`: a card holding the page's three-theme slider (the new agent
     screen in Basic, Glass and Inlet), with the story on its tab: the themes, why one system sits
     under Figma and the code, and how it's wired.
  2. `The kit, wired to code`: its numbers, then Figma (the kit's components in Flat Glass, cut out
     and labelled on the Jolly Petal piece), Code Connect, Storybook and the design lint, each a heading
     and a sentence on a tab over its picture. The Storybook shot opens full size in a lightbox.
*/

const DS = '/work/no3y-code/design-system'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/** The themes card's copy (Nov 27 2026, drafted off the two design-system threads, 58d9024b and c03ae54f,
    after a Gemini 4 Neon review): why the system happened, the themes cut down to the ones kept. */
const STORY_INTRO = [
  'no3y Code has four themes. Flat Glass is the default, then Glass 3D, Basic in Light and Darker Neutral, and Inlet in Black and Cream. With agents, trying a new look in real code was cheap, so for a while I had 11 Basic tones and 6 Inlet colors.',
  'That got messy fast. Agents shipped one-off buttons, mismatched corners and raw hex colors, and screens that looked fine in one theme broke in another. I cut the themes down to the ones I actually use and built one design system across Figma and code.',
]

/** The kit section's intro: how the work was split between me and the agents. */
const KIT_INTRO = [
  "I didn't want to hand-draw hundreds of variants, so I split the work. Agents measured the running app and built the kit in Figma. I reviewed the first components and set the rules: fewer button sizes, a 1px focus border, a switch that doesn't look disabled when it's off, and token names a person can read. Then I sent those changes back into the app.",
]

/** The Flat Glass stage: every kit export sits on it, and the panes below take it too. */
const KIT_FILL = '#1d1d1d'


type Zoom = { title: string; caption: string; src: string; alt: string }

function Lightbox({ item, onClose }: { item: Zoom | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    else if (!item && dialog.open) dialog.close()
  }, [item])

  return (
    <dialog
      ref={ref}
      data-theme="dark"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      style={{
        padding: 0,
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: radius.xl,
        background: '#1c1c1e',
        color: '#f2f2f2',
        maxWidth: 'min(94vw, 1280px)',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.65)',
      }}
    >
      {item && (
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space.md,
              padding: `${space.md} ${space.lg}`,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ ...type['label-m'], color: '#f2f2f2' }}>{item.title}</span>
              <span style={{ ...type['body-s'], color: 'rgba(255, 255, 255, 0.65)' }}>{item.caption}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              style={{
                height: 32,
                padding: `0 ${space.md}`,
                borderRadius: radius.full,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'transparent',
                color: '#f2f2f2',
                ...type['label-m'],
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Close
            </button>
          </div>
          <div
            style={{
              padding: space.lg,
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#161618',
            }}
          >
            {/* The frames carry their own rounded corners; nothing here clips them. */}
            <img
              src={item.src}
              alt={item.alt}
              style={{ display: 'block', maxWidth: '100%', maxHeight: 'calc(90vh - 110px)', width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </dialog>
  )
}

const InspectTag = () => (
  <span
    aria-hidden
    style={{
      position: 'absolute',
      right: space.sm,
      bottom: space.sm,
      fontFamily: MONO,
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.78)',
      background: 'rgba(0, 0, 0, 0.56)',
      backdropFilter: 'blur(8px)',
      padding: '4px 10px',
      borderRadius: radius.full,
      border: '1px solid rgba(255, 255, 255, 0.12)',
    }}
  >
    Inspect ↗
  </span>
)

/**
 * The kit grid, straight from Figma (Nov 26 2026): the board is a Figma file of linked instances of
 * the Basic UI kit, in Flat Glass (`xGxs2mCahayLskyTiNfk18`, "no3y Code — UI collage", node `3:6730`).
 * `KIT_ROWS` is that board: its rows in order, each tile's width on the Figma board (a row's tiles
 * share it as `fr`, so they keep the board's proportions) and what it holds. A picture piece is cut
 * out of its tile's 3x Figma export at the bounds Figma placed it
 * (`~/.t3-fork/scratch/no3y-capture/design-system/collage-figma/`: `raw/` the exports,
 * `pieces.json` the bounds, `export.mjs` the cut), so it sits on the tile's own #1d1d1d. Two tiles
 * are live instead (`No3yKitGlass`): the composer and the Petals grid, built from the board's
 * layers in their Flat Glass state over the Jolly Petal piece the board gives their tiles (`wall`,
 * the part of the piece each tile shows, cropped from the original), so the glass is a real blur.
 * The tile itself is drawn here with the board's values (the kit's `base/background` fill,
 * `base/border` hairline, 16 corners, 32 padding, 16 between pieces). On a desktop the whole board
 * is set at `KIT_SCALE` and capped at `KIT_BOARD_MAX` (so 1555 wide at most, out to the page's breakout;
 * 0.85 of a 1440 board until Nov 26 2026, when the user wanted it smaller and wider); one column at 1x on
 * a phone. Change the board in Figma, re-export the tiles into `raw/`, run `export.mjs`, and update
 * `KIT_ROWS` if a row or piece moved.
 */
const KIT_TILE = '#1d1d1d'
const KIT_BORDER = 'rgba(255, 255, 255, 0.08)'
const KIT_SCALE = 0.72
/** The board's widest, in its own pixels: 2160 × 0.72 is the page's 1560 breakout (Nov 26 2026; 1440 before). */
const KIT_BOARD_MAX = 2160
const KIT_DIR = `${DS}/kit-figma`
type KitPiece = { id: string; w: number; alt: string }
type KitTile = { w: number; pieces?: readonly KitPiece[]; live?: 'composer' | 'petals' | 'threads' | 'picker'; wall?: string; label?: string }
// Three rows since Nov 26 2026 (five before): the board runs out to the page's 1560 breakout at the same
// scale, so the tiles are reordered into fewer, wider rows rather than made bigger. A tile's `w` is its
// share of its row (the rows' totals differ; each row fills the board's width).
const KIT_ROWS: readonly (readonly KitTile[])[] = [
  [
    // The new project selector (custom #533: search, pins and sort), live and read off the app since
    // Nov 26 2026 (No3yKitGlass), first in the row on its own wallpaper, the user's blue and purple piece.
    { w: 469.33, live: 'picker', wall: 'wall-picker', label: 'The project selector in Flat Glass, live over the wallpaper' },
    { w: 469.33, pieces: [{ id: 'view-menu', w: 192, alt: 'The Petals view menu: list or grid, and compact cards' }] },
    { w: 469.33, pieces: [{ id: 'model-picker', w: 288, alt: 'The model picker: Pinned and provider tabs, model search, and the effort inline on the chosen model' }] },
    { w: 469.33, pieces: [{ id: 'usage-menu', w: 256, alt: 'The usage limits menu: session and weekly limits per provider with their reset times' }] },
    // Live since Nov 26 2026, read off the app (No3yKitGlass): the sidebar's compact cards, in place of the
    // Figma board's three full cards; the wallpaper is the hero's (the Jolly Petal piece, mirrored), zoomed in.
    { w: 469.33, live: 'threads', wall: 'wall-threads', label: 'Compact thread cards in Flat Glass, live over the wallpaper' },
  ],
  [
    {
      w: 469.33,
      pieces: [
        { id: 'background-popover', w: 320, alt: 'The background work popover: a subagent and a CI watch' },
        { id: 'dictation', w: 128, alt: 'Dictation while recording, a white capsule with a level meter' },
      ],
    },
    { w: 954.67, live: 'composer', wall: 'wall-composer', label: 'The new agent composer in Flat Glass, live over the wallpaper' },
    {
      w: 469.33,
      pieces: [{ id: 'pills', w: 358, alt: 'Composer pills: pull request chips open, merged and draft, background work, queued and subagents' }],
    },
    { w: 469.33, pieces: [{ id: 'launchpad', w: 398, alt: 'Launchpad suggestions to start something new' }] },
  ],
  [
    { w: 840, pieces: [{ id: 'question', w: 640, alt: 'An agent question in place of the composer, with three options and Submit' }] },
    {
      w: 820,
      // Not from the Figma board: a turn rendered in the app itself (Nov 26 2026), the mock studio's
      // `subagent-turn` scene off custom 25984b41b7, cut to the turn at 3x.
      pieces: [
        {
          id: 'subagent-turn',
          w: 740,
          alt: 'A finished turn: it changed PricingToggle.tsx, started an Accessibility review subagent on Opus 5.5 at High, then the review finished and the reply says the badge passed',
        },
      ],
    },
    { w: 720, live: 'petals', wall: 'wall-petals', label: 'The Petals grid in Flat Glass, live over the wallpaper' },
  ],
]

/** One piece, 3x with a 1.5x cut, at its own 1x width (or the tile's, if that's narrower). */
function KitImg({ piece }: { piece: KitPiece }) {
  const src = `${KIT_DIR}/${piece.id}.webp`
  return (
    <img
      src={src}
      srcSet={`${KIT_DIR}/${piece.id}-half.webp ${Math.round(piece.w * 1.5)}w, ${src} ${piece.w * 3}w`}
      sizes={`${piece.w}px`}
      alt={piece.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={{ display: 'block', width: piece.w, maxWidth: '100%', height: 'auto' }}
    />
  )
}

/** The Figma board: `KIT_ROWS`, each row its tiles at the board's proportions; one column on a phone. */
function KitBoard() {
  const isMobile = useIsMobile()
  const gap = isMobile ? 12 : 16
  return (
    <div
      role="group"
      aria-label="no3y Code components from the Figma kit, in Flat Glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        // `zoom` scales the board as a picture (type, pieces, padding and gaps together); its
        // KIT_BOARD_MAX cap is in the zoomed board's own pixels.
        // `width: 100%`: auto side margins alone shrink a flex child to its content, 13px short of the copy's edges.
        ...(isMobile ? {} : { zoom: KIT_SCALE, width: '100%', maxWidth: KIT_BOARD_MAX, marginInline: 'auto' }),
      }}
    >
      {KIT_ROWS.map((row, r) => (
        <div
          key={r}
          style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : row.map((tile) => `minmax(0, ${tile.w}fr)`).join(' '), gap }}
        >
          {row.map((tile, t) => (
            <div
              key={t}
              role={tile.live ? 'group' : undefined}
              aria-label={tile.label}
              style={{
                position: 'relative',
                // A wallpaper is sized to the whole tile, border included (border-box): sized inside it, the
                // 1px border strip showed the dark fill along the top and bottom.
                background: tile.wall ? `${KIT_TILE} url(${KIT_DIR}/${tile.wall}.webp) center / cover no-repeat border-box` : KIT_TILE,
                border: `1px solid ${KIT_BORDER}`,
                borderRadius: CURVED_INNER,
                padding: isMobile ? 20 : 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {tile.live === 'composer' ? <KitGlassComposer /> : null}
              {tile.live === 'petals' ? <KitGlassPetals /> : null}
              {tile.live === 'threads' ? <KitGlassThreads /> : null}
              {tile.live === 'picker' ? <KitGlassPicker /> : null}
              {tile.pieces?.map((piece) => (
                <KitImg key={piece.id} piece={piece} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Step 2's media: the Code Connect template, on its own fixed dark, filling its cell. */
function CodeConnectPane() {
  return (
    <div style={{ background: KIT_FILL, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <div
        style={{
          padding: `${space.md} ${space.xl}`,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: MONO,
          fontSize: 12,
          color: '#9a9a9a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>StatusChip.figma.ts · PR</span>
        <span style={{ color: '#24fe8a' }}>Synced</span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: space.xl,
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.6,
          color: '#e8e8e8',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <code>{CODE_CONNECT_SNIPPET}</code>
      </pre>
    </div>
  )
}

/** Step 3's media: the Storybook window whole, at its own size; click to inspect it. */
function StorybookPane({ onZoom }: { onZoom: (item: Zoom) => void }) {
  return (
    <button
      type="button"
      onClick={() =>
        onZoom({
          title: 'Storybook · Fork / Petal digest / Pull request states',
          caption: 'A Petal’s asks for each pull request state, rendered by the real component in Flat Glass.',
          src: STORYBOOK_SHOT.src,
          alt: STORYBOOK_SHOT.alt,
        })
      }
      aria-label="Inspect Storybook screenshot full size"
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, border: 'none', background: '#1b1b1d', cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden' }}
    >
      <img src={STORYBOOK_SHOT.src} alt={STORYBOOK_SHOT.alt} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: STORYBOOK_SHOT.aspect }} />
      <InspectTag />
    </button>
  )
}

/** The design rules (`.fork/DESIGN-RULES.md` in the fork), grouped as the linter reports them. */
const LINT_GROUPS = [
  {
    id: 'A',
    title: 'Values come from tokens',
    rules: ['Raw colors', 'Raw radii', 'Off-scale spacing', 'Raw type sizes', 'Arbitrary Tailwind values'],
  },
  {
    id: 'B',
    title: 'Reuse components',
    rules: ['Restyled primitives', 'Hand-built menus and dialogs', 'Home-made status marks', 'Icons around the shim', 'Components without a story'],
  },
  {
    id: 'C',
    title: 'Theme CSS stays clean',
    rules: ['Geometry on primitives', 'Cancelled paint', 'Tokens a theme leaves undefined', 'Heavy :has()', 'Dead selectors', 'Rules restated per theme'],
  },
] as const

const LINT_RULE_LINE = '1px solid rgba(255, 255, 255, 0.08)'

/** The lint step's picture: the 16 rules in their three groups, under the check CI runs on every PR,
    ending on its clean result (the linter blocks CI since custom ~a4881c2dce, and passes there).
    Nov 26 2026: a CI-run version with sample findings was tried and dropped; the user liked the rules. */
function DesignLintPane() {
  return (
    <div style={{ background: KIT_FILL, color: '#e8e8e8', display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <div
        style={{
          padding: `${space.md} ${space.xl}`,
          borderBottom: LINT_RULE_LINE,
          fontFamily: MONO,
          fontSize: 12,
          color: '#9a9a9a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space.md,
        }}
      >
        <span>design-lint --check</span>
        <span style={{ color: '#24fe8a', whiteSpace: 'nowrap' }}>Required on every PR</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xl, padding: space.xl }}>
        {LINT_GROUPS.map((group) => (
          <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: space.md, minWidth: 0 }}>
            <span style={{ ...type['label-m'], color: '#f2f2f2' }}>{group.title}</span>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.rules.map((rule, i) => (
                <li key={rule} style={{ display: 'flex', gap: space.md, alignItems: 'baseline', fontSize: 14, lineHeight: 1.4, color: 'rgba(255, 255, 255, 0.72)' }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: '#24fe8a', flexShrink: 0, width: 20 }}>
                    {group.id}
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: `${space.md} ${space.xl}`,
          borderTop: LINT_RULE_LINE,
          fontFamily: MONO,
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space.md,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: '#24fe8a' }}>✓ design-lint: clean.</span>
        <span style={{ color: '#7a7a7a' }}>5 themes</span>
      </div>
    </div>
  )
}

/** The four parts of the kit, a heading and a sentence each: Figma over the board, the other three under their panes. */
/* The kit's numbers (read off the kit `kUDQTOR0ndxERlBCqgy3nk` and `apps/fork-storybook` at custom
   `d01b458341`; recount when they move) sit with the part they count (Nov 26 2026): the user found
   them floating as a row of six under the heading. */
type KitStat = { value: string; label: string }
/** A part's components split in two, the standard building blocks and no3y's own, each a small card (Nov 26 2026). */
type KitSplit = { value: number; label: string; detail: string }
// Storybook and Code Connect counted off custom 2d07bf6664 (Nov 26 2026): stories by folder
// (`stories/components` standard, `stories/fork` no3y's, plus 4 foundations pages and their 14
// stories), Code Connect mappings by the source each names (`components/ui` standard, the rest no3y's).
const KIT_PARTS: readonly { heading: string; body: string; stats: readonly KitStat[]; split?: readonly KitSplit[] }[] = [
  {
    heading: 'Figma',
    body: 'Agents read each component\'s styles off Storybook and the running app and built it as a native Figma component. One Theme collection holds all six theme modes, with Flat Glass as the default.',
    stats: [
      { value: '227', label: 'theme variables' },
      { value: '6', label: 'theme modes' },
      { value: '280', label: 'icons' },
    ],
  },
  {
    heading: 'Code Connect',
    body: "Select a component in Figma and you see its real React code, so agents get the right imports when they read my designs. Keeping the two in sync is on purpose simple: agents update Figma when they change a component, and a Monday report lists anything that drifted for me to approve.",
    stats: [{ value: '94', label: 'components mapped' }],
    split: [
      { value: 58, label: 'standard components', detail: 'Button, Select, Menu' },
      { value: 36, label: 'no3y components', detail: 'Composer, thread cards, Petals' },
    ],
  },
  {
    heading: 'Storybook',
    body: "Every story renders the real component with the app's own styles and themes, so Storybook can't drift from what ships.",
    stats: [{ value: '435', label: 'stories' }],
    split: [
      { value: 48, label: 'standard components', detail: 'Button, Input, Menu, Dialog' },
      { value: 44, label: 'no3y components', detail: 'Composer pills, Petals, model picker' },
    ],
  },
  {
    heading: 'Design lint',
    body: 'The kit alone didn\'t stop drift, because the fork had the design lint turned off. Instead of freezing the old violations, I had agents fix all of them, checked every story before and after so nothing changed by accident, and made the lint block CI across the five main themes.',
    stats: [{ value: '16', label: 'rules' }],
  },
]

/** Out of the text column to the brand and Cinnabars pages' width, 48 clear of the window either side. */
function WideBoard({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  if (isMobile) return <>{children}</>
  const width = 'max(100%, min(1560px, calc(100vw - 96px)))'
  return <div style={{ width, marginLeft: `calc((100% - ${width}) / 2)` }}>{children}</div>
}

/**
 * `The kit, wired to code` (Nov 19 2026; one section since Nov 24): a heading with the kit's
 * numbers, the components on one board (`KitBoard`) with the Figma copy under it, then (Nov 26 2026)
 * Storybook, Code Connect and the design lint as a row of three off the board, each pane over its own
 * copy. Until then all four parts' copy was one row over a board that held the three panes too. The
 * rows before that, each part a tab over its own picture, are kept in
 * ~/.t3-fork/scratch/no3y-capture/design-system/No3yDesignSystemStory.before-board.tsx.
 */
function KitSection({ onZoom }: { onZoom: (item: Zoom) => void }) {
  const isMobile = useIsMobile()
  const part = (heading: string) => KIT_PARTS.find((p) => p.heading === heading)!
  // Each pane with its own part (until Nov 26 2026 the parts were unpacked in the wrong order, so
  // Storybook's picture carried Code Connect's caption and the reverse).
  const panes = [
    { part: part('Storybook'), pane: <StorybookPane onZoom={onZoom} /> },
    { part: part('Code Connect'), pane: <CodeConnectPane /> },
    { part: part('Design lint'), pane: <DesignLintPane /> },
  ]
  // The Figma copy keeps to the board's own width (zoomed to KIT_SCALE, up to the page's 1560 breakout), so
  // they share edges. The row of panes keeps the width it had at the board's old 0.85 (1224), since
  // its tiles of counts would wrap any narrower; it is centred on the same line.
  const kitWidth = { width: '100%', maxWidth: KIT_BOARD_MAX * KIT_SCALE, marginInline: 'auto' } as const
  const paneWidth = { width: '100%', maxWidth: 1224, marginInline: 'auto' } as const
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 32 : 48 }}>
      <CurvedCopy heading="The kit, wired to code" body={KIT_INTRO} />
      <WideBoard>
        <div style={{ ...kitWidth, display: 'flex', flexDirection: 'column', gap: space.xl }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
            <PartHeader part={part('Figma')} />
            <PartBody part={part('Figma')} />
          </div>
          <KitBoard />
        </div>
      </WideBoard>
      <WideBoard>
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {panes.map(({ part: p, pane }) => (
              <div key={p.heading} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, minWidth: 0 }}>
                <PartCards part={p} />
                <div style={{ marginTop: space.md }}>{pane}</div>
              </div>
            ))}
          </div>
        ) : (
          // One grid, two rows: each part's cards (stretched so the three end level), then the panes on one line.
          <div
            style={{
              ...paneWidth,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: 'auto 1fr',
              columnGap: space['2xl'],
            }}
          >
            {panes.map(({ part: p, pane }, i) => (
              <Fragment key={p.heading}>
                <div style={{ gridColumn: i + 1, gridRow: 1, minWidth: 0 }}>
                  <PartCards part={p} />
                </div>
                <div style={{ gridColumn: i + 1, gridRow: 2, paddingTop: space.xl, minWidth: 0, alignSelf: 'start' }}>{pane}</div>
              </Fragment>
            ))}
          </div>
        )}
      </WideBoard>
    </section>
  )
}

/** A part's heading with its numbers on the same line: the figure large, its label small. */
function PartHeader({ part }: { part: (typeof KIT_PARTS)[number] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', columnGap: space.xl, rowGap: space.xs }}>
      <span style={{ ...type['label-m'], fontSize: 16, color: color.text.primary }}>{part.heading}</span>
      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: space.xl, rowGap: space.xs }}>
        {part.stats.map((stat) => (
          <span key={stat.label} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ ...type['heading-m'], color: color.text.primary, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</span>
            <span style={{ ...type['body-s'], fontSize: 13, color: TEXT_SOFT }}>{stat.label}</span>
          </span>
        ))}
      </span>
    </div>
  )
}

/** A part's sentence (Figma's, over the board). */
function PartBody({ part }: { part: (typeof KIT_PARTS)[number] }) {
  return <p style={{ ...type['body-s'], margin: 0, fontSize: 14, lineHeight: 1.5, color: TEXT_SOFT, maxWidth: 560 }}>{part.body}</p>
}

/** The tile look the part cards share: the page's light tint, rounded, padded. */
const PART_TILE = { padding: space.lg, borderRadius: radius.lg, background: 'var(--color-bg-tint)' } as const

/**
 * A pane's part as tiles (Nov 26 2026): its heading, numbers and sentence in one tile across the
 * top, and where it splits its count, a tile per side under it (the count on top, what it is under
 * it). The tiles fill their grid cell's height, so the three parts' tiles end level.
 */
function PartCards({ part }: { part: (typeof KIT_PARTS)[number] }) {
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: part.split ? '1fr auto' : '1fr', gap: space.sm }}>
      <div style={{ ...PART_TILE, gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: space.sm }}>
        <PartHeader part={part} />
        <p style={{ ...type['body-s'], margin: 0, fontSize: 14, lineHeight: 1.5, color: TEXT_SOFT }}>{part.body}</p>
      </div>
      {part.split?.map((side) => (
        <div key={side.label} style={{ ...PART_TILE, display: 'flex', flexDirection: 'column', gap: space.xs }}>
          <span style={{ ...type['heading-m'], color: color.text.primary, fontVariantNumeric: 'tabular-nums' }}>{side.value}</span>
          <span style={{ ...type['label-m'], color: color.text.primary }}>{side.label}</span>
          <span style={{ ...type['body-s'], fontSize: 13, lineHeight: 1.45, color: TEXT_SOFT }}>{side.detail}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * The design-system chapter. The opening curved card holds the three-theme slider with the story on
 * its tab; then the kit's heading, numbers and four parts over one board (`KitSection`).
 */
export default function No3yDesignSystemStory({ compare }: { compare?: ComponentProps<typeof CompareSlider> }) {
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState<Zoom | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 48 : 96 }}>
      {/* The page's three-theme slider (Nov 19 2026; the opener until then) leads the chapter, where
          the themes are talked about. The live token bridge it replaced is kept in
          ~/.t3-fork/scratch/no3y-capture/design-system/No3yDesignSystemStory.with-token-bridge.tsx. */}
      <CurvedCard
        media={compare ? <CompareSlider {...compare} /> : null}
        copy={<CurvedCopy heading="Themes & the design system" body={STORY_INTRO} />}
      />

      <KitSection onZoom={setZoom} />

      <Lightbox item={zoom} onClose={() => setZoom(null)} />
    </div>
  )
}
