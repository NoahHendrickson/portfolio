/**
 * The home page's six hover-tabs (Figma section `321:38613`). The whole page
 * lives on `/`, so the active tab is session state rather than a path — it
 * survives refresh and Back from a project page, but a shared link always
 * opens on Me (or Work, via the legacy `/work` redirect in `App`).
 */
export type HomeTab = 'me' | 'work' | 'design' | 'been' | 'contact' | 'lols'

export const HOME_TAB_IDS: HomeTab[] = ['me', 'work', 'been', 'design', 'contact', 'lols']

const HOME_TAB_KEY = 'home-tab'

export function readHomeTab(): HomeTab {
  const tab = sessionStorage.getItem(HOME_TAB_KEY)
  return HOME_TAB_IDS.includes(tab as HomeTab) ? (tab as HomeTab) : 'me'
}

export function writeHomeTab(tab: HomeTab) {
  sessionStorage.setItem(HOME_TAB_KEY, tab)
}
