// The X shape's rotated diamonds extend ~53px beyond their rect positions,
// so the tile needs a wrap-around copy of the next X shape on the right edge
// to fill in the portion that gets clipped at the left boundary.
// Tile width = 656.3px (distance between repeating X shapes in the original SVG).
export default function FlowerRow() {
  return (
    <svg
      style={{ width: '100vw', height: '319px', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="xplus"
          x="-7.83"
          y="0"
          width="656.301"
          height="319"
          patternUnits="userSpaceOnUse"
        >
          {/* X shape (rotate 45°) */}
          <rect x="-7.83203" y="53.0859" width="75.0731" height="75.0731" rx="8" transform="rotate(45 -7.83203 53.0859)" fill="white" fillOpacity="0.02" />
          <rect x="98.3398" y="53.0859" width="75.0731" height="75.0731" rx="8" transform="rotate(45 98.3398 53.0859)" fill="white" fillOpacity="0.02" />
          <rect x="98.3398" y="159.25" width="75.0731" height="75.0731" rx="8" transform="rotate(45 98.3398 159.25)" fill="white" fillOpacity="0.02" />
          <rect x="-7.83203" y="159.25" width="75.0731" height="75.0731" rx="8" transform="rotate(45 -7.83203 159.25)" fill="white" fillOpacity="0.02" />

          {/* Plus shape (rotate 90°) */}
          <rect x="410.922" y="46.6499" width="75.0689" height="75.0662" rx="8" transform="rotate(90 410.922 46.6499)" fill="white" fillOpacity="0.02" />
          <rect x="486" y="121.722" width="75.0689" height="75.0662" rx="8" transform="rotate(90 486 121.722)" fill="white" fillOpacity="0.02" />
          <rect x="410.922" y="196.786" width="75.0689" height="75.0662" rx="8" transform="rotate(90 410.922 196.786)" fill="white" fillOpacity="0.02" />
          <rect x="335.871" y="121.722" width="75.0689" height="75.0662" rx="8" transform="rotate(90 335.871 121.722)" fill="white" fillOpacity="0.02" />

          {/* Wrap-around X shape at right edge (same shape shifted +656.301)
              Its BL diamonds bleed into the tile, filling the gap left by X shape's clipped BL. */}
          <rect x="648.469" y="53.0859" width="75.0731" height="75.0731" rx="8" transform="rotate(45 648.469 53.0859)" fill="white" fillOpacity="0.02" />
          <rect x="754.641" y="53.0859" width="75.0731" height="75.0731" rx="8" transform="rotate(45 754.641 53.0859)" fill="white" fillOpacity="0.02" />
          <rect x="754.641" y="159.25" width="75.0731" height="75.0731" rx="8" transform="rotate(45 754.641 159.25)" fill="white" fillOpacity="0.02" />
          <rect x="648.469" y="159.25" width="75.0731" height="75.0731" rx="8" transform="rotate(45 648.469 159.25)" fill="white" fillOpacity="0.02" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#xplus)" />
    </svg>
  )
}
