/**
 * The threads no3y Code's live sidebar replica draws on the no3y Code page.
 *
 * Read off the fork's own showcase seed (`scripts/web-showcase-seed.ts` on the
 * `custom` branch) and the sidebar it renders, so the replica shows the same
 * five projects and fourteen threads the baked captures did — titles, branches,
 * pull requests, models and statuses as the running app paints them. Two
 * things are the app's rather than the seed's: #186 reads as merged (the real
 * PR merged; the seed says open) and OpenAPI spec drift check has settled into
 * the Settled shelf, because its merged PR settles it. Order is the app's
 * activity order (most recent first), which every grouping keeps within its
 * groups.
 *
 * Nothing here is thread *content*: the page only shows the sidebar, so a
 * thread is the facts its card, its hover card and the groupings read.
 */

export type SidebarProjectId = 'lumen' | 'orbit-api' | 'pocketbook' | 't3code' | 'docs'

export type SidebarProject = {
  id: SidebarProjectId
  title: string
  /** The favicon the app serves for the project, as a data URI. */
  favicon: string
}

/**
 * A card's status, as the app resolves it. `limited` and `approval` draw the
 * same amber half circle as `input`; `waiting` is the monitoring pulse;
 * `woke` is the alarm clock; `idle` the hollow ring.
 */
export type SidebarStatus =
  | 'working'
  | 'waiting'
  | 'input'
  | 'approval'
  | 'failed'
  | 'limited'
  | 'done'
  | 'woke'
  | 'idle'

export type SidebarPullRequest = {
  number: number
  state: 'open' | 'merged' | 'draft'
  title: string
}

export type SidebarProvider = 'claude' | 'openai'

export type SidebarThread = {
  id: string
  title: string
  project: SidebarProjectId
  branch: string
  status: SidebarStatus
  /** The card's model label; the hover card prefixes Claude models with "Claude". */
  model: string
  provider: SidebarProvider
  pinned?: boolean
  pr?: SidebarPullRequest
  /** Minutes the run had been going when the page loaded; working threads only. */
  workingFor?: number
  /** The hover card's last line, for a run that stopped on an error. */
  notice?: { tone: 'error' | 'warning'; text: string }
}

function favicon(bg: string, fg: string, glyph: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${bg}"/>${glyph.replace(/\$fg/g, fg)}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const SIDEBAR_PROJECTS: Record<SidebarProjectId, SidebarProject> = {
  lumen: {
    id: 'lumen',
    title: 'lumen',
    favicon: favicon(
      '#f6c453',
      '#1b1b1f',
      `<circle cx="32" cy="32" r="11" fill="$fg"/><g stroke="$fg" stroke-width="4" stroke-linecap="round"><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6"/></g>`,
    ),
  },
  'orbit-api': {
    id: 'orbit-api',
    title: 'orbit-api',
    favicon: favicon(
      '#1f6f78',
      '#e6fbff',
      `<circle cx="32" cy="32" r="9" fill="$fg"/><ellipse cx="32" cy="32" rx="24" ry="9" fill="none" stroke="$fg" stroke-width="3.5" transform="rotate(-25 32 32)"/>`,
    ),
  },
  pocketbook: {
    id: 'pocketbook',
    title: 'pocketbook',
    favicon: favicon(
      '#6b4de6',
      '#ffffff',
      `<rect x="16" y="12" width="32" height="40" rx="6" fill="none" stroke="$fg" stroke-width="4"/><path d="M24 24h16M24 32h16M24 40h10" stroke="$fg" stroke-width="4" stroke-linecap="round"/>`,
    ),
  },
  t3code: {
    id: 't3code',
    title: 't3code',
    favicon: favicon(
      '#000000',
      '#ffffff',
      `<path d="M17 20h14v4h-5v20h-4V24h-5zM36 20h12v4h-8v6h7v4h-7v6h8v4H36z" fill="$fg"/>`,
    ),
  },
  docs: {
    id: 'docs',
    title: 'docs',
    favicon: favicon(
      '#2c2f36',
      '#c9d1d9',
      `<path d="M20 14h18l8 8v28H20z" fill="none" stroke="$fg" stroke-width="4" stroke-linejoin="round"/><path d="M38 14v8h8" fill="none" stroke="$fg" stroke-width="4" stroke-linejoin="round"/><path d="M26 32h12M26 40h12" stroke="$fg" stroke-width="3.5" stroke-linecap="round"/>`,
    ),
  },
}

/** The gear menu lists every project, in the app's order. */
export const SIDEBAR_PROJECT_ORDER: SidebarProjectId[] = ['lumen', 'orbit-api', 'pocketbook', 't3code', 'docs']

/** The thread the page opens on — the one the app had open in every capture. */
export const SIDEBAR_INITIAL_ACTIVE = 'checkout-server-actions'

export const SIDEBAR_THREADS: SidebarThread[] = [
  {
    id: 'sidebar-status-marks',
    title: 'Sidebar status marks pass',
    project: 't3code',
    branch: 'feat/sidebar-status-marks',
    status: 'done',
    model: 'Fable 5.1',
    provider: 'claude',
    // Pinned in the seed; unpinned here (Nov 4 2026) so the page shows no
    // Pinned block. The replica still draws one if a thread sets `pinned`.
    pr: { number: 186, state: 'merged', title: 'fix(desktop): sharper, noise-proof local dictation that returns faster' },
  },
  {
    id: 'flaky-cart-hydration',
    title: 'Fix flaky cart hydration test',
    project: 'lumen',
    branch: 'fix/cart-hydration-test',
    status: 'input',
    model: 'GPT-6-Astra',
    provider: 'openai',
  },
  {
    id: 'pool-exhaustion',
    title: 'Postgres connection pool exhaustion',
    project: 'orbit-api',
    branch: 'fix/pool-exhaustion',
    status: 'input',
    model: 'Opus 5.5',
    provider: 'claude',
  },
  {
    id: 'checkout-server-actions',
    title: 'Migrate checkout to server actions',
    project: 'lumen',
    branch: 'feat/checkout-server-actions',
    status: 'working',
    model: 'Fable 5.1',
    provider: 'claude',
    workingFor: 15,
    pr: { number: 412, state: 'open', title: 'Migrate checkout to server actions' },
  },
  {
    id: 'biometric-crash',
    title: 'Crash on iOS 27 biometric prompt',
    project: 'pocketbook',
    branch: 'fix/biometric-crash',
    status: 'approval',
    model: 'Fable 5.1',
    provider: 'claude',
  },
  {
    id: 'invoice-backfill',
    title: 'Backfill job for legacy invoices',
    project: 'orbit-api',
    branch: 'feat/invoice-backfill',
    status: 'failed',
    model: 'GPT-5.6-Sol',
    provider: 'openai',
    notice: { tone: 'error', text: 'The agent process exited unexpectedly (exit code 1).' },
  },
  {
    id: 'pricing-dark-mode',
    title: 'Dark mode for the pricing page',
    project: 'lumen',
    branch: 'feat/pricing-dark-mode',
    status: 'done',
    model: 'Opus 5.5',
    provider: 'claude',
    pr: { number: 409, state: 'open', title: 'Dark mode for the pricing page' },
  },
  {
    id: 'rate-limiter',
    title: 'Rate limiter for public endpoints',
    project: 'orbit-api',
    branch: 'feat/rate-limiter',
    status: 'working',
    model: 'GPT-6-Astra',
    provider: 'openai',
    workingFor: 42,
  },
  {
    id: 'bundle-audit',
    title: 'Audit bundle size regressions',
    project: 'lumen',
    branch: 'chore/bundle-audit',
    status: 'waiting',
    model: 'Opus 5.5',
    provider: 'claude',
    pr: { number: 401, state: 'draft', title: 'Trim the marketing bundle' },
  },
  {
    id: 'offline-sync',
    title: 'Offline sync conflict resolution',
    project: 'pocketbook',
    branch: 'feat/offline-sync',
    status: 'working',
    model: 'Opus 5.5',
    provider: 'claude',
    workingFor: 73,
  },
  {
    id: 'dependency-bump',
    title: 'Nightly dependency bump',
    project: 'orbit-api',
    branch: 'chore/deps',
    status: 'limited',
    model: 'Fable 5.1',
    provider: 'claude',
    notice: { tone: 'warning', text: 'You have hit your usage limit for this session. It resets at 6:00 PM.' },
  },
  {
    id: 'csp-headers',
    title: 'Tighten CSP headers',
    project: 'lumen',
    branch: 'main',
    status: 'idle',
    model: 'GPT-6-Astra',
    provider: 'openai',
  },
  {
    id: 'swipe-haptics',
    title: 'Haptics on transaction swipe',
    project: 'pocketbook',
    branch: 'feat/swipe-haptics',
    status: 'woke',
    model: 'GPT-6-Astra',
    provider: 'openai',
  },
  {
    id: 'expo-sdk',
    title: 'Upgrade Expo SDK',
    project: 'pocketbook',
    branch: 'chore/expo-55',
    status: 'idle',
    model: 'Fable 5.1',
    provider: 'claude',
  },
]

/** The collapsed shelves under the list, with the counts the app shows. */
export const SIDEBAR_SHELVES = { snoozed: 2, settled: 5 }

/** The machine every thread runs on, as the hover card names it. */
export const SIDEBAR_MACHINE = 'noey’s MacBook Pro (2)'

export type SidebarGrouping = 'none' | 'project' | 'status'

/** One of the page's controls under the live sidebar: a grouping (a radio) or compact cards (a toggle). */
export type SidebarPlaygroundOption = {
  label: string
  caption: string
  grouping?: SidebarGrouping
  compact?: true
}

export type SidebarStatusSection = 'pinned' | 'input' | 'completed' | 'working' | 'idle'

export const SIDEBAR_STATUS_SECTIONS: { key: SidebarStatusSection; label: string }[] = [
  { key: 'pinned', label: 'Pinned' },
  { key: 'input', label: 'Needs input' },
  { key: 'completed', label: 'Completed' },
  { key: 'working', label: 'Working' },
  { key: 'idle', label: 'Idle' },
]

/** Which status section a thread sorts into under "Group by status". */
export function statusSection(thread: SidebarThread): SidebarStatusSection {
  if (thread.pinned) return 'pinned'
  switch (thread.status) {
    case 'input':
    case 'approval':
    case 'failed':
    case 'limited':
      return 'input'
    case 'done':
    case 'woke':
      return 'completed'
    case 'working':
    case 'waiting':
      return 'working'
    case 'idle':
      return 'idle'
  }
}

/** The label screen readers and the hover card use for a status. */
export const STATUS_LABEL: Record<SidebarStatus, string | null> = {
  working: 'Working',
  waiting: 'Waiting',
  input: 'Needs input',
  approval: 'Needs approval',
  failed: 'Failed',
  limited: 'Usage limit reached',
  done: 'Done',
  woke: 'Woke from snooze',
  idle: null,
}

/**
 * The Petals section: the app's bots (Nov 15 2026), the three the Inlet clips show. Each card is
 * the app's bot card (`SidebarV2BotCardBody`): the mascot, the name, a status line in words, and
 * the trailing time and status mark. A working bot's mark is the monitoring breath, not the
 * working rain or ring, since its mascot already shows the work. Mascots are the app's own
 * sprites (`botMascotArt.ts`), copied off the running app's SVGs as path data.
 */
export type SidebarBotSprite = {
  width: number
  height: number
  /** One path per fill, cells on a 1-unit grid. */
  paths: { d: string; fill: string }[]
}

export type SidebarBot = {
  id: string
  name: string
  status: 'idle' | 'working'
  /** The card's second line. */
  line: string
  /** Minutes the run had been going when the page loaded; working bots only. */
  workingFor?: number
  /** The mascot's shape and mood, as the app names them. */
  mascot: { shape: string; mood: string; sprite: SidebarBotSprite }
}

export const SIDEBAR_BOTS: SidebarBot[] = [
  {
    id: 'bot:flake-hunter',
    name: "Flake hunter",
    status: 'idle',
    line: "Next check in 2h",
    mascot: {
      shape: 'Ginkgo',
      mood: 'Sleeping',
      sprite: {
        width: 17,
        height: 14,
        paths: [
          { fill: '#000000', d: 'M1 0h6v1h-6zM10 0h6v1h-6zM0 1h1v1h-1zM7 1h1v1h-1zM9 1h1v1h-1zM16 1h1v1h-1zM0 2h1v1h-1zM8 2h1v1h-1zM16 2h1v1h-1zM0 3h1v1h-1zM16 3h1v1h-1zM1 4h1v1h-1zM15 4h1v1h-1zM2 5h1v1h-1zM14 5h1v1h-1zM3 6h1v1h-1zM5 6h3v1h-3zM9 6h3v1h-3zM13 6h1v1h-1zM4 7h1v1h-1zM12 7h1v1h-1zM5 8h1v1h-1zM11 8h1v1h-1zM6 9h1v1h-1zM8 9h1v1h-1zM10 9h1v1h-1zM7 10h3v1h-3zM8 11h1v1h-1zM8 12h1v1h-1zM8 13h1v1h-1z' },
          { fill: '#fcb01a', d: 'M1 1h6v1h-6zM1 2h7v1h-7zM10 2h5v1h-5zM1 3h14v1h-14zM2 4h12v1h-12zM3 5h10v1h-10zM4 6h1v1h-1zM8 6h1v1h-1zM5 7h7v1h-7zM6 8h5v1h-5zM7 9h1v1h-1zM9 9h1v1h-1z' },
          { fill: '#ffd233', d: 'M10 1h6v1h-6zM9 2h1v1h-1zM15 2h1v1h-1zM15 3h1v1h-1zM14 4h1v1h-1zM13 5h1v1h-1zM12 6h1v1h-1z' },
        ],
      },
    },
  },
  {
    id: 'bot:release-scout',
    name: "Release scout",
    status: 'idle',
    line: "Next check in 2h",
    mascot: {
      shape: 'Sakura',
      mood: 'Sleeping',
      sprite: {
        width: 13,
        height: 15,
        paths: [
          { fill: '#000000', d: 'M2 0h3v1h-3zM8 0h3v1h-3zM1 1h1v1h-1zM5 1h1v1h-1zM7 1h1v1h-1zM11 1h1v1h-1zM0 2h1v1h-1zM6 2h1v1h-1zM12 2h1v1h-1zM0 3h1v1h-1zM12 3h1v1h-1zM0 4h1v1h-1zM12 4h1v1h-1zM0 5h1v1h-1zM12 5h1v1h-1zM0 6h1v1h-1zM12 6h1v1h-1zM1 7h1v1h-1zM3 7h3v1h-3zM7 7h3v1h-3zM11 7h1v1h-1zM1 8h1v1h-1zM11 8h1v1h-1zM2 9h1v1h-1zM10 9h1v1h-1zM3 10h1v1h-1zM9 10h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1zM5 12h3v1h-3zM6 13h1v1h-1zM6 14h1v1h-1z' },
          { fill: '#ff4f95', d: 'M2 1h3v1h-3zM1 2h5v1h-5zM8 2h3v1h-3zM1 3h10v1h-10zM1 4h10v1h-10zM1 5h10v1h-10zM1 6h10v1h-10zM2 7h1v1h-1zM6 7h1v1h-1zM4 8h5v1h-5zM3 9h7v1h-7zM4 10h2v1h-2zM7 10h2v1h-2zM5 11h1v1h-1zM7 11h1v1h-1z' },
          { fill: '#ff8ab8', d: 'M8 1h3v1h-3zM7 2h1v1h-1zM11 2h1v1h-1zM11 3h1v1h-1zM11 4h1v1h-1zM11 5h1v1h-1zM11 6h1v1h-1zM10 7h1v1h-1z' },
          { fill: '#ffc2d9', d: 'M2 8h2v1h-2zM9 8h2v1h-2z' },
          { fill: '#d8357a', d: 'M6 10h1v1h-1zM6 11h1v1h-1z' },
        ],
      },
    },
  },
  {
    id: 'bot:dependabot',
    name: "Dependabot",
    status: 'working',
    line: "Working on it…",
    workingFor: 3,
    mascot: {
      shape: 'Oak',
      mood: 'Thinking',
      sprite: {
        width: 13,
        height: 19,
        paths: [
          { fill: '#000000', d: 'M5 0h3v1h-3zM4 1h1v1h-1zM8 1h1v1h-1zM3 2h1v1h-1zM9 2h1v1h-1zM2 3h1v1h-1zM10 3h1v1h-1zM1 4h1v1h-1zM11 4h1v1h-1zM1 5h1v1h-1zM11 5h1v1h-1zM2 6h1v1h-1zM10 6h1v1h-1zM1 7h1v1h-1zM4 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM0 8h1v1h-1zM4 8h2v1h-2zM8 8h2v1h-2zM12 8h1v1h-1zM0 9h1v1h-1zM12 9h1v1h-1zM1 10h1v1h-1zM11 10h1v1h-1zM0 11h1v1h-1zM12 11h1v1h-1zM0 12h1v1h-1zM6 12h1v1h-1zM12 12h1v1h-1zM1 13h1v1h-1zM4 13h1v1h-1zM6 13h1v1h-1zM8 13h1v1h-1zM11 13h1v1h-1zM2 14h1v1h-1zM5 14h3v1h-3zM10 14h1v1h-1zM3 15h1v1h-1zM6 15h1v1h-1zM9 15h1v1h-1zM4 16h5v1h-5zM6 17h1v1h-1zM6 18h1v1h-1z' },
          { fill: '#008755', d: 'M5 1h2v1h-2zM4 2h4v1h-4zM3 3h6v1h-6zM2 4h8v1h-8zM2 5h8v1h-8zM3 6h6v1h-6zM2 7h2v1h-2zM6 7h2v1h-2zM1 8h3v1h-3zM6 8h2v1h-2zM10 8h1v1h-1zM1 9h10v1h-10zM2 10h9v1h-9zM1 11h11v1h-11zM1 12h5v1h-5zM7 12h5v1h-5zM2 13h2v1h-2zM5 13h1v1h-1zM7 13h1v1h-1zM9 13h2v1h-2zM3 14h2v1h-2zM8 14h2v1h-2zM4 15h2v1h-2zM7 15h2v1h-2z' },
          { fill: '#08b776', d: 'M7 1h1v1h-1zM8 2h1v1h-1zM9 3h1v1h-1zM10 4h1v1h-1zM10 5h1v1h-1zM9 6h1v1h-1zM10 7h1v1h-1zM11 8h1v1h-1zM11 9h1v1h-1z' },
          { fill: '#f5efe0', d: 'M5 7h1v1h-1zM9 7h1v1h-1z' },
        ],
      },
    },
  },
]
