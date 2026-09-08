import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { UNFORGIVEN_MAP } from '../map/game';
import { characterFile, press, settle, townSquare } from './battle.test-support';
import { runMoveControl, startGame, type GameSession } from './engine';
import { KEY } from './keys';
import { runMwMoveControl, startMwGame, type MwGameSession } from './mw/engine';
import { mwCharacterFile } from './mw/engine.test';
import { MW_KEY, mwTurn } from './mw/keys';
import { countsAsAction, decodeRecord, ENGINE_COMMIT, RunRecorder, RUN_LOG_VERSION, TURN_INPUTS } from './run';

/** A game of Dungeons of the Unforgiven being recorded, with a seed of the test's own. */
function recordedGame(
  overrides: Parameters<typeof characterFile>[0] = {},
  seed = 12345,
): { run: RunRecorder; session: GameSession; record: Uint8Array } {
  const file = characterFile(overrides);
  const record = file.bytes.slice();
  const run = new RunRecorder({
    game: 'unforgiven',
    name: 'BRAWLER',
    record: file.bytes,
    seed,
    startedAt: '2026-09-07T00:00:00.000Z',
  });
  const session = startGame(file, run.rng, run);
  void runMoveControl(session);
  return { run, session, record };
}

/** The same in Moraff's World. */
function recordedMwGame(seed = 7): { run: RunRecorder; session: MwGameSession } {
  const file = mwCharacterFile();
  const run = new RunRecorder({ game: 'moraffsWorld', name: 'GRIMWALD', record: file.bytes, seed });
  const session = startMwGame(file, run.rng, run);
  void runMwMoveControl(session);
  return { run, session };
}

describe('the run log', () => {
  it('keeps the seed, the record and the keys the game was given', async () => {
    const { run, session, record } = recordedGame();
    await press(session, KEY.arrowUp);
    await press(session, KEY.arrowLeft);
    await press(session, KEY.viewStats);
    session.finish();

    const log = run.log();
    expect(log.version).toBe(RUN_LOG_VERSION);
    expect(log.game).toBe('unforgiven');
    expect(log.name).toBe('BRAWLER');
    expect(log.mode).toBeNull();
    expect(log.seed).toBe(12345);
    expect(log.startedAt).toBe('2026-09-07T00:00:00.000Z');
    expect(log.engine).toBe(ENGINE_COMMIT);
    expect(log.inputs).toEqual([KEY.arrowUp, KEY.arrowLeft, KEY.viewStats]);
    expect(decodeRecord(log.record)).toEqual(record);
  });

  it('keeps the record the game began with, whatever the game saves over it', async () => {
    const { run, session, record } = recordedGame();
    await press(session, KEY.arrowUp);
    session.save();
    session.finish();

    expect(decodeRecord(run.log().record)).toEqual(record);
  });

  it('draws a seed of its own for every run', () => {
    const record = new Uint8Array(8);
    const seeds = new Set(
      Array.from({ length: 20 }, () => new RunRecorder({ game: 'unforgiven', name: 'A', record }).seed),
    );
    expect(seeds.size).toBeGreaterThan(15);
  });

  it('writes down the swings Ctrl-F takes without a key of its own', async () => {
    const start = townSquare();
    const { run, session } = recordedGame({ level: 0, dir: 0, ...start, lev: 10, str: 60, cls: 2 });
    const planted = session.game.monsters[0];
    planted.x = start.x;
    planted.y = start.y - 1;
    planted.hp = 100000;
    planted.level = 1;
    planted.type = 0;
    session.game.monsterMap[planted.y * 80 + planted.x] = 0;
    // A pass round the loop with a key nothing is bound to, which is where attack_timing meets
    // the monster and takes it up.
    await press(session, KEY.escape);

    await press(session, KEY.repeatFight);
    for (let waited = 0; waited < 5; waited++) await settle();
    // A key typed while the character is swinging is thrown away by the flush at the end of the
    // swing, so the game never reads it and the log never holds it.
    session.press(KEY.viewStats);
    for (let waited = 0; waited < 3; waited++) await settle();
    session.finish();

    const inputs = run.log().inputs;
    expect(inputs[0]).toBe(KEY.escape);
    expect(inputs[1]).toBe(KEY.repeatFight);
    expect(inputs.slice(2).every((key) => key === KEY.fight)).toBe(true);
    expect(inputs.length).toBeGreaterThan(2);
    expect(inputs).not.toContain(KEY.viewStats);
  });

  it("writes down Moraff's World's turn where the character stands", async () => {
    const { run, session } = recordedMwGame();
    session.press(MW_KEY.arrowUp);
    await settle();
    mwTurn(session, 2);
    session.press(MW_KEY.viewStats);
    await settle();
    session.finish();

    expect(run.log().inputs).toEqual([MW_KEY.arrowUp, TURN_INPUTS[2], MW_KEY.viewStats]);
  });
});

describe('the actions a run counts', () => {
  it('counts a step, a wait and a swing, and not the screens', async () => {
    const { run, session } = recordedGame();
    for (const key of [KEY.arrowUp, KEY.enter, KEY.fight, KEY.viewStats, KEY.expNeeded, KEY.pockets, KEY.expandMap]) {
      await press(session, key);
    }
    session.finish();

    expect(run.log().actions).toBe(3);
  });

  it("counts a turn in Moraff's World, where every arrow steps, and not in the other game", () => {
    expect(countsAsAction('unforgiven', KEY.arrowLeft)).toBe(false);
    expect(countsAsAction('unforgiven', KEY.arrowDown)).toBe(false);
    expect(countsAsAction('moraffsWorld', MW_KEY.arrowLeft)).toBe(true);
    expect(countsAsAction('moraffsWorld', MW_KEY.arrowDown)).toBe(true);
  });

  it('counts the ladders, the trap door, the dig and the spells', () => {
    for (const key of [KEY.up, KEY.down, KEY.trapDoor, KEY.dig, KEY.cast, KEY.useItem]) {
      expect(countsAsAction('unforgiven', key)).toBe(true);
    }
    for (const key of [MW_KEY.up, MW_KEY.down, MW_KEY.trapDoor, MW_KEY.wait, MW_KEY.cast, MW_KEY.useItem]) {
      expect(countsAsAction('moraffsWorld', key)).toBe(true);
    }
  });

  it('leaves out the keys that only put something on the screen', () => {
    for (const key of [KEY.viewStats, KEY.expNeeded, KEY.pockets, KEY.money, KEY.monsterManual, KEY.help, KEY.quit, KEY.options, KEY.graphics, KEY.expandMap, KEY.zoomView, KEY.armor, KEY.weapon, KEY.loseItem]) {
      expect(countsAsAction('unforgiven', key)).toBe(false);
    }
    for (const key of [MW_KEY.viewStats, MW_KEY.expNeeded, MW_KEY.pockets, MW_KEY.money, MW_KEY.help, MW_KEY.quit, MW_KEY.save, MW_KEY.sound, MW_KEY.brickSpeed, MW_KEY.expandMap, MW_KEY.zoomView, MW_KEY.armor, MW_KEY.weapon, MW_KEY.loseItem, MW_KEY.escape]) {
      expect(countsAsAction('moraffsWorld', key)).toBe(false);
    }
  });

  it('counts each of the swings Ctrl-F takes, and not Ctrl-F itself', () => {
    expect(countsAsAction('unforgiven', KEY.repeatFight)).toBe(false);
    expect(countsAsAction('unforgiven', KEY.fight)).toBe(true);
  });
});

/** Put a monster on the square in front of a character standing in the town facing north. */
function plantAMonster(session: GameSession, start: { x: number; y: number }, monster: { hp: number; type: number }) {
  const planted = session.game.monsters[0];
  planted.x = start.x;
  planted.y = start.y - 1;
  planted.hp = monster.hp;
  planted.level = 1;
  planted.type = monster.type;
  session.game.monsterMap[planted.y * 80 + planted.x] = 0;
}

/** The first square of the town whose north side is a module teleporter. */
function teleporterSquare(): { x: number; y: number } {
  const rows = UNFORGIVEN_MAP.floor(0, 0);
  for (let y = 2; y < 100; y++) {
    for (let x = 2; x < 76; x++) {
      if (rows[y][x].solid || rows[y][x].n !== 4) continue;
      if (bundledDungeon.ladder(x, y, 0, 0) !== 0) continue;
      if (bundledDungeon.townFeature(x, y, 0) !== 0) continue;
      return { x, y };
    }
  }
  throw new Error('no module teleporter in the town');
}

describe('the milestones a run records', () => {
  it('records the death, with the actions and the game time it happened at', async () => {
    const { run, session } = recordedGame({ level: 0, dir: 0, ...townSquare() });
    await press(session, KEY.arrowUp);
    session.game.pc.hp = -1;
    await press(session, KEY.escape);
    // FUN_2000_9232 prints two of UH.BIN's messages and waits for a key after each.
    await press(session, KEY.enter);
    await press(session, KEY.enter);
    session.finish();

    expect(session.dead).toBe(true);
    const milestones = run.log().milestones;
    expect(milestones).toEqual([{ kind: 'death', which: 0, actions: 1, time: session.game.secondsElapsed, floor: 0 }]);
  });

  it('records the section boss a swing killed', async () => {
    const start = townSquare();
    const { run, session } = recordedGame({ level: 0, dir: 0, ...start, lev: 20, str: 90, cls: 2 });
    plantAMonster(session, start, { hp: 1, type: 22 });
    await press(session, KEY.escape);
    await press(session, KEY.fight);
    for (let key = 0; key < 6; key++) await press(session, KEY.enter);
    session.finish();

    const boss = run.log().milestones.filter((milestone) => milestone.kind === 'boss');
    expect(boss.length).toBe(1);
    expect(boss[0].which).toBe(0);
    expect(boss[0].actions).toBeGreaterThan(0);
  });

  it('records the level a night at the inn handed over', async () => {
    const inn = (() => {
      for (let y = 1; y < 100; y++) {
        for (let x = 1; x < 76; x++) {
          if (bundledDungeon.townFeature(x, y, 0) === 4 && bundledDungeon.ladder(x, y, 0, 0) === 0) return { x, y };
        }
      }
      throw new Error('no inn in the town');
    })();
    const { run, session } = recordedGame({
      level: 0,
      ...inn,
      lev: 1,
      money: 100,
      exp: 100000,
      cultureStock: 10,
      crystals: 10,
      sp: 0,
      maxSp: 5,
    });
    await press(session, KEY.up);
    await press(session, KEY.escape);
    await press(session, KEY.escape);
    await press(session, KEY.escape);
    await press(session, 0x31);
    await press(session, KEY.viewStats);
    session.finish();

    const levels = run.log().milestones.filter((milestone) => milestone.kind === 'level');
    expect(levels.length).toBe(1);
    expect(levels[0].which).toBe(session.game.pc.lev);
    expect(levels[0].which).toBeGreaterThan(1);
  });

  it('records the module the teleporter led to', async () => {
    const start = teleporterSquare();
    const { run, session } = recordedGame({ level: 0, dir: 0, ...start });
    await press(session, KEY.arrowUp);
    await press(session, KEY.enter);
    await press(session, KEY.viewStats);
    session.finish();

    expect(session.game.pc.module).toBe(1);
    const modules = run.log().milestones.filter((milestone) => milestone.kind === 'dungeon');
    expect(modules.length).toBe(1);
    expect(modules[0].which).toBe(1);
  });
});
