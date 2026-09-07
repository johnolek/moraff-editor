import { readString } from '../editor/fields';

/** How many bytes the name field takes. Moraff's World allows 32, Dungeons of the Unforgiven 18,
 *  and both stop at the first zero, so reading the longer of the two suits either game. */
const NAME_LENGTH = 32;

/** The name in a character record. It is the first field of the file in both games. */
export function recordName(bytes: Uint8Array): string {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return readString(view, 0, Math.min(NAME_LENGTH, bytes.length)).trim();
}

/**
 * The character number a save file's name says it is, or null when the name is not a number.
 * Both games name a character's file after its number and nothing else — 20 to 29 in Dungeons
 * of the Unforgiven, 1 upwards in Moraff's World.
 */
export function slotFromFileName(fileName: string): number | null {
  return /^\d+$/.test(fileName) ? Number(fileName) : null;
}

/** What a character's file is called: its number, or the name it was loaded under. */
export function characterFileName(slot: number | null, fallback: string): string {
  return slot === null ? fallback : String(slot);
}
