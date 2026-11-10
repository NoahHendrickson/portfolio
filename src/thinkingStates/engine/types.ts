export type Shape = "rounded" | "square" | "circle" | "diamond";

/** Draws one frame. `t` is seconds since start, the canvas is a 56×56 unit space. */
export type Draw<U> = (t: number, ctx: CanvasRenderingContext2D, o: U) => void;
