/**
 * The Work tab's three sections, which the experiment's second rail (Figma
 * `365:6192`) switches between. Like the home tab, the choice is session state
 * rather than a path — the whole page lives on `/` — and the key is the same
 * one the old filter pills wrote, so a stale value simply falls back to the
 * first entry.
 */
export type WorkFilter = 'studies' | 'personal' | 'graphic'

export const WORK_FILTERS: { id: WorkFilter; label: string }[] = [
  { id: 'studies', label: 'Case studies' },
  { id: 'personal', label: 'Personal projects' },
  { id: 'graphic', label: 'Graphic design' },
]

const WORK_FILTER_KEY = 'work-filter'

export function readWorkFilter(): WorkFilter {
  const id = sessionStorage.getItem(WORK_FILTER_KEY)
  return WORK_FILTERS.some((filter) => filter.id === id) ? (id as WorkFilter) : 'studies'
}

export function writeWorkFilter(id: WorkFilter) {
  sessionStorage.setItem(WORK_FILTER_KEY, id)
}
