import { useSyncExternalStore } from 'react'

/*
  Which prototype Hi's first screen runs (Nov 11 2026), switched by
  `PrototypeToggle` over the theme switch on the dev server only:
  - `wordmark` (A): the Edge on the right with the "no3y" wordmark drawn into
    the texture at the screen's foot. The look the user liked and may go back to.
  - `follow` (B): no Edge or word — a blob of the texture follows the pointer,
    shedding droplets, and the pause scatters it away from the pointer.
  Kept in localStorage so a reload keeps the pick. B ships (Nov 11 2026): a
  production build always runs it, and the dev server opens on it unless A
  was picked.
*/
export type HomePrototype = 'wordmark' | 'follow'

const KEY = 'home-prototype'

function read(): HomePrototype {
  if (!import.meta.env.DEV) return 'follow'
  try {
    return localStorage.getItem(KEY) === 'wordmark' ? 'wordmark' : 'follow'
  } catch {
    return 'follow'
  }
}

let current = read()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setHomePrototype(next: HomePrototype) {
  current = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // Blocked storage: the pick just won't outlive the page.
  }
  listeners.forEach((listener) => listener())
}

export function useHomePrototype() {
  return useSyncExternalStore(subscribe, () => current)
}
