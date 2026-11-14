import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import type { HomeTab } from '../homeTab'

/**
 * Where home was scrolled to, kept for the session's page (module scope, so it
 * lives as long as the SPA does and a fresh load starts at the top). One tab's
 * worth: a tab switch starts the next panel at its top, so it resets this.
 */
let saved: { tab: HomeTab; top: number } | null = null

/** Frames to keep re-applying a restore the content isn't tall enough for yet. */
const RESTORE_FRAMES = 30

/**
 * Remembers how far down home was scrolled, and puts it back when a visitor
 * comes back from a project page (Back in the browser or the page's Back pill).
 * Desktop scrolls the panel (`scroller`); mobile scrolls the window. Returns
 * the call a tab switch makes so the new tab isn't handed the old one's place.
 */
export function useHomeScrollMemory(
  isHome: boolean,
  tab: HomeTab,
  isMobile: boolean,
  scroller: RefObject<HTMLElement | null>,
) {
  const tabRef = useRef(tab)
  tabRef.current = tab
  const wasHome = useRef(isHome)

  // The browser's own restore runs on popstate against whatever page is up at
  // that moment; the routes handle their own scroll instead.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (!isHome) return
    const onScroll = (event: Event) => {
      const panel = scroller.current
      if (isMobile) {
        if (event.target !== document) return
        saved = { tab: tabRef.current, top: window.scrollY }
      } else if (panel && event.target === panel) {
        saved = { tab: tabRef.current, top: panel.scrollTop }
      }
    }
    // Captured, since a scroll on an element doesn't bubble.
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => document.removeEventListener('scroll', onScroll, { capture: true })
  }, [isHome, isMobile, scroller])

  // Arriving back on home: before paint, so the top never flashes first.
  useLayoutEffect(() => {
    const arrived = isHome && !wasHome.current
    wasHome.current = isHome
    if (!arrived) return
    if (!saved || saved.tab !== tab || saved.top <= 0) {
      // Nothing to put back: start at the top (mobile's window may still be
      // where the project page left it).
      window.scrollTo({ top: 0 })
      return
    }
    const target = saved.top
    const apply = () => {
      if (isMobile) window.scrollTo({ top: target })
      else if (scroller.current) scroller.current.scrollTop = target
      return isMobile ? window.scrollY : (scroller.current?.scrollTop ?? target)
    }
    if (apply() >= target - 1) return
    // Something below hadn't laid out yet: try again for a few frames, until it
    // lands or the visitor scrolls themselves.
    let frames = 0
    let raf = 0
    const stop = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
    const step = () => {
      if (apply() >= target - 1 || ++frames >= RESTORE_FRAMES) return stop()
      raf = requestAnimationFrame(step)
    }
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('keydown', stop)
    raf = requestAnimationFrame(step)
    return stop
  }, [isHome, tab, isMobile, scroller])

  return (next: HomeTab) => {
    saved = { tab: next, top: 0 }
  }
}
