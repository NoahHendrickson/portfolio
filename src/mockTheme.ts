import { useSyncExternalStore } from 'react'

/*
  Which theme the no3y Code page's mockups show (Nov 14 2026): the fork's Glass theme, the
  page as it was, or Inlet Black, and since Nov 16 2026 Basic (Neutral Dark), the fork's
  default. A visitor flips it with the switch under the intro, which follows them down the page
  once it scrolls away (`MockThemeSwitch`); it holds for the session, like the home tab, so Back
  from another page keeps it. Glass is the default. A mockup with no version in the chosen theme
  yet shows its Glass one. The hero isn't switched: it shows all three on dividers of its own.

  A page-wide Compare mode (two dividers down the window cutting every mockup) was built and
  taken out the same day, Nov 16 2026: the user wanted the dividers on the hero only. Its code is
  kept in ~/.t3-fork/scratch/no3y-capture/portfolio-compare-mode-nov16/.
*/

export type MockTheme = 'basic' | 'glass' | 'inlet'

/** The themes in the switch's order. */
export const MOCK_THEMES: MockTheme[] = ['basic', 'glass', 'inlet']

const KEY = 'no3y-mock-theme'
const listeners = new Set<() => void>()

function read(): MockTheme {
  try {
    const stored = sessionStorage.getItem(KEY)
    return stored === 'basic' || stored === 'inlet' ? stored : 'glass'
  } catch {
    return 'glass'
  }
}

let current: MockTheme = read()

export function setMockTheme(theme: MockTheme) {
  if (theme === current) return
  current = theme
  try {
    sessionStorage.setItem(KEY, theme)
  } catch {
    // Private windows can refuse storage; the switch still works for this visit.
  }
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useMockTheme(): MockTheme {
  return useSyncExternalStore(subscribe, () => current, () => 'glass' as MockTheme)
}
