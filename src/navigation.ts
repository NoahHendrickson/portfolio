/** Fired after `navigate()` so listeners can sync without a full reload. */
export const ROUTE_CHANGE_EVENT = 'routechange'

export function getRoute() {
  return window.location.pathname || '/'
}

export function navigate(path: string) {
  if (path === getRoute()) return
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}

/** Rewrite legacy `#/work` bookmarks to `/work` paths. */
export function redirectHashRoute() {
  const hash = window.location.hash
  if (!hash.startsWith('#/')) return
  const path = hash.slice(1) || '/'
  window.history.replaceState(null, '', path)
}
