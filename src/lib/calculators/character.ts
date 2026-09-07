import { app } from '../app-state.svelte';
import { UNFORGIVEN } from '../editor/games';
import { parseSave, type SaveRecord } from '../game/dotu-files.js';

/**
 * The current character, or null when there is none or the current one is a Moraff's World
 * character. The editor's fields write straight into the bytes this reads, so calling it again
 * picks up whatever has been edited since.
 */
export function currentCharacter(): SaveRecord | null {
  const character = app.character;
  if (!character || character.game !== UNFORGIVEN.id) return null;
  return parseSave(character.bytes);
}
