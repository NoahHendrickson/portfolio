/**
 * D2 Conflux's Slate theme, for the coded replicas of its components on the
 * portfolio's D2 Conflux page (`src/components/conflux/`, Nov 5 2026). Values are
 * the app's own — its `src/app/globals.css` (dark + `data-app-theme="slate"`) as the
 * running app computes them — read off a DOM dump of the live app, not Figma.
 * Every replica reads from here so they can't drift apart; anything only one
 * component uses stays in that component's own file.
 */

/** The page backdrop the cards sit on (`--slate-gradient`). */
export const SLATE = 'linear-gradient(241.87deg, #374358 2.15%, #2f3841 93.13%)'

/** Ink (`--foreground`) and its muted step (`--muted-foreground`). */
export const FG = '#fcfcf5'
export const FG_MUTED = 'rgb(255 255 255 / 0.7)'

/** A card's fill (`bg-lifted`, white 4%) and its 1px edge (foreground 15%, raised ×1.6 on hover). */
export const CARD_BG = 'rgb(255 255 255 / 0.04)'
export const CARD_LINE = 'rgb(252 252 245 / 0.15)'
export const CARD_LINE_HOVER = 'rgb(252 252 245 / 0.24)'
/** `--shadow-raised`. */
export const SHADOW_RAISED = '0 0 4px rgb(0 0 0 / 0.4)'

/** Item tiles: the frame (grey, gold once masterworked) and the icon's backing. */
export const ITEM_FRAME = '#d4d5d5'
export const ITEM_FRAME_MASTERWORK = '#faec95'
export const ITEM_BACKING = '#262626'

/** The app's type is Geist, the site's own face. */
export const FONT = '"Geist Variable", Geist, system-ui, sans-serif'

/** Self-hosted Bungie icons, saved by their bungie.net file name. */
export const ICONS = '/work/stat-builder/conflux/icons'
export const icon = (bungiePath: string) => `${ICONS}/${bungiePath.split('/').pop()}`
