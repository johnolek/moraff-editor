import { describe, expect, it } from 'vitest';
import type { JournalEntry } from '../play/journal';
import { journalGroups } from './grouping';

/** One line of a journal, on the floor and in the module a test says. */
function line(text: string, floor: number, module = 0): JournalEntry {
  return { at: 0, floor, module, text, event: null };
}

describe('a journal in the stretches it was written in', () => {
  it('has nothing to group in an empty journal', () => {
    expect(journalGroups([])).toEqual([]);
  });

  it('keeps the lines of one floor together', () => {
    const groups = journalGroups([line('Stepped north', 3), line('Stepped east', 3)]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ floor: 3, module: 0 });
    expect(groups[0].entries.map((entry) => entry.text)).toEqual(['Stepped north', 'Stepped east']);
  });

  it('starts a stretch where the floor changes', () => {
    const groups = journalGroups([line('Stepped north', 3), line('Reached floor 4', 4)]);

    expect(groups.map((group) => group.floor)).toEqual([3, 4]);
  });

  it('starts a stretch where the module changes on the same floor', () => {
    const groups = journalGroups([line('Stepped north', 2, 0), line('Arrived in Module II', 2, 1)]);

    expect(groups.map((group) => group.module)).toEqual([0, 1]);
  });

  it('makes a stretch of its own of a floor come back to', () => {
    const groups = journalGroups([line('Stepped north', 3), line('Took the ladder', 2), line('Took the ladder', 3)]);

    expect(groups.map((group) => group.floor)).toEqual([3, 2, 3]);
  });
});
