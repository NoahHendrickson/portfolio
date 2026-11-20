import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { LandingVideo } from '../data/projects'

/*
  A looping clip in every version the theme switch can pick (no3y Code, Nov 16 2026), so a switch
  is instant: all the versions are stacked in one box, the shown one plays, and the others play
  along with it unseen, kept on its time, so picking another theme only changes which one shows.
  The takes are the same script in each theme, so the same second is the same moment.

  Two earlier passes swapped the file on the switch: the new one showed its poster while it
  loaded and then jumped (a freeze), and then the old one kept playing until the new one had
  loaded and caught up (a lag of half a second or more after the click).

  The hidden versions load with `preload="none"` and only start when the clip first plays (it
  plays once a quarter of it is on screen and pauses off screen), so the page doesn't fetch every
  version up front. A version that isn't ready yet when it's picked takes over once it has a
  frame; until then the old one stays up.
*/

/** How far, in seconds, a hidden version may drift before it's put back on the shown one's time. */
const DRIFT = 0.12
const VISIBLE = 0.25

export default function SwapClip({ videos, active, priority = false }: { videos: LandingVideo[]; active: string; priority?: boolean }) {
  const stillOnly = useMediaQuery('(prefers-reduced-motion: reduce)')
  const boxRef = useRef<HTMLDivElement>(null)
  const els = useRef(new Map<string, HTMLVideoElement>())
  // The version on screen: the picked one, once it can show a frame.
  const [shown, setShown] = useState(active)
  const shownRef = useRef(shown)
  useEffect(() => {
    shownRef.current = shown
  }, [shown])

  // Hand over to the picked version as soon as it has a frame on the shown one's time.
  useEffect(() => {
    if (active === shown) return
    const to = els.current.get(active)
    const from = els.current.get(shown)
    let cancelled = false
    const take = () => {
      if (!cancelled) setShown(active)
    }
    if (!to || !from || stillOnly || from.paused || to.readyState >= 2) {
      if (to && from && Math.abs(to.currentTime - from.currentTime) > DRIFT) to.currentTime = from.currentTime
      queueMicrotask(take)
      return () => {
        cancelled = true
      }
    }
    // Not loaded yet: once it can play, put it on the shown one's time and show it when that lands.
    const ready = () => {
      to.addEventListener('seeked', take, { once: true })
      to.currentTime = from.currentTime
    }
    to.addEventListener('canplay', ready, { once: true })
    void to.play().catch(() => {})
    return () => {
      cancelled = true
      to.removeEventListener('canplay', ready)
      to.removeEventListener('seeked', take)
    }
  }, [active, shown, stillOnly])

  // Play while on screen; the hidden versions follow the shown one's play state and time.
  useEffect(() => {
    const box = boxRef.current
    if (!box || stillOnly) return
    let frame = 0
    let visible = false
    const sync = () => {
      const lead = els.current.get(shownRef.current)
      if (lead) {
        for (const [src, v] of els.current) {
          if (src === shownRef.current) continue
          if (lead.paused !== v.paused) {
            if (lead.paused) v.pause()
            else void v.play().catch(() => {})
          }
          if (v.readyState >= 2 && Math.abs(v.currentTime - lead.currentTime) > DRIFT) v.currentTime = lead.currentTime
        }
      }
      if (visible) frame = requestAnimationFrame(sync)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        const lead = els.current.get(shownRef.current)
        cancelAnimationFrame(frame)
        if (visible) {
          void lead?.play().catch(() => {})
          frame = requestAnimationFrame(sync)
        } else {
          for (const v of els.current.values()) v.pause()
        }
      },
      { threshold: VISIBLE },
    )
    io.observe(box)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [stillOnly])

  const current = videos.find((v) => v.src === shown) ?? videos[0]
  const aspect = current.aspect.replace(/\s/g, '')

  if (stillOnly) {
    const picked = videos.find((v) => v.src === active) ?? current
    return (
      <img
        src={picked.poster}
        alt={picked.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ display: 'block', width: '100%', aspectRatio: aspect, objectFit: 'cover' }}
      />
    )
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', width: '100%', aspectRatio: aspect }}>
      {videos.map((v) => {
        const on = v.src === shown
        const style: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: on ? 1 : 0, pointerEvents: on ? undefined : 'none' }
        return (
          <video
            key={v.src}
            ref={(el) => {
              if (el) els.current.set(v.src, el)
              else els.current.delete(v.src)
            }}
            poster={v.poster}
            aria-label={on ? v.alt : undefined}
            aria-hidden={on ? undefined : true}
            loop
            muted
            playsInline
            preload={on ? 'metadata' : 'none'}
            style={style}
          >
            {v.hevc && <source src={v.hevc} type='video/mp4; codecs="hvc1"' />}
            <source src={v.src} type="video/mp4" />
          </video>
        )
      })}
    </div>
  )
}
