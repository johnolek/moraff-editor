import { describe, expect, it } from 'vitest';
import { monsterLevelBase } from '../game/dotu-mech.js';
import { SeededRng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import { newCharacterFile } from '../roller/save-file';
import { monsterTypeOf } from './floor';
import {
  fightMonster,
  fightOutcome,
  fightSquare,
  monsterLevelRange,
  rollFightHp,
  sendInTheMonster,
  startFight,
  type FightMonster,
  type FightSetup,
} from './fight-sim';
import { monsterById } from '../map/stocking';

/** A setup with the numbers a test cares about typed into it, the way the form types them. */
function setup(
  overrides: Partial<PlayerCharacter> = {},
  monster: Partial<FightMonster> = {},
): FightSetup {
  const character = { ...newGame().pc, name: 'BRAWLER', ...overrides };
  return {
    record: newCharacterFile(character),
    character,
    monster: { monsterId: 'builtin-0', module: 0, floor: 1, level: 1, hp: 40, ...monster },
  };
}

describe('the square a fight is set on', () => {
  it('is open to the north with nothing under the character', () => {
    const square = fightSquare(3, 0);
    const rows: MapSquare[][] = UNFORGIVEN_MAP.floor(3, 0);
    const under = rows[square.y][square.x];
    expect(under.solid).toBe(false);
    expect(under.n).toBe(3);
    expect(under.ladder).toBe(0);
    expect(under.trapdoor).toBe(-1);
    expect(under.chute).toBe(0);
    expect(rows[square.y - 1][square.x].solid).toBe(false);
  });
});

describe('the levels stock_level could store a monster with', () => {
  it('is the floor’s base level and as far as the nudge reaches either side of it', () => {
    expect(monsterLevelRange(50)).toEqual({ from: 38, to: 62 });
  });

  it('never goes below 1, since a level nudged out of range is put back to 1', () => {
    expect(monsterLevelRange(1)).toEqual({ from: 1, to: 13 });
  });
});

describe('the hit points a monster is sent in with', () => {
  it('are rolled from the floor rather than from the level the monster is stored with', () => {
    const entry = monsterById('builtin-0');
    const base = monsterLevelBase(20, 0);
    const rolled = rollFightHp(entry, base, () => 0.5);
    expect(rolled).toBe(rollFightHp(entry, base, () => 0.5));
    expect(rolled).toBeGreaterThan(rollFightHp(entry, 1, () => 0.5));
  });
});

describe('setting a fight up', () => {
  it('fights with the numbers the form typed, on the floor the monster was picked for', () => {
    const built = setup({ lev: 44, str: 77, luck: 12, maxHp: 300, hp: 300 }, { floor: 7 });
    const session = startFight(built, new SeededRng(1));
    const pc = session.game.pc;
    expect(pc.lev).toBe(44);
    expect(pc.str).toBe(77);
    expect(pc.luck).toBe(12);
    expect(pc.maxHp).toBe(300);
    expect(pc.level).toBe(7);
    expect(pc.module).toBe(0);
    session.finish();
  });

  it('leaves the floor empty until the monster is sent in', () => {
    const session = startFight(setup(), new SeededRng(2));
    expect(session.game.monsters.filter((monster) => monster.hp > 0)).toEqual([]);
    expect(session.game.engaged).toBe(-1);
    expect(fightOutcome(session, false)).toBe('waiting');
    session.finish();
  });

  it('never writes the record it copied the character out of', () => {
    const built = setup({ str: 30 });
    const before = built.record.slice();
    const session = startFight(built, new SeededRng(3));
    session.game.pc.str = 99;
    session.save();
    expect(built.record).toEqual(before);
    expect(session.file.bytes).not.toEqual(before);
    session.finish();
  });
});

describe('sending the monster in', () => {
  it('stands it in front of the character with the kind, level and hit points that were asked for', async () => {
    const built = setup({}, { monsterId: 'section-1-24', floor: 3, level: 6, hp: 55 });
    const session = startFight(built, new SeededRng(4));
    await sendInTheMonster(session, built.monster);
    const planted = fightMonster(session);
    expect(planted.type).toBe(monsterTypeOf('section-1-24'));
    expect(planted.level).toBe(6);
    expect(planted.hp).toBe(55);
    expect(planted.x).toBe(session.game.pc.x);
    expect(planted.y).toBe(session.game.pc.y - 1);
    session.finish();
  });

  it('leaves the loop fighting it, and it alone', async () => {
    const built = setup();
    const session = startFight(built, new SeededRng(5));
    await sendInTheMonster(session, built.monster);
    expect(session.game.engaged).toBe(0);
    expect(session.game.monsters.filter((monster) => monster.hp > 0)).toHaveLength(1);
    expect(fightOutcome(session, true)).toBe('fighting');
    session.finish();
  });

  it('sends nothing in when there is rock in front of the character', async () => {
    const built = setup();
    const session = startFight(built, new SeededRng(11));
    // The top row of the floor: north of it is off the map, which is turned down the way rock is.
    session.game.pc.y = 0;
    expect(await sendInTheMonster(session, built.monster)).toBe(false);
    expect(session.game.monsters.filter((monster) => monster.hp > 0)).toEqual([]);
    session.finish();
  });

  it('is dead once its hit points have run out', async () => {
    const built = setup({}, { hp: 1 });
    const session = startFight(built, new SeededRng(6));
    await sendInTheMonster(session, built.monster);
    fightMonster(session).hp = 0;
    expect(fightOutcome(session, true)).toBe('monsterDead');
    session.finish();
  });
});
