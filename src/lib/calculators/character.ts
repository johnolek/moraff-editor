import { currentEntry } from '../app-state.svelte';
import { UNFORGIVEN } from '../editor/games';
import { parseSave, type SaveRecord } from '../game/dotu-files.js';

/**
 * The current character, or null when there is none or the current one is a Moraff's World
 * character. The editor's fields write straight into the bytes this reads, so calling it again
 * picks up whatever has been edited since.
 */
export function currentCharacter(): SaveRecord | null {
  const character = currentEntry();
  if (!character || character.game !== UNFORGIVEN.id) return null;
  return parseSave(character.bytes);
}

/**
 * Which of a calculator's values are no longer the character's own, so the calculator can mark
 * them as changed. Everything is null when there is no character to compare against.
 */
export function changedFields<T extends object>(current: T, seed: T | null): Partial<Record<keyof T, boolean>> {
  const changed: Partial<Record<keyof T, boolean>> = {};
  if (!seed) return changed;
  for (const key of Object.keys(seed) as (keyof T)[]) changed[key] = !same(current[key], seed[key]);
  return changed;
}

/** Two values a calculator holds. Lists of what a character owns count as one value. */
function same(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((value, index) => value === b[index]);
  return a === b;
}
