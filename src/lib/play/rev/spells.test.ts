import { describe, expect, it } from 'vitest';
import { revValue, setRevValue, type RevPc } from './record';
import { SPELL_VALUES } from './screen/text';
import { REV_MAGIC } from './magic';
import {
  REV_NOT_ENOUGH_SPELL_POINTS,
  REV_PREP_SPELLS,
  revArriveInTheTown,
  revCastInTheDungeon,
  revEndPreppedSpells,
  revSpellMenu,
} from './spells';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

const KEY = (character: string) => character.charCodeAt(0);

/** Every spell of both sets known, which is both bitfields set on every level. */
function knowsEverything(pc: ReturnType<typeof revCharacter>): void {
  for (let level = 1; level <= 6; level++) {
    setRevValue(pc, 115 + 2 * level, 3);
    setRevValue(pc, 116 + 2 * level, 3);
  }
}

describe("the dungeon's spell menu", () => {
  it('leaves a spell the character has not been taught off the menu', async () => {
    const pc = revCharacter();
    setRevValue(pc, 118, 1);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('2'));
    expect(await revSpellMenu(game, desk, 1, 'prep')).toBe(3);
    expect(game.said).toEqual(['LEVEL 1 - SELECT ONE:  ', '1) CURE', '2) ', '3) CAST NO SPELL']);
  });

  it('reads Escape as the third answer', async () => {
    const pc = revCharacter();
    knowsEverything(pc);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(0x1b);
    expect(await revSpellMenu(game, desk, 1, 'prep')).toBe(3);
  });

  it('casts nothing at all when a monster has walked onto the square', async () => {
    const pc = revCharacter();
    knowsEverything(pc);
    const { game, desk } = revTestGame(pc);
    expect(await revSpellMenu(game, desk, 1, 'prep')).toBe(3);
  });
});

describe('the scratch cell the spell menu answers through', () => {
  /** The menu run with the keys given, and what stood in the cell as each key was asked for. */
  async function menu(pc: RevPc, typed: number[]): Promise<{ answer: number; cell: number; asking: number[] }> {
    const { game, desk, keys } = revTestGame(pc);
    const poll = desk.poll;
    const asking: number[] = [];
    desk.poll = () => {
      asking.push(game.scratch);
      return poll();
    };
    game.scratch = 99;
    keys.push(...typed);
    const answer = await revSpellMenu(game, desk, 1, 'prep');
    return { answer, cell: game.scratch, asking };
  }

  it('holds the mask of the spells the level offers while it asks, as 1000:C5EA does', async () => {
    const pc = revCharacter();
    setRevValue(pc, 118, 2);
    expect((await menu(pc, [KEY('2')])).asking).toEqual([2]);
  });

  it('holds the number that was chosen, as 1000:C730 does', async () => {
    const pc = revCharacter();
    knowsEverything(pc);
    expect(await menu(pc, [KEY('2')])).toMatchObject({ answer: 2, cell: 2 });
  });

  it('holds a key that is none of the three while it asks again', async () => {
    const pc = revCharacter();
    knowsEverything(pc);
    expect((await menu(pc, [KEY('7'), KEY('1')])).asking).toEqual([3, 7]);
  });

  it('holds the third answer for Escape, for a spell not known and for a monster arriving', async () => {
    const known = revCharacter();
    knowsEverything(known);
    expect(await menu(known, [0x1b])).toMatchObject({ answer: 3, cell: 3 });
    expect(await menu(revCharacter(), [KEY('1')])).toMatchObject({ answer: 3, cell: 3 });
    expect(await menu(known, [])).toMatchObject({ answer: 3, cell: 3 });
  });
});

describe("the dungeon's twelve spells", () => {
  it('turns a level and a choice into the arm of the ON GOTO the game jumps to', async () => {
    const pc = revCharacter({ hp: 10, maxHp: 100 });
    knowsEverything(pc);
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('1'), KEY('1'));
    await revCastInTheDungeon(game, desk);
    expect(pc.hp).toBe(25);
    expect(pc.spellPoints).toBe(19);
  });

  it('refuses a level the character cannot pay for, and a level of seven', async () => {
    const pc = revCharacter({ spellPoints: 2 });
    const { game, desk, keys } = revTestGame(pc);
    keys.push(KEY('4'));
    await revCastInTheDungeon(game, desk);
    expect(game.said).toContain(REV_NOT_ENOUGH_SPELL_POINTS);
  });

  it('CURE heals a point for every point of wisdom and never above the maximum', () => {
    const pc = revCharacter({ hp: 38, maxHp: 40 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[0].cast(game, desk, 1);
    expect(pc.hp).toBe(40);
  });

  it('SENSE LEVEL says which level the character is on', () => {
    const pc = revCharacter({ dungeonLevel: 12 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[1].cast(game, desk, 1);
    expect(game.said).toEqual(['YOU ARE ON LEVEL 12 ']);
    expect(pc.spellPoints).toBe(19);
  });

  it('STRENGTH adds six once and does nothing the second time', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[2].cast(game, desk, 2);
    REV_PREP_SPELLS[2].cast(game, desk, 2);
    expect(pc.stats[0]).toBe(21);
    expect(pc.spellPoints).toBe(18);
  });

  it('SPEED adds seven to agility', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[3].cast(game, desk, 2);
    expect(pc.stats[4]).toBe(22);
  });

  it("SENSE LOCATION reads both coordinates out, with BASIC's own gap between them", () => {
    const pc = revCharacter({ column: 7, row: 3, dungeonLevel: 10 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[4].cast(game, desk, 3);
    expect(game.said).toEqual(['X= 7          Y= 3 ', 'AND YOU ARE ON LEVEL 10 ']);
    expect(pc.spellPoints).toBe(17);
  });

  it('DESCEND drops a level', () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc);
    REV_PREP_SPELLS[5].cast(game, desk, 3);
    expect(levels).toEqual([11]);
  });

  it('FEATHER drops 250 pounds and stops there when that empties the purse', async () => {
    const pc = revCharacter({ weight: 200, dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc);
    await REV_PREP_SPELLS[6].cast(game, desk, 4);
    expect(pc.weight).toBe(0);
    expect(pc.spellPoints).toBe(16);
    expect(levels).toEqual([]);
  });

  it('FEATHER floats a still-laden character up a level, which is the fall into ASCEND', async () => {
    const pc = revCharacter({ weight: 400, dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc);
    await REV_PREP_SPELLS[6].cast(game, desk, 4);
    expect(pc.weight).toBe(150);
    expect(levels).toEqual([9]);
    expect(game.said).toEqual(['POOF']);
  });

  it('ASCEND does nothing in the town', () => {
    const pc = revCharacter({ dungeonLevel: 0 });
    const { game, desk, levels } = revTestGame(pc);
    REV_PREP_SPELLS[7].cast(game, desk, 4);
    expect(levels).toEqual([]);
    expect(pc.spellPoints).toBe(20);
  });

  it('CHANGE LEVEL steps between five up and four down, and never nowhere', () => {
    const pc = revCharacter({ dungeonLevel: 10 });
    const { game, desk, levels } = revTestGame(pc, revRolls([5]));
    REV_PREP_SPELLS[8].cast(game, desk, 5);
    expect(levels).toEqual([9]);
    expect(pc.spellPoints).toBe(15);
  });

  it('CHANGE LEVEL stops at the town and at the seventieth level', () => {
    const pc = revCharacter({ dungeonLevel: 68 });
    const { game, desk, levels } = revTestGame(pc, revRolls([9]));
    REV_PREP_SPELLS[8].cast(game, desk, 5);
    expect(levels).toEqual([70]);
  });

  it('HEAL puts the hit points half of wisdom above the maximum', () => {
    const pc = revCharacter({ hp: 1, maxHp: 40 });
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[10].cast(game, desk, 6);
    expect(pc.hp).toBe(47);
  });

  it('MOCCIOLO adds a point to every characteristic on a one', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc, revRolls([0]));
    REV_PREP_SPELLS[11].cast(game, desk, 6);
    expect(pc.stats).toEqual([16, 16, 16, 16, 16, 16]);
    expect(game.said).toEqual(['WOW!']);
  });

  it('MOCCIOLO takes two levels and every point of experience on a six', () => {
    const pc = revCharacter({ level: 9, experience: 5000, maxHp: 60, fromHealth: 6 });
    const { game, desk } = revTestGame(pc, revRolls([5, 3, 4]));
    REV_PREP_SPELLS[11].cast(game, desk, 6);
    expect(pc.level).toBe(7);
    expect(pc.experience).toBe(0);
    expect(pc.maxHp).toBe(43);
    expect(game.said).toEqual(['Oh my God!']);
  });
});

/** The "CAST" strip beside the map, as the screen builds it (`screen/from-game.ts`). */
const inEffect = (pc: RevPc): boolean[] => SPELL_VALUES.map((value) => revValue(pc, value) > 0);

describe('the spells that last until the town', () => {
  it('are the five record values the strip beside the map reads', () => {
    const pc = revCharacter();
    setRevValue(pc, REV_MAGIC.preppedStrength, 1);
    expect(inEffect(pc)).toEqual([false, false, true, false, false]);
  });

  it('gives back what Strength and Speed added and turns invisibility off', () => {
    const pc = revCharacter();
    const { game, desk } = revTestGame(pc);
    REV_PREP_SPELLS[2].cast(game, desk, 2);
    REV_PREP_SPELLS[3].cast(game, desk, 2);
    REV_PREP_SPELLS[9].cast(game, desk, 5);
    revEndPreppedSpells(game);
    expect(pc.stats[0]).toBe(15);
    expect(pc.stats[4]).toBe(15);
    expect(inEffect(pc)).toEqual([false, false, false, false, false]);
  });

  it('works the three bonuses out again when the character reaches the town', () => {
    const pc = revCharacter({ stats: [20, 15, 15, 20, 20, 15], dungeonLevel: 4 });
    const { game } = revTestGame(pc);
    revArriveInTheTown(game);
    expect(pc.dungeonLevel).toBe(0);
    expect(pc.fromHealth).toBe(14);
    expect(pc.fromStrength).toBeCloseTo(6.3);
    expect(pc.fromAgility).toBe(8);
  });
});
