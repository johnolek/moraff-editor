import { describe, expect, it } from 'vitest';
import type { JournalEntry } from '../play/journal';
import { foldWalks, journalGroups } from './grouping';

/** One line of a journal, on the floor and in the module a test says. */
function line(text: string, floor: number, module = 0): JournalEntry {
  return { at: 0, floor, module, text, event: null };
}

/** One step of a walk, at the action count and on the floor a test says. */
function step(at: number, floor = 1): JournalEntry {
  return { at, floor, module: 0, text: 'Stepped north', event: { kind: 'stepped', dir: 0 } };
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

describe('a walk as one line of the timeline', () => {
  it('makes one line of a run of steps, where the first of them was', () => {
    const folded = foldWalks([step(10), step(11), step(12)]);

    expect(folded).toHaveLength(1);
    expect(folded[0]).toMatchObject({ at: 10, text: 'Walked 3 steps', event: null });
  });

  it('counts a walk of one step in words', () => {
    expect(foldWalks([step(4)])[0].text).toEqual('Walked a step');
  });

  it('ends a walk at anything that is not a step', () => {
    const folded = foldWalks([step(1), line('Swung and missed', 1), step(3)]);

    expect(folded.map((entry) => entry.text)).toEqual(['Walked a step', 'Swung and missed', 'Walked a step']);
  });

  it('leaves a walk on each floor in the stretch it happened in', () => {
    const groups = journalGroups([step(1, 3), step(2, 3), step(3, 4)]);

    expect(groups.map((group) => group.entries.map((entry) => entry.text))).toEqual([
      ['Walked 2 steps'],
      ['Walked a step'],
    ]);
  });

  it('folds only what the game recorded as a step, whatever a line says', () => {
    const folded = foldWalks([line('Stepped north', 1), line('Stepped north', 1)]);

    expect(folded.map((entry) => entry.text)).toEqual(['Stepped north', 'Stepped north']);
  });
});
