import { useIsMobile } from '../../hooks/useIsMobile'

/** Colours and geometry for the D2 Stat Builder showcase variants. */

export const PAGE_BG = 'var(--color-bg-primary)'
export const TEXT = 'var(--color-text-primary)'
export const MUTED = 'var(--color-text-muted)'
export const BODY_TEXT = 'var(--color-text-secondary)'
export const BORDER = 'var(--color-border-subtle)'
export const ORANGE = 'var(--color-orange)'
/** The outro card is orange, so its pill stays light-on-orange. */
export const PILL_BG = 'var(--color-bg-inverse)'
export const PILL_TEXT = 'var(--color-text-inverse)'
export const WALL_BG = 'var(--color-bg-raised)'
export const CARD_BG = '#1a191e'

/** Screenshot chrome — the browser frame's own colours, not theme surfaces. */
export const FRAME_BORDER = '#373737'
export const FRAME_BG = '#202124'
export const OVERLAY_BORDER = '#3358c1'

export const GUTTER = { desktop: '80px', mobile: '20px' }

export function useGutter() {
  return useIsMobile() ? GUTTER.mobile : GUTTER.desktop
}

/** Sort-panel overlap composition from the Figma file. */
export const COMPOSITION = { width: 797, base: 700, overlayLeft: 539, overlayTop: 67, height: 434 }

export const pct = (px: number, of: number) => `${(px / of) * 100}%`

/** Live product + repo — the two CTAs every variant shares. */
export const APP_HREF = 'https://d2-stat-builder-dusky.vercel.app/'
export const REPO_HREF = 'https://github.com/NoahHendrickson/d2-stat-builder'

/**
 * Pull quotes distilled from the Discord screenshots. Product pages sell with
 * a line or two of social proof, not a wall of chat cards.
 */
export const QUOTES = [
  { text: 'Easily the best one out there.', attribution: 'Community' },
  { text: 'The table page is so good — this is a dope site.', attribution: 'Community' },
  {
    text: 'It only shows things I have. No insanely long list of stuff I can’t use.',
    attribution: 'Community',
  },
] as const
