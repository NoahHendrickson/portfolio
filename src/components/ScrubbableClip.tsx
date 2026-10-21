import { useEffect, useRef, type ComponentProps } from 'react'
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible'

/**
 * A muted looping screen recording with a seek bar along its foot, so a
 * visitor who scrolls in halfway through can drag back to the start. It plays
 * only while on screen (`threshold` is the share that counts as on screen).
 * The clip pauses while the bar is held and picks up from wherever it's let
 * go. The bar is painted off the video's own clock every frame while it plays
 * (`timeupdate` only fires about four times a second, which reads as a
 * stutter), straight onto `--progress` rather than through state, so it never
 * re-renders the page. Styled by `.clip-scrubber` in `index.css`.
 *
 * Everything else — `poster`, `aria-label`, `style`, the `<source>`s — passes
 * through to the `<video>`.
 */
export default function ScrubbableClip({
  threshold,
  children,
  ...video
}: Omit<ComponentProps<'video'>, 'ref'> & { threshold?: number }) {
  const clipRef = useRef<HTMLVideoElement>(null)
  const scrubber = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const resume = useRef(false)
  usePlayWhenVisible(clipRef, threshold)

  useEffect(() => {
    const clip = clipRef.current
    if (!clip) return
    let frame = 0
    const paint = () => {
      const at = clip.duration ? clip.currentTime / clip.duration : 0
      scrubber.current?.style.setProperty('--progress', `${at * 100}%`)
      if (input.current) input.current.value = String(at)
    }
    const tick = () => {
      paint()
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      paint()
    }
    clip.addEventListener('playing', start)
    clip.addEventListener('pause', stop)
    clip.addEventListener('seeked', paint)
    clip.addEventListener('loadedmetadata', paint)
    if (!clip.paused) start()
    return () => {
      cancelAnimationFrame(frame)
      clip.removeEventListener('playing', start)
      clip.removeEventListener('pause', stop)
      clip.removeEventListener('seeked', paint)
      clip.removeEventListener('loadedmetadata', paint)
    }
  }, [])

  function seek(value: number) {
    const clip = clipRef.current
    if (!clip?.duration) return
    clip.currentTime = value * clip.duration
    scrubber.current?.style.setProperty('--progress', `${value * 100}%`)
  }

  function hold() {
    const clip = clipRef.current
    if (!clip) return
    resume.current = !clip.paused
    clip.pause()
  }

  function release() {
    if (resume.current) void clipRef.current?.play().catch(() => {})
    resume.current = false
  }

  return (
    <div style={{ position: 'relative' }}>
      <video ref={clipRef} loop muted playsInline preload="metadata" {...video}>
        {children}
      </video>
      <div ref={scrubber} className="clip-scrubber">
        <input
          ref={input}
          type="range"
          min={0}
          max={1}
          step="any"
          defaultValue={0}
          aria-label="Seek video"
          onInput={(event) => seek(Number(event.currentTarget.value))}
          onPointerDown={hold}
          onPointerUp={release}
          onPointerCancel={release}
        />
        <div className="clip-scrubber-bar">
          <div className="clip-scrubber-fill" />
          <div className="clip-scrubber-thumb" />
        </div>
      </div>
    </div>
  )
}
