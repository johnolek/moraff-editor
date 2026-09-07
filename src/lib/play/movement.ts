import type { GameId } from '../app-state.svelte';
import { readStored, writeStored } from '../character/storage';
import { GAME_CHOICES, isGameId } from '../game-choice';
import { KEY } from './keys';

/**
 * Whose arrow keys a game is played with, which is a choice the Play tab offers and the browser
 * remembers for each game.
 *
 * Dungeons of the Unforgiven's arrows turn the character: the up arrow steps the way they face,
 * left and right turn them, and down turns them around. Moraff's World's are compass
 * directions: each arrow faces the character the way it points and steps that way.
 */
export type MovementStyle = GameId;

/** Where the choice is kept, one key per game. */
const PREFIX = 'moraff-tools.play.';
const SUFFIX = '.movement';

/** What each game's arrows do, in a line, for the control on the Play tab. */
const HOW: Record<MovementStyle, string> = {
  unforgiven: 'Up steps the way you face, left and right turn, and down turns around.',
  moraffsWorld: 'Each arrow faces the way it points and steps that way.',
};

/** The two styles the control offers, named after the game whose arrows they are. */
export const MOVEMENT_STYLES: { id: MovementStyle; label: string; how: string }[] = GAME_CHOICES.map((choice) => ({
  id: choice.id,
  label: choice.label,
  how: HOW[choice.id],
}));

/** What each arrow does under each style, for the buttons under the map. The words are each
 *  game's own for its own arrows, from the button bar (exe 4000:667b) and the help menu
 *  (WORLD.EXE 4000:3563); the two games read the same byte for an arrow. */
const ARROW_LABELS: Record<MovementStyle, Record<number, string>> = {
  unforgiven: {
    [KEY.arrowUp]: 'MOVE FORWARD',
    [KEY.arrowLeft]: 'TURN LEFT',
    [KEY.arrowDown]: 'TURN AROUND',
    [KEY.arrowRight]: 'TURN RIGHT',
  },
  moraffsWorld: {
    [KEY.arrowUp]: 'FACE AND MOVE NORTH',
    [KEY.arrowLeft]: 'FACE AND MOVE WEST',
    [KEY.arrowDown]: 'FACE AND MOVE SOUTH',
    [KEY.arrowRight]: 'FACE AND MOVE EAST',
  },
};

/** What a key does under a style, or null for a key that is not one of the four arrows. */
export function arrowLabel(style: MovementStyle, key: number): string | null {
  return ARROW_LABELS[style][key] ?? null;
}

/** Whose arrows this game is played with: the player's choice, or the game's own. */
export function readMovementStyle(game: GameId): MovementStyle {
  const stored = readStored(PREFIX + game + SUFFIX);
  return isGameId(stored) ? stored : game;
}

export function writeMovementStyle(game: GameId, style: MovementStyle): void {
  writeStored(PREFIX + game + SUFFIX, style);
}
