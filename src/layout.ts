/**
 * The dark shell's horizontal rhythm, shared by every page — `App`'s two tabs,
 * the blocks that pad themselves inside them (`Header`, `Experience`), and the
 * full-width project pages (`ProjectStory`, the Invisible studies, `WorkGate`).
 */

/** Page gutter, 120 of the file's 1512 frame. */
export const PAGE_GUTTER = 120

/**
 * The widest tablet the desktop split still runs on (iPad Pro 12.9 landscape).
 * Below the mobile breakpoint (900) the tabs go single-column on a 20px inset
 * and project pages on `PROJECT_MOBILE_PAD`, so this band — 901 to 1366 — is
 * where the desktop geometry has to survive on a screen a third narrower than
 * the frame it was drawn at.
 */
const TABLET_MAX = 1366

/**
 * The gutter, held flat at the file's 120 from tablet width up and scaled in
 * proportion below it.
 *
 * A flat 120 a side is 16% of the 1512 frame but a quarter of an iPad's width,
 * and it comes out of the content column twice: at 1024 the Me tab's copy is
 * left on a ~355px measure and the Design tab's cards are squeezed to ~200px
 * each, with the shader strip beside them unaffected. Scaling it against
 * `TABLET_MAX` rather than the frame width means the expression resolves to
 * exactly 120 at every width the desktop layout was actually designed for —
 * nothing above the tablet band moves.
 */
export const pageGutter = () =>
  `min(${PAGE_GUTTER}px, ${((PAGE_GUTTER / TABLET_MAX) * 100).toFixed(3)}vw)`

/**
 * The reference width the gutters centre against — `ProjectStory`'s 1600 cap,
 * the widest page in the site.
 *
 * Every page's content column is some share of the viewport, so past the
 * design width it keeps widening while the copy inside stays on its own
 * measure — the text ends up pinned to the far left of a large empty column.
 * Splitting the slack past this width into the gutters re-centres it.
 *
 * There is deliberately **one** reference width rather than one per page:
 * centring each page against its own content width gave every route a
 * different left edge on a big screen, so the tabs and copy jumped sideways
 * on navigation. Anchoring the formula to `100vw` (not `100%`) keeps it
 * container-independent — the same string yields the same left edge whether
 * the padded block is the full page or a `vw`-sized column. Pages with
 * narrower content keep their own max-widths and left-align to this edge.
 */
export const SHELL_MAX = 1600

/**
 * Horizontal page padding: `pageGutter()` until the viewport passes
 * `SHELL_MAX`, then whatever keeps that reference width centred. Call sites
 * keep their own mobile inset, where there is nothing to centre.
 */
export const shellPad = () =>
  `max(${pageGutter()}, calc((100vw - ${SHELL_MAX}px) / 2))`

/**
 * The widest the centred copy column grows on a large screen. 700 is the
 * stacked-page measure at the 1512 frame; past that the text looked pinned
 * in a widening column, so it follows the viewport a little, then stops.
 */
export const COPY_MAX = 840

/**
 * The centred copy column. Holds `width` through the design width, then
 * follows 45vw up to `COPY_MAX` so the measure opens a little on a big
 * screen without running away.
 */
export const copyMeasure = (width: number, cap = COPY_MAX) =>
  `min(${cap}px, max(${width}px, 45vw))`

/**
 * Inset to either edge of a centred copy column. Uses the same
 * `copyMeasure` as the column itself, so Back and Contact stay on its
 * edges as it grows. Never tighter than `shellPad()`, so on a narrow
 * viewport they stay on the page gutter with the copy (which then fills
 * the column).
 */
export const copyPad = (width: number, cap = COPY_MAX) =>
  `max(${shellPad()}, calc((100vw - ${copyMeasure(width, cap)}) / 2))`

/**
 * Right inset of a left-aligned copy column that starts at `shellPad()`.
 * Same floor as `copyPad`, so Contact sits on the text's right edge until
 * the column fills and both sides collapse to the page gutter.
 */
export const flushTrailingPad = (width: number) =>
  `max(${shellPad()}, calc(100vw - ${width}px - ${shellPad()}))`

/**
 * Project-page gutter below 900. Display titles wrap against the glass on the
 * 20px the tabs use, so these full-bleed pages take a step up. Header reads
 * the same value via `barInset` so Back / Contact stay on the copy's edge.
 */
export const PROJECT_MOBILE_PAD = '32px'
