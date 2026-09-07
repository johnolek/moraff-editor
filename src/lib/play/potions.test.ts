import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

const lowest: Rng = { random: () => 0 };

/** The I key's own menu, then its fourth line, which is the potions. */
const openThePotionMenu = async (session: Awaited<ReturnType<typeof inTheTown>>) => {
  await press(session, KEY.useItem);
  await press(session, 0x34);
};

describe('the potions', () => {
  it('raises one statistic by six and drops another by three', async () => {
    const session = inTheTown(lowest, { potions: [0, 2, 0, 0, 0, 0], iq: 40, dex: 30 });
    const pc = session.game.pc;
    await openThePotionMenu(session);
    expect(session.box).toContain('1) GREEN POTION');
    await press(session, 0x31);
    expect(pc.potions[1]).toBe(1);
    expect(pc.iq).toBe(46);
    expect(pc.dex).toBe(27);
    expect(session.box).toContain('YOUR INTELLIGENCE HAS BEEN');
  });

  it('takes the white potion out of the sixth line and moves the same pair the other way', async () => {
    const session = inTheTown(lowest, { potions: [0, 0, 0, 0, 3, 0], iq: 40, dex: 30 });
    const pc = session.game.pc;
    await openThePotionMenu(session);
    await press(session, 0x36);
    expect(pc.potions[4]).toBe(2);
    expect(pc.dex).toBe(36);
    expect(pc.iq).toBe(37);
  });

  it('says where to find one when the character has none of that colour', async () => {
    const session = inTheTown(lowest, { potions: [0, 0, 0, 0, 0, 0], str: 50, luck: 20 });
    const pc = session.game.pc;
    await openThePotionMenu(session);
    await press(session, 0x32);
    expect(pc.str).toBe(50);
    expect(pc.luck).toBe(20);
    expect(session.box).toContain('KILLING A SKELETON, ZOMBIE,');
  });

  it('drinks nothing on escape', async () => {
    const session = inTheTown(lowest, { potions: [1, 1, 1, 1, 1, 1], con: 25 });
    await openThePotionMenu(session);
    await press(session, KEY.escape);
    expect(session.game.pc.potions).toEqual([1, 1, 1, 1, 1, 1]);
    expect(session.game.pc.con).toBe(25);
  });
});
