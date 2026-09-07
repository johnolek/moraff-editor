import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { inTheTown, press, settle } from './battle.test-support';
import { KEY } from './keys';

/** A generator that rolls the lowest number it can; nothing in these keys rolls for anything. */
const lowest: Rng = { random: () => 0 };

describe('the I key', () => {
  it('drinks a potion of healing off the magic menu', async () => {
    const session = inTheTown(lowest, { healingPotions: 2, hp: 5, maxHp: 300 });
    await settle();
    await press(session, KEY.useItem);
    expect(session.box[0]).toBe('WHICH TYPE OF ITEM?');
    expect(session.view().screen.map((line) => line.text)).toContain('USE MAGIC MENU:');
    await press(session, 0x35);
    expect(session.box[0]).toBe('HIT A KEY (1-6):');
    await press(session, 0x32);
    expect(session.game.pc.hp).toBe(300);
    expect(session.game.pc.healingPotions).toBe(1);
    expect(session.view().screen).toEqual([]);
  });

  it('casts out of the scrolls when the first line is picked', async () => {
    const session = inTheTown(lowest);
    await settle();
    await press(session, KEY.useItem);
    await press(session, 0x31);
    expect(session.box.join('\n')).not.toContain('NOT BUILT YET');
  });
});

describe('the L key', () => {
  it('drops one of the suits of armor the character owns', async () => {
    const session = inTheTown(lowest, { armorOwned: [1, 0, 2, 0, 0, 0, 0, 0], armor: 2 });
    await settle();
    await press(session, KEY.loseItem);
    expect(session.box[0]).toBe('WHICH TYPE OF ITEM WOULD YOU');
    await press(session, 0x31);
    expect(session.box).toContain('CHAIN');
    await press(session, 0x33);
    expect(session.game.pc.armorOwned[2]).toBe(1);
    expect(session.game.pc.armor).toBe(2);
  });

  it('will not let the character drop their own skin', async () => {
    const session = inTheTown(lowest);
    await settle();
    await press(session, KEY.loseItem);
    await press(session, 0x31);
    await press(session, 0x31);
    expect(session.box).toContain("OWE! IT JUST WON'T COME OFF!");
    expect(session.game.pc.armorOwned[0]).toBe(1);
  });
});
