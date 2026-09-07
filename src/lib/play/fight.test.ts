import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { facingAMonster, inTheTown, press, settle } from './battle.test-support';
import { KEY } from './keys';

/** A generator that rolls as high as it can, so a swing always lands. */
const highest: Rng = { random: (n) => (n > 0 ? n - 1 : 0) };

/** A generator that rolls the lowest number it can, so nothing a swing rolls for lands. */
const lowest: Rng = { random: () => 0 };

describe('swinging at a monster', () => {
  it('takes the damage off the monster and spends the time the swing cost', async () => {
    const session = await facingAMonster(highest);
    const monster = session.game.monsters[0];
    const before = { hp: monster.hp, seconds: session.view().seconds };
    await press(session, KEY.fight);
    expect(monster.hp).toBeLessThan(before.hp);
    expect(session.box).toContain('YOU HIT THE MONSTER!!!');
    expect(session.box).toContain(`IT HAS ${monster.hp} HEALTH POINTS LEFT`);
    // The weapon in hand costs its own time, and a fifth of the agility the character is short
    // of 85 is spent on top of it.
    const pc = session.game.pc;
    const cost = session.game.weaponTime[pc.weapon] + Math.trunc((85 - pc.dex) / 5);
    expect(session.view().seconds).toBe(before.seconds + cost);
  });

  it('says nothing was hit when the swing misses', async () => {
    const session = await facingAMonster(lowest);
    const monster = session.game.monsters[0];
    await press(session, KEY.fight);
    expect(session.box).toContain('YOU MISSED THE MONSTER');
    expect(monster.hp).toBe(50);
  });

  it('sends the character to find a monster when there is nothing in front of them', async () => {
    const session = inTheTown(lowest);
    await settle();
    await press(session, KEY.fight);
    expect(session.box[0]).toBe('YOU MUST BE STANDING NEXT TO A');
    expect(session.view().engaged).toBeNull();
  });
});
