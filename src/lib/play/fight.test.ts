import { describe, expect, it } from 'vitest';
import { BorlandRng, type Rng } from '../game/port/rng';
import { facingAMonster, inTheTown, onAFloorFacingAMonster, press, settle } from './battle.test-support';
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

describe('keeping the swings up with Ctrl-F', () => {
  it('swings until the monster is dead without another key', async () => {
    const session = await facingAMonster(highest, { cls: 2 }, { hp: 400 });
    const monster = session.game.monsters[0];
    await press(session, KEY.repeatFight);
    expect(session.repeatFight).toBe(true);
    for (let waited = 0; waited < 200 && session.repeatFight; waited++) await settle();
    expect(monster.hp).toBe(0);
    expect(session.view().box.map((line) => line.text)).toContain('YOU KILLED IT!');
    expect(session.repeatFight).toBe(false);
  });

  it('stops the moment the player touches a key', async () => {
    const session = await facingAMonster(highest, { cls: 2 }, { hp: 100000 });
    await press(session, KEY.repeatFight);
    await settle();
    session.press(KEY.escape);
    await settle();
    await settle();
    expect(session.repeatFight).toBe(false);
    expect(session.game.monsters[0].hp).toBeGreaterThan(0);
  });
});

describe('dying in a fight', () => {
  it('ends the game once the monster fighting back has taken the last hit point', async () => {
    // A stocked floor needs a generator that answers differently each time it is asked, since
    // the stocking draws squares until it finds a free one.
    const session = onAFloorFacingAMonster(new BorlandRng(7), 3, { hp: 1, maxHp: 1, lev: 0, str: 1 });
    await settle();
    for (let swing = 0; swing < 60 && !session.view().over; swing++) {
      // The monster's timer has run out, so the seconds the swing costs buy it an attack.
      session.game.monsterTimers[0] = -1;
      await press(session, KEY.fight);
    }
    expect(session.game.pc.hp).toBe(-100);
    expect(session.view().dead).toBe(true);
    expect(session.view().over).toBe(true);
  });
});
