import { useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { control, radius } from './tokens'
import {
  ICON_SIZE,
  resolveOpacity,
  resolvePalette,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
} from './buttonStyles'

type Props = {
  icon: ReactNode
  /**
   * Required. There is no visible text, so this is the only thing a screen
   * reader has to go on. Rendered as `aria-label`.
   */
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  /** Pins the visual state. Used by the Storybook matrix; leave unset in the app. */
  state?: ButtonState
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>

/**
 * Circular icon-only button. Shares `Button`'s palette and control heights;
 * width is locked to the height so it stays a circle at every size.
 */
export default function IconButton({
  icon,
  label,
  variant = 'primary',
  size = 'md',
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

  const palette = resolvePalette(variant, resolved)
  const opacity = resolveOpacity(variant, resolved)
  const box = control[size]

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e) }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: box,
        height: box,
        flexShrink: 0,
        boxSizing: 'border-box',
        padding: 0,
        borderRadius: radius.full,
        border: '1px solid',
        borderColor: palette.borderColor,
        background: palette.background,
        color: palette.color,
        opacity,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease, border-color 150ms ease, opacity 150ms ease',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{ display: 'inline-flex', width: ICON_SIZE[size], height: ICON_SIZE[size] }}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  )
}
