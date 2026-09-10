import { describe, expect, it } from 'vitest';
import type { JournalEvent } from '../game/journal-events';
import { UNFORGIVEN_MAP } from '../map/game';
import type { JournalEntry } from './journal';
import { RUN_GAMES } from './run';
import { summarizeJournal, summaryLines } from './summary';

/**
 * What a run comes to, folded from its journal. The entries here are written by hand rather than
 * played, so that what each total is made of is in the test that reads it.
 */

/** Dungeons of the Unforgiven's own words for its clock and its modules. */
const NAMES = {
  clockWords: RUN_GAMES.unforgiven.clockWords,
  dungeonName: UNFORGIVEN_MAP.dungeonName,
};

/** An entry for one event, on the floor and in the module a test says. */
function wrote(event: JournalEvent, floor = 1, module = 0): JournalEntry {
  return { at: 0, floor, module, text: '', event };
}

/** A monster as the events name one. */
const GHOUL = { type: 4, level: 46, name: 'GHOUL' };
const ORC = { type: 5, level: 12, name: 'ORC' };

/** EXPLOSION, the first spell of the wizard list's level 7 line. The game has no Fireball. */
const EXPLOSION = { type: 2, level: 6, slot: 0 };

describe('what a run came to', () => {
  it('counts the steps and takes the actions and the clock from the run itself', () => {
    const summary = summarizeJournal(
      [wrote({ kind: 'stepped', dir: 0 }), wrote({ kind: 'stepped', dir: 1 })],
      { actions: 812, time: 4000 },
    );
    expect(summary).toMatchObject({ steps: 2, actions: 812, time: 4000 });
    expect(summaryLines(summary, NAMES)).toContain('Took 2 steps');
    expect(summaryLines(summary, NAMES)).toContain('Spent 812 actions and 4000 seconds');
  });

  it('adds the experience the kills were worth and takes off what a drainer drained', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'killed', monster: GHOUL, experience: 40000 }),
        wrote({ kind: 'experienceDrained', experience: 30, monster: GHOUL }),
      ],
      { actions: 1, time: 1 },
    );
    expect(summary).toMatchObject({ experience: 40000, experienceLost: 30 });
    expect(summaryLines(summary, NAMES)).toContain('Gained 40000 experience');
    expect(summaryLines(summary, NAMES)).toContain('Lost 30 experience to drainers');
  });

  it('counts the levels gained and the levels lost', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'levelGained', level: 6, from: 1 }),
        wrote({ kind: 'levelLost', levels: 2, level: 4, monster: GHOUL }),
      ],
      { actions: 1, time: 1 },
    );
    expect(summary).toMatchObject({ levelsGained: 5, levelsLost: 2 });
    expect(summaryLines(summary, NAMES)).toContain('Gained 5 levels, lost 2');
  });

  it('takes the deepest floor and the furthest module from where the entries were written', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'stepped', dir: 0 }, 12, 0),
        wrote({ kind: 'stepped', dir: 0 }, 47, 2),
        wrote({ kind: 'stepped', dir: 0 }, 3, 2),
      ],
      { actions: 3, time: 3 },
    );
    expect(summary).toMatchObject({ deepestFloor: 47, furthestDungeon: 2 });
    expect(summaryLines(summary, NAMES)).toContain('Reached floor 47 of Module III');
  });

  it('adds the money found and the money spent, a building at a time', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'found', find: { what: 'money', amount: 341880 } }),
        wrote({ kind: 'coinsSpent', amount: 300, on: 'MACE', where: 'STORE' }),
        wrote({ kind: 'coinsSpent', amount: 900, on: 'CHAIN', where: 'STORE' }),
        wrote({ kind: 'coinsSpent', amount: 11, on: 'A ROOM', where: 'HOLE' }),
      ],
      { actions: 3, time: 3 },
    );
    expect(summary.moneyFound).toBe(341880);
    expect(summary.spent).toEqual([
      { where: 'STORE', amount: 1200 },
      { where: 'HOLE', amount: 11 },
    ]);
    expect(summaryLines(summary, NAMES)).toContain('Found 341880 Greater-American Dollars');
    expect(summaryLines(summary, NAMES)).toContain('Spent 1200 rubles at the STORE');
    expect(summaryLines(summary, NAMES)).toContain('Spent 11 rubles at the HOLE');
  });

  it('counts the wands and scrolls that were made, by the spell each was made for', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'wandMade', spell: EXPLOSION, charges: 5 }),
        wrote({ kind: 'wandMade', spell: EXPLOSION, charges: 5 }),
        wrote({ kind: 'wandMade', spell: EXPLOSION, charges: 5 }),
        wrote({ kind: 'scrollWritten', spell: EXPLOSION }),
      ],
      { actions: 4, time: 4 },
    );
    expect(summary.made).toEqual([
      { what: 'wand', spell: 'EXPLOSION', count: 3 },
      { what: 'scroll', spell: 'EXPLOSION', count: 1 },
    ]);
    expect(summaryLines(summary, NAMES)).toContain('Made 3 wands of EXPLOSION');
    expect(summaryLines(summary, NAMES)).toContain('Wrote 1 scroll of EXPLOSION');
  });

  it('counts the charges a wand spent and the items that were used', () => {
    const cast = (source: 'spellPoints' | 'wand'): JournalEntry =>
      wrote({
        kind: 'cast',
        spell: { game: 'unforgiven', type: 2, level: 6, slot: 0, source, name: 'EXPLOSION' },
      });
    const summary = summarizeJournal(
      [
        cast('wand'),
        cast('wand'),
        cast('spellPoints'),
        wrote({ kind: 'itemUsed', item: 'POTION OF HEALING' }),
      ],
      { actions: 4, time: 4 },
    );
    expect(summary.used).toEqual([
      { what: 'charge', name: 'EXPLOSION', count: 2 },
      { what: 'item', name: 'POTION OF HEALING', count: 1 },
    ]);
    expect(summaryLines(summary, NAMES)).toContain('Used 2 charges of EXPLOSION');
    expect(summaryLines(summary, NAMES)).toContain('Used the POTION OF HEALING 1 time');
  });

  it('keeps an account of the fighting for each kind of monster', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'met', monster: GHOUL, slot: 3 }),
        wrote({ kind: 'swung', weapon: 'LONG SWORD', monster: GHOUL, damage: 31 }),
        wrote({ kind: 'swung', weapon: 'LONG SWORD', monster: GHOUL, damage: 0 }),
        wrote({ kind: 'hit', monster: GHOUL, damage: 16, breath: null }),
        wrote({ kind: 'hit', monster: GHOUL, damage: 0, breath: null }),
        wrote({ kind: 'killed', monster: GHOUL, experience: 341880 }),
        wrote({ kind: 'met', monster: ORC, slot: 7 }),
      ],
      { actions: 7, time: 7 },
    );
    expect(summary.monsters).toEqual([
      { name: 'GHOUL', fights: 1, swings: 2, hits: 1, damageDealt: 31, damageTaken: 16, blows: 1, kills: 1 },
      { name: 'ORC', fights: 1, swings: 0, hits: 0, damageDealt: 0, damageTaken: 0, blows: 0, kills: 0 },
    ]);
    expect(summaryLines(summary, NAMES)).toContain(
      'Fought 1 GHOUL: swung 2 times and hit for 31, took 16 from them, killed 1',
    );
  });

  it('counts one fight for a monster walked away from and come back to', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'met', monster: GHOUL, slot: 3 }),
        wrote({ kind: 'met', monster: GHOUL, slot: 3 }),
      ],
      { actions: 2, time: 2 },
    );
    expect(summary.monsters[0].fights).toBe(1);
  });

  it('counts a fight of its own for another monster met in between', () => {
    const summary = summarizeJournal(
      [
        wrote({ kind: 'met', monster: GHOUL, slot: 3 }),
        wrote({ kind: 'met', monster: ORC, slot: 7 }),
        wrote({ kind: 'met', monster: GHOUL, slot: 3 }),
      ],
      { actions: 3, time: 3 },
    );
    expect(summary.monsters[0].fights).toBe(2);
  });

  it('counts the deaths', () => {
    const summary = summarizeJournal(
      [wrote({ kind: 'died', monster: GHOUL, floor: 7, dungeon: 2 })],
      { actions: 1, time: 1 },
    );
    expect(summary.deaths).toBe(1);
    expect(summaryLines(summary, NAMES)).toContain('Died 1 time');
  });

  it('passes over an entry written from one of the kinds a game has of its own', () => {
    const summary = summarizeJournal(
      [{ at: 0, floor: 4, module: 0, text: 'Read the tablet in section 1', event: null }],
      { actions: 1, time: 1 },
    );
    expect(summary).toMatchObject({ steps: 0, deepestFloor: 4, monsters: [] });
  });
});
