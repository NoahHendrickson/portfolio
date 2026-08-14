/**
 * The soft gate over the Invisible career work. The password form lives on the
 * case study pages themselves (`WorkGate`), so a locked visitor never leaves
 * the URL they opened — Back from there is the Design tab they came from.
 *
 * Client-side only — everything under `public/work/` is still served publicly,
 * so this keeps the work out of casual sight rather than actually protecting it.
 */

const UNLOCK_KEY = 'work-pages-unlocked'

export function isUnlocked() {
  return sessionStorage.getItem(UNLOCK_KEY) === 'true'
}

export function unlock() {
  sessionStorage.setItem(UNLOCK_KEY, 'true')
}
