import { useMediaQuery } from './useMediaQuery'

/**
 * 900 rather than 768 so portrait iPads (810–834) get the single-column layout —
 * the desktop shader split leaves only a ~330px text column at those widths.
 * Landscape tablets (1024+) keep the desktop split.
 */
export const MOBILE_BREAKPOINT_PX = 900
export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY)
}
