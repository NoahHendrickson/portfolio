// import {
//   Shader,
//   Ascii,
//   Aurora,
//   Blob,
//   ChromaticAberration,
//   Dither,
//   FlowingGradient,
//   Pixelate,
// } from 'shaders/react'

// /** CSS opacity on the whole WebGL canvas (all passes). */
// const OVERLAY_OPACITY = 0.55

// export default function ShaderEffect() {
//   return (
//     <Shader
//       style={{
//         position: 'absolute',
//         inset: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//         opacity: OVERLAY_OPACITY,
//       }}
//     >
//       <Aurora
//         balance={23}
//         center={{
//           x: 1,
//           y: 0,
//         }}
//         colorA="#0ddb90"
//         colorB="#1a9677"
//         colorC="#2c64db"
//         intensity={100}
//         rayDensity={19}
//         speed={-6.3}
//         visible={false}
//         waviness={159}
//       />
//       <FlowingGradient
//         colorB="#17e68cf7"
//         colorC="#4d82ff"
//         colorD="#15d46a"
//         colorSpace="linear"
//         visible={false}
//       />
//       <Blob
//         center={{
//           x: 0.8,
//           y: 0.26,
//         }}
//         colorA="#485bcf"
//         colorB="#1ee979"
//       />
//       <Blob
//         center={{
//           x: 0.02,
//           y: 1,
//         }}
//         colorA="#76f00e"
//         colorB="#f77b00"
//       />
//       <Dither colorB="#fffffff7" colorMode="source" />
//       <Ascii visible={false} />
//       <Pixelate visible={false} />
//       <ChromaticAberration visible={false} />
//     </Shader>
//   )
// }

import {
  Shader,
  Dither,
  FlowingGradient,
  Plasma,
} from 'shaders/react'

const OVERLAY_OPACITY = 1.0

export default function ShaderEffect() {
  return (
    <Shader
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity: OVERLAY_OPACITY,
    }}>
      <Plasma
        colorA="#11d47f" />
      <FlowingGradient
        colorA="#f8ff96"
        colorB="#29e684"
        colorC="#2cb058"
        colorD="#234a2a"
        speed={1} />
      <Dither
        colorMode="source"
        pixelSize={4} />
    </Shader>
  )
}
