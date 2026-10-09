import { DEFAULT_INTRO, INTRO_VARIANTS, isIntroVariant, type IntroConfig } from './introTimeline'

/**
 * The first-visit logo intro (`IntroSplash`). Seen once per browser, so it is
 * localStorage rather than the session the home tab lives in. `?intro` on the
 * URL plays it regardless, for checking it without clearing storage, and
 * `?intro=<variant>` plays one of `INTRO_VARIANTS` over the real page. In dev
 * it plays on every load, so a refresh is a replay.
 */
const INTRO_KEY = 'intro-seen'

const introParam = () => new URLSearchParams(window.location.search).get('intro')

export function shouldPlayIntro(): boolean {
  if (import.meta.env.DEV || introParam() !== null) return true
  return localStorage.getItem(INTRO_KEY) === null
}

export function markIntroSeen() {
  localStorage.setItem(INTRO_KEY, '1')
}

/** The variant `?intro=<name>` asks for, or the shipped default. */
export function introConfigFromUrl(): IntroConfig {
  const name = introParam()
  return name && isIntroVariant(name) ? INTRO_VARIANTS[name] : DEFAULT_INTRO
}
