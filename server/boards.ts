import type { Milestone } from '../src/lib/play/run';

/**
 * The boards: which runs go on one, and what order they stand in.
 *
 * Everything about ranking is here so that the server and the site say the same thing about a
 * board. The site's pages over these are MORF-146; nothing here draws anything.
 *
 * A board is one game and one of faithful and speedrun, never the two mixed: they are different
 * games to play, so runs of one tell you nothing about runs of the other. A run's board is the
 * `leaderboard` of the character it was played with — the board it was rolled for and locked to
 * for life — and a character rolled for no board is on none of them. Only a run that was verified
 * and had no record written into it from outside the game is on a board at all, which is what
 * `eligible` on the verdict already says.
 */

/**
 * How far a run got, which is not the same number in all three games.
 *
 * Moraff's Revenge has one dungeon and seventy floors of it, so how deep the character got is
 * what a run of it is measured by; every milestone is stamped with the floor the character was
 * standing on, so the deepest of those is the answer. The other two are measured by the module or
 * the dungeon reached, which is a milestone of its own. A run that never left the place it
 * started in has no such milestone, and that place is index 0 in both: Module I in Dungeons of
 * the Unforgiven, and the town in Moraff's World.
 */
export function deepestReach(game: string, milestones: readonly Milestone[]): number {
  if (game === 'revenge') return highest(milestones.map((milestone) => milestone.floor));
  return highest(milestones.filter((milestone) => milestone.kind === 'dungeon').map((milestone) => milestone.which));
}

/**
 * The highest level a run reached.
 *
 * A level is a milestone, so this is the highest one of those. A character that never gained a
 * level has none, and stands at 0: what it was rolled at is not in the run.
 */
export function highestLevel(milestones: readonly Milestone[]): number {
  return highest(milestones.filter((milestone) => milestone.kind === 'level').map((milestone) => milestone.which));
}

function highest(numbers: number[]): number {
  return numbers.reduce((most, number) => Math.max(most, number), 0);
}
