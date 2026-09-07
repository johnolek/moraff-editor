import { describe, expect, it } from 'vitest';
import data from './mw-data.json';

/** The three tables `mw-tools/reference/build_mw_data.py` cuts out of WORLD.EXE. */
describe('mw-data.json', () => {
  it('holds the whole monster table', () => {
    expect(data.monsters).toHaveLength(112);
    expect(data.monsters.map((monster) => monster.index)).toEqual(data.monsters.map((_, index) => index));
    for (const monster of data.monsters) {
      expect(monster.name).not.toBe('');
      expect(monster.raw).toHaveLength(2 * 0x23);
    }
  });

  it('holds the weapons and the armour', () => {
    expect(data.weapons).toHaveLength(12);
    expect(data.armour).toHaveLength(7);
    expect(data.weapons[7]).toMatchObject({ name: 'GREAT SWORD', damageDie: 19, toHit: 3, swingTime: 25 });
    expect(data.armour[6]).toMatchObject({ name: 'TITANIUM', armourClass: 16 });
  });

  it('stands the eight quest bosses on their own floors', () => {
    expect(data.bosses.map((boss) => boss.floor)).toEqual([4, 8, 12, 16, 125, 150, 175, 200]);
    expect(data.bosses.map((boss) => boss.monster)).toEqual([104, 105, 106, 107, 108, 109, 110, 111]);
    expect(data.bosses[0]).toMatchObject({ name: 'SHADOW DRAGONFLY', killFlagBit: 0 });
    expect(data.bosses[7]).toMatchObject({ name: 'RED DRAGON KING', killFlagBit: 7 });
  });

  it('reads the fields the combat code uses', () => {
    expect(data.monsters[0]).toMatchObject({
      name: 'OGRE',
      defence: 14,
      damageDie: 15,
      hpPerFloor: 10,
      attack: 18,
      extraDefence: 9,
      defenceAndAttack: 11,
      expMult: 2,
      picture: 0,
      pictureDrawn: true,
    });
    // The four dragons of a colour breathe the same thing; the orange ones breathe fire.
    expect(data.monsters[84]).toMatchObject({ name: 'ORANGE DRAGONFLY', breath: 1 });
    // A puffball is kind 6, and drains or raises the characteristic its stat drain names.
    expect(data.monsters[72]).toMatchObject({ name: 'LT. BLUE PUFFBALL', kind: 6, statDrain: 1 });
    expect(data.monsters[83]).toMatchObject({ name: 'DK. GRAY PUFFBALL', kind: 6, statDrain: -6 });
  });

  it('takes main at its word about the deepest floor a monster reaches', () => {
    // main (exe 2000:4292) rewrites a maximum over 120 for the 104 monsters it rolls.
    expect(data.monsters[0].maxFloor).toBe(254);
    expect(data.monsters[111].maxFloor).toBe(127);
    // MORAFF is the one monster whose floors do not overlap, so it is never stocked.
    expect(data.monsters[9]).toMatchObject({ name: 'MORAFF', minFloor: 120, maxFloor: 90 });
  });
});
