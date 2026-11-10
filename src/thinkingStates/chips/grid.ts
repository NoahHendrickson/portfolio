import type { ChipDef } from "./types";
import type { GridUtils } from "../engine/grid";

export const GRID_CHIPS: ChipDef<"grid", GridUtils>[] = [

  {
    system: "grid",
    id: "wave",
    label: "Debugging",
    name: "Diagonal wave",
    color: "#38BDF8",
    group: "grid",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < o.N; j++)
        for (var i = 0; i < o.N; i++) {
          var a = 0.5 + 0.5 * Math.sin(t * 5 - (i + j) * 0.9);
          o.cell(i, j, a * a * a);
        }
    },
  },
  {
    system: "grid",
    id: "scan",
    label: "Searching",
    name: "Scanline",
    color: "#FBBF24",
    group: "grid",
    draw: (t, _ctx, o) => {
      var c = ((t * 3.2) % (o.N + 2)) - 1;
      for (var j = 0; j < o.N; j++)
        for (var i = 0; i < o.N; i++) {
          o.cell(i, j, Math.exp(-Math.abs(i - c) * 1.1));
        }
    },
  },
  {
    system: "grid",
    id: "bloom",
    label: "Deploying",
    name: "Bloom",
    color: "#4ADE80",
    group: "radial",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < 7; j++)
        for (var i = 0; i < 7; i++) {
          var dx = i - 3,
            dy = j - 3,
            rad = Math.hypot(dx, dy);
          if (rad > 3.4) continue;
          var ang = Math.atan2(dy, dx);
          var petal = 0.5 + 0.5 * Math.cos(4 * ang);
          var wave = Math.pow(0.5 + 0.5 * Math.sin(t * 2.8 - rad * 1.4), 2.5);
          var a = rad < 0.5 ? wave : wave * (0.25 + 0.75 * petal);
          o.cellN(7, i, j, a);
        }
    },
  },
  {
    system: "grid",
    id: "dna-helix",
    label: "Sequencing",
    name: "DNA helix",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < 7; j++) {
        var ph = t * 3.2 - j * 0.785;
        var s = Math.sin(ph),
          c = Math.cos(ph);
        var x1 = 3 + 2.45 * s,
          x2 = 3 - 2.45 * s;
        var d1 = 0.4 + 0.6 * (0.5 + 0.5 * c),
          d2 = 0.4 + 0.6 * (0.5 - 0.5 * c);
        for (var i = 0; i < 7; i++) {
          var a = Math.max(
            Math.exp(-Math.abs(i - x1) * 2.4) * d1,
            Math.exp(-Math.abs(i - x2) * 2.4) * d2,
          );
          if (a > 0.08) o.cellN(7, i, j, a);
        }
      }
    },
  },
  {
    system: "grid",
    id: "dna-ladder",
    label: "Sequencing",
    name: "Ladder",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // The helix plus faint base-pair rungs, which show as the strands swing apart.
      for (var j = 0; j < 7; j++) {
        var ph = t * 3.2 - j * 0.785,
          s = Math.sin(ph),
          c = Math.cos(ph),
          x1 = 3 + 2.45 * s,
          x2 = 3 - 2.45 * s,
          d1 = 0.4 + 0.6 * (0.5 + 0.5 * c),
          d2 = 0.4 + 0.6 * (0.5 - 0.5 * c),
          lo = Math.min(x1, x2),
          hi = Math.max(x1, x2);
        for (var i = 0; i < 7; i++) {
          var a = Math.max(Math.exp(-Math.abs(i - x1) * 2.4) * d1, Math.exp(-Math.abs(i - x2) * 2.4) * d2);
          if (i > lo + 0.6 && i < hi - 0.6) a = Math.max(a, 0.3 * Math.abs(s));
          if (a > 0.08) o.cellN(7, i, j, a);
        }
      }
    },
  },
  {
    system: "grid",
    id: "dna-triple",
    label: "Sequencing",
    name: "Triple helix",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // Three strands a third of a turn apart, on a 9×9 grid for room. Each strand lights only
      // the one or two cells nearest it, and a strand turning away drops back to ~20%, so the
      // front strand reads on top and the twist stays clear.
      for (var j = 0; j < 9; j++)
        for (var i = 0; i < 9; i++) {
          var a = 0;
          for (var k = 0; k < 3; k++) {
            var ph = t * 2.6 - j * 0.55 + k * 2.094,
              x = 4 + 3.3 * Math.sin(ph),
              depth = 0.5 + 0.5 * Math.cos(ph),
              near = Math.max(0, 1 - Math.abs(i - x) * 1.1);
            a = Math.max(a, near * (0.18 + 0.82 * depth * depth));
          }
          if (a > 0.1) o.cellN(9, i, j, a);
        }
    },
  },
  {
    system: "grid",
    id: "dna-sideways",
    label: "Sequencing",
    name: "Sideways helix",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // The helix laid on its side, twisting left to right.
      for (var i = 0; i < 7; i++) {
        var ph = t * 3.2 - i * 0.785,
          s = Math.sin(ph),
          c = Math.cos(ph),
          y1 = 3 + 2.45 * s,
          y2 = 3 - 2.45 * s,
          d1 = 0.4 + 0.6 * (0.5 + 0.5 * c),
          d2 = 0.4 + 0.6 * (0.5 - 0.5 * c);
        for (var j = 0; j < 7; j++) {
          var a = Math.max(Math.exp(-Math.abs(j - y1) * 2.4) * d1, Math.exp(-Math.abs(j - y2) * 2.4) * d2);
          if (a > 0.08) o.cellN(7, i, j, a);
        }
      }
    },
  },
  {
    system: "grid",
    id: "dna-fine",
    label: "Sequencing",
    name: "Fine helix",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // A 9×9 grid for a smoother twist.
      for (var j = 0; j < 9; j++) {
        var ph = t * 3.2 - j * 0.6,
          s = Math.sin(ph),
          c = Math.cos(ph),
          x1 = 4 + 3.2 * s,
          x2 = 4 - 3.2 * s,
          d1 = 0.4 + 0.6 * (0.5 + 0.5 * c),
          d2 = 0.4 + 0.6 * (0.5 - 0.5 * c);
        for (var i = 0; i < 9; i++) {
          var a = Math.max(Math.exp(-Math.abs(i - x1) * 2.2) * d1, Math.exp(-Math.abs(i - x2) * 2.2) * d2);
          if (a > 0.08) o.cellN(9, i, j, a);
        }
      }
    },
  },
  {
    system: "grid",
    id: "dna-plasmid",
    label: "Sequencing",
    name: "Plasmid",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // Circular DNA: two strands twist around a ring (9×9 for enough resolution).
      for (var j = 0; j < 9; j++)
        for (var i = 0; i < 9; i++) {
          var dx = i - 4,
            dy = j - 4,
            r = Math.hypot(dx, dy);
          if (r > 4.45) continue;
          var ph = 3 * Math.atan2(dy, dx) - t * 3,
            s = Math.sin(ph),
            c = Math.cos(ph),
            a = Math.max(
              Math.exp(-Math.abs(r - (2.9 + 1.15 * s)) * 2.8) * (0.4 + 0.6 * (0.5 + 0.5 * c)),
              Math.exp(-Math.abs(r - (2.9 - 1.15 * s)) * 2.8) * (0.4 + 0.6 * (0.5 - 0.5 * c)),
            );
          if (a > 0.08) o.cellN(9, i, j, a);
        }
    },
  },
  {
    system: "grid",
    id: "dna-reader",
    label: "Sequencing",
    name: "Reader",
    color: "#2DD4BF",
    group: "radial",
    draw: (t, _ctx, o) => {
      // A read head sweeps down the helix, lighting each base pair as it passes.
      var head = ((t * 2.5) % 9) - 1;
      for (var j = 0; j < 7; j++) {
        var ph = t * 3.2 - j * 0.785,
          s = Math.sin(ph),
          c = Math.cos(ph),
          x1 = 3 + 2.45 * s,
          x2 = 3 - 2.45 * s,
          d1 = 0.4 + 0.6 * (0.5 + 0.5 * c),
          d2 = 0.4 + 0.6 * (0.5 - 0.5 * c),
          band = Math.exp(-Math.pow(j - head, 2) * 1.2),
          lo = Math.min(x1, x2),
          hi = Math.max(x1, x2);
        for (var i = 0; i < 7; i++) {
          var a = Math.max(Math.exp(-Math.abs(i - x1) * 2.4) * d1, Math.exp(-Math.abs(i - x2) * 2.4) * d2) * (0.4 + 0.6 * band);
          if (i > lo + 0.5 && i < hi - 0.5) a = Math.max(a, 0.6 * band);
          if (a > 0.08) o.cellN(7, i, j, a);
        }
      }
    },
  },
  {
    system: "grid",
    id: "ripple-bare",
    label: "Syncing",
    name: "Bare ripple",
    color: "#22D3EE",
    group: "bare",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < o.N; j++)
        for (var i = 0; i < o.N; i++) {
          var d = Math.hypot(i - 2, j - 2);
          var a = 0.5 + 0.5 * Math.sin(t * 5 - d * 1.6);
          o.cellA(i, j, a * a * a);
        }
    },
  },
  {
    system: "grid",
    id: "rain-bare",
    label: "Compiling",
    name: "Bare rain",
    color: "#34D399",
    group: "bare",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < o.N; i++) {
        var sp = 2.5 + o.frac(i * 5.7) * 2.5,
          y = ((t * sp + o.frac(i * 9.1) * 7) % (o.N + 3)) - 1.5;
        for (var j = 0; j < o.N; j++) {
          var dy = y - j;
          o.cellA(i, j, dy >= 0 ? Math.exp(-dy * 0.8) : Math.exp(dy * 8));
        }
      }
    },
  },
  {
    system: "grid",
    id: "wave-bare",
    label: "Debugging",
    name: "Bare wave",
    color: "#38BDF8",
    group: "bare",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < o.N; j++)
        for (var i = 0; i < o.N; i++) {
          var a = 0.5 + 0.5 * Math.sin(t * 5 - (i + j) * 0.9);
          o.cellA(i, j, a * a * a);
        }
    },
  },
  {
    system: "grid",
    id: "rain-bare4",
    label: "Compiling",
    name: "Bare rain (4 col)",
    color: "#34D399",
    group: "bare",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 4; i++) {
        var sp = 2.5 + o.frac(i * 5.7) * 2.5,
          y = ((t * sp + o.frac(i * 9.1) * 7) % (o.N + 3)) - 1.5;
        for (var j = 0; j < o.N; j++) {
          var dy = y - j;
          o.cellA(i + 0.5, j, dy >= 0 ? Math.exp(-dy * 0.8) : Math.exp(dy * 8));
        }
      }
    },
  },
  {
    system: "grid",
    id: "snake-bare",
    label: "Planning",
    name: "Bare snake",
    color: "#A3E635",
    group: "bare",
    draw: (t, _ctx, o) => {
      var M = o.N * o.N,
        head = (t * 14) % M;
      for (var j = 0; j < o.N; j++)
        for (var i = 0; i < o.N; i++) {
          var k = j * o.N + (j % 2 ? o.N - 1 - i : i),
            d = (head - k + M) % M;
          o.cellA(i, j, d < 7 ? 1 - d / 7 : 0);
        }
    },
  },];
