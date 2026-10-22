import { NO3Y_CODE_DOWNLOAD, STAT_BUILDER_SITE, projects } from './projects'

/**
 * The Work tab's cards and the sections that group them. Declared here rather
 * than in `WorkList` because the rail's Work menu (`HomeRail`) reads the same
 * sections for its labels and counts, and a component file should export
 * only components. Each card is its art exported whole out of Figma (452.5 ×
 * 250 in the file, shipped at 2x — the Invisible cards at 4x so the UI type
 * stays sharp) plus the caption copy that has no home in the `Project` type.
 */

export type WorkCard = {
  /** The page the art and the primary pill both go to. */
  href: string
  title: string
  subtitle: string
  /**
   * `srcSet` lists smaller cuts of a 4x export (see `cuts`), so the browser
   * scales from the nearest one rather than halving the 1810 itself.
   */
  art: { src: string; alt: string; srcSet?: string }
  /**
   * Art laid over the export. How to Build a PC's card is a bare field — the
   * Figma file never had its art — so the old thumbnail sits centred at
   * `width`.
   */
  overlay?: { src: string; width?: string }
  /** The pill beside the primary CTA: an external link, or an href-less label
   *  (the file's "@ Invisible Technologies"). */
  extra?: { label: string; href?: string }
  /**
   * What the card adds when it runs as one of All's featured rows — the
   * larger cards over the grid. `results` are its outcomes, a short sentence
   * each; a card without results carries a `blurb` instead.
   */
  feature?: { blurb?: string; results?: string[] }
}

/**
 * A 4x export (1810 wide) with its 900 and 1300 cuts beside it, as
 * `<name>-900.<ext>` / `<name>-1300.<ext>`, Lanczos-resized from the export.
 * Left to itself the browser draws an 1810 card into a ~440 box by more than
 * halving it, which crunches the UI type and turns no3y Code's halftone
 * wallpaper into moiré; with the cuts no downscale runs past ~1.5×. Re-cut
 * all three if the export changes. `width` is the master's own width.
 */
function cuts(src: string, width = 1810) {
  const dot = src.lastIndexOf('.')
  const [base, ext] = [src.slice(0, dot), src.slice(dot)]
  return `${base}-900${ext} 900w, ${base}-1300${ext} 1300w, ${src} ${width}w`
}

/**
 * The zoomed cut of a card (`<name>-zoom.<ext>`, 1392 × 769): the export
 * cropped 1.3× in from the window's top-left, so the UI type reads 30%
 * larger in the box and the window runs off the right edge. Its 900 and 1300
 * cuts are lightly sharpened after the resize.
 */
function zoomed(src: string, alt: string) {
  const dot = src.lastIndexOf('.')
  const zoom = `${src.slice(0, dot)}-zoom${src.slice(dot)}`
  return { src: zoom, srcSet: cuts(zoom, 1392), alt }
}

const no3y: WorkCard = {
  href: '/work/no3y-code',
  title: projects['no3y-code'].title,
  subtitle: 'Agent orchestration tool',
  // Not a Figma export: the page's new-agent capture (`collage/new-agent.webp`)
  // cropped from the top to the card's box, so the window clips at the foot.
  art: {
    src: '/work/bento/card-no3y-agent.jpg',
    srcSet: cuts('/work/bento/card-no3y-agent.jpg'),
    alt: 'no3y Code — the new-agent screen on the Glass theme, over a fluted gradient',
  },
  extra: { label: 'Download from GitHub', href: NO3Y_CODE_DOWNLOAD },
  feature: { blurb: projects['no3y-code'].tagline },
}

const crisp: WorkCard = {
  href: '/work/crisp',
  title: projects.crisp.title,
  subtitle: 'Zoom editor for screen recordings',
  art: {
    src: '/work/bento/card-crisp.webp',
    alt: 'Crisp — the circular mark and wordmark on magenta',
  },
}

const statBuilder: WorkCard = {
  href: '/work/stat-builder',
  title: projects['stat-builder'].title,
  subtitle: 'Community tool for Destiny 2',
  // Not a Figma export: the optimizer's builds column alone, every card
  // collapsed, captured at 3x in a 2560-wide window (narrower and the column
  // drops under its 649px max and the card headers wrap) from the app's
  // verify-d2 harness (stubbed backend, its fixture reshaped to 550-power
  // Armor 3.0 so the masterwork costs resolve) and laid on the old
  // card's yellow, clipped at the foot like no3y Code's. Baked at 2x with
  // headless Chrome, JPEG 4:4:4 so the small UI type holds.
  art: zoomed(
    '/work/bento/card-d2-builds.jpg',
    'D2 Conflux — the builds column, a list of stat builds, on yellow',
  ),
  extra: { label: 'View the site', href: STAT_BUILDER_SITE },
}

const onboarding: WorkCard = {
  href: '/work/invisible/onboarding',
  title: 'Meridial’s Onboarding Redesign',
  subtitle: 'Research & Product Design',
  art: {
    src: '/work/bento/card-invisible-onboarding.webp',
    srcSet: cuts('/work/bento/card-invisible-onboarding.webp'),
    alt: 'Meridial — the onboarding profile step in a browser, on mauve',
  },
  extra: { label: '@ Invisible Technologies' },
  // The study's "Measureable outcomes", from its 50/50 experiment.
  feature: {
    results: [
      'Doubled overall funnel conversion',
      // A non-breaking hyphen, so a narrow column doesn't split "drop-off".
      'Increased conversion 4× at the biggest drop‑off',
      'Lifted mobile profile completion by 50%',
    ],
  },
}

const synapse: WorkCard = {
  href: '/work/invisible/synapse',
  title: 'Launching Synapse',
  subtitle: 'Annotation platform for AI training',
  // The file's card only ever came out at 2x, so it was rebuilt at 4x: the
  // task window from its vector frame (`293:18293`, the annotations platform
  // page) laid on the old card's purple, upscaled, at the old card's
  // placement to the pixel.
  art: zoomed(
    '/work/bento/card-invisible-synapse.webp',
    'Synapse — three model responses beside the task panel, on purple',
  ),
  extra: { label: '@ Invisible Technologies' },
}

const apply: WorkCard = {
  href: '/work/invisible/apply',
  title: 'Meridial’s Explore & Apply',
  subtitle: 'Finding and applying to AI projects',
  // The whole window, not zoomed, but its 900 and 1300 cuts are sharpened
  // after the resize like the zoomed cards', so its small UI type holds up.
  art: {
    src: '/work/bento/card-invisible-apply.webp',
    srcSet: cuts('/work/bento/card-invisible-apply.webp'),
    alt: 'Meridial — Explore split view in a browser, on a light-blue field',
  },
  extra: { label: '@ Invisible Technologies' },
}

const nachoBox: WorkCard = {
  href: '/work/nacho-box',
  title: projects['nacho-box'].title,
  subtitle: 'Packaging and graphic design project',
  art: {
    src: '/work/nacho-box/thumbnail.webp',
    alt: 'Nacho Box — the “Lime” lockup on a chip-pattern yellow',
  },
}

const howToPc: WorkCard = {
  href: '/work/how-to-pc',
  title: projects['how-to-pc'].title,
  subtitle: 'Graphic design project',
  art: {
    src: '/work/bento/card-how-to-pc.webp',
    alt: 'How to Build a PC — the title and graphics-card illustration on teal',
  },
  // A flat field in the infographic's own teal (#00A5A5), not the Figma
  // card's magenta gradient. The old card's placement: the title art centred
  // on a 76% measure.
  overlay: { src: '/work/how-to-pc/thumbnail.webp', width: '76%' },
}

const pixelArt: WorkCard = {
  href: '/work/pixel-art',
  title: projects['pixel-art'].title,
  subtitle: 'Destiny 2 gear, one pixel at a time',
  art: {
    src: '/work/bento/card-pixel-art.webp',
    alt: 'All ten pixel art Destiny 2 inventory icons in two rows on charcoal',
  },
}

/**
 * The sections, in the order the rail's Work menu lists them (Figma
 * `373:12447`). "All" runs the same sections in that order, except that it
 * leads with `ALL_LEAD`; the ids are the ones the old filter pills wrote to
 * sessionStorage, so a stored value stays valid.
 */
export type WorkFilter = 'all' | 'fun' | 'career' | 'graphic'

const SECTIONS: { id: Exclude<WorkFilter, 'all'>; label: string; cards: WorkCard[] }[] = [
  { id: 'career', label: 'Case studies', cards: [onboarding, synapse, apply] },
  { id: 'fun', label: 'Personal projects', cards: [crisp, no3y, statBuilder] },
  { id: 'graphic', label: 'Graphic design', cards: [pixelArt, nachoBox, howToPc] },
]

/**
 * The cards All opens on, larger and ahead of the grid (which then leaves
 * them out). The other filters list them in their own sections as usual.
 */
export const FEATURED: WorkCard[] = [onboarding, no3y]

/** All's opening run: the featured pair, then D2 Conflux heading the grid. */
const ALL_LEAD: WorkCard[] = [...FEATURED, statBuilder]

export const WORK_FILTERS: { id: WorkFilter; label: string; cards: WorkCard[] }[] = [
  {
    id: 'all',
    label: 'All',
    cards: [
      ...ALL_LEAD,
      ...SECTIONS.flatMap((section) => section.cards).filter((card) => !ALL_LEAD.includes(card)),
    ],
  },
  ...SECTIONS,
]

/** Survives refresh — the whole home page lives on `/`, so the filter isn't in the path. */
const WORK_FILTER_KEY = 'work-filter'

export function readWorkFilter(): WorkFilter {
  const id = sessionStorage.getItem(WORK_FILTER_KEY)
  return WORK_FILTERS.some((filter) => filter.id === id) ? (id as WorkFilter) : 'all'
}

export function writeWorkFilter(id: WorkFilter) {
  sessionStorage.setItem(WORK_FILTER_KEY, id)
}
