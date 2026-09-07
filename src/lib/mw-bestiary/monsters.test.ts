import { describe, expect, it } from 'vitest';
import {
  BOSSES,
  MONSTERS,
  MONSTERS_PER_FLOOR,
  appearsOn,
  bossFloor,
  depthDistribution,
  depthRange,
  describeEffects,
  floorGroup,
  hpRange,
  isBoss,
  killExperience,
  monsterGroups,
  neverStocked,
  stockingOdds,
} from './monsters';

const named = (name: string) => MONSTERS.find((monster) => monster.name === name)!;

describe('where a monster appears', () => {
  it('takes the floors from the monster and the picture from WORLD.PIC', () => {
    // The yellow vermin are stocked from the first floor to the last.
    expect(appearsOn(named('YELLOW SPIDER'), 1)).toBe(true);
    expect(appearsOn(named('YELLOW SPIDER'), 200)).toBe(true);
    // The black ones wait until floor 7.
    expect(appearsOn(named('BLACK SPIDER'), 6)).toBe(false);
    expect(appearsOn(named('BLACK SPIDER'), 7)).toBe(true);
    // A troll is deep enough but has no picture in WORLD.PIC.
    expect(named('TROLL').pictureDrawn).toBe(false);
    expect(appearsOn(named('TROLL'), 20)).toBe(false);
  });

  it('leaves the surface empty', () => {
    expect(appearsOn(named('OGRE'), 0)).toBe(false);
  });

  it('stands a quest boss on its own floor and nowhere else', () => {
    expect(bossFloor(named('SHADOW DRAGON'))).toBe(12);
    expect(appearsOn(named('SHADOW DRAGON'), 12)).toBe(true);
    expect(appearsOn(named('SHADOW DRAGON'), 13)).toBe(false);
    expect(BOSSES.every((boss) => isBoss(MONSTERS[boss.monster]))).toBe(true);
  });

  it('counts the seventeen monsters the game can never stock', () => {
    const never = MONSTERS.filter(neverStocked);
    expect(never).toHaveLength(17);
    // MORAFF himself is the one whose floors do not overlap: 120 at the shallowest, 90 deep.
    expect(named('MORAFF').minFloor).toBeGreaterThan(named('MORAFF').maxFloor);
    expect(never).toContain(named('MORAFF'));
  });
});

describe('stocking a floor', () => {
  it('starts the group at six for a new character, who is in dungeon 0', () => {
    expect(floorGroup(0)).toBe(6);
    expect(floorGroup(3)).toBe(0);
    expect(floorGroup(-1)).toBe(5);
  });

  it('shares the floor out between the monsters it allows', () => {
    const odds = stockingOdds(30, 0);
    expect(odds.reduce((sum, chance) => sum + chance, 0)).toBeCloseTo(1, 10);
    // Nothing that cannot be stocked takes a share.
    expect(odds[named('TROLL').index]).toBe(0);
    expect(odds[named('SHADOW DRAGONFLY').index]).toBe(0);
    // Two draws in three are one of the first nine, so the group leads its floor by a mile.
    expect(odds[named('OGRE').index]).toBeGreaterThan(odds[named('YELLOW SPIDER').index]);
  });

  it('gives the group no lead when the group has no picture', () => {
    // Dungeon 0 makes group 6, the HOBBIT, whom WORLD.PIC has no picture of.
    expect(named('HOBBIT').index).toBe(6);
    const hobbit = stockingOdds(30, 6);
    const ogre = stockingOdds(30, 0);
    expect(hobbit[named('OGRE').index]).toBeLessThan(ogre[named('OGRE').index]);
    // With the group void the nine share alike, apart from the one draw in three over all 104.
    expect(hobbit[named('OGRE').index]).toBeCloseTo(hobbit[named('WEREWOLF').index], 10);
  });

  it('leaves a floor for its 145 monsters', () => {
    expect(MONSTERS_PER_FLOOR).toBe(145);
    const odds = stockingOdds(50, 0);
    expect(odds[named('OGRE').index] * MONSTERS_PER_FLOOR).toBeGreaterThan(1);
  });
});

describe('hit points', () => {
  it('runs from one to the multiplier times the floor', () => {
    // An ogre is ten hit points a floor, so floor 30 gives it 1 to 301.
    expect(hpRange(named('OGRE'), 30)).toEqual([1, 301]);
  });

  it('gives a quest boss twenty more per floor', () => {
    // The shadow dragon is 62 a floor and stands on floor 12: 744 + 1 from the rolls, 240 on top.
    expect(hpRange(named('SHADOW DRAGON'), 12)).toEqual([241, 985]);
  });

  it('caps the roll at 32,000', () => {
    expect(hpRange(named('GIANT WHITE BALL'), 400)[1]).toBe(32000);
  });
});

describe('depth', () => {
  it('drifts ten floors either way at most', () => {
    expect(depthRange(50)).toEqual([40, 60]);
    expect(depthRange(3)).toEqual([1, 13]);
  });

  it('leaves most monsters on the floor they were stocked on', () => {
    const spread = depthDistribution(50);
    expect(spread.reduce((sum, entry) => sum + entry.p, 0)).toBeCloseTo(1, 10);
    const floorItself = spread.find((entry) => entry.depth === 50)!;
    expect(floorItself.p).toBeGreaterThan(0.6);
    expect(spread[0].depth).toBeGreaterThanOrEqual(40);
    expect(spread[spread.length - 1].depth).toBeLessThanOrEqual(60);
  });

  it('keeps a shallow floor above zero', () => {
    expect(depthDistribution(1).every((entry) => entry.depth >= 1)).toBe(true);
  });
});

describe('what a kill is worth', () => {
  it('raises 1.23 to the monster depth and scales it by the multiplier', () => {
    // 2 * (5 * 1.23^30 + 31) for an ogre, which is worth twice the base.
    expect(killExperience(named('OGRE'), 30)).toBeCloseTo(2 * (5 * 1.23 ** 30 + 31), 6);
  });

  it('stops counting depth at 130', () => {
    expect(killExperience(named('OGRE'), 200)).toBe(killExperience(named('OGRE'), 130));
  });

  it('pays 128 times the base for the deepest quest boss', () => {
    expect(named('RED DRAGON KING').expMult).toBe(128);
  });
});

describe('what a monster does to you', () => {
  it('says which characteristic a puffball moves', () => {
    expect(describeEffects(named('LT. BLUE PUFFBALL'))).toEqual([
      'Pops when it reaches you: adds a point to your Strength, and it is gone',
    ]);
    expect(describeEffects(named('DK. GRAY PUFFBALL'))).toEqual([
      'Pops when it reaches you: takes a point off your Luck, and it is gone',
    ]);
  });

  it('counts the levels a drainer takes', () => {
    expect(describeEffects(named('VAMPIRE'))).toContain('Drains 2 levels when it hits you');
    expect(describeEffects(named('SKELETON'))).toContain('Drains 1 level when it hits you');
  });

  it('names what a dragon breathes', () => {
    expect(describeEffects(named('ORANGE DRAGON'))).toContain(
      'Breathes fire instead of striking half the time, halved by Anti-Fire',
    );
    expect(describeEffects(named('WHITE DRAGON'))).toContain(
      'Breathes acid instead of striking half the time, which destroys the armor you are wearing',
    );
  });

  it('marks the poison, the disease and the monster no spell touches', () => {
    expect(describeEffects(named('BLACK SPIDER'))).toContain('Poisons you when it hits you');
    expect(describeEffects(named('GREEN SPIDER'))).toContain('Gives you a disease when it hits you');
    expect(describeEffects(named('ZEUS'))).toContain('Refuses Go Away, Hold Monster, Drain Monster and Autokill, and catches a thrown grenade without using it up');
  });
});

describe('the list', () => {
  it('holds all 112 monsters once each', () => {
    const groups = monsterGroups();
    const listed = groups.flatMap((group) => group.monsters);
    expect(listed).toHaveLength(112);
    expect(new Set(listed.map((monster) => monster.index)).size).toBe(112);
  });

  it('leads with the eight quest bosses and ends with the ones never stocked', () => {
    const groups = monsterGroups();
    expect(groups[0].label).toBe('Quest bosses');
    expect(groups[0].monsters).toHaveLength(8);
    expect(groups[groups.length - 1].label).toBe('Never stocked');
  });
});
