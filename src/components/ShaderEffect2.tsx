// import { Shader, Dither, FlowingGradient } from 'shaders/react'

// export default function ShaderEffect2() {
//   return (
//     <Shader
//       style={{
//         position: 'absolute',
//         inset: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//       }}
//     >
//       <FlowingGradient
//         colorA="#89f000"
//         colorB="#29e684"
//         colorC="#2cb058"
//         colorD="#193d19"
//         speed={1.5}
//         visible={true} />
//       <Dither
//         colorMode="source"
//         threshold={0.6} />
//     </Shader>
//   )
// }

import { Shader, Aurora, Dither } from 'shaders/react'

export default function ShaderEffect2() {
  return (
    <Shader
      colorSpace="srgb"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Aurora
        balance={46}
        colorA="#a6ed51"
        colorB="#07fa92"
        colorC="#3de034"
        height={169}
        intensity={100}
        rayDensity={36}
        seed={76}
        speed={4.9}
        transform={{
          anchorX: 0.91,
          anchorY: 0.48,
        }}
        waviness={0}
      />
      <Dither
        colorA="#07b04b"
        colorB="#0eed8c"
        colorMode="source"
        pixelSize={5}
      />
    </Shader>
  )
}
