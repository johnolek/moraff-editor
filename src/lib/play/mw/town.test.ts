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

describe('the gate out to the world map', () => {
  it('says the wilderness is not built', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, ...surface(5) }));
    await pressMw(session, MW_KEY.up);
    expect(session.box).toContain('1) EXPLORE THE WILDERNESS');
    await pressMw(session, 0x31);
    expect(session.box).toEqual([
      'NOT BUILT YET: WALK OUT ONTO THE WORLD MAP AND FIND ANOTHER DUNGEON',
    ]);
  });
});
