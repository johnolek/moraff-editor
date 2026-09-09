import { readStored, writeStored } from '../character/storage';
import { GAME_CHOICES } from '../game-choice';

/**
 * Whose arrow keys a game is played with, which is a choice the Play tab offers and the browser
 * remembers for each game.
 *
 * Dungeons of the Unforgiven's arrows turn the character: the up arrow steps the way they face,
 * left and right turn them, and down turns them around. Moraff's World's are compass
 * directions: each arrow faces the character the way it points and steps that way.
 */
export type MovementStyle = 'unforgiven' | 'moraffsWorld';

/** Where the choice is kept, one key per game. */
const PREFIX = 'moraff-tools.play.';
const SUFFIX = '.movement';

/** What each game's arrows do, in a line, for the control on the Play tab. */
const HOW: Record<MovementStyle, string> = {
  unforgiven: 'Up steps the way you face, left and right turn, and down turns around.',
  moraffsWorld: 'Each arrow faces the way it points and steps that way.',
};

/** The two styles the control offers, named after the game whose arrows they are. Only a game
 *  the site can play has arrows to offer. */
export const MOVEMENT_STYLES: { id: MovementStyle; label: string; how: string }[] = GAME_CHOICES.filter(
  (choice): choice is { id: MovementStyle; label: string } => choice.id in HOW,
).map((choice) => ({ id: choice.id, label: choice.label, how: HOW[choice.id] }));

function isMovementStyle(value: unknown): value is MovementStyle {
  return MOVEMENT_STYLES.some((style) => style.id === value);
}

/**
 * Whose arrows this game is played with: the player's choice, or the game's own.
 *
 * Moraff's Revenge is not one of the two: it has both styles of its own and switches between them
 * with Escape, so its Play tab reads the game's own variable rather than this.
 */
export function readMovementStyle(game: MovementStyle): MovementStyle {
  const stored = readStored(PREFIX + game + SUFFIX);
  return isMovementStyle(stored) ? stored : game;
}

export function writeMovementStyle(game: MovementStyle, style: MovementStyle): void {
  writeStored(PREFIX + game + SUFFIX, style);
}
