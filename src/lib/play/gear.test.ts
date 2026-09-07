import { describe, expect, it } from 'vitest';
import { ARMOR_NAMES, WEAPON_NAMES } from '../game/port/drops';
import type { Rng } from '../game/port/rng';
import { inTheTown, press } from './battle.test-support';
import { gearMenuLines } from './gear';
import { KEY } from './keys';

const lowest: Rng = { random: () => 0 };

/** The line of a menu drawn over the map, by the row it is on. */
const menuRow = (screen: { text: string }[], row: number): string | undefined =>
  screen.map((line) => line.text).find((text) => text.startsWith(`${row}) `));

describe('the menu the A and W keys build', () => {
  it('names what is in each slot with the plus on it and dashes the empty ones', () => {
    const lines = gearMenuLines(WEAPON_NAMES, [1, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 3, 0, 0]);
    expect(lines[0]).toBe('1) FIST');
    expect(lines[1]).toBe('2) --------');
    expect(lines[5]).toBe('6) SHORTSWORD, PLUS 3');
  });

  it('dashes the eighth armor row, which the game has no name for', () => {
    const lines = gearMenuLines(ARMOR_NAMES, [1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0]);
    expect(lines[6]).toBe('7) TITANIUM');
    expect(lines[7]).toBe('8) --------');
  });
});

describe('the A key', () => {
  it('puts on a suit of armor the character owns', async () => {
    const session = inTheTown(lowest, { cls: 0, armorOwned: [1, 1, 0, 0, 0, 0, 0, 0], armor: 0 });
    await press(session, KEY.armor);
    expect(menuRow(session.game.screen, 2)).toBe('2) LEATHER');
    await press(session, 0x32);
    expect(session.game.pc.armor).toBe(1);
    expect(session.game.screen).toEqual([]);
  });

  it('refuses a class that may not wear it and leaves the old armor on', async () => {
    const session = inTheTown(lowest, { cls: 3, armorOwned: [1, 1, 0, 0, 0, 0, 0, 0], armor: 0 });
    await press(session, KEY.armor);
    await press(session, 0x32);
    expect(session.game.pc.armor).toBe(0);
    expect(session.box).toContain('  CAN NOT WEAR ARMOR OF THIS TYPE');
  });

  it('changes nothing for a row the character owns nothing in', async () => {
    const session = inTheTown(lowest, { cls: 0, armorOwned: [1, 0, 0, 0, 0, 0, 0, 0], armor: 0 });
    await press(session, KEY.armor);
    await press(session, 0x33);
    expect(session.game.pc.armor).toBe(0);
    expect(session.box).toEqual([]);
  });
});

describe('the W key', () => {
  it('takes a weapon the character owns into their hand', async () => {
    const owned = [1, 0, 0, 0, 0, 1, 0, 0];
    const session = inTheTown(lowest, { cls: 0, weaponsOwned: owned, weapon: 0 });
    await press(session, KEY.weapon);
    expect(menuRow(session.game.screen, 6)).toBe('6) SHORTSWORD');
    await press(session, 0x36);
    expect(session.game.pc.weapon).toBe(5);
  });

  it('keeps a monk to their fists', async () => {
    const owned = [1, 1, 0, 0, 0, 0, 0, 0];
    const session = inTheTown(lowest, { cls: 2, weaponsOwned: owned, weapon: 0 });
    await press(session, KEY.weapon);
    await press(session, 0x32);
    expect(session.game.pc.weapon).toBe(0);
    expect(session.box).toContain('  CAN NOT USE THAT WEAPON.');
  });

  it('keeps the great sword for a fighter', async () => {
    const owned = [1, 0, 0, 0, 0, 0, 0, 1];
    const sage = inTheTown(lowest, { cls: 5, weaponsOwned: owned, weapon: 0 });
    await press(sage, KEY.weapon);
    await press(sage, 0x38);
    expect(sage.game.pc.weapon).toBe(0);
    const fighter = inTheTown(lowest, { cls: 0, weaponsOwned: owned, weapon: 0 });
    await press(fighter, KEY.weapon);
    await press(fighter, 0x38);
    expect(fighter.game.pc.weapon).toBe(7);
  });

  it('leaves the weapon in hand alone on escape', async () => {
    const owned = [1, 0, 0, 0, 0, 1, 0, 0];
    const session = inTheTown(lowest, { cls: 0, weaponsOwned: owned, weapon: 5 });
    await press(session, KEY.weapon);
    await press(session, KEY.escape);
    expect(session.game.pc.weapon).toBe(5);
  });
});
