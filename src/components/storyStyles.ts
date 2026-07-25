import { useIsMobile } from '../hooks/useIsMobile'
import type { Split } from '../data/projects'

/**
 * Colours and geometry shared by the three `ProjectStory` layouts. Split out of
 * `storyParts.tsx` because that file exports components, and mixing the two
 * breaks Fast Refresh.
 */

export const PAGE_BG = 'var(--color-bg-primary)'
export const TEXT = 'var(--color-text-primary)'
export const ORANGE = 'var(--color-orange)'
export const MUTED = 'var(--color-text-muted)'
export const BODY_TEXT = 'var(--color-text-secondary)'
export const BORDER = 'var(--color-border-subtle)'
/** The outro card is orange in both themes, so its pill stays light-on-orange. */
export const PILL_BG = 'var(--color-bg-inverse)'
export const PILL_TEXT = 'var(--color-text-inverse)'

/** Screenshot chrome, not theme surface — these are the browser frame's own colours. */
export const FRAME_BORDER = '#373737'
export const FRAME_BG = '#202124'
export const WALL_BG = 'var(--color-bg-raised)'
export const CARD_BG = '#1a191e'
export const OVERLAY_BORDER = '#3358c1'

/** Page gutter. Layouts pad themselves so one of them can bleed a shot past it. */
export const GUTTER = { desktop: '80px', mobile: '20px' }

export function useGutter() {
  return useIsMobile() ? GUTTER.mobile : GUTTER.desktop
}

/** Content width the Figma file's column measurements were taken at. */
const CONTENT_WIDTH = 1328

/**
 * The one overlapping composition in the file: a 700px browser frame with the
 * 258px sort panel hanging off its bottom-right, 797px wide overall. Everything
 * is a share of that box, so the overlap survives being scaled down.
 */
export const COMPOSITION = { width: 797, base: 700, overlayLeft: 539, overlayTop: 67, height: 434 }

export const pct = (px: number, of: number) => `${(px / of) * 100}%`

/**
 * Two columns in the ratio Figma has them, with the leftover width as the gap —
 * so copy, shot and gutter all scale together.
 */
export function splitStyle(split: Split, alignEnd?: boolean): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `${split.copy}fr ${split.shot}fr`,
    columnGap: pct(CONTENT_WIDTH - split.copy - split.shot, CONTENT_WIDTH),
    alignItems: alignEnd ? 'end' : 'start',
  }
}
