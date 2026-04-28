import { useSyncExternalStore } from 'react'

export const MOBILE_BREAKPOINT_PX = 768
export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
