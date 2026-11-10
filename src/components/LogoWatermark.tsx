import { LABEL } from '../introTimeline'
import { pixelPath } from '../pixelFaces'

const PATH = pixelPath(LABEL)

/** The intro's "no3y" label as decoration: very large and faint, sized by whoever places it. */
export default function LogoWatermark({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${LABEL[0].length} ${LABEL.length}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', pointerEvents: 'none', ...style }}
    >
      <path d={PATH} fill="currentColor" />
    </svg>
  )
}
