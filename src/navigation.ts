/** Fired after `navigate()` so listeners can sync without a full reload. */
export const ROUTE_CHANGE_EVENT = 'routechange'

export function getRoute() {
  return window.location.pathname || '/'
}

/**
 * Subscribe to route changes. Paired with `getRoute` in `useSyncExternalStore`,
 * which re-reads the route after subscribing — a page that redirects from its
 * own mount effect fires before a listener added in a parent's effect exists,
 * and that update would otherwise be dropped.
 */
export function subscribeToRoute(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(ROUTE_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(ROUTE_CHANGE_EVENT, onChange)
  }
}

export function navigate(path: string, { replace = false } = {}) {
  if (path === getRoute()) return
  // `replace` is for a page that redirects away from itself — leaving its entry
  // in history would just bounce the visitor forward again on Back.
  if (replace) window.history.replaceState(null, '', path)
  else window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
}

/** Rewrite legacy `#/work` bookmarks to `/work` paths. */
export function redirectHashRoute() {
  const hash = window.location.hash
  if (!hash.startsWith('#/')) return
  const path = hash.slice(1) || '/'
  window.history.replaceState(null, '', path)
}
