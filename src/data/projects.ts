/**
 * Content for the project landing pages rendered by `ProjectLanding.tsx`.
 * Routes live in `App.tsx` — keys here match the `#/work/<slug>` hash.
 *
 * Screenshots: drop files into `public/work/<slug>/` and set `src` on a shot.
 * A shot with no `src` renders the placeholder card with its `label` on it.
 */

const ORANGE = '#f95b1c'
const GREEN = '#1f7a4c'
const INDIGO = '#3d3a8f'
const INK = '#1d1f1e'

export type Shot = {
  /** Shown on the placeholder card until `src` is filled in. */
  label: string
  /** e.g. `/work/forge/panel.png` */
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
  /** Card screenshot, e.g. `/work/forge/hero.png`. */
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
      body: string | string[]
      copyWidth: number
      panelWidth: number
      shot: LandingShot
      /** CSS chrome around a raw screenshot — background defaults to `--color-bg-tint`. */
      panel?: { background?: string }
    }
  /** A centered 688px heading + body block, standing between shots — D2 Stat Builder. */
  | { kind: 'copy'; heading: string; body: string | string[] }
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
   * The Forge's "Github" with an outbound icon.
   */
  eyebrow: string | Array<string | { label: string; href: string }>
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
   * Title + row alignment. `center` (the default) centres the title block and
   * floats Back beside it. `start` stacks Back above the eyebrows and left-aligns
   * the title with the rows — Phanttom.
   */
  align?: 'center' | 'start'
  /** Title block; every page runs it full width of its column. */
  hero: {
    /** Paragraphs under the title. Defaults to `[project.summary]`. */
    body?: string[]
    /** Outbound pills under the title — GitHub / live site, etc. */
    links?: { label: string; href: string }[]
    /** App shot below the copy block. */
    shot?: LandingShot
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
   * page exists. The `#/work/<slug>` route still renders either way.
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
  forge: {
    slug: 'forge',
    title: 'The Forge',
    eyebrow: ['Side project', '2026', 'Design tooling'],
    tagline:
      'A Figma-style design mode for your own app, in your own browser — that hands its edits to whatever AI coding agent you already use.',
    bento: {
      eyebrow: 'Design tooling',
      cover: '/work/forge/hero.png',
      tagline:
        'Experimental Figma-style design mode for your own app, in your own browser that hands its edits to whatever AI coding agent you already use.',
      note: '*UI is largely unfinished',
    },
    pageReady: true,
    landing: {
      // Frame 102:2048 — continuous / left-aligned shell, orange-tinted panels.
      eyebrow: [
        'Vibe coded',
        { label: 'Github', href: 'https://github.com/NoahHendrickson/the-forge' },
      ],
      flow: 'continuous',
      gap: 120,
      align: 'start',
      hero: {
        body: [
          'Experimental Figma-style design mode for your own app, in your own browser that hands its edits to whatever AI coding agent you already use.',
        ],
      },
      sections: [
        {
          kind: 'feature',
          gap: 80,
          heading: 'the idea',
          body: "Basically I wanted Cursor's design mode in Claude. It's not always possible to get the level of precision you want with just prompting and pointing at elements. My workflow consists of a lot of back and forth between different AI coding tools and Figma. While I actually think this workflow is a great way of working, I wanted to try something new. I wanted to make changes like I do in figma and have whatever coding agent i prefer, apply them.",
          copyWidth: 573,
          panelWidth: 572,
          shot: {
            src: '/work/forge/idea-panel.png',
            alt: 'Design mode properties panel over a live app — Layout, Size, Padding and Fill on a selected card',
            aspect: '572 / 430',
            frame: 'plain',
          },
        },
        {
          kind: 'feature',
          gap: 80,
          heading: 'the process',
          body: 'This project has been mostly done without and figma designs yet. I spent a good chunk of time going back and forth with claude to ground out the idea and feature I wanted. I first wanted to prove out the functionality before taking a pass at polishing the UX/UI of it.',
          copyWidth: 387.5,
          panelWidth: 757.5,
          shot: {
            src: '/work/forge/process-panel.png',
            alt: 'The Forge running at localhost over an infinite canvas of Master and Discipline cards',
            aspect: '757.5 / 421.667',
            frame: 'plain',
          },
        },
      ],
      outro: {
        heading: 'Try it in your own project with',
        command: 'npx forge-mode init',
      },
    },
    summary:
      'Run your dev server, flip on design mode, and click any element to get a real properties panel. Scrub padding, drag corner radius, tweak opacity, compare before and after. Every edit previews instantly on the live DOM. When it looks right, The Forge packages the change into a deterministic, token-aware request — exact file and line, py-2.5 → py-6 in your project’s own Tailwind vocabulary — and hands it to Claude Code, Cursor, or Codex to apply to your actual source.',
    accent: ORANGE,
    links: [
      { label: 'GitHub', href: 'https://github.com/NoahHendrickson/the-forge' },
      { label: 'npm — forge-mode', href: 'https://www.npmjs.com/package/forge-mode' },
    ],
    stats: [
      { value: '1', label: 'command to install' },
      { value: '2', label: 'frameworks — Vite & Next' },
      { value: 'file:line', label: 'precision on every edit' },
    ],
    heroShot: {
      label: 'Design mode on, element selected, properties panel open',
      caption: 'The panel lives in a shadow-DOM overlay, so it never inherits a single style from your app.',
    },
    sections: [
      {
        label: 'the problem',
        heading: 'Designers can see the fix. Getting it into the codebase is the expensive part.',
        paragraphs: [
          'I can spot a spacing problem in two seconds and fix it in devtools in ten. Then it evaporates on refresh, and the actual change becomes a screenshot, a Slack thread, and a ticket that gets translated twice before it lands.',
          'Coding agents removed the translation step — but only if you can tell them precisely what to change. “Make the card tighter” gets you slop. “src/App.tsx line 7, py-2.5 → py-6” gets you the change. The Forge is the thing that turns the first sentence into the second.',
        ],
      },
      {
        label: 'how it works',
        heading: 'See → Edit → Package → Deliver → Verify',
        paragraphs: [
          'A dev-only plugin tags every element with its source location, so a click in the browser maps back to an exact line. Edits apply as drafts — inline styles on the live DOM — so your framework is never touched while you explore.',
          'Hit send and the queued drafts go to an agent session over MCP. It applies them to real source, HMR reloads, and the browser re-reads computed styles to confirm the change actually landed before flipping the draft to Implemented.',
        ],
        bullets: [
          'Layout section with a 9-dot align matrix, gap, and size modes',
          'Typography, Fill and Stroke with a popover color picker',
          'A token picker that binds values to your design tokens instead of hardcoding them',
          'Multi-select with relative deltas',
          'Before/after compare and one-click reset on every draft',
        ],
        shots: [
          { label: 'Hover outlines and click-to-inspect', caption: 'M1 — See' },
          { label: 'Properties panel: padding, radius, opacity', caption: 'M2 — Edit' },
          { label: 'Change request with before → after deltas', caption: 'M3 — Package' },
          { label: 'Embedded agent session streaming into the panel', caption: 'M-Embed' },
        ],
      },
      {
        label: 'the bet',
        heading: 'Complementary, never a replacement.',
        paragraphs: [
          'The Forge never owns your workflow. It feeds the agent session you already have open, on the subscription you already pay for — no API keys, no new place to live. Uninstall it and nothing breaks.',
          'That constraint drove most of the design decisions: dev-only, zero production footprint, and a fallback ladder so a send still reaches you whether you’re in an embedded session, a linked watcher, a terminal, or just pasting into a chat.',
        ],
      },
      {
        label: 'what i owned',
        paragraphs: [
          'Everything: the product concept, the interaction model for the panel, the visual design, and the implementation — a Vite plugin, a Next plugin, the shadow-DOM overlay, the Tailwind token mapper, the MCP server, and the npm package.',
          'This is the project where “designer who works in the codebase” stopped being a description of how I work and became the whole product.',
        ],
      },
    ],
    stack: [
      'TypeScript',
      'Vite plugin',
      'Next.js 15/16',
      'Shadow DOM overlay',
      'Tailwind v4 tokens',
      'MCP server',
      'npm package',
    ],
    status: [
      { label: 'See — source-tagged elements + inspect overlay', state: 'shipped' },
      { label: 'Edit — draft engine, scrubbable controls, compare', state: 'shipped' },
      { label: 'Package — token mapper + change requests', state: 'shipped' },
      { label: 'Deliver — MCP loop, /forge-design, verification', state: 'shipped' },
      { label: 'Published — npx forge-mode init, Vite + Next', state: 'shipped' },
      { label: 'Embedded sessions + unified composer', state: 'building' },
      { label: 'Effects, shadows, gradients', state: 'next' },
    ],
    cta: {
      heading: 'Try it in your own project — one command.',
      label: 'npx forge-mode init',
      href: 'https://github.com/NoahHendrickson/the-forge',
    },
  },

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
      // Same continuous / left-aligned shell as Phanttom and The Forge.
      eyebrow: [
        'Vibe coded',
        { label: 'GitHub', href: 'https://github.com/NoahHendrickson/d2-stat-builder' },
        { label: 'Website', href: 'https://d2-stat-builder-dusky.vercel.app/' },
      ],
      flow: 'continuous',
      gap: 120,
      align: 'start',
      hero: {
        body: [
          'This is a tool for my favorite video game of all time, Destiny 2. It’s made for power users and nerds like myself. For those unfamiliar with Destiny 2, this allows you to set preferences and then finds the armor pieces you should equip to achieve that build.',
          'There are other sites that do this, but I wanted to focus mine on the particular needs of hard core players and a change in the armor system that allowed me to speed up the search for builds once a user enters their parameters.',
        ],
        shot: {
          // Frame 443 — browser chrome baked into the export (node 93:5358).
          src: '/work/stat-builder/builder.png',
          alt: 'The builder — armor summary, class tabs, six stat sliders, major mods and set bonuses on the left, ranked builds on the right',
          aspect: '2233 / 1592',
        },
        shotWidth: 1078,
      },
      sections: [
        {
          kind: 'feature',
          gap: 80,
          heading: 'I wanted to make finding my armor easier',
          body: 'The armor system was changed, affecting stats and bonuses you could get. I wanted a really easy way to search and filter my armor across the things that mattered. I built a custom sorting feature that allows users to chain sorts together to mirror the mental model we use to rank armor.',
          copyWidth: 573,
          panelWidth: 572,
          shot: {
            src: '/work/stat-builder/table.png',
            alt: 'The armor table, filtered by class, archetype, tertiary stat and set bonus',
            aspect: '1600 / 1020',
          },
          // Raw screenshot — CSS tinted frame like other D2 panels.
          panel: {},
        },
        {
          // The one overlapping composition in the file — the sort panel laid
          // over the bottom-right of the table frame.
          kind: 'shot',
          width: 1064,
          height: 580,
          frame: { left: 35, top: 24, width: 879.75 },
          shot: {
            src: '/work/stat-builder/table-full.png',
            alt: 'The armor table, filtered by class, archetype, tertiary stat and set bonus',
            aspect: '879.75 / 497',
            frame: 'chrome',
            // 1202px of screenshot inside an 880px frame — the file crops in on
            // the left of the table rather than fitting the whole width.
            zoom: 1.366,
          },
          overlay: {
            src: '/work/stat-builder/sort-panel.png',
            alt: 'Sort by Tuned — a custom stat order dragged into place',
            aspect: '626 / 736',
            left: 780,
            top: 130,
            width: 250,
          },
        },
      ],
      feedback: {
        heading: 'Community feedback',
        shots: [
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
          {
            src: '/work/stat-builder/feedback-owned-only.jpg',
            alt: '“ok one thing i love is that it only shows things i have, it doesnt give me an insanely long list of stuff i cant use”',
            width: 205,
            aspect: '1016 / 881',
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
    tagline: 'Command palette style filter and search for Destiny 2 the video game weapons.',
    bento: {
      eyebrow: 'Destiny 2 - 3rd party tool',
      cover: '/work/armory/hero.png',
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

  phanttom: {
    slug: 'phanttom',
    title: 'Phanttom',
    eyebrow: ['Side project', '2026', 'macOS app'],
    tagline:
      'A terminal built for a desk full of agents — vertical tabs, live status, and a sidebar that tells you which session needs you.',
    bento: {
      eyebrow: 'Design tooling (WIP)',
      cover: '/work/phanttom/hero.png',
      tagline:
        'My fork of ghostty because i wanted vertical tabs with additional information, and it sounded like fun.',
    },
    pageReady: true,
    landing: {
      // Frame 97:8539 — continuous 120px rhythm, feature rows with tinted panels.
      eyebrow: ['Vibe coded', 'Figma+Cursor+Claude'],
      flow: 'continuous',
      gap: 120,
      align: 'start',
      hero: {
        body: [
          'This is a fork of Ghostty, a popular terminal emulator. I wanted to design my own terminal for a few reasons: I really like vertical tabs and more importantly I really wanted to see more information at a glance when using the terminal.',
        ],
      },
      sections: [
        {
          kind: 'feature',
          gap: 80,
          heading: 'the idea',
          body: "In basically every agentic coding tool I've used or seen, a thread is always afforded as a single that is the first message of the session. When it comes to multi-tasking I was finding this a bit annoying. I wasn't always sure what branch I was on, what branch was checked out, or if I was in a worktree. I would need to click into a thread to actually get info. So I explored adding more information to the thread tabs themselves.",
          copyWidth: 573,
          panelWidth: 572,
          shot: {
            src: '/work/phanttom/idea-panel.png',
            alt: 'Phanttom session — vertical sidebar of agent tabs beside a Claude Code terminal',
            aspect: '572 / 430',
            frame: 'plain',
          },
        },
        {
          kind: 'feature',
          gap: 80,
          heading: 'the process',
          body: 'I dove right into claude and talked through how we could fork ghostty with the main goal of adding vertical tabs with more information. Once something was up and running that I could interact with I then went into figma and got precise with the design of the tabs and the information to show.',
          copyWidth: 387.5,
          panelWidth: 757.5,
          shot: {
            src: '/work/phanttom/process-panel.png',
            alt: 'Tab design explorations beside a Phanttom sidebar of session tabs',
            aspect: '757.5 / 421.667',
            frame: 'plain',
          },
        },
      ],
    },
    summary:
      'A fork of Ghostty with tabs moved into a vertical sidebar, a real appearance settings GUI, and first-class support for AI coding agents: tabs that name themselves from your first prompt, working / done / attention status per session, and a pixel-rain indicator that shows a session is alive. Phantom with two t’s, in the spirit of Ghostty’s.',
    accent: INK,
    accentIsDark: true,
    links: [{ label: 'GitHub', href: 'https://github.com/NoahHendrickson/phanttom' }],
    stats: [
      { value: '∞', label: 'tabs that stay readable' },
      { value: '3', label: 'states — working, done, attention' },
      { value: '0', label: 'lines of the Zig core touched' },
    ],
    heroShot: {
      label: 'Sidebar with several agent sessions, one in attention state',
      caption: 'Horizontal tabs stop working at about four sessions. This starts working at four.',
    },
    sections: [
      {
        label: 'the problem',
        heading: 'Six agent sessions, six tabs labelled “zsh”.',
        paragraphs: [
          'Once you’re running several coding agents at once, a horizontal tab strip collapses. Titles truncate to nothing, and there’s no way to tell which session is thinking, which finished, and which is sitting on a permission prompt waiting for you.',
          'The fix isn’t a better tab title. It’s giving the terminal enough of a model of what’s running inside it to say something useful — which meant the app had to understand agent sessions, not just shells.',
        ],
      },
      {
        label: 'what it adds',
        paragraphs: [
          'Everything Phanttom adds lives in the macOS layer. The upstream terminal core is untouched, which keeps rebasing onto new Ghostty releases boring — exactly what you want from a fork you intend to keep.',
        ],
        bullets: [
          'Vertical tabs in a collapsible sidebar with persisted width',
          'Automatic tab names extracted from the first prompt of a session, with a Reset Name action to re-arm it',
          'Per-tab status: working, done, needs attention',
          'Pixel-rain activity indicator so a live session reads as alive at a glance',
          'Git branch per tab, read off the main thread so the UI never stalls',
          'An appearance settings GUI instead of a config file',
          'Signed builds and auto-updates through its own release feed',
        ],
        shots: [
          { label: 'Sidebar, expanded — tabs with names, branches, status', caption: 'Vertical tabs' },
          { label: 'Pixel-rain indicator on an active session', caption: 'Activity' },
          { label: 'Appearance settings window', caption: 'Settings GUI' },
          { label: 'Sidebar collapsed to icons', tall: true, caption: 'Collapsed' },
        ],
      },
      {
        label: 'the craft',
        heading: 'Status has to be earned, not guessed.',
        paragraphs: [
          'Tab state comes from the agent itself — hooks in the session emit escape sequences the app listens for, so “done” means done rather than “output stopped for a few seconds.” Getting that plumbing right meant chasing bytes through four layers of escaping to find a bell character that was arriving as the literal text 007.',
          'The design work was mostly restraint: this is someone’s terminal, and it should still feel like Ghostty. The sidebar borrows the titlebar zone, matches the window’s material, and disappears entirely when you collapse it.',
        ],
      },
    ],
    stack: [
      'Swift',
      'AppKit + SwiftUI',
      'Ghostty (Zig core, untouched)',
      'OSC escape sequences',
      'Claude Code hooks',
      'Sparkle auto-updates',
      'GitHub Releases',
    ],
    status: [
      { label: 'Vertical tab sidebar with collapse + persistence', state: 'shipped' },
      { label: 'Appearance settings GUI', state: 'shipped' },
      { label: 'Agent status, auto-naming, pixel rain', state: 'shipped' },
      { label: 'Signed builds + auto-update feed', state: 'shipped' },
      { label: 'Rebasing onto upstream releases', state: 'building' },
    ],
    cta: {
      heading: 'A terminal that keeps up with how I actually work now.',
      label: 'See the repo',
      href: 'https://github.com/NoahHendrickson/phanttom',
    },
  },
}
