import { radiusPx } from './design-system/tokens'
import { SHEET_MAX } from './sheetStyle'

/*
  The cream lattice's shared values (Nov 9 2026): rounded cells suspended in the
  rail's cream, the gaps between them carrying on past the grid as cream rules
  that flare into concave fillets. The home bento (`HomeProjects`) came first;
  `components/Cream.tsx` builds project pages from the same values. Kept out of
  the component file, which Fast Refresh wants exporting components only.
*/

export const CREAM = 'var(--color-bg-cream)'
/** The cream between the cells, and round the outside of the grid. */
export const CREAM_GAP = 8
export const CREAM_GAP_PHONE = 6
/** A cell's corner, and the fillets' radius: three times the gap, as drawn. */
export const CREAM_RADIUS = radiusPx['2xl']
export const CREAM_RADIUS_PHONE = radiusPx.xl
/** A project page's grid: the ruled sheet's 1128 of cells, plus its two walls. */
export const CREAM_COLUMN = SHEET_MAX + CREAM_GAP * 2
/** Always this much dark either side of the grid, so the rules and fillets have room. */
export const CREAM_MARGIN = 48

export function creamMetrics(isMobile: boolean) {
  const gap = isMobile ? CREAM_GAP_PHONE : CREAM_GAP
  const pad = isMobile ? 20 : 40
  return {
    gap,
    radius: isMobile ? CREAM_RADIUS_PHONE : CREAM_RADIUS,
    /** Inside a cream cell. */
    pad,
    /** The copy on the bare dark, in line with what's in the cells. */
    inset: gap + pad,
  }
}
