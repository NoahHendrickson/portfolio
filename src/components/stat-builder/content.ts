import type { Landing, LandingShot, ShotOverlay } from '../../data/projects'

/**
 * Showcase layouts expect a heading/body + media pair. Project data stores those
 * as adjacent `copy` / `shot` sections (or a single `feature` section), so this
 * adapter is the bridge — PR #7 referenced a nonexistent `landing.features`.
 */
export type Feature = {
  heading: string
  body: string
  shot: LandingShot
  overlay?: ShotOverlay
}

function asBody(body: string | string[]): string {
  return Array.isArray(body) ? body.join('\n\n') : body
}

export function getFeatures(landing: Landing): Feature[] {
  const features: Feature[] = []
  const { sections } = landing

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    switch (section.kind) {
      case 'copy': {
        const next = sections[i + 1]
        if (next?.kind === 'shot') {
          features.push({
            heading: section.heading,
            body: asBody(section.body),
            shot: next.shot,
            overlay: next.overlay,
          })
          i++
        }
        break
      }
      case 'feature':
        features.push({
          heading: section.heading,
          body: asBody(section.body),
          shot: section.shot,
        })
        break
      case 'shot':
      case 'columns':
      case 'row':
        break
      default: {
        const _exhaustive: never = section
        void _exhaustive
      }
    }
  }

  return features
}

/** Hairline-split eyebrow arrays ("Vibe coded · Figma+Cursor+Claude") → one line. */
export function formatEyebrow(eyebrow: Landing['eyebrow']): string {
  if (typeof eyebrow === 'string') return eyebrow
  return eyebrow.map((entry) => (typeof entry === 'string' ? entry : entry.label)).join(' · ')
}
