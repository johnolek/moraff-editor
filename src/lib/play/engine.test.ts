import { describe, expect, it } from 'vitest';
import { parseSave } from '../game/dotu-files.js';
import { bundledDungeon } from '../game/dungeon';
import { savePlayer } from '../game/port/record';
import { BorlandRng, type Rng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { UNFORGIVEN_MAP, type MapSquare } from '../map/game';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** A character file that lives in the test rather than in the roster. */
function characterFile(overrides: Partial<PlayerCharacter> = {}): CharacterFile & { dead: boolean } {
  const pc = { ...newGame().pc, name: 'DIGGER', hp: 200, maxHp: 200, ...overrides };
  return {
    bytes: savePlayer(pc, newCharacterFile(pc)),
    dead: false,
    write(bytes) {
      this.bytes = bytes;
    },
    died() {
      this.dead = true;
    },
  };
}

/** A session with the loop running, waiting for its first key. */
function playing(file: CharacterFile, rng: Rng = new BorlandRng(3)): GameSession {
  const session = startGame(file, rng);
  void runMoveControl(session);
  return session;
}

/** A generator that rolls the lowest number it can, so a moment can be checked step by step.
 *  Only a floor the game does not stock can be played with one: the stocking draws squares until
 *  it finds a free one, and every draw from this comes back the same. */
const lowest: Rng = { random: () => 0 };

/** Press a key and let the loop get back to waiting for the next one. */
async function press(session: GameSession, key: number): Promise<void> {
  session.press(key);
  await new Promise((resolve) => setTimeout(resolve));
}

/** Let the loop run without pressing anything, for a turn that starts by itself. */
const settle = () => new Promise((resolve) => setTimeout(resolve));

const floorOf = (level: number, module = 0) => UNFORGIVEN_MAP.floor(level, module);

/** The first square of a floor a test can be run on, by whatever it needs to be. */
function findSquare(
  level: number,
  wanted: (square: MapSquare, x: number, y: number, rows: MapSquare[][]) => boolean,
  module = 0,
): { x: number; y: number } {
  const rows = floorOf(level, module);
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      if (!rows[y][x].solid && wanted(rows[y][x], x, y, rows)) return { x, y };
    }
  }
  throw new Error(`no such square on floor ${level}`);
}

/** A square of the town with nothing on it and a way out to the north. */
const townWalk = () =>
  findSquare(0, (square, x, y) => square.n === 3 && bundledDungeon.ladder(x, y, 0, 0) === 0 && bundledDungeon.townFeature(x, y, 0) === 0 && bundledDungeon.trapdoor(x, y, 0, 0) === -1);

describe('walking', () => {
  it('takes a step the way the character faces', async () => {
    const start = townWalk();
    const file = characterFile({ level: 0, dir: 0, ...start });
    const session = playing(file);
    await press(session, KEY.arrowUp);
    expect(session.view().place).toMatchObject({ x: start.x, y: start.y - 1 });
  });

  it('turns without moving', async () => {
    const start = townWalk();
    const session = playing(characterFile({ level: 0, dir: 0, ...start }));
    await press(session, KEY.arrowLeft);
    expect(session.view().place).toMatchObject({ x: start.x, y: start.y, dir: 2 });
    await press(session, KEY.arrowDown);
    expect(session.view().place.dir).toBe(3);
    await press(session, KEY.arrowRight);
    expect(session.view().place.dir).toBe(1);
  });

  it('says so when the way ahead is a wall', async () => {
    const start = findSquare(0, (square) => square.n === 0 && square.s === 3);
    const session = playing(characterFile({ level: 0, dir: 0, ...start }));
    await press(session, KEY.arrowUp);
    expect(session.box).toContain('THE WALL REFUSES TO MOVE');
    expect(session.view().place).toMatchObject(start);
  });
});

describe('the moment after an action', () => {
  it('walks a monster one square towards the character', async () => {
    // The town has no monsters of its own, so the one put here is the only one that can move.
    const start = findSquare(0, (square, x, y, rows) => square.e === 3 && rows[y][x + 2].w === 3);
    const session = playing(characterFile({ level: 0, dir: 0, ...start }), lowest);
    const monster = session.game.monsters[0];
    monster.x = start.x + 2;
    monster.y = start.y;
    monster.hp = 20;
    session.game.monsterMap[monster.y * 80 + monster.x] = 0;
    await press(session, KEY.enter);
    expect([monster.x, monster.y]).toEqual([start.x + 1, start.y]);
    expect(session.view().monsters[0]).toMatchObject({ x: start.x + 1, y: start.y });
  });

  it('ticks the battle spell timers', async () => {
    const start = townWalk();
    const session = playing(characterFile({ level: 0, ...start, strengthTimer: 4 }));
    await press(session, KEY.enter);
    expect(session.game.pc.strengthTimer).toBe(3);
  });

  it('engages the monster the character is facing', async () => {
    const start = findSquare(3, (square) => square.n === 3);
    const session = playing(characterFile({ level: 3, dir: 0, ...start }));
    expect(session.view().engaged).toBeNull();
    const monster = session.game.monsters[0];
    session.game.monsterMap[monster.y * 80 + monster.x] = 0xff;
    monster.x = start.x;
    monster.y = start.y - 1;
    session.game.monsterMap[monster.y * 80 + monster.x] = 0;
    await press(session, KEY.escape);
    expect(session.view().engaged?.slot).toBe(0);
    expect(session.view().banner[0]).toContain('YOU ARE FIGHTING A LEVEL');
  });
});

describe('changing floors', () => {
  it('goes down the ladder the square holds', async () => {
    const ladder = findSquare(2, (square) => square.ladder > 0);
    const depth = bundledDungeon.ladder(ladder.x, ladder.y, 2, 0);
    const session = playing(characterFile({ level: 2, ...ladder }));
    await press(session, KEY.down);
    expect(session.view().place.floor).toBe(2 + depth);
    // The ladder is a ladder from both ends, so the landing square offers the way back up.
    expect(session.view().prompt).toEqual(["HIT 'U'", 'TO GO UP']);
  });

  it('climbs the ladder back up', async () => {
    const ladder = findSquare(4, (square) => square.ladder < 0);
    const rise = bundledDungeon.ladder(ladder.x, ladder.y, 4, 0);
    const session = playing(characterFile({ level: 4, ...ladder }));
    expect(session.view().prompt).toEqual(["HIT 'U'", 'TO GO UP']);
    await press(session, KEY.up);
    expect(session.view().place.floor).toBe(4 + rise);
  });

  it('says there is no ladder on a square without one', async () => {
    const start = findSquare(3, (square) => square.ladder === 0 && square.chute === 0 && square.trapdoor === -1);
    const session = playing(characterFile({ level: 3, ...start }));
    await press(session, KEY.up);
    expect(session.box[0]).toContain('THERE IS NO LADDER HERE');
  });

  it('falls down a chute the moment the character stands on one', async () => {
    const chute = findSquare(3, (square) => square.chute !== 0 && square.ladder === 0 && square.trapdoor === -1);
    const landing = bundledDungeon.chute(chute.x, chute.y, 3, 0);
    const session = playing(characterFile({ level: 3, ...chute }));
    await settle();
    expect(session.box).toContain('YOU HAVE FALLEN DOWN A CHUTE!');
    await press(session, KEY.escape);
    expect(session.view().place).toMatchObject({ floor: landing, x: chute.x, y: chute.y });
  });

  it('goes through a trap door to the square every one of them lands on', async () => {
    const door = findSquare(3, (square) => square.trapdoor >= 0 && square.ladder === 0);
    const destination = bundledDungeon.trapdoor(door.x, door.y, 3, 0);
    const keys = Array.from({ length: 36 }, () => 0);
    keys[Math.trunc(destination / 5)] = 1;
    const session = playing(characterFile({ level: 3, ...door, keys }));
    expect(session.box[0]).toBe('  YOU HAVE FOUND A TRAP DOOR');
    await press(session, KEY.trapDoor);
    const [x, y] = bundledDungeon.trapdoorDest(destination, 0);
    expect(session.view().place).toMatchObject({ floor: destination, x, y });
  });

  it('keeps the trap door shut without its key', async () => {
    const door = findSquare(3, (square) => square.trapdoor >= 0 && square.ladder === 0);
    const session = playing(characterFile({ level: 3, ...door }));
    expect(session.box).toContain('NOT HAVE THE CORRECT KEY.');
    await press(session, KEY.trapDoor);
    expect(session.box[0]).toBe("I DON'T SEE ANY TRAP");
    expect(session.view().place.floor).toBe(3);
  });

  it('walks into a module teleporter and comes out in the next module’s town', async () => {
    const teleporter = findSquare(1, (square) => square.e === 4 && square.ladder === 0 && square.trapdoor === -1 && square.chute === 0);
    const file = characterFile({ level: 1, dir: 3, ...teleporter });
    const session = playing(file);
    await press(session, KEY.arrowUp);
    expect(session.box[0]).toBe('YOU HAVE BEEN DETACHED FROM');
    await press(session, KEY.escape);
    expect(session.view().place.module).toBe(1);
    expect(session.view().place.floor).toBe(0);
    // change_module saves the character where it drops them, before movecontrol loads the town.
    expect(parseSave(file.bytes).module).toBe(1);
  });

  it('digs through the floor to whatever is under it', async () => {
    const start = findSquare(3, (square) => square.ladder === 0 && square.chute === 0 && square.trapdoor === -1);
    const session = playing(characterFile({ level: 3, ...start, cls: 3 }));
    await press(session, KEY.dig);
    expect(session.box[0]).toBe('DO YOU WISH TO DIG A HOLE');
    await press(session, 0x31);
    // The dig either goes through or a monster reaches the character first.
    const view = session.view();
    expect(view.place.floor > 3 || session.box.includes('A MONSTER WANTS TO HELP')).toBe(true);
  });
});

describe('saving', () => {
  it('writes the position the save editor reads back', async () => {
    const start = townWalk();
    const file = characterFile({ level: 0, dir: 0, ...start });
    const session = playing(file);
    await press(session, KEY.arrowUp);
    await press(session, KEY.quit);
    await press(session, KEY.escape);
    expect(session.view().over).toBe(true);
    const saved = parseSave(file.bytes);
    expect([saved.x, saved.y, saved.level]).toEqual([start.x, start.y - 1, 0]);
    expect(saved.checksumOk).toBe(true);
    expect(saved.name).toBe('DIGGER');
  });

  it('saves where a chute dropped the character', async () => {
    const chute = findSquare(3, (square) => square.chute !== 0 && square.ladder === 0 && square.trapdoor === -1);
    const landing = bundledDungeon.chute(chute.x, chute.y, 3, 0);
    const file = characterFile({ level: 3, ...chute });
    const session = playing(file);
    await settle();
    await press(session, KEY.escape);
    expect(parseSave(file.bytes).level).toBe(landing);
  });
});

describe('the message box', () => {
  it('replaces the box before it and wipes the menu column it is drawn down', async () => {
    const session = playing(characterFile({ level: 0, ...townWalk() }));
    await settle();
    const game = session.game;
    game.draw({ text: 'A MENU LINE', x: 0x3a2, y: 0x329, font: 0, colour: 6 });
    game.say('FIRST BOX');
    expect(game.screen.some((line) => line.text === 'A MENU LINE')).toBe(false);
    game.say('SECOND BOX');
    expect(session.box).toEqual(['SECOND BOX']);
  });
});

describe('dying', () => {
  it('marks the character dead and leaves the file alone', async () => {
    const start = townWalk();
    const file = characterFile({ level: 0, hp: -1, ...start });
    const before = file.bytes;
    const session = playing(file);
    await settle();
    // The snake says where the character has gone and adds one of its five parting shots.
    expect(session.box.some((line) => line.startsWith("I THINK YOU'RE"))).toBe(true);
    await press(session, KEY.escape);
    expect(file.dead).toBe(true);
    expect(session.view().dead).toBe(true);
    expect(session.view().over).toBe(true);
    expect(file.bytes).toBe(before);
  });
});
