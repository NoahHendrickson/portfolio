import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  CaretDown,
  Check,
  Copy,
  DownloadSimple,
  EnvelopeSimple,
  FileText,
  GithubLogo,
  LinkSimple,
  LinkedinLogo,
  List,
  Sparkle,
  X,
} from '@phosphor-icons/react'

/**
 * Defaults applied through Phosphor's `IconContext` in `main.tsx` (and in the
 * Storybook preview), so individual call sites never pass a weight. Duotone is
 * the system's weight — the Figma icon components are drawn from the same
 * duotone source.
 */
export const ICON_DEFAULTS = { weight: 'duotone' } as const

/**
 * The icon set, mirroring the 17 `Icon / *` components on the Figma design
 * system page. Keys match the Phosphor slugs used as the Figma component names.
 */
export const icons = {
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-square-out': ArrowSquareOut,
  'arrow-up-right': ArrowUpRight,
  'caret-down': CaretDown,
  check: Check,
  copy: Copy,
  'download-simple': DownloadSimple,
  'envelope-simple': EnvelopeSimple,
  'file-text': FileText,
  'github-logo': GithubLogo,
  'link-simple': LinkSimple,
  'linkedin-logo': LinkedinLogo,
  list: List,
  sparkle: Sparkle,
  x: X,
} as const

export type IconName = keyof typeof icons
