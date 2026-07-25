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
}

/**
 * A two-column row, as the copy and shot widths measured at the Figma file's
 * 1328px content width. The gap is whatever is left over, so the row keeps its
 * proportions at any window size.
 */
export type Split = { copy: number; shot: number }

/** A copy-beside-screenshot block on a landing page. */
export type Feature = {
  heading: string
  body: string
  split: Split
  shot: LandingShot
  /** Panel overlapping the bottom-right of `shot` — geometry in `ProjectStory.tsx`. */
  overlay?: { src: string; alt: string; aspect: string }
}

/** One chat screenshot in the community-feedback wall. */
export type FeedbackShot = {
  src: string
  alt: string
  /** Card width in px at the design's content width; the wall wraps below that. */
  width: number
  /** Aspect ratio of the image inside the card. */
  aspect: string
  /** Card padding in px. Defaults to 16. */
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
  /** Single muted line above the title — not the `eyebrow` array the generic page uses. */
  eyebrow: string
  hero: {
    split: Split
    shot: LandingShot
    /** Paragraphs beside the shot. Defaults to `[project.summary]`. */
    body?: string[]
    /** Bottom-align the shot with the copy block instead of top-aligning it. */
    alignEnd?: boolean
  }
  /** The blocks between the hero and the closing card. */
  features: Feature[]
  feedback?: { heading: string; body: string; shots: FeedbackShot[] }
  /** Closing orange card — replaces `cta` on a landing page. */
  outro: {
    heading: string
    links?: { label: string; href: string }[]
    /** A static pill instead of links — the install command on The Forge. */
    command?: string
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
      eyebrow: 'Design tool | Experimental case study',
      hero: {
        // 468 : 700 with a 160px gap, bottom-aligned so the shot ends level with the copy.
        split: { copy: 468, shot: 700 },
        alignEnd: true,
        body: [
          'Experimental Figma-style design mode for your own app, in your own browser that hands its edits to whatever AI coding agent you already use.',
          'Basically I wanted Cursor’s design mode in Claude. This is a bit of a case study to test a slightly different workflow for a design tool, where as a designer you get the precision of figma like inputs and then the coding agent you prefer applies those changes. So the code becomes the canvas.',
          'I opted for a package that can be installed in your project and is meant to be very easy for coding agents to understand and setup. I may test out a mac app that you load a repo into. This is very much a learning project.',
        ],
        shot: {
          src: '/work/forge/design-mode.png',
          alt: 'Design mode running over a live app — layer tree on the left, three cards on the canvas, properties panel on the right',
          aspect: '700 / 366',
          frame: 'border',
        },
      },
      features: [
        {
          heading: 'Canvas mode',
          body: 'I really wanted the feel of Figma in the code. The ability to pan around and zoom on the page is so engrained in a designers brain.',
          split: { copy: 572, shot: 700 },
          shot: {
            src: '/work/forge/canvas-mode.png',
            alt: 'The same app zoomed out on an infinite canvas at 44%, layer tree and properties panel still docked either side',
            aspect: '700 / 478',
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
      eyebrow: 'Destiny 2 3rd party tool',
      hero: {
        // 491 : 797 with a 40px gap.
        split: { copy: 491, shot: 797 },
        shot: {
          src: '/work/stat-builder/builder.png',
          alt: 'The builder — armor summary, class tabs, six stat sliders, major mods and set bonuses on the left, ranked builds on the right',
          aspect: '797 / 394',
          frame: 'chrome',
        },
      },
      features: [
        {
          heading: 'Table view',
          body: 'Armor 3.0 changed how I ‘looked’ for armor. On top of wanting a fast armor optimizer, I wanted a really easy way to search and filter my armor across the parameters that mattered. Intentionally designed for large screens based on the user base. Users can add custom sorting, pin filter values they use often to make their armor search easy.',
          // The shot column is the 797px composition — a 700px frame with the sort panel hanging off it.
          split: { copy: 499, shot: 797 },
          shot: {
            src: '/work/stat-builder/table.png',
            alt: 'The armor table, filtered by class, archetype, tertiary stat and set bonus',
            aspect: '700 / 388',
            frame: 'chrome',
          },
          overlay: {
            src: '/work/stat-builder/sort-panel.png',
            alt: 'Sort by Tuned — a custom stat order dragged into place',
            aspect: '258 / 303',
          },
        },
      ],
      feedback: {
        heading: 'Community feedback',
        body: 'I started making this for myself and shared in a community discord. Seeing the positive feedback is great, but even better has been getting requests for additional features and users finding bugs.',
        shots: [
          {
            src: '/work/stat-builder/feedback-table-page.jpg',
            alt: '“omg the table page is so good, thank you — this is a dope site, good job, ill add it to #helpful-links”',
            width: 303,
            aspect: '606 / 259',
            bg: '#201f24',
          },
          {
            src: '/work/stat-builder/feedback-helpful-links.jpg',
            alt: 'The app linked in the server’s helpful-links channel — “check available builds and excellent armor filtering”',
            width: 603,
            aspect: '554 / 146',
            pad: 8,
            position: '72% 50%',
          },
          {
            src: '/work/stat-builder/feedback-works-great.jpg',
            alt: '“oh wow! that is absolutely amazing, it seems to work great — thank you so much for implementing”',
            width: 405.5,
            aspect: '352 / 97',
            position: 'left top',
          },
          {
            src: '/work/stat-builder/feedback-best-one.jpg',
            alt: '“Hey dude, I really love your app, its so good and quick — easily the best one out there”',
            width: 498,
            aspect: '996 / 251',
          },
          {
            src: '/work/stat-builder/feedback-owned-only.jpg',
            alt: '“ok one thing i love is that it only shows things i have, it doesnt give me an insanely long list of stuff i cant use”',
            width: 362,
            aspect: '1016 / 881',
          },
        ],
      },
      outro: {
        heading: 'If you happen to be a hard-core Destiny 2 fan, check it out!',
        links: [
          { label: 'D2 Stat Builder', href: 'https://d2-stat-builder-dusky.vercel.app/' },
          { label: 'See the repo', href: 'https://github.com/NoahHendrickson/d2-stat-builder' },
        ],
      },
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
    tagline:
      'Search Destiny 2 weapons by the perks they can roll — and by the rolls sitting in your vault right now.',
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
