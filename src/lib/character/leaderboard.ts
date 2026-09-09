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
