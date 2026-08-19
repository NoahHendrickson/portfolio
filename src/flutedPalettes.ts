/**
 * The colour beds `FlutedGradient` refracts, kept out of the component file so
 * the component stays the only export there (Fast Refresh wants one or the
 * other) — the same split as `layout.ts` and `homeTab.ts`.
 */

/** A stop on the `linear` bed. The library takes at most 8. */
type Stop = { color: string; position: number }

/** The five control points of the `mesh` bed, in the order the shader takes them. */
type MeshPoint = { color: string; x: number; y: number }

export type FlutedPalette = {
  label: string
  /** Multi-stop axis. `start` / `end` tilt it; the file's frame runs a shallow diagonal. */
  stops: Stop[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  /** The same palette as placed points, for `bed="mesh"`. */
  mesh: MeshPoint[]
}

/**
 * `no3y` is measured off `card-no3y.png` rather than guessed: the flutes smear
 * the bed sideways, so the export was blurred horizontally to average them out
 * before sampling across the top and bottom edges. The violet runs further
 * right along the bottom than the top, which is the diagonal `start` / `end`.
 */
export const PALETTES = {
  no3y: {
    label: 'no3y Code',
    stops: [
      { color: '#7b6cf6', position: 0 },
      { color: '#f43e5a', position: 0.16 },
      { color: '#fb6a3c', position: 0.3 },
      { color: '#fb9462', position: 0.46 },
      { color: '#fab8aa', position: 0.62 },
      { color: '#f0bed3', position: 0.8 },
      { color: '#d5bae0', position: 1 },
    ],
    start: { x: 0, y: 0.26 },
    end: { x: 1, y: -0.02 },
    mesh: [
      { color: '#7b6cf6', x: 0.02, y: 0.1 },
      { color: '#fb6a3c', x: 0.42, y: 0.02 },
      { color: '#8873f0', x: 0.1, y: 0.95 },
      { color: '#d5bae0', x: 0.98, y: 0.2 },
      { color: '#f9a1b4', x: 0.7, y: 0.9 },
    ],
  },
  /** The site's accent, kept in one hue family the way the other cards are. */
  ember: {
    label: 'Ember',
    stops: [
      { color: '#5c1f0a', position: 0 },
      { color: '#c56430', position: 0.3 },
      { color: '#f97316', position: 0.55 },
      { color: '#fbbf6b', position: 0.78 },
      { color: '#fde3c0', position: 1 },
    ],
    start: { x: 0, y: 0.2 },
    end: { x: 1, y: -0.05 },
    mesh: [
      { color: '#5c1f0a', x: 0.05, y: 0.15 },
      { color: '#f97316', x: 0.55, y: 0.05 },
      { color: '#c56430', x: 0.15, y: 0.9 },
      { color: '#fde3c0', x: 0.95, y: 0.3 },
      { color: '#fbbf6b', x: 0.75, y: 0.95 },
    ],
  },
  /** The leaf-field greens, for a bed that sits with the home page's shell. */
  leaf: {
    label: 'Leaf',
    stops: [
      { color: '#234a2a', position: 0 },
      { color: '#2cb058', position: 0.32 },
      { color: '#29e684', position: 0.58 },
      { color: '#afde7c', position: 0.82 },
      { color: '#e8f5c8', position: 1 },
    ],
    start: { x: 0, y: 0.2 },
    end: { x: 1, y: -0.05 },
    mesh: [
      { color: '#234a2a', x: 0.05, y: 0.12 },
      { color: '#29e684', x: 0.5, y: 0.05 },
      { color: '#2cb058', x: 0.12, y: 0.92 },
      { color: '#e8f5c8', x: 0.96, y: 0.28 },
      { color: '#afde7c', x: 0.72, y: 0.92 },
    ],
  },
} satisfies Record<string, FlutedPalette>

export type PaletteName = keyof typeof PALETTES
