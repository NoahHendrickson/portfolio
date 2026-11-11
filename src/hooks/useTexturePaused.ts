import { useSyncExternalStore } from 'react'

/*
  Whether the home page's texture is paused, shared between the "I'm
  overstimulated" button under Hi's copy and the texture beside it, which sit
  in different parts of the tree. Kept for the tab's session (a per-visitor
  convenience: storage failing just means it starts playing), so a visitor
  who paused it isn't greeted by it again on Back from a project page.
*/
const KEY = 'texture-paused'

function read() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

let paused = read()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setTexturePaused(next: boolean) {
  paused = next
  try {
    sessionStorage.setItem(KEY, next ? '1' : '0')
  } catch {
    // Private window or blocked storage: it just won't outlive the page.
  }
  listeners.forEach((listener) => listener())
}

export function useTexturePaused() {
  return useSyncExternalStore(subscribe, () => paused)
}
