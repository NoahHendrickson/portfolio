import { DOT_CHIPS } from "./dots";
import { GRID_CHIPS } from "./grid";
import type { Chip, Group } from "./types";

export type { Chip, Group } from "./types";

export const CHIPS: Chip[] = [...GRID_CHIPS, ...DOT_CHIPS];

export const GROUPS: { id: Group; label: string; blurb: string }[] = [
  { id: "grid", label: "Grid", blurb: "5×5 pixel grids over a dim blueprint" },
  { id: "radial", label: "Radial", blurb: "7×7 spinners, sweeps and helices" },
  { id: "bare", label: "Bare", blurb: "No background grid, just the lit cells" },
  { id: "dots", label: "Dot matrix", blurb: "Sparse braille-style dot fields" },
];

export const chipById = (id: string) => CHIPS.find((c) => c.id === id);
