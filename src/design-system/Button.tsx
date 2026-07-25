import { useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { control, radius, space, type } from './tokens'
import {
  resolveOpacity,
  resolvePalette,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
} from './buttonStyles'

export type { ButtonSize, ButtonState, ButtonVariant }

type Props = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  disabled?: boolean
  /** Pins the visual state. Used by the Storybook matrix; leave unset in the app. */
  state?: ButtonState
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

/**
 * Sized by height, not vertical padding, so a row of buttons lines up regardless
 * of label or icon. Heights come from the `control` ramp.
 */
const SIZES = {
  xs: { height: control.xs, paddingInline: space.md, text: type['label-s'], icon: 14 },
  sm: { height: control.sm, paddingInline: space.lg, text: type['label-m'], icon: 16 },
  md: { height: control.md, paddingInline: space.xl, text: type['label-l'], icon: 20 },
  lg: { height: control.lg, paddingInline: space['2xl'], text: type['label-l'], icon: 20 },
} as const

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  disabled = false,
  state,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: Props) {
  const [hovered, setHovered] = useState(false)

  const resolved: ButtonState = state ?? (disabled ? 'disabled' : hovered ? 'hover' : 'default')
  const isDisabled = resolved === 'disabled'

  const sizing = SIZES[size]
  const palette = resolvePalette(variant, resolved)
  const opacity = resolveOpacity(variant, resolved)

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e) }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: sizing.height,
        boxSizing: 'border-box',
        gap: space.sm,
        padding: `0 ${sizing.paddingInline}`,
        borderRadius: radius.full,
        border: '1px solid',
        borderColor: palette.borderColor,
        background: palette.background,
        color: palette.color,
        fontFamily: 'inherit',
        fontSize: sizing.text.fontSize,
        fontWeight: sizing.text.fontWeight,
        lineHeight: sizing.text.lineHeight,
        letterSpacing: sizing.text.letterSpacing,
        opacity,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease, border-color 150ms ease, opacity 150ms ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {leadingIcon && (
        <span style={{ display: 'inline-flex', width: sizing.icon, height: sizing.icon }} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span>{children}</span>
      {trailingIcon && (
        <span style={{ display: 'inline-flex', width: sizing.icon, height: sizing.icon }} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  )
}
