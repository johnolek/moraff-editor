import { app } from '../app-state.svelte';
import { UNFORGIVEN } from '../editor/games';
import { parseSave, type SaveRecord } from '../game/dotu-files.js';

/**
 * The Dungeons of the Unforgiven character open in the save editor, or null when the editor
 * holds nothing or holds a Moraff's World file. The editor's fields write straight into the
 * bytes this reads, so calling it again picks up whatever has been edited since.
 */
export function loadedCharacter(): SaveRecord | null {
  const save = app.save;
  if (!save || save.game !== UNFORGIVEN.id) return null;
  return parseSave(save.bytes);
}
