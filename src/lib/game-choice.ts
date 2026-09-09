import type { GameId } from './app-state.svelte';
import { readStored, writeStored } from './character/storage';

/** Which game the last visit was looking at. */
const GAME_KEY = 'moraff-tools.game';
/** Prefixes the key holding the character last worked on under one game. */
const LAST_CHARACTER_PREFIX = 'moraff-tools.last-character.';
/** Which character the last visit had in hand, whichever game it belongs to. */
const CURRENT_CHARACTER_KEY = 'moraff-tools.current-character';

/** The games the site knows, as the switch in the header names them. */
export const GAME_CHOICES: { id: GameId; label: string }[] = [
  { id: 'unforgiven', label: 'Dungeons of the Unforgiven' },
  { id: 'moraffsWorld', label: "Moraff's World" },
  { id: 'revenge', label: "Moraff's Revenge" },
];

export function isGameId(value: unknown): value is GameId {
  return GAME_CHOICES.some((choice) => choice.id === value);
}

export function loadChosenGame(): GameId | null {
  const stored = readStored(GAME_KEY);
  return isGameId(stored) ? stored : null;
}

export function saveChosenGame(game: GameId): void {
  writeStored(GAME_KEY, game);
}

export function loadLastCharacter(game: GameId): string | null {
  return readStored(LAST_CHARACTER_PREFIX + game) || null;
}

export function saveLastCharacter(game: GameId, id: string): void {
  writeStored(LAST_CHARACTER_PREFIX + game, id);
}

/**
 * The character being worked on lives here rather than in the database with the roster, because
 * which one is in hand is a choice about this browser, the same as which game is showing and
 * which character each game was last on.
 */
export function loadCurrentCharacter(): string | null {
  return readStored(CURRENT_CHARACTER_KEY) || null;
}

export function saveCurrentCharacter(id: string | null): void {
  writeStored(CURRENT_CHARACTER_KEY, id ?? '');
}
