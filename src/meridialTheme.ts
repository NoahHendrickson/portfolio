import type { CSSProperties } from 'react'

/** Meridial's magenta, read off the onboarding prototype captures. */
export const MERIDIAL_ACCENT = '#cb52b9'
export const MERIDIAL_ACCENT_HOVER = '#b5449f'

/**
 * The plate the two studies' screenshots stand on: the product's blue easing into its
 * magenta, a deeper take on both so it holds its edge against a cream card (Nov 9 2026;
 * the product's own pale `#dff2fe` and wash all but vanished there).
 */
export const MERIDIAL_PLATE = 'linear-gradient(135deg, #a9dcfb 0%, #c4d6f9 50%, #eebde5 100%)'

/**
 * The site's accent re-pointed to Meridial's magenta, for the two Meridial
 * studies (onboarding, Explore and apply) — only what reads the accent, like
 * `ContactMenu`, picks it up; the page keeps the sheet's surfaces and text.
 */
export const MERIDIAL_THEME = {
  '--color-orange': MERIDIAL_ACCENT,
  '--color-orange-hover': MERIDIAL_ACCENT_HOVER,
  '--color-on-accent': '#ffffff',
} as CSSProperties
