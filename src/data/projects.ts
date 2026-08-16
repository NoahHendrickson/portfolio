/**
 * Content for the project landing pages rendered by `ProjectLanding.tsx`.
 * Routes live in `App.tsx` — keys here match the `/work/<slug>` path.
 *
 * Screenshots: drop files into `public/work/<slug>/` and set `src` on a shot.
 * A shot with no `src` renders the placeholder card with its `label` on it.
 */

const GREEN = '#1f7a4c'
const INDIGO = '#3d3a8f'
const PURPLE = '#691a85'
const TEAL = '#00a5a5'
/** Nacho Box's pack colour — the lime the 2022 page stood its title art on. */
const LIME = '#cef982'

/** Upstream of the no3y Code fork. */
const T3_CODE = 'https://github.com/pingdotgg/t3code'

export type Shot = {
  /** Shown on the placeholder card until `src` is filled in. */
  label: string
  /** e.g. `/work/stat-builder/panel.png` */
  src?: string
  alt?: string
  caption?: string
  /** Portrait-ish shots sit in a 3:4 card instead of 16:9. */
  tall?: boolean
}

export type Section = {
  /** Muted left-rail label, lowercase — matches the résumé rail on the home page. */
  label: string
  heading?: string
  paragraphs: string[]
  bullets?: string[]
  shots?: Shot[]
}

/**
 * Shorter, more casual copy than the landing page's `eyebrow` / `tagline`. Written
 * for the Work bento; `WorkList.tsx` now reads the taglines for its rows.
 */
export type BentoCopy = {
  /** Muted line above the title, e.g. `Destiny 2 - 3rd party tool`. */
  eyebrow: string
  /** Card screenshot, e.g. `/work/stat-builder/hero.png`. */
  cover: string
  /** Wide and tall cards only — the two compact cards are eyebrow + title. */
  tagline?: string
  /** Small caveat under the tagline, e.g. `*UI is largely unfinished`. */
  note?: string
}

/**
 * A screenshot on a landing page. The image is pinned to the top of its box and
 * clipped by it, so `src` can be a full-page capture that runs longer than the box.
 *
 * `frame` picks the treatment used in the Figma file:
 * - `chrome` — Chrome browser bar (`/work/browser-bar.png`) above a hairline frame
 * - `border` — the same frame, no bar
 * - `plain` — the rounded image on its own (default)
 */
export type LandingShot = {
  src: string
  alt: string
  /** Aspect ratio of the image box — the window below the browser bar, when there is one. */
  aspect: string
  frame?: 'chrome' | 'border' | 'plain'
  /**
   * Image width as a multiple of the box, for the shots the file zooms into
   * rather than fits. Pinned top-left, so the extra runs off the right edge.
   */
  zoom?: number
  /** `object-position` when the box crops the image. */
  position?: string
}

/**
 * A looping clip standing in for the hero `shot` — Moonfang Armory. It plays
 * muted, inline and on a loop with no controls, and `prefers-reduced-motion`
 * falls back to `poster` alone. With no `backdrop` it is cover-fit into
 * `aspect`; with one it sits as a window on the desktop instead.
 */
export type LandingVideo = {
  src: string
  /**
   * Optional HEVC (`hvc1`) encode, listed first so Safari / Chrome-on-Mac can
   * keep a 10-bit file. `src` is the H.264 fallback.
   */
  hevc?: string
  /** Opening frame, shown while the clip loads and in place of it when motion is reduced. */
  poster: string
  /** Describes the clip, since there is no audio track to fall back on. */
  alt: string
  /** Aspect ratio of the box, e.g. `1272 / 862`. */
  aspect: string
  /**
   * Scale of the clip inside its window, for a capture whose subject sits small
   * in the frame — 1.35 crops a quarter off each edge. Defaults to 1 (no crop).
   * Applied for the whole clip unless `zoomAfter` delays it.
   */
  zoom?: number
  /** What the zoom holds still, as a `transform-origin`. Defaults to the centre. */
  focus?: string
  /**
   * Seconds into playback before `zoom` eases in. Reduced-motion keeps the
   * poster at 1×. Without `zoomUntil`, the crop snaps off when the clip loops.
   */
  zoomAfter?: number
  /** Seconds into playback when the crop eases back to 1×. */
  zoomUntil?: number
  /**
   * The macOS desktop the clip is seated on, the way the other heroes bake one
   * into their PNG. Sizes are px at the box's designed width, so the window
   * keeps its margin as the composition scales.
   */
  backdrop?: {
    src: string
    /** Window width; the rest of the box's width is split evenly as margin. */
    width: number
    /** The window's own ratio, e.g. `16 / 9` — it need not match the box. */
    aspect: string
    /** Window corner radius. Defaults to 12. */
    radius?: number
  }
}

/**
 * A panel laid over a screenshot. Its box is px inside the `shot` section's
 * `width` × `height`, so it keeps its overlap as the composition scales.
 */
export type ShotOverlay = {
  src: string
  alt: string
  aspect: string
  left: number
  top: number
  width: number
}

/**
 * One run inside a paragraph, for the copy the file styles in parts — no3y
 * Code's "the idea" sets each project name semibold + underlined and drops the
 * clause after it to the muted ink.
 */
export type TextRun = {
  text: string
  /** A `/work/…` href routes in-app; anything else opens in a new tab. Always underlined. */
  href?: string
  /** Semibold + underlined, which is how the file marks the project names. */
  strong?: boolean
  /** Dropped to `--color-text-muted`, which the file does for trailing clauses. */
  muted?: boolean
}

/** A paragraph — plain text, or runs when the file styles part of it. */
export type Paragraph = string | TextRun[]

/** One paragraph, or several stacked with the file's 24px gap. */
export type Prose = string | Paragraph[]

/**
 * One entry in the hairline-split eyebrow row above a story title — plain copy,
 * an outbound link with its icon (The Forge's "Github"), or runs when only part
 * of the entry is the link ("Fork of T3 Code").
 */
export type EyebrowEntry = string | { label: string; href: string } | TextRun[]

/** A screenshot with its caption underneath — one column of a side-by-side pair. */
export type StoryColumn = {
  /** Column width in px at the file's 1272px content width. */
  width: number
  shot: LandingShot
  /** One paragraph, or several stacked with the file's 16px gap. */
  caption: string | string[]
  /** Caption block narrower than its column, where the file has it so. */
  captionWidth?: number
}

/**
 * A row between the hero and the closing card, centered as a group in the
 * content column. All widths and gaps are px at the file's 1272px content
 * width; the row scales proportionally below it.
 */
export type StorySection =
  /** Screenshots side by side, captions underneath — The Forge. */
  | { kind: 'columns'; gap: number; columns: StoryColumn[] }
  /** One screenshot beside its caption, vertically centered. */
  | {
      kind: 'row'
      gap: number
      shot: LandingShot
      shotWidth: number
      caption: string | string[]
      captionWidth: number
    }
  /**
   * Muted heading + body on the left, tinted media panel on the right —
   * Phanttom / Forge / D2 "the idea" / "the process" rows. Widths are px at
   * the row's designed total (copy + gap + panel); the row scales as `fr` shares.
   * Omit `panel` when the PNG already bakes the tinted chrome (Phanttom, Forge);
   * set it for raw screenshots that need a CSS frame (D2).
   */
  | {
      kind: 'feature'
      gap: number
      heading: string
      body: Prose
      copyWidth: number
      panelWidth?: number
      /** Heading and copy above the media, which then runs the full column. */
      stack?: boolean
      shot?: LandingShot
      /** A looping clip in place of `shot` — no3y Code's design mode row. */
      video?: LandingVideo
      /** CSS clip around the media — background defaults to `--color-bg-tint`. */
      panel?: { background?: string }
      /**
       * Runs the body at 18px on the primary ink instead of 16 on the secondary,
       * which is how the July D2 frame sets its one row.
       */
      lead?: boolean
    }
  /** A centered 688px heading + body block, standing between shots — D2 Stat Builder. */
  | { kind: 'copy'; heading: string; body: Prose }
  /**
   * One screenshot on its own, optionally with a panel laid over it. The box is
   * the whole composition's footprint at the file's 1512 frame; the frame and
   * the overlay are placed inside it as shares, so the group scales as one.
   */
  | {
      kind: 'shot'
      width: number
      height: number
      /** The browser frame's box inside that footprint. */
      frame: { left: number; top: number; width: number }
      shot: LandingShot
      overlay?: ShotOverlay
    }
  /**
   * A full-bleed closing band — no3y Code's "Learning to Design Engineer". The
   * copy sits over a darkened corner of a wallpaper with the screenshot beside
   * it. Every measure is px at the file's content width and the row renders as
   * proportional columns; `height` is the file's, which the band keeps unless
   * the copy wraps past it.
   */
  | {
      kind: 'band'
      width: number
      height: number
      /** The wallpaper filling the box. Decorative, so it carries no alt. */
      background: string
      heading: string
      body: Prose
      /** The pads either side of the two columns. */
      pad: { left: number; right: number }
      copyWidth: number
      shotWidth: number
      shot: LandingShot
    }

/** One chat screenshot in the community-feedback wall. */
export type FeedbackShot = {
  src: string
  alt: string
  /**
   * Card width in px at the design's content width, rendered as an `fr` share
   * of the wall — the row always fills the column and the cards scale together.
   */
  width: number
  /** Aspect ratio of the image inside the card. */
  aspect: string
  /** Card padding in px. Defaults to 6. */
  pad?: number
  /** Card background. Defaults to `#1a191e`. */
  bg?: string
  /** `object-position` for shots the card aspect has to crop. */
  position?: string
}

/**
 * The screenshot-led landing layout rendered by `ProjectStory.tsx` — no stats
 * row, résumé rail, or stack/status grid. A project that sets `landing` gets
 * that page instead of the generic `ProjectLanding`.
 */
export type Landing = {
  /**
   * The muted line above the title. Several entries render as one row split by
   * hairlines ("Vibe coded / Figma+Cursor+Claude"). An entry can be a link —
   * The Forge's "Github" with an outbound icon — or runs, when only part of the
   * entry is the link ("Fork of T3 Code" on no3y Code).
   */
  eyebrow: string | EyebrowEntry[]
  /**
   * Row rhythm. `banded` (the default) makes every row its own 80px-padded
   * band, so consecutive rows sit 184px apart with the page's own 24px gap
   * between them. `continuous` is Forge, D2 and Phanttom: one 80px-padded
   * block with the bands below it butted straight up against it.
   */
  flow?: 'banded' | 'continuous'
  /**
   * Gap between the title block and each row inside a `continuous` page.
   * Defaults to 80 (D2); Phanttom's frame runs 120.
   */
  gap?: number
  /**
   * Gap between the rows themselves, when the frame spaces them wider than it
   * spaces the title block from the hero shot. Defaults to `gap` — no3y Code is
   * the only frame that splits them (120 into the rows, then 200 between them).
   */
  rowGap?: number
  /**
   * Title + row alignment. `center` (the default) centres the title block and
   * floats Back beside it. `start` stacks Back above the eyebrows and left-aligns
   * the title with the rows — Phanttom.
   */
  align?: 'center' | 'start'
  /**
   * Title-block rhythm. `even` (the default) spaces Back, the eyebrow, the title
   * and the body on one gap — Phanttom, The Forge and D2 all run 16. `paired` is
   * no3y Code's frame: 24 between the blocks, with the eyebrow seated flush
   * against the title as a group of its own (the file's Frame 465).
   */
  titleRhythm?: 'even' | 'paired'
  /**
   * Where the eyebrow sits relative to the title. `above` is every frame but
   * Moonfang Armory, which seats it underneath. Only applies to `paired`.
   */
  eyebrowPlacement?: 'above' | 'below'
  /** Title-block width. Defaults to 720; Moonfang Armory's paragraph runs 688. */
  copyWidth?: number
  /**
   * Row alignment on its own, for a frame that left-aligns the title but still
   * centres a row narrower than the content column — no3y Code's composer row is
   * 1225 of 1272. Defaults to `align`.
   */
  rowAlign?: 'center' | 'start'
  /** Title block; every page runs it full width of its column. */
  hero: {
    /** Paragraphs under the title. Defaults to `[project.summary]`. */
    body?: string[]
    /** Outbound pills under the title — GitHub / live site, etc. */
    links?: { label: string; href: string }[]
    /**
     * The one call to action, seated under the copy rather than over it —
     * Moonfang Armory's "Check it out". It takes the accent pill, since it is
     * the only thing on the page asking to be clicked.
     */
    cta?: { label: string; href: string }
    /** App shot below the copy block. */
    shot?: LandingShot
    /** A looping clip in place of `shot` — Moonfang Armory. Shares `shotWidth`. */
    video?: LandingVideo
    /** Its width in px at the 1272px content width. */
    shotWidth?: number
  }
  /** The rows between the hero and the closing card. */
  sections: StorySection[]
  feedback?: { heading: string; body?: string; shots: FeedbackShot[] }
  /** Closing orange card — replaces `cta` on a landing page. Omit to skip it. */
  outro?: {
    heading: string
    links?: { label: string; href: string }[]
    /** A static pill instead of links — the install command on The Forge. */
    command?: string
    /** The file's 40px heading (The Forge) instead of Heading/L. */
    large?: boolean
  }
}

export type Project = {
  slug: string
  title: string
  eyebrow: string[]
  tagline: string
  bento: BentoCopy
  /**
   * Whether the project page is designed enough to link to. Cards in the bento are
   * inert until this is set, so a project can go up on the Work grid before its
   * page exists. The `/work/<slug>` route still renders either way.
   */
  pageReady?: boolean
  landing?: Landing
  summary: string
  accent: string
  /** `true` when the accent is dark enough that the hero card needs light text. */
  accentIsDark?: boolean
  links: { label: string; href: string }[]
  stats: { value: string; label: string }[]
  heroShot: Shot
  sections: Section[]
  stack: string[]
  status: { label: string; state: 'shipped' | 'building' | 'next' }[]
  cta: { heading: string; label: string; href: string }
}

export const projects: Record<string, Project> = {
  'stat-builder': {
    slug: 'stat-builder',
    title: 'D2 Stat Builder',
    eyebrow: ['Side project', '2026', 'Destiny 2'],
    tagline:
      'Tell it the build you want. It searches the gear you actually own and tells you what to equip.',
    bento: {
      eyebrow: 'Destiny 2 - 3rd party tool',
      cover: '/work/stat-builder/hero.png',
    },
    pageReady: true,
    landing: {
      // Frame 121:4922 — the July redo. Title over its eyebrow on an 80px
      // rhythm, one composed hero panel, a single row, then the feedback band.
      eyebrow: ['Third-party tool for the Destiny 2 community.'],
      flow: 'continuous',
      gap: 80,
      align: 'start',
      titleRhythm: 'paired',
      eyebrowPlacement: 'below',
      copyWidth: 688,
      hero: {
        body: [
          'This is a tool for my favorite video game of all time, Destiny 2. I made it for power users and nerds like myself. In Destiny 2 there are different characters, stats and builds you can create. This app helps you find the gear for your perfect stat splits and builds.',
          'Users set their stat targets, make some other selections and watch builds populate in the right column. Once they find a build they like, they can equip it in-game and save it as a loadout.',
        ],
        shot: {
          // Node 240:23742 — the browser frame and its desktop are one export,
          // as the file draws the whole Chrome chrome inside the panel.
          src: '/work/stat-builder/hero-panel.jpg',
          alt: 'The builder — armor summary, class tabs, six stat sliders, major mods and set bonuses on the left, ranked builds on the right',
          aspect: '1272 / 862',
          frame: 'plain',
        },
        shotWidth: 1272,
      },
      sections: [
        {
          kind: 'feature',
          gap: 80,
          heading: 'making finding armor easy',
          body: 'Destiny 2’s in-game vault and existing third-party tools made it difficult to search my armor or identify which pieces to pursue. I went back to basics and designed a table view with quick filters and custom sorting.',
          copyWidth: 524,
          panelWidth: 668,
          lead: true,
          shot: {
            // Node 241:23813 — the table's browser frame runs off the panel's
            // right edge, so the crop is baked into the export.
            src: '/work/stat-builder/table-panel.jpg',
            alt: 'The armor table, filtered by class, archetype, tertiary stat and set bonus, with the custom sort menu open',
            aspect: '668 / 526',
            frame: 'plain',
          },
        },
      ],
      feedback: {
        heading: 'Community feedback',
        // The redo leads with the tall "only shows things i have" shot.
        shots: [
          {
            src: '/work/stat-builder/feedback-owned-only.jpg',
            alt: '“ok one thing i love is that it only shows things i have, it doesnt give me an insanely long list of stuff i cant use”',
            width: 205,
            aspect: '1016 / 881',
            pad: 6,
          },
          {
            src: '/work/stat-builder/feedback-table-page.jpg',
            alt: '“omg the table page is so good, thank you — this is a dope site, good job, ill add it to #helpful-links”',
            width: 171,
            aspect: '606 / 259',
            pad: 6,
            bg: '#201f24',
          },
          {
            src: '/work/stat-builder/feedback-helpful-links.jpg',
            alt: 'The app linked in the server’s helpful-links channel — “check available builds and excellent armor filtering”',
            width: 342,
            aspect: '554 / 146',
            pad: 3,
            position: '72% 50%',
          },
          {
            src: '/work/stat-builder/feedback-works-great.jpg',
            alt: '“oh wow! that is absolutely amazing, it seems to work great — thank you so much for implementing”',
            width: 230,
            aspect: '352 / 97',
            pad: 6,
            position: 'left top',
          },
          {
            src: '/work/stat-builder/feedback-best-one.jpg',
            alt: '“Hey dude, I really love your app, its so good and quick — easily the best one out there”',
            width: 283,
            aspect: '996 / 251',
            pad: 6,
          },
        ],
      },
      // The July frame drops the closing orange card and ends on the footer.
    },
    summary:
      'A Destiny 2 armor optimizer for Armor 3.0. Sign in with Bungie, set targets for the six stats, add the constraints for your build: exotic, set bonuses, fragments, mods, and the optimizer searches your own vault and returns the exact pieces to equip.',
    accent: GREEN,
    accentIsDark: true,
    links: [{ label: 'GitHub', href: 'https://github.com/NoahHendrickson/d2-stat-builder' }],
    stats: [
      { value: '6', label: 'stats to hit at once' },
      { value: '5', label: 'constraint systems layered in' },
      { value: '0', label: 'writes to your account' },
    ],
    heroShot: {
      label: 'Builder panel with stat targets set, results column populated',
      caption: 'Targets on the left, ranked loadouts on the right, no spreadsheet anywhere.',
    },
    sections: [
      {
        label: 'the problem',
        heading: 'Armor 3.0 turned build-crafting into a constraint-satisfaction problem.',
        paragraphs: [
          'Six stats, set bonuses, tuning, fragments, mod costs, and one exotic — all interacting, all pulling from a vault of hundreds of pieces. Players solve it today with spreadsheets, or by eyeballing it and settling.',
          'The interesting design problem isn’t the math. It’s that the answer is only useful if you trust it, which means the UI has to show its work: which constraint is binding, what you gave up, and why this loadout beat the next one.',
        ],
      },
      {
        label: 'what it does',
        paragraphs: [
          'Sign in with Bungie, and the app pulls the manifest, caches it in IndexedDB, and ingests your full inventory including the vault. Set your targets, pick your constraints, and it searches the real combination space and ranks what comes back.',
        ],
        bullets: [
          'Six Armor 3.0 stat targets with live feasibility feedback',
          'Exotic and exotic class-perk selection',
          'Set bonuses, tuning, and fragment picking folded into the search',
          'Mod cost accounted for in the result, not bolted on after',
          'An armory view for inspecting individual pieces',
        ],
        shots: [
          { label: 'Stat target sliders + class emblem tabs', caption: 'Builder panel' },
          { label: 'Ranked build results with sort controls', caption: 'Results' },
          { label: 'Exotic and fragment pickers', caption: 'Constraints' },
          { label: 'Piece inspector', tall: true, caption: 'Armory' },
        ],
      },
      {
        label: 'the craft',
        heading: 'Designing for a player who will absolutely check your math.',
        paragraphs: [
          'The benchmark was D2ArmorPicker and DIM’s Loadout Optimizer — tools this audience already trusts. Anything I shipped got cross-checked against them roll for roll, which meant the design couldn’t hand-wave a single number.',
          'So the UI leans on progressive disclosure: a simple target-setting surface up front, with every derived value traceable back to the piece and mod that produced it. Loading is its own designed state, because a first-run manifest sync is genuinely slow and pretending otherwise reads as broken.',
        ],
      },
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'shadcn/ui',
      'TanStack Query',
      'IndexedDB',
      'Bungie API',
      'Vercel',
    ],
    status: [
      { label: 'Bungie OAuth, read-only', state: 'shipped' },
      { label: 'Manifest pipeline with IndexedDB cache', state: 'shipped' },
      { label: 'Inventory ingestion including vault', state: 'shipped' },
      { label: 'Core optimizer + results UI', state: 'shipped' },
      { label: 'Full constraints — mods, set bonuses, exotics, tuning, fragments', state: 'building' },
      { label: 'Polish + deploy', state: 'next' },
    ],
    cta: {
      heading: 'Built for one very picky player. Me.',
      label: 'See the repo',
      href: 'https://github.com/NoahHendrickson/d2-stat-builder',
    },
  },

  armory: {
    slug: 'armory',
    title: 'Moonfang Armory',
    eyebrow: ['Side project', '2026', 'Destiny 2'],
    tagline: 'A command-palette-style filter and search for Destiny 2 weapons.',
    bento: {
      eyebrow: 'Destiny 2 - 3rd party tool',
      cover: '/work/armory/hero.png',
    },
    pageReady: true,
    landing: {
      // Frame 247:27321 — title above the eyebrow, one 80px-gapped block, and a
      // looping capture of the command palette where the other frames put a shot.
      eyebrow: ['Third-party tool for the Destiny 2 community.'],
      flow: 'continuous',
      gap: 80,
      align: 'start',
      titleRhythm: 'paired',
      eyebrowPlacement: 'below',
      copyWidth: 688,
      hero: {
        body: [
          'So the name of this project is just a popular armor set from Destiny 2, the video game. What this site actually does is allow users to search for weapons in Destiny 2 based on certain perks, traits and many other parameters. It’s a command palette UX that allows for the chaining of many filters.',
        ],
        video: {
          src: '/work/armory/hero.mp4',
          poster: '/work/armory/hero-poster.jpg',
          alt: 'The command palette filtering Destiny 2 weapons down to hand cannons, then chaining further filters across 125 results',
          aspect: '1272 / 862',
          // The palette only fills the middle third of the capture, so the clip
          // crops into it. Its centre sits a little above the frame's, hence 40%.
          zoom: 1.35,
          focus: '50% 40%',
          // Seated on the frame's macOS desktop at the same 80px side margin the
          // other heroes bake into their PNG, so the clip stays a full 16:9.
          backdrop: {
            src: '/work/armory/desktop.jpg',
            width: 1112,
            aspect: '16 / 9',
          },
        },
        shotWidth: 1272,
        cta: { label: 'Check it out', href: 'https://noeyarmory.vercel.app/' },
      },
      sections: [],
    },
    summary:
      'A weapon and perk search app built after D2Foundry went dark. Find a weapon and see every possible random roll per column plus its stats. Find a perk and see every weapon in the game that can roll it. Then sign in with Bungie and run the same searches against the gear you actually own.',
    accent: INDIGO,
    accentIsDark: true,
    links: [{ label: 'GitHub', href: 'https://github.com/NoahHendrickson/noeyarmory' }],
    stats: [
      { value: '2', label: 'directions of search' },
      { value: '6', label: 'filter dimensions' },
      { value: 'client', label: 'side fuzzy search, no round trip' },
    ],
    heroShot: {
      label: 'Weapon detail — perk columns with every possible roll',
      caption: 'The view the game itself never gives you.',
    },
    sections: [
      {
        label: 'the problem',
        heading: 'The community lost its reference tool and went back to wikis.',
        paragraphs: [
          'D2Foundry answered two questions better than anything else: what can this weapon roll, and what rolls this perk. When it went away, players fell back to scattered wikis and spreadsheets that go stale every season.',
          'I rebuilt the parts that mattered on a modern stack, then added the one thing those tools couldn’t do — pointing the same search at your own inventory.',
        ],
      },
      {
        label: 'what it does',
        paragraphs: [
          'Two search directions, one index. Weapon-first gives you every column and every possible perk in it. Perk-first inverts it: name a perk, get every weapon in the game that can roll it, grouped by archetype.',
        ],
        bullets: [
          'Filter by element, weapon type, ammo, rarity, frame, and perk',
          'My Vault — sign in with Bungie and search the weapons you own, at the exact rolls you have',
          'My Armor — owned armor by slot, class, rarity, and equipped mods',
          'Fuzzy search that runs client-side, so results land as you type',
        ],
        shots: [
          { label: 'Weapon search results grid', caption: 'Search' },
          { label: 'Perk-first results — every weapon that rolls it', caption: 'Inverted search' },
          { label: 'My Vault, signed in', caption: 'Owned rolls' },
          { label: 'Filter rail', tall: true, caption: 'Filters' },
        ],
      },
      {
        label: 'the craft',
        heading: 'A design system first, an app second.',
        paragraphs: [
          'The component library is its own package documented in Storybook, with play-function tests running in a real browser alongside the unit suite. Building the primitives first meant the dense parts — perk columns, filter rails, owned-roll badges — could stay consistent instead of drifting per screen.',
          'The data layer takes the Bungie manifest and compiles it into weapon and armor indexes ahead of time, so search is a local fuzzy match rather than a network request. That one decision is what makes the interface feel instant, and it shaped how the whole search UI got designed.',
        ],
      },
    ],
    stack: [
      'Next.js 16',
      'TypeScript',
      'Base UI + shadcn',
      'Tailwind v4',
      'Storybook 10',
      'Vitest',
      'fuse.js',
      'Bungie OAuth',
      'pnpm monorepo',
    ],
    status: [
      { label: 'Weapon → perks, every random roll per column', state: 'shipped' },
      { label: 'Perk → weapons, inverted search', state: 'shipped' },
      { label: 'Filters across six dimensions', state: 'shipped' },
      { label: 'My Vault + My Armor via Bungie OAuth', state: 'building' },
      { label: 'Component library in Storybook', state: 'building' },
    ],
    cta: {
      heading: 'Rebuilding the tool the community lost.',
      label: 'See the repo',
      href: 'https://github.com/NoahHendrickson/noeyarmory',
    },
  },

  'no3y-code': {
    slug: 'no3y-code',
    title: 'no3y Code',
    eyebrow: ['Side project', '2026', 'Agent tooling'],
    tagline:
      'My fork of T3 Code — the sidebar I actually wanted when multi-tasking across agents, plus a design mode built into the harness.',
    bento: {
      eyebrow: 'Agent orchestration UI + Design mode (T3 Code fork)',
      cover: '/work/bento/no3y-code.png',
      tagline:
        'My fork of T3 Code — the sidebar I actually wanted when multi-tasking across agents, plus a design mode built into the harness.',
    },
    pageReady: true,
    landing: {
      // Frame 149:12222 — continuous / left-aligned shell, but the rows sit 200
      // apart where the title block runs 120 into the hero, and the composer row
      // is centred at 1225 of the 1272 column.
      eyebrow: [
        [{ text: 'Fork of ' }, { text: 'T3 Code', href: T3_CODE }],
        'Agent orchestration + Design mode',
      ],
      flow: 'continuous',
      gap: 120,
      rowGap: 200,
      align: 'start',
      rowAlign: 'center',
      titleRhythm: 'paired',
      eyebrowPlacement: 'below',
      hero: {
        body: [
          'This is the culmination of a few projects and ideas. I wanted to edit code with the precision of Figma’s design mode inside an agentic coding tool and tackle issues I have with most tools’ sidebar UX. I forked T3 Code so I could make UX/UI improvements, build a design mode and add small features I want. I am not associated with T3 Code in any way and only work on my fork :)',
        ],
        shot: {
          src: '/work/no3y-code/hero.png',
          alt: 'no3y Code on the desktop — a new portfolio thread asking what we should build',
          aspect: '1728 / 1117',
          frame: 'plain',
        },
        shotWidth: 1272,
      },
      sections: [
        {
          kind: 'feature',
          gap: 80,
          heading: 'the idea',
          body: [
            'I wanted a really powerful design mode in the agent orchestration tools I was using. I didn’t want to just select an element and prompt. Sometimes I wanted to be precise with my edits and send those off to an agent to apply. I also wanted more information at a glance when I was working on multiple projects at once.',
            [
              { text: 'the-forge.', strong: true },
              {
                text: ' I created the-forge, an npm package for Vite apps that provides a design mode for making frontend changes in a sidebar and sending those edits to a coding agent.',
                muted: true,
              },
            ],
            [
              { text: 'Phanttom.', strong: true },
              {
                text: ' This Ghostty fork added vertical tabs and surfaced more useful context for each session. I eventually found that I didn’t want my primary workflow to live in a terminal.',
                muted: true,
              },
            ],
            [
              {
                text: 'I wanted to combine these things to have one main app I used to get things done. But because I lack the technical expertise to create my own agent app from scratch, I forked an open-source one. Huge shout-out to ',
              },
              { text: 'T3 Code', href: T3_CODE },
              { text: '—it’s an awesome open-source app and is very fork-friendly.' },
            ],
          ],
          copyWidth: 625,
          panelWidth: 567,
          shot: {
            src: '/work/no3y-code/idea.png',
            alt: 'no3y Code’s thread sidebar beside the design mode properties panel, over a fluted gradient',
            aspect: '567 / 464',
            frame: 'plain',
          },
        },
        {
          kind: 'feature',
          gap: 80,
          heading: 'Thread cards',
          body: 'One line wasn’t enough. When multitasking across projects and models, I wanted to see the project, branch, and model at a glance. T3 Code provided a strong foundation, and I designed the interface around the context I rely on most.',
          copyWidth: 434.5,
          panelWidth: 757.5,
          shot: {
            src: '/work/no3y-code/sidebar.png',
            alt: 'Thread card v2 — status, prompt, branch and model across default, hover and selected states',
            aspect: '789 / 422',
            frame: 'plain',
          },
        },
        {
          kind: 'feature',
          gap: 80,
          heading: 'Design mode',
          body: [
            'For a while I have been wanting to build a design mode that works alongside coding agents and whatever harness I prefer at the time. This feature is very much a work in progress and I’m building it from scratch. It was important to get it functional so I could actually use and test it out.',
            'My motivation was that, as a designer, I still see enormous value in getting my hands dirty. Sometimes I need to compare variations—16 px or 24 px—and design mode lets me test both before applying the one that works.',
            'Canvas mode was another feature I knew I wanted. It lets you pan around the page and focus on certain areas. It also allowed an easy way to see the page at different sizes.',
          ],
          copyWidth: 720,
          stack: true,
          video: {
            src: '/work/no3y-code/design-mode.mp4',
            hevc: '/work/no3y-code/design-mode-hevc.mp4',
            poster: '/work/no3y-code/design-mode-poster.jpg',
            alt: 'Design mode in no3y Code: the preview opens beside the thread, then an element is selected and a gap change is queued to the agent',
            aspect: '16 / 9',
          },
        },
        {
          // Frame 287:6508 draws the BentoCard at 456×351; the page runs it at
          // the sidebar row's 757.5 so it doesn't sit small under Design mode.
          // The export is square-cornered — MOCKUP_RADIUS clips it in CSS.
          kind: 'feature',
          gap: 80,
          heading: 'Message composer',
          body: 'I prefer a compact message composer and broke it into 3 sections, the branch information, the input and then model parameters.',
          copyWidth: 434.5,
          panelWidth: 757.5,
          shot: {
            src: '/work/no3y-code/composer.png',
            alt: 'The message composer on a gradient card — worktree and branch above the input, mode and model below it',
            aspect: '456 / 351',
            frame: 'plain',
          },
        },
      ],
    },
    /*
      Everything below feeds the generic cream `ProjectLanding`, which this
      project never renders because `landing` is set. Left at what the July frame
      actually says rather than padded out with invented stats.
    */
    summary:
      'This is the culmination of a few projects and ideas. I wanted to edit code with the precision of Figma’s design mode inside an agentic coding tool and tackle issues I have with most tools’ sidebar UX.',
    accent: PURPLE,
    accentIsDark: true,
    links: [{ label: 'T3 Code — upstream', href: T3_CODE }],
    stats: [],
    heroShot: {
      label: 'Thread sidebar, an agent session, and design mode open over a project',
    },
    sections: [
      {
        label: 'the idea',
        paragraphs: [
          'I wanted a really powerful design mode in the agent orchestration tools I was using. I didn’t want to just select an element and prompt. Sometimes I wanted to be precise with my edits and send those off to an agent to apply.',
          'I wanted to combine these things to have one main app I used to get things done. But because I lack the technical expertise to create my own agent app from scratch, I forked an open-source one.',
        ],
      },
      {
        label: 'the sidebar',
        paragraphs: [
          'One line was not enough for me. When multi-tasking and using different models in different projects I wanted more information at a glance about what project I was in, what branch and what model was being used.',
        ],
      },
      {
        label: 'design mode',
        paragraphs: [
          'A design mode that works alongside coding agents and whatever harness I prefer at the time. Very much a work in progress, and built from scratch — it was important to get it functional so I could actually use and test it out.',
        ],
      },
    ],
    stack: [],
    status: [],
    cta: {
      heading: 'Forked from an open-source app that is very fork friendly.',
      label: 'See T3 Code',
      href: T3_CODE,
    },
  },

  'how-to-pc': {
    slug: 'how-to-pc',
    title: 'How To Build a PC',
    eyebrow: ['Graphic Design', '2019', 'Infographic'],
    tagline:
      'A supplemental infographic for building a custom PC — an overview of the parts and the order to install them in.',
    bento: {
      eyebrow: 'Graphic Design',
      cover: '/work/how-to-pc/thumbnail.png',
    },
    pageReady: true,
    landing: {
      // Ported from the 2022 site (Noah-Site, /HowToPC). No Figma frame for this
      // one — it reuses the story shell so it sits on the same dark theme.
      eyebrow: ['Graphic Design', '2019'],
      flow: 'continuous',
      gap: 120,
      align: 'start',
      titleRhythm: 'paired',
      eyebrowPlacement: 'below',
      hero: {
        body: [
          'I am a tech enthusiast, so of course I build my own computers. I wanted to create a supplemental infographic for building a custom PC. The goal of this guide isn’t to get into detail about each step but rather give an overview and suggest an order of process to make the experience easier.',
        ],
      },
      sections: [
        {
          // The poster runs 1378.6 × 5951.8; seated at 880 in the 1272 column so
          // the callout copy stays a readable size rather than filling the page.
          kind: 'shot',
          width: 1272,
          height: 3799,
          frame: { left: 196, top: 0, width: 880 },
          shot: {
            src: '/work/how-to-pc/infographic.svg',
            alt: 'How to Build a PC — a parts legend, then CPU, RAM, AIO cooler, motherboard, PSU and GPU installation steps, ending with the cable-connection checklist',
            aspect: '1378.6 / 5951.8',
            frame: 'plain',
          },
        },
      ],
    },
    /* Generic-landing fields; unused because `landing` is set. */
    summary:
      'A supplemental infographic for building a custom PC. Rather than detailing every step, it gives an overview of the parts and suggests an order of process to make the build easier.',
    accent: TEAL,
    accentIsDark: true,
    links: [],
    stats: [],
    heroShot: {
      label: 'How to Build a PC — the full infographic',
    },
    sections: [
      {
        label: 'the idea',
        paragraphs: [
          'I am a tech enthusiast, so of course I build my own computers. I wanted to create a supplemental infographic for building a custom PC.',
          'The goal of this guide isn’t to get into detail about each step but rather give an overview and suggest an order of process to make the experience easier.',
        ],
      },
    ],
    stack: [],
    status: [],
    cta: {
      heading: 'An overview, not a manual.',
      label: 'See the infographic',
      href: '/work/how-to-pc',
    },
  },

  'nacho-box': {
    slug: 'nacho-box',
    title: 'Nacho Box',
    eyebrow: ['Graphic Design', '2019', 'Packaging'],
    tagline:
      'A chips-and-salsa box for parties — hand-drawn lettering, icons and patterns, carried through to the dieline.',
    bento: {
      eyebrow: 'Graphic Design',
      cover: '/work/nacho-box/thumbnail.png',
    },
    pageReady: true,
    landing: {
      // Ported from the 2022 site (Noah-Site, /NachoBox), same as How to Build a
      // PC. The artwork is black line on white, so every SVG carries a baked
      // background rect — the 2022 page's cream for the sheets, the pack colours
      // for the two dielines — rather than floating on the dark shell.
      eyebrow: ['Graphic Design', '2019'],
      flow: 'continuous',
      gap: 120,
      align: 'start',
      titleRhythm: 'paired',
      eyebrowPlacement: 'below',
      hero: {
        body: [
          'A packaging project I made in college. The goal was to design a convenient chips-and-salsa container for parties and get-togethers—one box, three salsas, and four flavors. I like to showcase this mostly for the graphics and illustrations, as I am really proud of the style I captured.',
        ],
        shot: {
          src: '/work/nacho-box/covers.svg',
          alt: 'Four pack fronts side by side — Original, Kick of Jalapeño, Hint of Lime and Kick of Chile — each over a tortilla-chip pattern with hot, guac and mild bowls along the bottom',
          aspect: '1000 / 500',
        },
        shotWidth: 1272,
      },
      sections: [
        {
          kind: 'copy',
          heading: 'Drawn by hand, cleaned up after',
          body: 'To get an organic vibe, I hand drew all of the lettering and icons with pen and paper, then scanned them in and cleaned them up in Illustrator.',
        },
        {
          kind: 'columns',
          gap: 32,
          columns: [
            {
              width: 620,
              shot: {
                src: '/work/nacho-box/lettering-sketch.jpg',
                alt: 'A spiral sketchbook page of hand-drawn block letters spelling S T R C H P and LIME, with salsa bowls, lime wedges and jalapeño slices around them',
                aspect: '4 / 3',
              },
              caption: 'The original pen-and-paper sheet.',
            },
            {
              width: 620,
              shot: {
                src: '/work/nacho-box/lettering-clean.jpg',
                alt: 'The same sheet after scanning — the notebook and shadows gone, the linework left clean on white',
                aspect: '4 / 3',
              },
              caption: 'The same sheet, scanned and traced.',
            },
          ],
        },
        {
          kind: 'copy',
          heading: 'The finished alphabet',
          body: 'The full character set that came out of it, plus the words the concept kept coming back to.',
        },
        {
          // 890 of the 1272 column — the 2022 page ran the font sheet at 70%.
          kind: 'shot',
          width: 1272,
          height: 679,
          frame: { left: 191, top: 0, width: 890 },
          shot: {
            src: '/work/nacho-box/alphabet.svg',
            alt: 'A hand-drawn A–Z in outlined block capitals, above the words TORTILLA, CHIPS, GUAC, VERDE, JALAPENO, HOT, DIPS, QUESO and CHILE set in the same face, each in a different colour',
            aspect: '590.5 / 450.7',
          },
        },
        {
          kind: 'copy',
          heading: 'Icons for the patterns',
          body: 'The icons took the same approach — sketched first, then redrawn and tiled into a pattern for each flavour.',
        },
        {
          kind: 'shot',
          width: 1272,
          height: 358,
          frame: { left: 0, top: 0, width: 1272 },
          shot: {
            src: '/work/nacho-box/icon-sketches.jpg',
            alt: 'Four sketchbook pages in a row — avocados, tomatoes and tomato slices, chile peppers, and a scatter of tortilla chips beside mild, guac and hot labels',
            aspect: '2560 / 720',
          },
        },
        {
          kind: 'shot',
          width: 1272,
          height: 94,
          frame: { left: 191, top: 0, width: 890 },
          shot: {
            src: '/work/nacho-box/icon-banner.svg',
            alt: 'The ten finished icons in a line — tomato, avocado, chile, lime wedge, jalapeño slice, tortilla chip, salsa bowl, pepper, lime slice and a second chip',
            aspect: '999.2 / 105.8',
          },
        },
        {
          kind: 'shot',
          width: 1272,
          height: 648,
          frame: { left: 0, top: 0, width: 1272 },
          shot: {
            src: '/work/nacho-box/patterns.svg',
            alt: 'Eight pattern sets laid out in a grid, each shown in three colourways — chips, chips with lime, chips with jalapeño, chips with chile, chiles, avocados, tomatoes and limes',
            aspect: '1000 / 509.4',
          },
        },
        {
          kind: 'copy',
          heading: 'The box itself',
          body: 'Flat dielines for two of the four flavours — the pattern runs over the side panels, and THREE SALSAS INSIDE sits on the flap that opens.',
        },
        {
          kind: 'columns',
          gap: 32,
          columns: [
            {
              width: 620,
              shot: {
                src: '/work/nacho-box/package-jalapeno.svg',
                alt: 'The Kick of Jalapeño box laid flat on terracotta — front panel in yellow, side panels in the chip-and-jalapeño pattern, THREE SALSAS INSIDE along the bottom flap',
                aspect: '1 / 1',
              },
              caption: 'Kick of Jalapeño.',
            },
            {
              width: 620,
              shot: {
                src: '/work/nacho-box/package-lime.svg',
                alt: 'The Hint of Lime box laid flat on lime green, in the same construction with the chip-and-lime pattern on its side panels',
                aspect: '1 / 1',
              },
              caption: 'Hint of Lime.',
            },
          ],
        },
      ],
    },
    /* Generic-landing fields; unused because `landing` is set. */
    summary:
      'A packaging project from college — a chips-and-salsa box for parties, with three salsas inside. The lettering, icons and patterns were all drawn by hand and rebuilt in Illustrator.',
    accent: LIME,
    links: [],
    stats: [],
    heroShot: {
      label: 'Nacho Box — the four pack fronts',
    },
    sections: [
      {
        label: 'the idea',
        paragraphs: [
          'This is a packaging project I created in college. My goal was to concept out a convenient chips-and-salsa container for parties or get-togethers.',
          'To achieve an organic vibe, I hand drew all the lettering and icons with pen and paper, then scanned them into Illustrator and cleaned them up.',
        ],
      },
    ],
    stack: [],
    status: [],
    cta: {
      heading: 'One box, three salsas.',
      label: 'See the packaging',
      href: '/work/nacho-box',
    },
  },
}
