import { useRef, useState } from 'react'
import { radius as radii } from '../design-system/tokens'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible'
import type { LandingVideo } from '../data/projects'

/*
  The hero clip — Moonfang Armory's — moved out of `ProjectStory` when every
  data-driven page went onto the ruled sheet (Nov 4 2026): a looping capture,
  optionally cropped in (`zoom` about `focus`, or eased into mid-clip with
  `zoomAfter` / `zoomUntil`), optionally seated as a window on a desktop
  `backdrop`.
*/

/** The screenshots' own dark chrome behind the clip, not a theme surface. */
const FRAME_BG = '#202124'
const MOCKUP_RADIUS = radii.xl
const pct = (px: number, of: number) => `${(px / of) * 100}%`
const ZOOM_IN = 'transform 1.35s cubic-bezier(0.4, 0, 0.2, 1)'
const ZOOM_OUT = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * The hero as a looping clip rather than a still — Moonfang Armory. It plays
 * muted and inline once it enters the viewport, and carries a `poster`
 * so the box shows the opening frame instead of black while the file loads.
 * The clip is cover-fit, so a source wider than the designed box is cropped
 * evenly rather than letterboxed. `prefers-reduced-motion` gets the poster
 * alone. `zoomAfter` eases into `zoom` mid-clip; `zoomUntil` eases back out
 * so the loop meets a full-bleed frame.
 */
export default function HeroVideo({
  video,
  maxWidth,
  style,
  radius = MOCKUP_RADIUS,
}: {
  video: LandingVideo
  /** The width the file draws it at, which the backdrop window is placed against. */
  maxWidth: number
  style?: React.CSSProperties
  /** The box's outer corner — the mockups' shared 16, or 0 on the ruled sheet. */
  radius?: string
}) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const clipRef = useRef<HTMLVideoElement>(null)
  usePlayWhenVisible(clipRef)
  const [lateZoom, setLateZoom] = useState({
    scale: 1,
    smooth: false,
    out: false,
  })

  const { backdrop } = video

  const box: React.CSSProperties = {
    position: 'relative',
    ...style,
    aspectRatio: video.aspect.replace(/\s/g, ''),
    borderRadius: radius,
    overflow: 'hidden',
    background: FRAME_BG,
  }

  const fill: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  const syncZoom = () => {
    const el = clipRef.current
    if (!el || video.zoomAfter == null || video.zoom == null) return
    const due = el.currentTime >= video.zoomAfter
    const held = due && (video.zoomUntil == null || el.currentTime < video.zoomUntil)
    const scale = held ? video.zoom : 1
    setLateZoom((prev) =>
      prev.scale === scale ? prev : { scale, smooth: due, out: due && !held },
    )
  }

  /* Static crop (Armory) vs a delayed ease into the same crop (no3y Code). */
  const clip: React.CSSProperties = !video.zoom
    ? fill
    : video.zoomAfter == null
      ? {
          ...fill,
          transform: `scale(${video.zoom})`,
          transformOrigin: video.focus ?? 'center',
        }
      : {
          ...fill,
          transform: `scale(${lateZoom.scale})`,
          transformOrigin: video.focus ?? 'center',
          transition: lateZoom.smooth ? (lateZoom.out ? ZOOM_OUT : ZOOM_IN) : 'none',
        }

  /*
    On a desktop the clip is a window: centred, its own ratio, and lifted off
    the wallpaper with a shadow. Sizes are shares of the box so the margin holds
    at any width. Without a backdrop it just fills the box.
  */
  const stage: React.CSSProperties = backdrop
    ? {
        position: 'absolute',
        top: '50%',
        left: pct((maxWidth - backdrop.width) / 2, maxWidth),
        width: pct(backdrop.width, maxWidth),
        transform: 'translateY(-50%)',
        aspectRatio: backdrop.aspect.replace(/\s/g, ''),
        borderRadius: `${backdrop.radius ?? 12}px`,
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
      }
    : { width: '100%', height: '100%' }

  const media = stillOnly ? (
    <img src={video.poster} alt={video.alt} style={clip} />
  ) : (
    <video
      ref={clipRef}
      src={video.src}
      poster={video.poster}
      aria-label={video.alt}
      loop
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={video.zoomAfter != null ? syncZoom : undefined}
      onSeeked={video.zoomAfter != null ? syncZoom : undefined}
      style={clip}
    />
  )

  return (
    <div style={box}>
      {backdrop && <img src={backdrop.src} alt="" style={{ ...fill, position: 'absolute', inset: 0 }} />}
      <div style={stage}>{media}</div>
    </div>
  )
}
