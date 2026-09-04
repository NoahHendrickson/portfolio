import { NO3Y_CODE_DOWNLOAD, STAT_BUILDER_SITE, projects } from './projects'

/**
 * The Work tab's cards and the sections that group them. Declared here rather
 * than in `WorkList` because the rail's Work menu (`HomeRail`) reads the same
 * sections for its labels and counts, and a component file should export
 * only components. Each card is its art exported whole out of Figma (452.5 ×
 * 250 in the file, shipped at 2x — the Invisible apply and onboarding cards
 * at 4x so the UI type stays sharp) plus the caption copy that has no home
 * in the `Project` type.
 */

export type WorkCard = {
  /** The page the art and the primary pill both go to. */
  href: string
  title: string
  subtitle: string
  art: { src: string; alt: string }
  /**
   * Art laid over the export. How to Build a PC's Figma card is a bare
   * gradient — the file never had its art — so the old thumbnail sits centred
   * at `width`.
   */
  overlay?: { src: string; width?: string }
  /** The pill beside the primary CTA: an external link, or an href-less label
   *  (the file's "@ Invisible Technologies"). */
  extra?: { label: string; href?: string }
}

const no3y: WorkCard = {
  href: '/work/no3y-code',
  title: projects['no3y-code'].title,
  subtitle: 'Agent orchestration tool',
  art: {
    src: '/work/bento/card-no3y.png',
    alt: 'no3y Code — the composer bar over a red-and-violet gradient',
  },
  extra: { label: 'Download from GitHub', href: NO3Y_CODE_DOWNLOAD },
}

const crisp: WorkCard = {
  href: '/work/crisp',
  title: projects.crisp.title,
  subtitle: 'Zoom editor for screen recordings',
  art: {
    src: '/work/bento/card-crisp.png',
    alt: 'Crisp — the circular mark and wordmark on magenta',
  },
}

const statBuilder: WorkCard = {
  href: '/work/stat-builder',
  title: projects['stat-builder'].title,
  subtitle: 'Community tool for Destiny 2',
  art: {
    src: '/work/bento/card-stat-builder.png',
    alt: 'D2 Stat Builder — the armor table in a dark window on yellow',
  },
  extra: { label: 'View the site', href: STAT_BUILDER_SITE },
}

const onboarding: WorkCard = {
  href: '/work/invisible/onboarding',
  title: 'Revitalizing Meridial’s onboarding flow',
  subtitle: 'Research & Product Design',
  art: {
    src: '/work/bento/card-invisible-onboarding.png',
    alt: 'Meridial — the onboarding profile step in a browser, on mauve',
  },
  extra: { label: '@ Invisible Technologies' },
}

const synapse: WorkCard = {
  href: '/work/invisible/synapse',
  title: 'Designing AI training interfaces for Synapse',
  subtitle: 'Product design',
  art: {
    src: '/work/bento/card-invisible-synapse.png',
    alt: 'Synapse — three model responses beside the task panel, on purple',
  },
  extra: { label: '@ Invisible Technologies' },
}

const apply: WorkCard = {
  href: '/work/invisible/apply',
  title: 'Users can apply to projects on Meridial',
  subtitle: 'Product design',
  art: {
    src: '/work/bento/card-invisible-apply.png',
    alt: 'Meridial — Explore split view in a browser, on a light-blue field',
  },
  extra: { label: '@ Invisible Technologies' },
}

const nachoBox: WorkCard = {
  href: '/work/nacho-box',
  title: projects['nacho-box'].title,
  subtitle: 'Packaging and graphic design project',
  art: {
    src: '/work/nacho-box/thumbnail.png',
    alt: 'Nacho Box — the “Hint of Lime” lockup on a chip-pattern yellow',
  },
}

const howToPc: WorkCard = {
  href: '/work/how-to-pc',
  title: projects['how-to-pc'].title,
  subtitle: 'Graphic design project',
  art: {
    src: '/work/bento/card-how-to-pc.png',
    alt: 'How to Build a PC — the graphics-card illustration on magenta',
  },
  // The old card's placement: the title art centred on a 76% measure.
  overlay: { src: '/work/how-to-pc/thumbnail.png', width: '76%' },
}

const armory: WorkCard = {
  href: '/work/armory',
  title: projects.armory.title,
  subtitle: 'Community tool for Destiny 2',
  art: {
    src: '/work/bento/card-armory.png',
    alt: 'Moonfang Armory — a pixel weapon sprite centered on a blue dither',
  },
  extra: { label: 'View the site', href: 'https://noeyarmory.vercel.app/' },
}

/**
 * The sections, in the order the rail's Work menu lists them (Figma
 * `373:12447`). "All" concatenates the same sections so the grid matches
 * the menu; the ids are the ones the old filter pills wrote to
 * sessionStorage, so a stored value stays valid.
 */
export type WorkFilter = 'all' | 'fun' | 'career' | 'graphic'

const SECTIONS: { id: Exclude<WorkFilter, 'all'>; label: string; cards: WorkCard[] }[] = [
  { id: 'career', label: 'Case studies', cards: [onboarding, synapse, apply] },
  { id: 'fun', label: 'Personal projects', cards: [crisp, no3y, statBuilder, armory] },
  { id: 'graphic', label: 'Graphic design', cards: [nachoBox, howToPc] },
]

export const WORK_FILTERS: { id: WorkFilter; label: string; cards: WorkCard[] }[] = [
  { id: 'all', label: 'All', cards: SECTIONS.flatMap((section) => section.cards) },
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
