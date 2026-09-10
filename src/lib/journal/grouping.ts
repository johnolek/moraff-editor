import type { JournalEntry } from '../play/journal';
import { walkWords } from './words';

/**
 * A run's journal cut into the stretches that happened in one place.
 *
 * A run is hundreds or thousands of lines long, and what a reader wants of it is where the
 * character was rather than the lines one after another. So the timeline is grouped: a stretch
 * runs until the floor or the module changes, and going back to a floor later in the run is a
 * stretch of its own rather than more of the one before.
 */

/** Everything the run did in one visit to one floor of one module or dungeon. */
export interface JournalGroup {
  floor: number;
  /** The module of Dungeons of the Unforgiven, or the dungeon of the other two games. */
  module: number;
  entries: JournalEntry[];
}

/** The journal in stretches, oldest first, each of them one visit to one floor. */
export function journalGroups(entries: readonly JournalEntry[]): JournalGroup[] {
  const groups: JournalGroup[] = [];
  for (const entry of entries) {
    const open = groups[groups.length - 1];
    if (open !== undefined && open.floor === entry.floor && open.module === entry.module) {
      open.entries.push(entry);
    } else {
      groups.push({ floor: entry.floor, module: entry.module, entries: [entry] });
    }
  }
  return groups.map((group) => ({ ...group, entries: foldWalks(group.entries) }));
}

/**
 * The same lines with each run of consecutive steps in place of it: "Walked 12 steps".
 *
 * Walking is most of what a run does, so a timeline that gives every step a line of its own is
 * thousands of lines of "Stepped north". Anything else at all — a swing, a find, a turn, a wait —
 * ends the walk, so the line says how far the character got before something happened. A walk
 * never runs from one stretch into the next, since this is applied to each stretch on its own.
 *
 * It is done here, where the journal is drawn, rather than in the recorder that writes it. That
 * way the journals already written in the browser and on the server read the same way as the ones
 * written from now on, and a replay still writes exactly the lines the run it replays wrote.
 */
export function foldWalks(entries: readonly JournalEntry[]): JournalEntry[] {
  const folded: JournalEntry[] = [];
  let walk: JournalEntry[] = [];
  for (const entry of entries) {
    if (entry.event?.kind === 'stepped') {
      walk.push(entry);
      continue;
    }
    if (walk.length > 0) {
      folded.push(walkEntry(walk));
      walk = [];
    }
    folded.push(entry);
  }
  if (walk.length > 0) folded.push(walkEntry(walk));
  return folded;
}

/** The one line a stretch of steps becomes, where the run had got to at the first of them. */
function walkEntry(walk: JournalEntry[]): JournalEntry {
  const first = walk[0];
  return {
    at: first.at,
    floor: first.floor,
    module: first.module,
    text: walkWords(walk.length),
    event: null,
  };
}
