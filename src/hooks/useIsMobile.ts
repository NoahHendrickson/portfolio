import { WIDE_MIN } from '../layout'
import { useMediaQuery } from './useMediaQuery'

/**
 * 900 rather than 768 so portrait iPads (810–834) get the single-column layout —
 * the desktop shader split leaves only a ~330px text column at those widths.
 * Landscape tablets (1024+) keep the desktop split.
 */
export const MOBILE_BREAKPOINT_PX = 900
/** The width half on its own, for a `sizes` attribute, which can't take a query list. */
export const MOBILE_WIDTH_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`
/**
 * A phone on its side (932 × 430 at the largest) is past the width breakpoint,
 * but the desktop home is a one-viewport frame: with the Work menu open the
 * rail runs ~520 tall, so the tabs under it fell off a landscape phone's screen
 * with no way to scroll to them. Short touch screens take the mobile layout
 * instead; a short desktop window keeps the split.
 */
export const SHORT_TOUCH_QUERY = '(max-height: 600px) and (pointer: coarse)'
export const MOBILE_QUERY = `${MOBILE_WIDTH_QUERY}, ${SHORT_TOUCH_QUERY}`
export const WIDE_QUERY = `(min-width: ${WIDE_MIN}px)`

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY)
}

export function useIsWide(): boolean {
  return useMediaQuery(WIDE_QUERY)
}
