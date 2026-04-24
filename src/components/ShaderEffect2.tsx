import { Shader, Dither, FlowingGradient } from 'shaders/react'

export default function ShaderEffect2() {
  return (
    <Shader
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <FlowingGradient
        colorA="#89f000"
        colorB="#29e684"
        colorC="#2cb058"
        colorD="#193d19"
        speed={1.5}
        visible={true} />
      <Dither
        colorMode="source"
        threshold={0.6} />
    </Shader>
  )
}
