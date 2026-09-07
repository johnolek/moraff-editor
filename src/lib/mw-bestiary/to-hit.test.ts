import { describe, expect, it } from 'vitest';
import { MONSTERS, WEAPONS } from './monsters';
import { fighterFromRecord, monsterDefence, mwHitChance, toHitTotal, totalNeededFor, type MwFighter } from './to-hit';

const named = (name: string) => MONSTERS.find((monster) => monster.name === name)!;

const fighter = (over: Partial<MwFighter> = {}): MwFighter => ({
  lev: 20,
  str: 40,
  luck: 15,
  weapon: 6,
  weaponPlus: 0,
  gauntlet: 0,
  ...over,
});

describe('the swing', () => {
  it('adds twice the level, Strength, Luck and what the kit is worth', () => {
    // A long sword is worth 2 to hit.
    expect(toHitTotal(fighter())).toBe(40 + 40 + 15 + 2);
    expect(toHitTotal(fighter({ weaponPlus: 5, gauntlet: 3 }))).toBe(40 + 40 + 15 + 2 + 5 + 3);
  });

  it('takes twice the depth and three defence bytes off', () => {
    // An ogre defends with 14, 9 and 11.
    expect(monsterDefence(named('OGRE'), 30)).toBe(60 + 14 + 9 + 11);
  });
});

describe('landing a hit', () => {
  it('never lands one the defence is out of reach of', () => {
    expect(mwHitChance(50, named('RED DRAGON KING'), 200, 19)).toBe(0);
  });

  it('lands more often the deeper the total goes past the defence', () => {
    const ogre = named('OGRE');
    const low = mwHitChance(monsterDefence(ogre, 30) + 45, ogre, 30, 9);
    const high = mwHitChance(monsterDefence(ogre, 30) + 120, ogre, 30, 9);
    expect(low).toBeGreaterThan(0);
    expect(high).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(1);
  });

  it('says what total half the swings need', () => {
    const ogre = named('OGRE');
    const half = totalNeededFor(0.5, ogre, 30);
    expect(half).toBeGreaterThan(monsterDefence(ogre, 30));
    // A fist rolls random(2), so half of the swings that get past still do nothing.
    expect(mwHitChance(half, ogre, 30, WEAPONS[0].damageDie)).toBeLessThan(0.5);
  });
});

describe('reading a save file', () => {
  it('takes the level, the characteristics and the weapon in hand out of the record', () => {
    const bytes = new Uint8Array(2344);
    const view = new DataView(bytes.buffer);
    view.setInt16(0x7a8, 42, true);
    view.setInt16(0x812, 88, true);
    view.setInt16(0x81c, 31, true);
    view.setUint8(0x9b, 7);
    view.setInt8(0x8e + 7, 12);
    view.setInt8(0x846, 4);
    expect(fighterFromRecord(bytes)).toEqual({
      lev: 42,
      str: 88,
      luck: 31,
      weapon: 7,
      weaponPlus: 12,
      gauntlet: 4,
    });
  });
});
