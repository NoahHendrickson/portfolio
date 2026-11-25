/**
 * Dev only: preview the site in Cinnabar, live from Cinnabar Studio.
 *
 * Start the dev server with VITE_CINNABAR_LIVE=1 (the Studio at http://127.0.0.1:8765) or a Studio
 * URL. The Studio recompiles both Cinnabar families after every edit and announces each version over
 * server-sent events: Cinnabar Interface (the UI face no3y Code ships) and Cinnabar Sans (the same
 * letters set tighter, the site's typeface). Each time, this fetches the chosen family's upright and italic files
 * and registers them under the site's typeface ('Cinnabar Sans'). Faces added through
 * document.fonts come after the stylesheet's, so they replace the bundled files with the Studio's
 * latest, with no change to the site's CSS. Without the flag, and in production builds, this does
 * nothing.
 *
 * FontSwitch (components/FontSwitch.tsx) picks Cinnabar Interface, Cinnabar Sans or Geist (the
 * site's previous typeface, still loaded as the fallback), for comparison; the choice is remembered
 * in this browser.
 */
const FAMILY = 'Cinnabar Sans'
const STORAGE_KEY = 'cinnabar-live:font'
const STYLES = ['upright', 'italic'] as const

export type LiveFont = 'interface' | 'sans' | 'geist'
type CinnabarFamily = Exclude<LiveFont, 'geist'>

/** True when this dev server was started with VITE_CINNABAR_LIVE. */
export const cinnabarLiveEnabled = Boolean(import.meta.env.DEV && import.meta.env.VITE_CINNABAR_LIVE)

const flag = import.meta.env.VITE_CINNABAR_LIVE
const studio = !flag || flag === '1' || flag === 'true' ? 'http://127.0.0.1:8765' : flag.replace(/\/+$/, '')

let current: LiveFont = readStored()
let latest = 0 // newest version the Studio has announced
const shown: Record<CinnabarFamily, number> = { interface: 0, sans: 0 }
const faces: Record<CinnabarFamily, FontFace[]> = { interface: [], sans: [] }
const listeners = new Set<() => void>()

function readStored(): LiveFont {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'interface' || v === 'geist' ? v : 'sans'
  } catch {
    return 'sans'
  }
}

/** Geist for comparison: the site's text set in its fallback instead of Cinnabar. */
let geistStyle: HTMLStyleElement | null = null

/** Only the chosen family's faces are in document.fonts; for Geist, none are, and the text is set in it. */
function applyFaces(): void {
  for (const family of ['interface', 'sans'] as const) {
    for (const face of faces[family]) {
      if (family === current) document.fonts.add(face)
      else document.fonts.delete(face)
    }
  }
  if (current === 'geist' && !geistStyle) {
    geistStyle = document.createElement('style')
    geistStyle.textContent = "html, body { font-family: 'Geist Variable', sans-serif !important; }"
    document.head.appendChild(geistStyle)
  } else if (current !== 'geist' && geistStyle) {
    geistStyle.remove()
    geistStyle = null
  }
}

async function load(family: CinnabarFamily, version: number): Promise<void> {
  if (version <= shown[family]) return
  const loaded = await Promise.all(
    STYLES.map(async (style) => {
      const response = await fetch(`${studio}/live/${family}/${style}.ttf?v=${version}`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`${family} ${style}: HTTP ${response.status}`)
      const face = new FontFace(FAMILY, await response.arrayBuffer(), {
        weight: '100 900',
        style: style === 'italic' ? 'italic' : 'normal',
      })
      return face.load()
    }),
  )
  // A newer version may have landed while these loaded; never step backwards.
  if (version <= shown[family]) return
  for (const face of faces[family]) document.fonts.delete(face)
  faces[family] = loaded
  shown[family] = version
  applyFaces()
}

function refresh(): void {
  if (current === 'geist' || !latest) return
  load(current, latest).catch((error: unknown) => console.warn('[cinnabar-live]', error))
}

export function getLiveFont(): LiveFont {
  return current
}

export function setLiveFont(font: LiveFont): void {
  if (font === current) return
  current = font
  try {
    localStorage.setItem(STORAGE_KEY, font)
  } catch {
    // Private windows can refuse storage; the switch still works for this page.
  }
  applyFaces()
  refresh() // a family not looked at since the last edit catches up
  for (const listener of listeners) listener()
}

export function subscribeLiveFont(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function startCinnabarLive(): void {
  if (!cinnabarLiveEnabled || typeof EventSource === 'undefined') return
  applyFaces() // a remembered Geist choice applies before the first Studio version arrives

  // EventSource retries a dropped connection on its own, but gives up for good on an HTTP error
  // (for example the Studio not running yet), so reconnect from scratch then.
  function connect(): void {
    const events = new EventSource(`${studio}/live/events`)
    events.addEventListener('message', (event) => {
      const version = Number(event.data)
      if (Number.isFinite(version) && version > latest) {
        latest = version
        refresh()
      }
    })
    events.addEventListener('error', () => {
      if (events.readyState === EventSource.CLOSED) setTimeout(connect, 5000)
    })
  }
  connect()
}
