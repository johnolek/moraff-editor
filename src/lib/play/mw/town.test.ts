import { describe, expect, it } from 'vitest';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_KEY } from './keys';

/** A square of the town holding one of the five things floor 0 can hold. */
const surface = (feature: number) => findMwSquare(0, (square) => square.surface === feature);

describe('the store', () => {
  it('sells a weapon and takes the price out of the pocket', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, money: 500, ...surface(1) }));
    await pressMw(session, MW_KEY.up);
    expect(session.box).toContain('WHAT WOULD YOU LIKE TO BUY?');
    await pressMw(session, 0x31);
    // The money line and then the shelf.
    await pressMw(session, MW_KEY.escape);
    expect(session.box).toContain('2) CLUB..........15 JP');
    await pressMw(session, 0x32);
    expect(session.game.pc.weaponsOwned[2]).toBe(1);
    expect(session.game.pc.money).toBe(485);
  });

  it('leaves without buying when the third line is picked', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, money: 500, ...surface(1) }));
    await pressMw(session, MW_KEY.up);
    await pressMw(session, 0x33);
    expect(session.game.pc.money).toBe(500);
    expect(session.box).toEqual([]);
  });
});

describe('the temple', () => {
  it('heals the wounds it is paid for', async () => {
    const session = playingMw(
      mwCharacterFile({ floor: 0, money: 100, hp: 10, maxHp: 200, ...surface(2) }),
    );
    await pressMw(session, MW_KEY.up);
    // The money on hand, and then the menu.
    expect(session.box).toEqual(['MONEY ON HAND: 100']);
    await pressMw(session, MW_KEY.escape);
    expect(session.box).toContain('1) CURE WOUNDS..........30 JP');
    await pressMw(session, 0x31);
    expect(session.game.pc.money).toBe(70);
    expect(session.game.pc.hp).toBeGreaterThan(10);
  });
});

describe('the inn', () => {
  it('takes ten jewels for the night and fills the spell points back up', async () => {
    const session = playingMw(
      mwCharacterFile({ floor: 0, money: 40, sp: 1, maxSp: 30, ...surface(4) }),
    );
    await pressMw(session, MW_KEY.up);
    // The sign, then the question.
    await pressMw(session, MW_KEY.escape);
    expect(session.box).toContain('1) STAY FOR THE NIGHT');
    await pressMw(session, 0x31);
    expect(session.game.pc.money).toBe(30);
    expect(session.game.pc.sp).toBe(30);
  });
});

describe('the bank', () => {
  /** The bank, with a deposit chosen and the two boxes in front of the amount answered. */
  async function askingForADeposit() {
    const session = playingMw(mwCharacterFile({ floor: 0, money: 500, bank: 0, ...surface(3) }));
    await pressMw(session, MW_KEY.up);
    expect(session.box).toContain('2) DEPOSIT MONEY');
    await pressMw(session, 0x32);
    expect(session.box).toContain('PLEASE TYPE THE AMOUNT');
    await pressMw(session, 0x20);
    await pressMw(session, 0x20);
    return session;
  }

  it('takes the amount typed when Escape ends it, the way Enter does', async () => {
    const session = await askingForADeposit();
    for (const digit of [0x31, 0x30, 0x30]) await pressMw(session, digit);
    // read_string only looks at Escape once something has been typed, and takes what is there.
    await pressMw(session, MW_KEY.escape);
    expect(session.game.pc.bank).toBe(100);
    expect(session.game.pc.money).toBe(400);
  });

  it('ignores an Escape typed before the first digit', async () => {
    const session = await askingForADeposit();
    await pressMw(session, MW_KEY.escape);
    await pressMw(session, 0x37);
    await pressMw(session, 0x0d);
    expect(session.game.pc.bank).toBe(7);
  });
});

describe('the gate out to the world map', () => {
  /** The last gate square of dungeon 0's town, which is where its own world map drops you. */
  const DUNGEON_0_GATE = { x: 74, y: 74 };

  it('walks out onto the gate square the world map drops you on', async () => {
    const start = surface(5);
    const session = playingMw(mwCharacterFile({ floor: 0, ...start }));
    await pressMw(session, MW_KEY.up);
    expect(session.box).toContain('1) EXPLORE THE WILDERNESS');
    await pressMw(session, 0x31);
    // The scan keeps the last gate square of the floor rather than the first, so it is not the
    // one the character was standing on to use the gate.
    expect(start).not.toEqual(DUNGEON_0_GATE);
    expect(session.view().place).toMatchObject({ ...DUNGEON_0_GATE, floor: 0, dungeon: 0 });
  });

  it('arrives on floor 0 the way enter_level does', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, ...surface(5) }));
    const before = session.game.monsters;
    const remembered = [...session.floors.remembered];
    await pressMw(session, MW_KEY.up);
    await pressMw(session, 0x31);
    // generate_section rotates its three monster tables and puts a fresh, empty floor 0 in play.
    expect(session.game.monsters).not.toBe(before);
    expect(session.floors.remembered).toEqual([0, remembered[0], remembered[1]]);
  });
});
