# Leaf pattern — Figma reference notes

Source: file `5mDT1eQf2KBcET9dh6kPXd`, node `123:4359` ("Frame 455").
Assets saved alongside this file: `frame-full.png` (raw 565×664 export), `pattern-full.svg` (vector export of the whole frame), `left-edge-zoom.png` / `right-edge-zoom.png` / `top-edge-zoom.png` / `bottom-edge-zoom.png` (3×/2× crops used to inspect the boundaries).

## Node structure

- `Frame 455` (565×664px, `overflow: hidden`) contains 28 sibling groups (`Group 94`…`Group 138`), each one pixel-art leaf.
- Each leaf group is **not** a single vector — it's built from dozens of individual 14.119×14.119px square `div`s (rotated 90°, some also `-scale-y-100`'d for mirrored corners), each with its own solid fill. There's no shared "leaf component" being instanced; every leaf is a bespoke grid of squares.
- Per leaf: **13 columns × 9 rows** of 14.119px cells → bounding box **183.55 × 127.07px**, confirmed exactly against the reported group width/height.
- Cells are contiguous (cell pitch = cell size, 14.119px), so there are no gaps *inside* a single leaf — outline, fill and highlight cells all tile edge-to-edge.

## Leaf shape

Each leaf reads as a wide pointed lens ("eye") shape: a black outer outline, a horizontal notch pinching the middle (like a closed eyelid / leaf midrib), a saturated main-fill color on the lower-right mass, and a lighter highlight color along the upper-left arc. A handful of pixels (~2 per leaf, <1% of cells) use a darker shade of the main hue as a corner shadow accent.

Hue families found in this frame (main / highlight hex):

| Family | Main | Highlight |
|---|---|---|
| Blue | `#3a7ed7` | `#58dbdf` |
| Amber | `#fcb01a` | `#ffd233` |
| Orange-red | `#f95b1c` | `#ff8f0c` |
| Pink | `#ff4f95` | `#ff8fbc` |
| Red | `#ff4a4d` | `#ff9495` |
| Green | `#26b846` | `#3aed62` |
| Teal | `#008755` | `#08b776` |

Outline is pure black (`#000000`) on every leaf. Background behind the pattern is `#444444` (a flat dark gray — this is almost certainly a placeholder fill, not a token; swap for whatever surface color the leaves actually sit on in your layout).

## Grid / spacing

The 28 leaves tile in **4 visible columns** (the frame clips a 5th column-worth on the right), each column a straight vertical stack of same-x leaves, columns staggered like brick coursing:

- **Column x-positions (left edges):** ~283.5, ~408.5, ~535.5, ~655.5px
- **Column pitch (center-to-center horizontally):** 125px, 127px, 120px → **~124px average**
- **Leaf bbox width:** 183.55px → so adjacent columns' bounding boxes overlap by **~59–60px (~32% of width)**. The actual leaf *silhouettes* don't overlap though — the pointed tips of one leaf nest into the concave notch of its neighbor, so no pixels are double-covered and no background shows through in the interior.
- **Row pitch within one column:** a flat **113px**, verified across all 7 rows in two different columns.
- **Vertical stagger between adjacent columns:** **56.5px** — exactly half the row pitch (columns A/C share one row phase, B/D share the other, offset by 113/2).
- **Leaf bbox height:** 127.07px → consecutive rows in the same column overlap by **~14px (~11% of height)**, again absorbed by the shape's silhouette rather than visible pixel overlap.
- **Cell size:** 14.119px square, contiguous (0px gap) inside a leaf.

Net effect: a dense, fully-interlocking diagonal tessellation — not simple overlapping rectangles. If reproducing in CSS, treat each leaf as a positioned sprite of size 183.55×127.07 at `x = col*124, y = row*113 + (col is odd ? 56.5 : 0)`.

## Left edge (where the pattern meets content)

**Hard boundary, but jagged — not a straight crop, not a fade.** The leaf pattern starts at x≈283.5 (roughly the frame's horizontal midpoint). To the left is flat `#444444` background with zero opacity fade — but the boundary itself follows individual leaf silhouettes rather than a clean vertical line: single-cell (14px) tips and outline pixels from the leftmost column poke ~14–28px past the main body of leaves into the empty area, creating a comb/zigzag edge (see `left-edge-zoom.png`). No leaf is fractionally cropped here — every leaf touching this edge is fully modeled, its point just happens to reach into otherwise-empty space.

## Top / right / bottom edges

**Plain hard crop**, unlike the left edge. The tiled field clearly continues beyond the frame in all three directions — leaves are sliced mid-shape exactly at y=0, x=565, and y=664 (see the corresponding zoom crops). This is just `overflow: hidden` on the frame, not a designed edge. Don't replicate this feathering/tapering behavior on those sides — only the left edge has the deliberately-placed jagged boundary.

## Color arrangement

Not random per-leaf — colors run in diagonal bands. Scanning down the screenshot, hue families repeat in stripes roughly 2 rows deep before rotating to the next family (amber → orange-red → teal → blue → pink → red → repeat), and the two staggered columns within a stripe are usually the same or an adjacent family, which is what produces the diagonal rainbow-stripe look in `frame-full.png` rather than a checkerboard or fully random scatter. I did not reverse-engineer an exact deterministic sequence — if you need the pattern to repeat seamlessly, treat this as "cycle through a ~7-hue palette in diagonal stripes" rather than copying a fixed lookup table.

## Summary — spacing numbers to use in code

- Leaf sprite size: **183.55 × 127.07px** (13×9 cells of 14.119px)
- Column pitch: **~124px** (write your own consistent value here rather than the file's slightly-uneven 120/125/127 — that unevenness reads as float-math noise, not intent)
- Row pitch: **113px**
- Column stagger: **56.5px** (half of row pitch)
- Horizontal bbox overlap between columns: **~59–60px**
- Vertical bbox overlap between rows: **~14px**
- Cell size: **14.119px**, no inner gap
- Left edge: hard cut at the pattern's natural x-origin, jagged by leaf silhouette, no fade
- Top/right/bottom: plain `overflow: hidden` clipping, not something to reproduce deliberately
