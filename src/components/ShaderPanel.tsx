import LeafPattern from './LeafPattern'

type ShaderPanelProps = {
  /** Passed straight through — see `LeafPattern`'s `shift`. */
  shift?: string
}

/** The right-hand panel — leaf pattern (replacing the shader for preview). */
export default function ShaderPanel({ shift }: ShaderPanelProps) {
  return <LeafPattern shift={shift} />
}
