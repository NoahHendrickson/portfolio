import { color } from './tokens'

/**
 * Shared between `Button` and `IconButton` so the two can never drift. Mirrors
 * the Style x State matrix of the Figma `Button` / `Icon Button` component sets.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonState = 'default' | 'hover' | 'disabled'

export const VARIANTS = {
  primary: {
    default: { background: color.accent.default, borderColor: color.accent.default, color: color.accent.onAccent },
    hover: { background: color.accent.hover, borderColor: color.accent.hover, color: color.accent.onAccent },
  },
  secondary: {
    default: { background: color.bg.cream, borderColor: color.bg.cream, color: color.text.inverse },
    hover: { background: color.bg.cream, borderColor: color.bg.cream, color: color.text.inverse },
  },
  ghost: {
    default: { background: 'transparent', borderColor: color.border.default, color: color.text.primary },
    hover: { background: color.border.subtle, borderColor: color.border.default, color: color.text.primary },
  },
} as const

/** Secondary has no distinct hover fill in the system — it dims instead. */
export const HOVER_OPACITY = 0.88
export const DISABLED_OPACITY = 0.4

/**
 * Icon sizes paired to each control height. `xs` steps down to 14 so the icon
 * stays in proportion to its 12px label; `md` and `lg` share 20.
 */
export const ICON_SIZE = { xs: 14, sm: 16, md: 20, lg: 20 } as const

export function resolvePalette(variant: ButtonVariant, state: ButtonState) {
  return VARIANTS[variant][state === 'hover' ? 'hover' : 'default']
}

export function resolveOpacity(variant: ButtonVariant, state: ButtonState) {
  if (state === 'disabled') return DISABLED_OPACITY
  if (state === 'hover' && variant === 'secondary') return HOVER_OPACITY
  return 1
}
