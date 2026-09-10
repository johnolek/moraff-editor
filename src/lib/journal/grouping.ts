import type { JournalEntry } from '../play/journal';

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
  return groups;
}
