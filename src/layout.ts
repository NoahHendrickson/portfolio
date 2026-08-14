/**
 * The dark shell's horizontal rhythm, shared by every page — `App`'s two tabs,
 * the blocks that pad themselves inside them (`Header`, `Experience`), and the
 * full-width project pages (`ProjectStory`, the Invisible studies, `WorkGate`).
 */

/** Page gutter, 120 of the file's 1512 frame. */
export const PAGE_GUTTER = 120

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

/** The list column on the Design tab, 1240 of the file's three columns. */
export const WORK_LIST_MAX = 1240

/**
 * Horizontal page padding: the gutter until the viewport passes `SHELL_MAX`,
 * then whatever keeps that reference width centred. Call sites keep their own
 * 20px mobile inset, where there is nothing to centre.
 */
export const shellPad = () =>
  `max(${PAGE_GUTTER}px, calc((100vw - ${SHELL_MAX}px) / 2))`
