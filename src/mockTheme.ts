import { useSyncExternalStore } from 'react'

/*
  Which theme the no3y Code page's mockups show (Nov 14 2026): the fork's Glass theme, the
  page as it was, or Inlet Black. A visitor flips it with the switch under the intro; it
  holds for the session, like the home tab, so Back from another page keeps it. Glass is the
  default.
*/

export type MockTheme = 'glass' | 'inlet'

const KEY = 'no3y-mock-theme'
const listeners = new Set<() => void>()

function read(): MockTheme {
  try {
    return sessionStorage.getItem(KEY) === 'inlet' ? 'inlet' : 'glass'
  } catch {
    return 'glass'
  }
}

let current: MockTheme = read()

export function setMockTheme(theme: MockTheme) {
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
  return useSyncExternalStore(subscribe, () => current, () => 'glass')
}
