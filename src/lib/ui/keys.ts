/** What a keypress on the page means before any tab of the site looks at it. */

/**
 * Whether the key went to something the visitor is typing in.
 *
 * The three Play tabs and the character roller listen for keys on the window, since the game
 * takes them wherever the pointer is. A key typed into a field on the same page -- the save
 * editor's numbers, a floor to jump to -- must reach the field and nothing else.
 */
export function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
}
