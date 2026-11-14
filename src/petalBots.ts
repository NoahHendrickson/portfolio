/*
  The brand's bots (Nov 14 2026), off the brand file's `bots` page
  (`h7PWAQCOhl8NwRoFTs3Cbu`, Mood=Idle): six Petal bots (set `78:857`; its two
  whole flowers, Blossom and Daisy, were left out) and the eight Leaf bots (set
  `77:686`, Oak among them). Each bot's squares were read off its export at 10px
  a square and are stored cropped to the bot; `build` centres each in one shared
  `BOT_BOX`, so every bot keeps the file's square size. `X` is the black
  outline, `w` the cream shine in each eye, and the other letters the bot's own
  inks. The eyes are found in the rows (a shine with black right of it and two
  rows of black under: 2 × 3), lifted out and drawn on their own, so they can
  step a square toward the pointer; the squares they leave take the face's fill.
  Kept out of the component file for Fast Refresh.
*/
import { rowsPath, type Ink } from './brandArt'

export type PetalBotData = { name: string; inks: Record<string, string>; rows: string[] }

/** The square every bot is centred in: the widest (Maple, 21) and tallest (Willow, 20) fit. */
export const BOT_BOX = 21

export const OUTLINE = '#000000'
/** The shine, which is the cream the bots are drawn for. */
export const SHINE = '#F5EFE0'

export const PETAL_BOTS: PetalBotData[] = [
  {
    name: 'Sakura',
    inks: { a: '#FF4F95', b: '#FF8AB8', c: '#FFC2D9', d: '#D8357A' },
    rows: [
      '..XXX...XXX..',
      '.XaaaX.XbbbX.',
      'XaaaaaXbaaabX',
      'XaaaaaaaaaabX',
      'XaaaaaaaaaabX',
      'XaawXaawXaabX',
      'XaaXXaaXXaabX',
      '.XaXXaaXXabX.',
      '.XccaaaaaccX.',
      '..XaaaaaaaX..',
      '...XaadaaX...',
      '....XadaX....',
      '.....XXX.....',
      '......X......',
      '......X......',
    ],
  },
  {
    name: 'Spoon',
    inks: { a: '#3CB5FC', b: '#86D3FF', c: '#FFB3CF', d: '#1D8BD1' },
    rows: [
      '...XXX...',
      '.XXaabXX.',
      '.XaaaabX.',
      'XaaaaaabX',
      'XawXawXbX',
      'XaXXaXXbX',
      'XaXXaXXbX',
      'XccaaaacX',
      '.XaaaaaX.',
      '.XdadadX.',
      '..XdddX..',
      '..XdddX..',
      '...XdX...',
      '...XdX...',
      '....X....',
      '....X....',
      '....X....',
    ],
  },
  {
    name: 'Tulip',
    inks: { a: '#F95B1C', b: '#FF8F0C', c: '#FFC09A', d: '#C9420F' },
    rows: [
      'X......X......X',
      'XX....XaX....XX',
      'XaX..XaabX..XbX',
      'XaaX.XaabX.XbbX',
      'XaaaXaaaabXbabX',
      'XaaaaaaaaabaabX',
      'XaaawXaawXaaabX',
      'XaaaXXaaXXaaabX',
      'XaaaXXaaXXaaabX',
      '.XaccaaaaaccaX.',
      '.XaaaaaaaaaaaX.',
      '..XaaaadaaaaX..',
      '...XXaadaaXX...',
      '.....XXXXX.....',
      '.......X.......',
      '.......X.......',
    ],
  },
  {
    name: 'Drop',
    inks: { a: '#7970F9', b: '#A9A3FF', c: '#FFB3CF', d: '#5149D6' },
    rows: [
      '....XXXXX....',
      '..XXaaabbXX..',
      '.XaaaaaaabbX.',
      '.XaaaaaaaabX.',
      'XaaaaaaaaaabX',
      'XaawXaawXaabX',
      'XaaXXaaXXaabX',
      'XaaXXaaXXaabX',
      '.XccaaaaaccX.',
      '.XaaaaaaaaaX.',
      '..XaadddaaX..',
      '...XadddaX...',
      '....XadaX....',
      '.....XdX.....',
      '......X......',
      '......X......',
    ],
  },
  {
    name: 'Bell',
    inks: { a: '#C841FA', b: '#DF8BFF', c: '#FFB3CF' },
    rows: [
      '.......X.......',
      '.......X.......',
      '.....XXXXX.....',
      '....XaaabbX....',
      '...XaaaaaabX...',
      '...XaaaaaabX...',
      '..XaaaaaaaabX..',
      '..XawXaawXabX..',
      '..XaXXaaXXabX..',
      '.XaaXXaaXXaabX.',
      '.XaccaaaaaccaX.',
      'XaaaaaaaaaaaaaX',
      'XaXXaaXXXaaXXaX',
      'XX..XX...XX..XX',
    ],
  },
  {
    name: 'Bud',
    inks: { a: '#FCB01A', b: '#FFD233', c: '#FF9A7A', d: '#26B846', e: '#3AED62' },
    rows: [
      '......X......',
      '.....XaX.....',
      '....XaabX....',
      '...XaaaabX...',
      '..XaaaaaabX..',
      '.XawXaawXabX.',
      '.XaXXaaXXabX.',
      'XaaXXaaXXaabX',
      'XaccaaaaaccaX',
      'XaaaaaaaaaaaX',
      'XXaaaaaaaaaXX',
      'XdXXaaaaaXXeX',
      '.XddXXXXXeeX.',
      '..XXdddddXX..',
      '....XXXXX....',
      '......X......',
      '......X......',
    ],
  },
]

export const LEAF_BOTS: PetalBotData[] = [
  {
    name: 'Classic',
    inks: { a: '#26B846', b: '#3AED62' },
    rows: [
      '....X....',
      '...XaX...',
      '..XaabX..',
      '.XaaaabX.',
      'XaaaaaabX',
      'XawXawXbX',
      'XaXXaXXbX',
      'XaXXaXXbX',
      'XaaaaaaaX',
      '.XaaaaaX.',
      '..XaXaX..',
      '...XXX...',
      '....X....',
    ],
  },
  {
    name: 'Round',
    inks: { a: '#F95B1C', b: '#FF8F0C' },
    rows: [
      '......X......',
      '.....XaX.....',
      '...XXaabXX...',
      '..XaaaaabbX..',
      '.XaaaaaaaabX.',
      '.XaaaaaaaabX.',
      'XaawXaawXaabX',
      'XaaXXaaXXaabX',
      'XaaXXaaXXaabX',
      '.XaaaaaaaaaX.',
      '.XaaaaaaaaaX.',
      '..XaaaXaaaX..',
      '...XXaXaXX...',
      '.....XXX.....',
      '......X......',
      '......X......',
    ],
  },
  {
    name: 'Willow',
    inks: { a: '#008755', b: '#08B776' },
    rows: [
      '....X....',
      '....X....',
      '...XaX...',
      '...XaX...',
      '..XaabX..',
      '..XaabX..',
      '.XaaaabX.',
      '.XaaaabX.',
      'XawXawXbX',
      'XaXXaXXbX',
      'XaXXaXXbX',
      'XaaaaaaaX',
      '.XaaaaaX.',
      '.XaaXaaX.',
      '..XaXaX..',
      '..XaXaX..',
      '...XXX...',
      '....X....',
      '....X....',
      '....X....',
    ],
  },
  {
    name: 'Heart',
    inks: { a: '#FCB01A', b: '#FFD233' },
    rows: [
      '.......X.......',
      '......XaX......',
      '.....XaabX.....',
      '....XaaaabX....',
      '...XaaaaaabX...',
      '..XaaaaaaaabX..',
      '.XaaaaaaaaaabX.',
      '.XaawXaawXaabX.',
      'XaaaXXaaXXaaabX',
      'XaaaXXaaXXaaabX',
      'XaaaaaaXaaaaaaX',
      '.XaaaaX.XaaaaX.',
      '..XXXX...XXXX..',
      '.......X.......',
      '.......X.......',
    ],
  },
  {
    name: 'Maple',
    inks: { a: '#F95B1C', b: '#FF8F0C' },
    rows: [
      '..........X..........',
      '.........XaX.........',
      '........XaabX........',
      '........XaabX........',
      '...X....XaabX....X...',
      '...XX..XaaaabX..XX...',
      '...XaX.XaaaabX.XbX...',
      '...XaaXaaaaaabXbbX...',
      'X...XaawXaawXabbX...X',
      'XX..XaaXXaaXXaabX..XX',
      '.XXXaaaXXaaXXaaabXXX.',
      '..XaaaaaaaaaaaaaaaX..',
      '...XaaaaaaaaaaaaaX...',
      '....XXaaaaXaaaaXX....',
      '......XaaXXXaaX......',
      '.....XXXX...XXXX.....',
      '..........X..........',
      '..........X..........',
    ],
  },
  {
    name: 'Oak',
    inks: { a: '#008755', b: '#08B776' },
    rows: [
      '.....XXX.....',
      '....XaabX....',
      '...XaaaabX...',
      '..XaaaaaabX..',
      '.XaaaaaaaabX.',
      '.XaaaaaaaabX.',
      '..XaaaaaabX..',
      '.XawXaawXabX.',
      'XaaXXaaXXaabX',
      'XaaXXaaXXaabX',
      '.XaaaaaaaaaX.',
      'XaaaaaaaaaaaX',
      'XaaaaaXaaaaaX',
      '.XaaXaXaXaaX.',
      '..XaaXXXaaX..',
      '...XaaXaaX...',
      '....XXXXX....',
      '......X......',
      '......X......',
    ],
  },
  {
    name: 'Ginkgo',
    inks: { a: '#FCB01A', b: '#FFD233' },
    rows: [
      '.XXXXXX...XXXXXX.',
      'XaaaaaaX.XbbbbbbX',
      'XaaaaaaaXbaaaaabX',
      'XaaaaaaaaaaaaaabX',
      '.XaaawXaawXaaabX.',
      '..XaaXXaaXXaabX..',
      '...XaXXaaXXabX...',
      '....XaaaaaaaX....',
      '.....XaaaaaX.....',
      '......XaXaX......',
      '.......XXX.......',
      '........X........',
      '........X........',
      '........X........',
    ],
  },
  {
    name: 'Monstera',
    inks: { a: '#26B846', b: '#3AED62' },
    rows: [
      '.....XXXXXXX.....',
      '...XXaaaabbbXX...',
      '..XaaaaaaaaabbX..',
      '.XaaaaaaaaaaaabX.',
      '.XaaaaaaaaaaaabX.',
      'XaaaawXaawXaaaabX',
      'XaaaaXXaaXXaaaabX',
      'XaaaaXXaaXXaaaabX',
      'XXXaaaaaaaaaaaaaX',
      '...XaaaaaaaaaaaaX',
      'XXXaXaaaXaaaaaaaX',
      '.XaX.XaaXaXaaaaX.',
      '.XaaXaaXXXaaaaX..',
      '..XaaaaaXaaaaaX..',
      '...XXaaaXaaaXX...',
      '.....XXX.XXX.....',
      '........X........',
      '........X........',
    ],
  },
]

/** Eyes are 2 squares wide, 3 tall, the shine in the top-left square. */
export const EYE_W = 2
export const EYE_H = 3

export type Offset = { dx: number; dy: number }
export type BotFamily = 'Petal' | 'Leaf'
export type PetalBotArt = {
  name: string
  family: BotFamily
  /** The body with the eyes lifted out, fills first and the outline over them. */
  inks: Ink[]
  /** Each eye's top-left square, in the `BOT_BOX`. */
  eyes: { x: number; y: number }[]
  /** The eyes' centre, in the box. */
  centre: { x: number; y: number }
  /** Every step the eyes can take (a square either way, diagonals too) without landing on the outline. */
  offsets: Offset[]
}

function build(bot: PetalBotData, family: BotFamily): PetalBotArt {
  const { rows } = bot
  const ox = Math.floor((BOT_BOX - rows[0].length) / 2)
  const oy = Math.floor((BOT_BOX - rows.length) / 2)
  const at = (x: number, y: number) => rows[y]?.[x] ?? '.'
  const eyes: { x: number; y: number }[] = []
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== 'w') return
      const black = [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
        [1, 2],
      ].every(([i, j]) => at(x + i, y + j) === 'X')
      if (black) eyes.push({ x, y })
    }),
  )
  const isEye = (x: number, y: number) => eyes.some((e) => x >= e.x && x < e.x + EYE_W && y >= e.y && y < e.y + EYE_H)

  // The face's fill: the commonest ink round the eyes.
  const counts = new Map<string, number>()
  for (const e of eyes)
    for (let y = e.y - 1; y <= e.y + EYE_H; y++)
      for (let x = e.x - 1; x <= e.x + EYE_W; x++) {
        const ch = at(x, y)
        if (isEye(x, y) || ch === 'X' || ch === '.' || ch === 'w') continue
        counts.set(ch, (counts.get(ch) ?? 0) + 1)
      }
  const face = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'a'
  const bare = rows.map((row, y) => [...row].map((ch, x) => (isEye(x, y) ? face : ch)).join(''))

  const offsets: Offset[] = []
  for (const dy of [-1, 0, 1])
    for (const dx of [-1, 0, 1]) {
      const clear = eyes.every((e) => {
        for (let j = 0; j < EYE_H; j++)
          for (let i = 0; i < EYE_W; i++) {
            const ch = bare[e.y + j + dy]?.[e.x + i + dx] ?? '.'
            if (ch === 'X' || ch === '.') return false
          }
        return true
      })
      if (clear) offsets.push({ dx, dy })
    }

  const order = [...Object.keys(bot.inks), 'X']
  const colors: Record<string, string> = { ...bot.inks, X: OUTLINE, w: SHINE }
  const inks = order
    .map((ch) => ({ color: colors[ch], d: rowsPath(bare, (c) => c === ch, ox, oy) }))
    .filter((ink) => ink.d)

  const placed = eyes.map((e) => ({ x: e.x + ox, y: e.y + oy }))
  const xs = placed.map((e) => e.x)
  const centre = {
    x: (Math.min(...xs) + Math.max(...xs) + EYE_W) / 2,
    y: placed[0].y + EYE_H / 2,
  }
  return { name: bot.name, family, inks, eyes: placed, centre, offsets }
}

/** Every bot the page shows, Petal bots first. */
export const BOT_ART: PetalBotArt[] = [
  ...PETAL_BOTS.map((bot) => build(bot, 'Petal')),
  ...LEAF_BOTS.map((bot) => build(bot, 'Leaf')),
]

/** Sin 22.5°: past this share of the distance, an axis counts, so the eyes have eight directions. */
const AXIS = 0.383

/**
 * Where the eyes look, given the pointer's direction from them in px and how near
 * counts as on the face (`dead`, where they look straight out). A step that would
 * land on the outline falls back to its stronger axis, then the other, then centre.
 */
export function lookToward(art: PetalBotArt, vx: number, vy: number, dead: number): Offset {
  const len = Math.hypot(vx, vy)
  if (len < dead) return { dx: 0, dy: 0 }
  const dx = Math.abs(vx) > len * AXIS ? Math.sign(vx) : 0
  const dy = Math.abs(vy) > len * AXIS ? Math.sign(vy) : 0
  const tries: Offset[] =
    Math.abs(vx) >= Math.abs(vy)
      ? [{ dx, dy }, { dx, dy: 0 }, { dx: 0, dy }]
      : [{ dx, dy }, { dx: 0, dy }, { dx, dy: 0 }]
  return tries.find((t) => art.offsets.some((o) => o.dx === t.dx && o.dy === t.dy)) ?? { dx: 0, dy: 0 }
}

/*
  One pointer for every bot: the window's last pointer position, re-announced on
  any scroll (the bots move under a still pointer), at most once a frame.
*/
type Listener = (p: { x: number; y: number }) => void
const listeners = new Set<Listener>()
let pointer: { x: number; y: number } | null = null
let frame = 0
let attached = false

function announce() {
  frame = 0
  if (pointer) for (const l of listeners) l(pointer)
}
function queue() {
  if (!frame) frame = requestAnimationFrame(announce)
}
function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  pointer = { x: e.clientX, y: e.clientY }
  queue()
}

export function watchPointer(listener: Listener): () => void {
  listeners.add(listener)
  if (!attached) {
    attached = true
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', queue, { passive: true, capture: true })
  }
  if (pointer) listener(pointer)
  return () => {
    listeners.delete(listener)
    if (!listeners.size && attached) {
      attached = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', queue, { capture: true })
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}
