import { Shader, Dither, FlowingGradient } from 'shaders/react'

export default function ShaderEffect() {
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
      <FlowingGradient
        colorA="#afde7c"
        colorB="#29e684"
        colorC="#2cb058"
        colorD="#234a2a"
      />
      <Dither colorMode="source" />
    </Shader>
  )
}
