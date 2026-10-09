/**
 * The logo intro's art and timeline, apart from `IntroSplash` so the component
 * file exports only components (Fast Refresh) and so Storybook and `App` can
 * share the variant presets.
 *
 * Both marks are rebuilt as squares on their own grids, read off the frame's
 * export (Figma `419:7381`), rather than shipped as the export — that is what
 * lets each square carry its own delay.
 */

/**
 * The four-leaf mark (`419:7032`), 23 × 23 at the frame's 6.6px square, as the
 * file builds it: four leaf groups, each a rotation of one 9 × 13 leaf, sitting
 * at `x` / `y` on the mark's grid and overlapping along the centre cross. `k`
 * is the outline, and each leaf is a base colour plus a highlight: top
 * `g`/`G`, right `o`/`O`, bottom `y`/`Y`, left `t`/`T`. `leaf` is the
 * clockwise-from-the-top index the fills and spins stagger by.
 *
 * Listed in the file's paint order — each one draws over the ones before it
 * where they overlap — so compositing them in turn gives the mark exactly.
 * Kept as leaves rather than the composite so the `spin` draw can move each
 * one as a whole.
 */
export const LEAVES = [
  {
    leaf: 2,
    x: 7,
    y: 10,
    rows: [
      '...kkk...',
      '..kykyk..',
      '.kyykyyk.',
      'kyyykkyyk',
      'kykykykyk',
      'kyyykyyyk',
      'kYykkkyyk',
      'kYkykykyk',
      'kYyykyyyk',
      '.kYykyyk.',
      '..kYkyk..',
      '...kkk...',
      '....k....',
    ],
  },
  {
    leaf: 1,
    x: 10,
    y: 7,
    rows: [
      '...kkkkkk....',
      '..kooooook...',
      '.kookookook..',
      'kookookooook.',
      'kkkkkkkkkkkkk',
      'koooookoooOk.',
      '.kookookoOk..',
      '..koooOOOk...',
      '...kkkkkk....',
    ],
  },
  {
    leaf: 0,
    x: 7,
    y: 0,
    rows: [
      '....k....',
      '...kkk...',
      '..kgkGk..',
      '.kggkgGk.',
      'kgggkggGk',
      'kgkgkgkGk',
      'kggkkkgGk',
      'kgggkgggk',
      'kgkgkgkgk',
      'kggkkgggk',
      '.kggkggk.',
      '..kgkgk..',
      '...kkk...',
    ],
  },
  {
    leaf: 3,
    x: 0,
    y: 7,
    rows: [
      '....kkkkkk...',
      '...kTTTtttk..',
      '..kTtkttkttk.',
      '.kTtttktttttk',
      'kkkkkkkkkkkkk',
      '.kttttkttkttk',
      '..kttkttkttk.',
      '...kttttttk..',
      '....kkkkkk...',
    ],
  },
]

const MARK_SIZE = 23

/** The leaves composited in paint order — the mark as it reads at rest. */
export const MARK: string[] = (() => {
  const grid = Array.from({ length: MARK_SIZE }, () => Array<string>(MARK_SIZE).fill('.'))
  for (const { x, y, rows } of LEAVES) {
    rows.forEach((row, dy) =>
      [...row].forEach((ch, dx) => {
        if (ch !== '.') grid[y + dy][x + dx] = ch
      }),
    )
  }
  return grid.map((row) => row.join(''))
})()

const MARK_INK: Record<string, string> = {
  k: '#000000',
  g: '#26b846',
  G: '#3aed62',
  o: '#f95b1c',
  O: '#ff8f0c',
  y: '#fcb01a',
  Y: '#ffd233',
  t: '#008755',
  T: '#08b776',
}

/** Leaf index per colour, clockwise from the top — the order they fill in. */
const LEAF_OF: Record<string, number> = { g: 0, G: 0, o: 1, O: 1, y: 2, Y: 2, t: 3, T: 3 }

/**
 * The "no3y" label (`419:7377`): 13 × 3 blocks, each three of the mark's
 * squares (the file's 20.27 against 6.61, near enough). Letters start at
 * columns 0 / 4 / 7 / 10, which is how a block is told which letter it types
 * with.
 */
export const LABEL = [
  'XX..X..XX.X.X',
  'X.X..X.X...X.',
  'X.X.X...X.X..',
]
const LETTER_COLS = [0, 4, 7, 10]
/** Where the cursor sits after the last letter: one space past the `y`. */
const TAIL_COL = 14

/** A label block is three mark squares; the gap is the file's 30.4 / 6.61. */
export const BLOCK = 3
export const LABEL_GAP = 4.6

/**
 * Every knob a variant can turn. Times are ms at `speed` 1; `speed` divides
 * all of them, so 0.25 is a 4× slow-motion of the same variant.
 */
export type IntroConfig = {
  /**
   * How the mark draws in. `bloom` grows the outline out from the centre a
   * ring at a time and floods the leaves in behind it, clockwise from the
   * top; `scan` prints it row by row; `scatter` dissolves it in at random;
   * `spin` brings each leaf in whole, spinning into place, clockwise from the
   * top and `leafStagger` apart; `fan` shows the frontmost leaf (the dark
   * green, left) alone, then sweeps the other three out from behind it
   * clockwise, round the mark's centre and at full size, each dropping off at
   * its own place — top, then right, then bottom.
   */
  draw: 'bloom' | 'scan' | 'scatter' | 'spin' | 'fan'
  /**
   * `type` runs an orange cursor through the letters; `sweep` builds the label
   * column by column. `reveal` draws the mark alone in the middle of the
   * sheet, then slides it left into the lockup and pulls the label out from
   * behind it as it goes.
   */
  label: 'type' | 'sweep' | 'reveal'
  /**
   * `spine` folds the sheet left into the rail's 48px spine (desktop only —
   * mobile has no spine and lifts instead); `lift` wipes it off the top;
   * `fade` dissolves it.
   */
  exit: 'spine' | 'lift' | 'fade'
  /** `scale` pops each square up from a third of its size; `instant` just switches it on. */
  pop: 'scale' | 'instant'
  /** Playback rate. */
  speed: number
  /** ms per ring (bloom), row (scan) or spread unit (scatter). */
  step: number
  /**
   * ms between one leaf starting and the next (bloom, spin and fan). In `fan`
   * it is between each leaf leaving the stack; 0 sweeps them out together.
   */
  leafStagger: number
  /** Degrees each leaf turns on its way in (spin only); negative turns anticlockwise. */
  spinDeg: number
  /**
   * What each leaf turns about (spin only): `mark` swings it round the mark's
   * centre, so the leaves spiral out from the middle; `leaf` turns it about its
   * own centre, like a pinwheel blade settling.
   */
  spinPivot: 'mark' | 'leaf'
  /** The size each leaf starts at, 0–1 (spin only). */
  spinFrom: number
  /** ms each leaf's spin takes (spin), or the whole sweep to the farthest leaf (fan). */
  spinMs: number
  /** ms between letters (type, sweep). */
  letterStep: number
  /** ms the mark takes to slide over and pull the label out (reveal only). */
  slideMs: number
  /** ms the finished lockup holds before the exit. */
  hold: number
  /** ms the exit takes. */
  exitMs: number
}

/** The base every preset spreads from: the outline blooms, the cursor types. */
const BLOOM: IntroConfig = {
  draw: 'bloom',
  label: 'type',
  exit: 'spine',
  pop: 'scale',
  speed: 1,
  step: 28,
  leafStagger: 110,
  spinDeg: 360,
  spinPivot: 'mark',
  spinFrom: 0,
  spinMs: 900,
  letterStep: 120,
  slideMs: 800,
  hold: 800,
  exitMs: 700,
}

/**
 * Named starting points. `App` reads `?intro=<name>` against these, and each
 * one is a Storybook story, so adding a variant here makes it watchable in both.
 */
export const INTRO_VARIANTS = {
  bloom: BLOOM,
  scan: { ...BLOOM, draw: 'scan', label: 'sweep', pop: 'instant', step: 32, exit: 'lift' },
  scatter: { ...BLOOM, draw: 'scatter', step: 30, exit: 'fade', exitMs: 500 },
  spin: { ...BLOOM, draw: 'spin', leafStagger: 140 },
  pinwheel: {
    ...BLOOM,
    draw: 'spin',
    spinPivot: 'leaf',
    spinDeg: -540,
    spinFrom: 0.2,
    spinMs: 800,
    leafStagger: 120,
  },
  fan: { ...BLOOM, draw: 'fan', spinMs: 1100, leafStagger: 0 },
} satisfies Record<string, IntroConfig>

/**
 * The one that ships: the leaves fan out from behind the front one in the
 * middle of the sheet, then the mark slides left and the name comes out from
 * behind it.
 */
export const DEFAULT_INTRO: IntroConfig = { ...INTRO_VARIANTS.fan, label: 'reveal', speed: 1.25 }

export type IntroVariant = keyof typeof INTRO_VARIANTS

export function isIntroVariant(name: string): name is IntroVariant {
  return name in INTRO_VARIANTS
}

/** Lead-in so the first frame paints the empty sheet rather than landing mid-draw. */
const LEAD_IN = 150
const POP_MS = 140
const BLINK = 400
const TAIL_BLINKS = 2
/** Breath between the mark finishing and the label starting. */
const LABEL_GAP_MS = 80
/** `reveal`: the finished mark rests in the middle this long before it slides. */
const SLIDE_BEAT = 250
/** `fan`: the front leaf fading in on its own, then a beat before the sweep. */
const ANCHOR_IN = 200
const ANCHOR_BEAT = 250
/** The leaf the fan opens from: the last in paint order, so the one in front. */
const FAN_ANCHOR = LEAVES[LEAVES.length - 1].leaf

export type Square = { x: number; y: number; ink: string; delay: number }
export type CursorStop = { col: number; from: number; iterations: number }

/**
 * One leaf of the `spin` / `fan` draws: its squares relative to its own box,
 * the box on the mark's grid, and where it turns about — px off the box's
 * top-left once multiplied by the square size, so the component only has to
 * scale it. `from` is the angle it turns in from and `scale` the size it
 * starts at.
 *
 * `role` is how it moves. A `spin` leaf turns in on its own. In `fan` the
 * `anchor` fades in and each `sweep` leaf is shown only once it starts
 * moving, out from behind it.
 */
export type SpinLeaf = {
  x: number
  y: number
  width: number
  height: number
  squares: { x: number; y: number; ink: string }[]
  role: 'spin' | 'anchor' | 'sweep'
  delay: number
  duration: number
  from: number
  scale: number
  pivot: { x: number; y: number }
}

export type IntroTimeline = {
  /** Square by square, for every draw but `spin` — empty for that one. */
  mark: Square[]
  /** Leaf by leaf, for `spin` and `fan` — empty for the others. */
  leaves: SpinLeaf[]
  label: Square[]
  cursor: CursorStop[]
  /** When the `reveal` slide starts and how long it runs; null for the other labels. */
  slide: { at: number; ms: number } | null
  popMs: number
  blinkMs: number
  foldAt: number
  exitMs: number
}

const CENTER = 11
const ring = (x: number, y: number) => Math.abs(x - CENTER) + Math.abs(y - CENTER)
const cell = (x: number, y: number) => MARK[y]?.[x] ?? '.'

/** A fixed hash per square, so `scatter` dissolves the same way every replay. */
function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * A black square is outline when it is on the centre cross (the stems) or
 * borders the empty canvas; the rest are the vein dots inside a leaf, which
 * `bloom` draws with that leaf's fill rather than early on bare canvas.
 */
function veinLeaf(x: number, y: number): number | undefined {
  const onEdge = [cell(x - 1, y), cell(x + 1, y), cell(x, y - 1), cell(x, y + 1)].includes('.')
  if (x === CENTER || y === CENTER || onEdge) return undefined
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const leaf = LEAF_OF[cell(x + dx, y + dy)]
      if (leaf !== undefined) return leaf
    }
  }
  return undefined
}

function markDelay(config: IntroConfig, ch: string, x: number, y: number): number {
  const { step } = config
  switch (config.draw) {
    case 'scan':
      // A slight left-to-right lean inside each row, so it reads as printing
      // rather than whole rows blinking on.
      return y * step + x * 2
    case 'scatter':
      return noise(x, y) * 22 * step
    case 'spin':
    case 'fan':
      return 0
    case 'bloom': {
      const fill = (leaf: number) => 8 * step + leaf * config.leafStagger + ring(x, y) * step
      if (ch !== 'k') return fill(LEAF_OF[ch])
      const vein = veinLeaf(x, y)
      return vein === undefined ? ring(x, y) * step : fill(vein)
    }
  }
}

const letterOf = (col: number) => LETTER_COLS.filter((start) => col >= start).length - 1

export function buildIntro(config: IntroConfig): IntroTimeline {
  const t = (ms: number) => ms / config.speed

  const markRaw = MARK.flatMap((row, y) =>
    [...row].flatMap((ch, x) =>
      ch === '.' ? [] : [{ x, y, ink: MARK_INK[ch], delay: markDelay(config, ch, x, y) }],
    ),
  )
  const byLeaf = config.draw === 'spin' || config.draw === 'fan'
  const leaves: SpinLeaf[] = byLeaf
    ? LEAVES.map(({ leaf, x, y, rows }) => {
        const box = {
          x,
          y,
          width: rows[0].length,
          height: rows.length,
          squares: rows.flatMap((row, dy) =>
            [...row].flatMap((ch, dx) => (ch === '.' ? [] : [{ x: dx, y: dy, ink: MARK_INK[ch] }])),
          ),
        }
        const aboutMark = { x: CENTER + 0.5 - x, y: CENTER + 0.5 - y }

        if (config.draw === 'spin') {
          return {
            ...box,
            role: 'spin' as const,
            delay: leaf * config.leafStagger,
            duration: config.spinMs,
            from: config.spinDeg,
            scale: config.spinFrom,
            pivot: config.spinPivot === 'mark' ? aboutMark : { x: box.width / 2, y: box.height / 2 },
          }
        }

        // `fan`: every leaf starts stacked on the anchor — a quarter turn back
        // per place clockwise from it — and travels for a time in proportion to
        // how far it goes. On one easing curve that gives them the same speed
        // off the mark, so they leave as one stack and drop off one at a time.
        //
        // The anchor is the frontmost leaf in the file's paint order, and
        // clockwise from it the leaves run front to back, so the stack starts
        // hidden behind it and each leaf comes out from behind the one before.
        // Nothing changes depth at any point — the order things are seen to
        // stack in is the order they rest in, with no swap when they land.
        const steps = (leaf - FAN_ANCHOR + LEAVES.length) % LEAVES.length
        const sweepStart = ANCHOR_IN + ANCHOR_BEAT
        return steps === 0
          ? { ...box, role: 'anchor' as const, delay: 0, duration: ANCHOR_IN, from: 0, scale: 1, pivot: aboutMark }
          : {
              ...box,
              role: 'sweep' as const,
              delay: sweepStart + (steps - 1) * config.leafStagger,
              duration: (config.spinMs * steps) / (LEAVES.length - 1),
              from: -90 * steps,
              scale: 1,
              pivot: aboutMark,
            }
      })
    : []

  const markEnd = byLeaf
    ? Math.max(...leaves.map((l) => l.delay + l.duration))
    : Math.max(...markRaw.map((s) => s.delay)) + POP_MS
  const labelStart = markEnd + LABEL_GAP_MS
  // `reveal` has no per-square timing: the whole label is there from the
  // start of the slide, hidden behind the mark until it is pulled out.
  const slideAt = markEnd + SLIDE_BEAT

  // `sweep` spends the same time per letter as `type`, spread over its columns.
  const colStep = config.letterStep / BLOCK
  const labelDelay = (x: number) =>
    config.label === 'reveal'
      ? slideAt
      : config.label === 'type'
        ? labelStart + letterOf(x) * config.letterStep
        : labelStart + x * colStep
  const labelEnd =
    config.label === 'reveal'
      ? slideAt + config.slideMs
      : config.label === 'type'
        ? labelStart + (LETTER_COLS.length - 1) * config.letterStep
        : labelStart + (LABEL[0].length - 1) * colStep

  const labelRaw = LABEL.flatMap((row, y) =>
    [...row].flatMap((ch, x) => (ch === 'X' ? [{ x, y, ink: '', delay: labelDelay(x) }] : [])),
  )

  // The cursor as a run of stops: before the first letter, then in front of
  // each one as the one before it lands, then one space past the end through
  // the hold. Each stop is shown only for its window — see `.intro-cursor`.
  const cursorIn = Math.max(0, labelStart - 1.5 * BLINK)
  const stops =
    config.label === 'type'
      ? [
          { col: LETTER_COLS[0], from: cursorIn, to: labelStart },
          ...LETTER_COLS.slice(1).map((col, i) => ({
            col,
            from: labelStart + i * config.letterStep,
            to: labelStart + (i + 1) * config.letterStep,
          })),
          { col: TAIL_COL, from: labelEnd, to: labelEnd + Math.min(config.hold, TAIL_BLINKS * BLINK) },
        ]
      : []

  return {
    mark: byLeaf ? [] : markRaw.map((s) => ({ ...s, delay: t(LEAD_IN + s.delay) })),
    leaves: leaves.map((l) => ({ ...l, delay: t(LEAD_IN + l.delay), duration: t(l.duration) })),
    label: labelRaw.map((s) => ({ ...s, delay: t(LEAD_IN + s.delay) })),
    cursor: stops
      .filter((s) => s.to > s.from)
      .map((s) => ({ col: s.col, from: t(LEAD_IN + s.from), iterations: (s.to - s.from) / BLINK })),
    slide: config.label === 'reveal' ? { at: t(LEAD_IN + slideAt), ms: t(config.slideMs) } : null,
    popMs: config.pop === 'instant' ? 1 : t(POP_MS),
    blinkMs: t(BLINK),
    foldAt: t(LEAD_IN + labelEnd + POP_MS + config.hold),
    exitMs: t(config.exitMs),
  }
}
