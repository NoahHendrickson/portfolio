import { useEffect } from 'react'

/**
 * Play a muted loop only while the clip is on screen. Four HEVC files
 * decoding at once on Crisp is wasteful, and a clip you haven't reached
 * yet shouldn't be moving. `play()` is allowed without a gesture because
 * the element stays muted + inline — the same pair that used to back
 * `autoPlay`. `threshold` is the share of the clip that counts as on screen.
 */
export function usePlayWhenVisible(ref: React.RefObject<HTMLVideoElement | null>, threshold = 0.25) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
}
