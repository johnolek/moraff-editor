import { describe, expect, it } from 'vitest';
import type { EveryoneRow } from '../../../server/everyone';
import {
  classesOf,
  DEFAULT_SORT,
  filterRows,
  sortRows,
  STAT_SORT_KEYS,
  toggledSort,
  type EveryoneFilters,
  type EveryoneSortKey,
} from './everyone';

/** One character in the table, with only what a test is about written into it. */
function row(over: Partial<EveryoneRow> & { name: string }): EveryoneRow {
  return {
    characterId: over.name,
    player: 'John',
    leaderboard: 'speedrun',
    status: 'alive',
    playing: false,
    level: 1,
    deepest: 0,
    actions: 0,
    clock: 0,
    playMs: 0,
    timed: false,
    at: null,
    now: { cls: 'Fighter', hp: 10, maxHp: 10, stats: [1, 2, 3, 4, 5, 6] },
    ...over,
  };
}

/** Every box ticked, which is what the table opens with. */
function allOf(rows: EveryoneRow[]): EveryoneFilters {
  return {
    statuses: new Set(['alive', 'dead', 'won'] as const),
    boards: new Set(['faithful', 'speedrun']),
    classes: new Set(classesOf(rows)),
  };
}

function names(rows: EveryoneRow[]): string[] {
  return rows.map((each) => each.name);
}

describe('the classes there are to filter by', () => {
  it('are the ones the characters on screen are, in alphabetical order', () => {
    const rows = [
      row({ name: 'Thok', now: { cls: 'Wizard', hp: 1, maxHp: 1, stats: [] } }),
      row({ name: 'Grond', now: { cls: 'Fighter', hp: 1, maxHp: 1, stats: [] } }),
      row({ name: 'Arka', now: { cls: 'Fighter', hp: 1, maxHp: 1, stats: [] } }),
    ];

    expect(classesOf(rows)).toEqual(['Fighter', 'Wizard']);
  });

  it('leave out a character there is no record to read a class from', () => {
    expect(classesOf([row({ name: 'Unknown', now: null })])).toEqual([]);
  });
});

describe('the rows the ticked boxes leave showing', () => {
  const rows = [
    row({ name: 'Alive', status: 'alive' }),
    row({ name: 'Dead', status: 'dead' }),
    row({ name: 'Won', status: 'won' }),
  ];

  it('is everybody while every box is ticked', () => {
    expect(names(filterRows(rows, allOf(rows)))).toEqual(['Alive', 'Dead', 'Won']);
  });

  it('leaves out a status nobody asked for', () => {
    expect(names(filterRows(rows, { ...allOf(rows), statuses: new Set(['won'] as const) }))).toEqual(['Won']);
  });

  it('leaves out the other board', () => {
    const boards = [row({ name: 'Quick', leaderboard: 'speedrun' }), row({ name: 'True', leaderboard: 'faithful' })];

    expect(names(filterRows(boards, { ...allOf(boards), boards: new Set(['faithful']) }))).toEqual(['True']);
  });

  it('leaves out a class nobody asked for', () => {
    const classes = [
      row({ name: 'Grond', now: { cls: 'Fighter', hp: 1, maxHp: 1, stats: [] } }),
      row({ name: 'Sagey', now: { cls: 'Sage', hp: 1, maxHp: 1, stats: [] } }),
    ];

    expect(names(filterRows(classes, { ...allOf(classes), classes: new Set(['Sage']) }))).toEqual(['Sagey']);
  });

  it('keeps a character the boxes cannot speak about', () => {
    const odd = [row({ name: 'Unknown', now: null, leaderboard: null })];

    expect(names(filterRows(odd, { ...allOf(odd), boards: new Set(), classes: new Set() }))).toEqual(['Unknown']);
  });
});

describe('putting the table in order', () => {
  it('opens on the highest level', () => {
    const rows = [row({ name: 'Low', level: 2 }), row({ name: 'High', level: 20 })];

    expect(names(sortRows(rows, DEFAULT_SORT))).toEqual(['High', 'Low']);
  });

  it('keeps the order the server sent for two that stand alike', () => {
    const rows = [row({ name: 'First', level: 5 }), row({ name: 'Second', level: 5 })];

    expect(names(sortRows(rows, DEFAULT_SORT))).toEqual(['First', 'Second']);
    expect(names(sortRows(rows, { by: 'level', descending: false }))).toEqual(['First', 'Second']);
  });

  it('compares words without regard to capitals', () => {
    const rows = [row({ name: 'zog' }), row({ name: 'Arka' })];

    expect(names(sortRows(rows, { by: 'name', descending: false }))).toEqual(['Arka', 'zog']);
  });

  it('sorts on one of the six characteristics by where it sits in the record', () => {
    const rows = [
      row({ name: 'Weak', now: { cls: 'Sage', hp: 1, maxHp: 1, stats: [10, 90, 0, 0, 0, 0] } }),
      row({ name: 'Strong', now: { cls: 'Sage', hp: 1, maxHp: 1, stats: [90, 10, 0, 0, 0, 0] } }),
    ];

    expect(names(sortRows(rows, { by: STAT_SORT_KEYS[0], descending: true }))).toEqual(['Strong', 'Weak']);
    expect(names(sortRows(rows, { by: STAT_SORT_KEYS[1], descending: true }))).toEqual(['Weak', 'Strong']);
  });

  it('sorts on the moment rather than the words it is written in', () => {
    const rows = [
      row({ name: 'Older', at: '2026-09-01T00:00:00.000Z' }),
      row({ name: 'Newer', at: '2026-09-08T00:00:00.000Z' }),
    ];

    expect(names(sortRows(rows, { by: 'at', descending: true }))).toEqual(['Newer', 'Older']);
  });

  it('puts a character there is nothing to compare last, whichever way the column is turned', () => {
    const rows = [
      row({ name: 'Known', now: { cls: 'Sage', hp: 40, maxHp: 50, stats: [1, 2, 3, 4, 5, 6] } }),
      row({ name: 'Unknown', now: null }),
      row({ name: 'Other', now: { cls: 'Mage', hp: 10, maxHp: 50, stats: [1, 2, 3, 4, 5, 6] } }),
    ];

    expect(names(sortRows(rows, { by: 'hp', descending: true }))).toEqual(['Known', 'Other', 'Unknown']);
    expect(names(sortRows(rows, { by: 'hp', descending: false }))).toEqual(['Other', 'Known', 'Unknown']);
  });

  it('puts a run the server never timed last on the play time', () => {
    const rows = [
      row({ name: 'Untimed', playMs: 900000, timed: false }),
      row({ name: 'Timed', playMs: 60000, timed: true }),
    ];

    expect(names(sortRows(rows, { by: 'playMs', descending: true }))).toEqual(['Timed', 'Untimed']);
    expect(names(sortRows(rows, { by: 'playMs', descending: false }))).toEqual(['Timed', 'Untimed']);
  });

  it('leaves the rows it was given alone', () => {
    const rows = [row({ name: 'Low', level: 2 }), row({ name: 'High', level: 20 })];

    sortRows(rows, DEFAULT_SORT);

    expect(names(rows)).toEqual(['Low', 'High']);
  });
});

describe('clicking a column heading', () => {
  it('turns the column already sorted on round', () => {
    expect(toggledSort({ by: 'level', descending: true }, 'level')).toEqual({ by: 'level', descending: false });
    expect(toggledSort({ by: 'level', descending: false }, 'level')).toEqual({ by: 'level', descending: true });
  });

  it('sorts a column of numbers largest first', () => {
    const keys: EveryoneSortKey[] = ['deepest', 'actions', 'clock', 'playMs', 'hp', 'at'];

    for (const key of keys) expect(toggledSort(DEFAULT_SORT, key)).toEqual({ by: key, descending: true });
  });

  it('sorts a column of words alphabetically', () => {
    const keys: EveryoneSortKey[] = ['player', 'name', 'leaderboard', 'status', 'cls'];

    for (const key of keys) expect(toggledSort(DEFAULT_SORT, key)).toEqual({ by: key, descending: false });
  });
});
