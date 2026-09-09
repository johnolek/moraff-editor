import type { Leaderboard } from '../app-state.svelte';

/**
 * The lock a character carries from the roll: which leaderboard it was rolled for, in the words
 * the roller, the roster and the Play tab all use for it.
 *
 * The lock itself is a field of the roster entry (`RosterEntry.leaderboard`). This is what the
 * pages say about it.
 */

/** The two boards, in the order they are offered. */
export const LEADERBOARDS: Leaderboard[] = ['faithful', 'speedrun'];

export function isLeaderboard(value: unknown): value is Leaderboard {
  return LEADERBOARDS.includes(value as Leaderboard);
}

/** What a board is called where there is room for a word: the roster's column, the Play tab. */
export function leaderboardLabel(board: Leaderboard): string {
  return board === 'faithful' ? 'Faithful' : 'Speedrun';
}

/**
 * What the roller offers before a roll: play the character for its own sake, or roll it for one
 * of the two boards.
 *
 * The choice is made once, because it is the whole point of the lock: a board is a set of runs
 * played the same way, and a character that could change the way it plays is not on one.
 */
export const LEADERBOARD_CHOICES: { id: Leaderboard | null; label: string; how: string }[] = [
  {
    id: null,
    label: 'Free play',
    how: 'Not on a leaderboard. Play the character however you like and change the mode whenever you want.',
  },
  {
    id: 'faithful',
    label: 'Leaderboard — faithful',
    how: 'Locked to faithful for good: only what the game shows. Every run of this character goes on the faithful board.',
  },
  {
    id: 'speedrun',
    label: 'Leaderboard — speedrun',
    how: 'Locked to speedrun for good: the whole floor, so a route can be planned. Every run of this character goes on the speedrun board.',
  },
];

/**
 * What the Play tab says where the mode radios would be for a character rolled for a board.
 *
 * There are no radios for such a character: the mode is the board's, and showing a control that
 * cannot be moved would be showing a choice that is not there.
 */
export function lockedPlayNote(board: Leaderboard): string {
  return `Locked: this character was rolled for the ${board} leaderboard, so every run of it is played this way.`;
}

/**
 * What the Save Editor asks before it writes into a character rolled for a board.
 *
 * The editor's records are not in the run log, so a replay has no way of putting the character
 * back into them: a board's runs stop being comparable the moment one of them is written from
 * outside the game. So the place is given up rather than the edit refused, and the player is told
 * which of the two they are choosing.
 */
export function leaderboardEditWarning(board: Leaderboard): string {
  return `This character was rolled for the ${board} board. Editing it here takes it off that board for good, and its runs will stop counting. Edit it anyway?`;
}
