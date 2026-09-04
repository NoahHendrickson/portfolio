/**
 * Design tokens, mirroring the "Mini Design System" page of the July 2026 Figma
 * file. Every value here resolves to a CSS variable declared in `src/index.css`
 * — these are the handles for inline `style={{ ... }}` objects, which is how
 * most components in this repo are written.
 */

export const color = {
  bg: {
    primary: 'var(--color-bg-primary)',
    raised: 'var(--color-bg-raised)',
    inverse: 'var(--color-bg-inverse)',
    cream: 'var(--color-bg-cream)',
    tint: 'var(--color-bg-tint)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
    inverse: 'var(--color-text-inverse)',
  },
  ink: {
    default: 'var(--color-ink)',
    secondary: 'var(--color-ink-secondary)',
    muted: 'var(--color-ink-muted)',
  },
  border: {
    subtle: 'var(--color-border-subtle)',
    default: 'var(--color-border-default)',
    ink: 'var(--color-border-ink)',
  },
  accent: {
    default: 'var(--color-orange)',
    hover: 'var(--color-orange-hover)',
    onAccent: 'var(--color-on-accent)',
  },
} as const

export const space = {
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
  '2xl': 'var(--space-2xl)',
  '3xl': 'var(--space-3xl)',
  '4xl': 'var(--space-4xl)',
  '5xl': 'var(--space-5xl)',
} as const

/** Height ramp for interactive controls. Buttons are sized by height, not padding. */
export const control = {
  xs: 'var(--control-xs)',
  sm: 'var(--control-sm)',
  md: 'var(--control-md)',
  lg: 'var(--control-lg)',
} as const

export const controlPx = { xs: 28, sm: 32, md: 36, lg: 40 } as const

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  '4xl': 'var(--radius-4xl)',
  full: 'var(--radius-full)',
} as const

/** Raw pixel values, for the places that need a number rather than a CSS value. */
export const spacePx = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64, '5xl': 80,
} as const

export const radiusPx = {
  sm: 6, md: 8, lg: 12, xl: 16, '2xl': 24, '3xl': 32, '4xl': 56, full: 1000,
} as const

/**
 * The type ramp. `Display/XL` is fluid on the live site (it drives the hero), so
 * its size is a clamp; every other step is fixed.
 */
export type TypeStyle = {
  fontSize: string
  fontWeight: number
  lineHeight: number
  letterSpacing: string
  textTransform?: 'uppercase'
}

export const type = {
  'display-xl': { fontSize: 'clamp(28px, 8vw, 80px)', fontWeight: 500, lineHeight: 1.05, letterSpacing: '0' },
  'display-l': { fontSize: '40px', fontWeight: 500, lineHeight: 1.1, letterSpacing: '0' },
  'heading-l': { fontSize: '30px', fontWeight: 500, lineHeight: 1.2, letterSpacing: '0' },
  'heading-m': { fontSize: '20px', fontWeight: 500, lineHeight: 1.3, letterSpacing: '0' },
  'body-l': { fontSize: '16px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
  'body-m': { fontSize: '15px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
  'body-s': { fontSize: '14px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
  'label-l': { fontSize: '16px', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0' },
  'label-m': { fontSize: '14px', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0' },
  'label-s': { fontSize: '12px', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0' },
  eyebrow: { fontSize: '12px', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.08em', textTransform: 'uppercase' },
  caption: { fontSize: '12px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
} as const satisfies Record<string, TypeStyle>

export type TypeName = keyof typeof type
