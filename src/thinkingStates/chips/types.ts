import type { GridUtils } from "../engine/grid";
import type { PixUtils } from "../engine/pix";
import type { Draw, Shape } from "../engine/types";

export type Group = "grid" | "radial" | "bare" | "dots";

export interface ChipDef<S extends "grid" | "pix", U> {
  system: S;
  id: string;
  label: string;
  name: string;
  color: string;
  group: Group;
  /** Fixed cell shape; otherwise the user's choice applies. */
  shape?: Shape;
  /** Dot size multiplier (dot-matrix chips only). */
  scale?: number;
  draw: Draw<U>;
}

export type Chip = ChipDef<"grid", GridUtils> | ChipDef<"pix", PixUtils>;
