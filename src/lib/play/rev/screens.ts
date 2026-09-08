/**
 * What the tab says where the port has not built what the key does.
 *
 * Nothing is ever silently nothing: a key the original dispatches on that this port does not
 * answer says what the game would have done with it, the way `../screens.ts` and
 * `../mw/screens.ts` do for the other two games.
 */
export function REV_NOT_BUILT(what: string): string[] {
  return ['NOT BUILT YET:', `   ${what}.`];
}
