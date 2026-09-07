import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import { savePlayer } from '../game/port/record';
import { BorlandRng, type Rng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** A character file that lives in the test rather than in the roster. */
function characterFile(overrides: Partial<PlayerCharacter> = {}): CharacterFile {
  const pc = { ...newGame().pc, name: 'SHOPPER', hp: 200, maxHp: 200, ...overrides };
  return {
    bytes: savePlayer(pc, newCharacterFile(pc)),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
  };
}

/** Press a key and let the loop get back to waiting for the next one. */
async function press(session: GameSession, key: number): Promise<void> {
  session.press(key);
  await new Promise((resolve) => setTimeout(resolve));
}

/** Type a number a digit at a time and hit Enter, the way typed_name reads one. */
async function type(session: GameSession, amount: string): Promise<void> {
  for (const digit of amount) await press(session, digit.charCodeAt(0));
  await press(session, KEY.enter);
}

/** The town square the given building stands on: 1 store, 2 temple, 3 bank, 4 inn. */
function buildingSquare(building: number): { x: number; y: number } {
  for (let y = 1; y < 100; y++) {
    for (let x = 1; x < 76; x++) {
      if (bundledDungeon.townFeature(x, y, 0) !== building) continue;
      if (bundledDungeon.ladder(x, y, 0, 0) !== 0) continue;
      return { x, y };
    }
  }
  throw new Error(`no building ${building} in the town`);
}

/** A character standing on a building's square, with the loop waiting for its first key. */
function standingOn(
  building: number,
  overrides: Partial<PlayerCharacter> = {},
  rng: Rng = new BorlandRng(3),
): GameSession {
  const file = characterFile({ level: 0, ...buildingSquare(building), ...overrides });
  const session = startGame(file, rng);
  void runMoveControl(session);
  return session;
}

describe('the store', () => {
  it('opens its menu when U is pressed on the square', async () => {
    const session = standingOn(1);
    await press(session, KEY.up);
    expect(session.box[0]).toBe('YOU HAVE ENTERED A STORE');
    expect(session.box).toContain('1) WEAPONS');
  });

  it('takes the price of a weapon and hands it over', async () => {
    const session = standingOn(1, { money: 20 });
    await press(session, KEY.up);
    await press(session, 0x31);
    expect(session.box[0]).toBe('PLEASE SELECT A WEAPON:');
    expect(session.box).toContain('MONEY ON HAND: 20');
    await press(session, 0x32);
    expect(session.game.pc.money).toBe(5);
    expect(session.game.pc.weaponsOwned[2]).toBe(1);
    expect(session.box[0]).toBe('EXCELLENT CHOICE!');
  });

  it('turns a purchase down when the money is short', async () => {
    const session = standingOn(1, { money: 14 });
    await press(session, KEY.up);
    await press(session, 0x31);
    await press(session, 0x32);
    expect(session.game.pc.money).toBe(14);
    expect(session.box[0]).toBe('  WHAT DO YOU THINK WE');
  });

  it('buys as much culture stock as the typed rubles cover', async () => {
    const session = standingOn(1, { money: 100, lev: 1, cultureStock: 0 });
    await press(session, KEY.up);
    await press(session, 0x33);
    expect(session.box[0]).toBe('CULTURE STOCK HELPS KEEP YOU');
    expect(session.box).toContain('PRICE PER UNIT: 3');
    await press(session, KEY.escape);
    await type(session, '30');
    expect(session.game.pc.cultureStock).toBe(10);
    expect(session.game.pc.money).toBe(70);
    expect(session.box).toContain('CULTURE STOCK:   10');
  });

  it('leaves the store on Escape', async () => {
    const session = standingOn(1, { money: 20 });
    await press(session, KEY.up);
    await press(session, KEY.escape);
    expect(session.box).toEqual([]);
    await press(session, KEY.up);
    expect(session.box[0]).toBe('YOU HAVE ENTERED A STORE');
  });
});

describe('the temple', () => {
  it('opens its menu when U is pressed on the square', async () => {
    const session = standingOn(2);
    await press(session, KEY.up);
    expect(session.box[0]).toBe('PLEASE SELECT A SPELL');
    expect(session.box).toContain('3) HEAL ALL WOUNDS.....500 RUBLES');
  });

  it('heals all wounds for five hundred rubles', async () => {
    const session = standingOn(2, { money: 600, hp: 10, maxHp: 200 });
    await press(session, KEY.up);
    await press(session, 0x33);
    expect(session.game.pc.hp).toBe(200);
    expect(session.game.pc.money).toBe(100);
  });

  it('cures poison and disease', async () => {
    const session = standingOn(2, { money: 800, poison: 400, disease: 200 });
    await press(session, KEY.up);
    await press(session, 0x34);
    expect(session.game.pc.poison).toBe(-1);
    await press(session, 0x35);
    expect(session.game.pc.disease).toBe(-1);
  });

  it('will not sell a cure on credit', async () => {
    const session = standingOn(2, { money: 9, hp: 10, maxHp: 200 });
    await press(session, KEY.up);
    await press(session, 0x31);
    expect(session.game.pc.hp).toBe(10);
    expect(session.box[0]).toBe("SORRY, CAN'T BUY ON CREDIT");
  });

  it('leaves the temple on Escape', async () => {
    const session = standingOn(2, { money: 600 });
    await press(session, KEY.up);
    await press(session, KEY.escape);
    expect(session.box).toEqual([]);
  });
});
