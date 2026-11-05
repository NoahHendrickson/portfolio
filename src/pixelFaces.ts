/*
  The rail's pixel faces, in their own module so the no3y Code page's
  background pattern (`ProjectSheet`) can share them — a component file should
  export only components for Fast Refresh.
*/

/**
 * The 16px pixel faces the frame seats where a pill otherwise carries the
 * orange arrow: the Hi tab's (Figma `371:12378`) and the three in section
 * `372:12388`. Each is two eyes over a mouth, drawn on the 2px grid.
 */
export const FACE_DOTS = {
  /** `371:12378` — a smile that turns up at its right end. */
  smirk: [
    [5, 2],
    [9, 2],
    [5, 4],
    [9, 4],
    [11, 8],
    [5, 10],
    [7, 10],
    [9, 10],
  ],
  /** `371:12355` — an open grin. */
  grin: [
    [5, 4],
    [9, 4],
    [3, 8],
    [11, 8],
    [3, 10],
    [5, 10],
    [7, 10],
    [9, 10],
    [11, 10],
  ],
  /** `371:12365` — laughing, eyes up and the mouth wide open. */
  laugh: [
    [5, 2],
    [9, 2],
    [3, 6],
    [5, 6],
    [7, 6],
    [9, 6],
    [11, 6],
    [3, 8],
    [11, 8],
    [5, 10],
    [7, 10],
    [9, 10],
  ],
  /** `371:12346` — a typed `:)`, turned upright to match the other faces. */
  emoticon: [
    [5, 4],
    [9, 4],
    [12, 8],
    [10, 10],
    [8, 10],
    [6, 10],
    [4, 10],
    [2, 8],
  ],
  /** `390:28031` — eyes up-right, mouth a flat line. */
  eyeroll: [
    [3, 3],
    [5, 5],
    [9, 3],
    [11, 5],
    [3, 10],
    [5, 10],
    [7, 10],
    [9, 10],
    [11, 10],
  ],
} satisfies Record<string, [number, number][]>
