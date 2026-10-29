import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { color, radius, radiusPx } from '../design-system/tokens'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { visibleSpan } from '../visibleSpan'

const FILL = color.bg.cream
const INK = color.ink.default
/** How far the tab's fill reaches past the trigger, so opening never moves the text. */
const PAD_X = 8
const PAD_Y = 4
/**
 * The concave join where the tab meets the panel. Tighter than the rail's 16,
 * so the joins read crisper against a small tab.
 */
const FILLET = 10
/**
 * A thin 4 round the content, so the panel reads as an edge round it rather
 * than a card, and the corner grows with it (12 = 4 + the content's own 8),
 * so a rounded image inside stays concentric with the panel.
 */
const PANEL_PAD = 4
const PANEL_RADIUS = radiusPx.lg
/** The least room the panel keeps from the viewport's edge. */
const EDGE = 8
/**
 * How far the panel has to run past the tab on a side for that side to turn
 * up into it: the fillet, then the panel's own top corner.
 */
const SHOULDER = FILLET + PANEL_RADIUS
/**
 * How far a `bare` popover's fillets run below the tab's foot. The pieces
 * there leave the foot at a slight angle (a tipped card), so their top edge
 * falls away from it; the fillet runs on down over them so no sliver of page
 * shows between the two.
 */
const BARE_DROP = 3
const FADE = 'opacity 140ms ease'
/**
 * The panel grows out of the tab's foot on open with a small overshoot, and
 * shrinks back without one on close. Kept small so it reads as give, not bounce.
 */
const GROW_FROM = 0.94
const GROW = 'transform 320ms cubic-bezier(0.34, 1.45, 0.64, 1)'
const SHRINK = 'transform 140ms ease'
const SHADOW = 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.45))'
/** The same shadow at zero, so it fades out with the panel rather than snapping off. */
const NO_SHADOW = 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0))'
const LABEL: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
  textDecorationThickness: '1.5px',
}

/**
 * An underlined trigger in running copy that opens a panel under it, drawn
 * like the rail's active pill: on hover or focus the trigger fills cream as a
 * tab with rounded top corners, and the panel hangs centred off its foot,
 * running out past it on both sides and turning up into it through a concave
 * fillet each side, so the two read as one surface. Near the viewport's edge
 * (or the edge of a scroller that would clip it) the panel slides over to
 * stay in view; if that leaves a side too little
 * room to turn up into the tab, that side goes flush with the tab's edge
 * instead, square at that corner. The fill is laid behind the trigger rather
 * than padding it, so the line doesn't shift when it opens.
 *
 * Open, the trigger reads at medium weight. Medium runs wider than regular,
 * and letting the line reflow could carry the trigger out from under the
 * pointer (and close it again), so the regular copy keeps the line's layout
 * and a medium copy is laid over it — the "face", which the tab and panel
 * hang off, so they size to the wider text. The panel is part of
 * the hover target, so the pointer can move onto it without closing it, and
 * it is inert while closed, so its links are only reachable once it shows.
 */
export default function Popover({
  children,
  content,
  gap = 8,
  iconAlign = 'center',
  leadRadius,
  bare = false,
}: {
  children: ReactNode
  content: ReactNode
  /** Between an icon or avatar and the words in the trigger. */
  gap?: number
  /**
   * How an icon sits against the words: centred on the line, or with its foot
   * on the text's baseline, the way a glyph would sit.
   */
  iconAlign?: 'center' | 'baseline'
  /**
   * The tab's top-left corner, for a trigger led by something round (an
   * avatar) that the default corner would sit awkwardly against.
   */
  leadRadius?: number
  /**
   * No panel of its own: the content is laid exactly under the tab, as wide
   * as it, and draws its own surfaces — for content that hangs several
   * cream pieces off the tab rather than one. The tab is drawn over the
   * content, so anything that rises into it tucks underneath. It keeps a
   * fillet each side, for pieces whose top edge leaves the tab's foot there,
   * but doesn't slide, since the pieces set their own shape.
   */
  bare?: boolean
}) {
  const [open, setOpen] = useState(false)
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
  /**
   * Where the panel sits, measured from the face's left edge, which sides
   * turn up into the tab (the rest are flush), and the tab's centre on the
   * panel, for the grow to come out of.
   */
  const [place, setPlace] = useState({ x: -PAD_X, left: false, right: true, origin: 0 })
  const faceRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLSpanElement>(null)

  // Measured as it opens, so it never paints in the wrong place. The panel is
  // always laid out (only faded), so its width is there to read.
  const show = () => {
    if (faceRef.current && panelRef.current && !bare) {
      const box = faceRef.current.getBoundingClientRect()
      const width = panelRef.current.offsetWidth
      const tabLeft = -PAD_X
      const tabRight = box.width + PAD_X
      const [minX, maxX] = visibleSpan(faceRef.current)
      // Centred, then slid to stay inside what can show it.
      let x = (box.width - width) / 2
      x = Math.min(x, maxX - EDGE - box.left - width)
      x = Math.max(x, minX + EDGE - box.left)
      // A side left too little room to turn up goes flush with the tab. The
      // panel clears the tab by two shoulders, so only one side ever can.
      if (tabLeft - x < SHOULDER) x = tabLeft
      else if (x + width - tabRight < SHOULDER) x = tabRight - width
      setPlace({
        x,
        left: x < tabLeft,
        right: x + width > tabRight,
        origin: box.width / 2 - x,
      })
    }
    setOpen(true)
  }

  const r = `${PANEL_RADIUS}px`

  return (
    <span
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={(e) => {
        // Focus moving onto a link in the panel keeps it open.
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
      style={{
        position: 'relative',
        zIndex: open ? 20 : 'auto',
        display: 'inline-flex',
        outline: 'none',
        // One shadow round the tab and panel together; a box-shadow on the
        // panel would land on the tab above it.
        filter: open ? SHADOW : NO_SHADOW,
        transition: 'filter 140ms ease',
      }}
    >
      {/* The regular copy, which holds the line's layout. */}
      <span style={{ ...LABEL, gap, alignItems: iconAlign, opacity: open ? 0 : 1, transition: FADE }}>{children}</span>

      <span
        ref={faceRef}
        // Takes no pointer itself, or its extra width would open the popover
        // from beside the trigger; the tab and panel take it when open.
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          width: 'max-content',
          pointerEvents: 'none',
        }}
      >
        {/* The tab. It runs 1px into the panel so the two never show a seam. */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -PAD_Y,
            bottom: -(PAD_Y + 1),
            left: -PAD_X,
            right: -PAD_X,
            zIndex: 1,
            background: FILL,
            borderRadius: `${leadRadius === undefined ? radius.md : `${leadRadius}px`} ${radius.md} 0 0`,
            opacity: open ? 1 : 0,
            transition: FADE,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          {(bare || place.left) && <Fillet side="left" drop={bare ? BARE_DROP : 0} />}
          {(bare || place.right) && <Fillet side="right" drop={bare ? BARE_DROP : 0} />}
        </span>

        <span
          aria-hidden
          style={{
            ...LABEL,
            zIndex: 2,
            gap,
            alignItems: iconAlign,
            color: INK,
            fontWeight: 500,
            opacity: open ? 1 : 0,
            transition: FADE,
            pointerEvents: 'none',
          }}
        >
          {children}
        </span>

        <span
          ref={panelRef}
          inert={!open}
          style={{
            position: 'absolute',
            // Under the tab, which is drawn over it.
            zIndex: 0,
            top: `calc(100% + ${PAD_Y}px)`,
            color: INK,
            ...(bare
              ? { left: -PAD_X, width: `calc(100% + ${PAD_X * 2}px)` }
              : {
                  left: place.x,
                  // Wide enough to clear the tab by a shoulder each side.
                  minWidth: `calc(100% + ${PAD_X * 2 + SHOULDER * 2}px)`,
                  padding: PANEL_PAD,
                  background: FILL,
                  // Square only where a side runs flush into the tab.
                  borderRadius: `${place.left ? r : 0} ${place.right ? r : 0} ${r} ${r}`,
                }),
            // The panel sets its own type rather than taking the trigger's,
            // which may be a heading.
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.4,
            opacity: open ? 1 : 0,
            // Grows out of the tab's foot, so the join holds still.
            transform: open || still ? 'scale(1)' : `scale(${GROW_FROM})`,
            transformOrigin: bare ? '50% 0' : `${place.origin}px 0`,
            transition: still ? FADE : `${FADE}, ${open ? GROW : SHRINK}`,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          {content}
        </span>
      </span>
    </span>
  )
}

/**
 * A concave join where the tab meets the panel: a square of the fill beside
 * the tab's foot with a quarter-disk knocked out of its far top corner, the
 * inverse of a border-radius (as the rail's `Fillet`). It sits 1px up, level
 * with the panel's top, since the tab runs 1px into the panel.
 */
function Fillet({ side, drop = 0 }: { side: 'left' | 'right'; drop?: number }) {
  const left = side === 'left'
  return (
    <span
      style={{
        position: 'absolute',
        bottom: 1 - drop,
        width: FILLET,
        height: FILLET + drop,
        ...(left ? { right: '100%' } : { left: '100%' }),
        background: `radial-gradient(circle ${FILLET}px at ${left ? '0' : '100%'} 0, transparent ${FILLET}px, ${FILL} ${FILLET + 0.5}px)`,
      }}
    />
  )
}
