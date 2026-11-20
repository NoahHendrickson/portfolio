import { useSyncExternalStore } from 'react'

/*
  Which layout prototype `/work/no3y-code` runs, switched by `PrototypeToggle` over the
  theme switch on the dev server only:
  - `current` (A): the original 14-block layout.
  - `story` (B): the condensed narrative arc (What I wanted -> Petals -> Themes & design
    system -> Customize your sidebar -> Working in parallel -> Inside the composer ->
    Design mode).
  Kept in localStorage so a reload preserves the pick. Production builds stay on `current`
  until `story` is promoted; dev opens on `story` so the new prototype is ready to review.
*/
export type No3yPrototype = 'current' | 'story'

const KEY = 'no3y-code-prototype'

function read(): No3yPrototype {
  if (!import.meta.env.DEV) return 'current'
  try {
    return localStorage.getItem(KEY) === 'current' ? 'current' : 'story'
  } catch {
    return 'story'
  }
}

let current = read()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setNo3yPrototype(next: No3yPrototype) {
  current = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // Blocked storage: the pick just won't outlive the page.
  }
  listeners.forEach((listener) => listener())
}

export function useNo3yPrototype() {
  return useSyncExternalStore(subscribe, () => current)
}
