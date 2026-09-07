import { describe, expect, it } from 'vitest';
import { expValue } from '../game/port/combat';
import { GARBAGE_CAN } from '../game/port/kills';
import { WEAPON_NAMES } from '../game/port/drops';
import type { Rng } from '../game/port/rng';
import { facingAMonster, press, TAKE, LEAVE } from './battle.test-support';

/** A generator that rolls the lowest number it can, which is what makes every drop land. */
const lowest: Rng = { random: () => 0 };

describe('killing the monster being fought', () => {
  it('hands over the experience and parks the slot in the garbage can', async () => {
    const session = await facingAMonster(lowest, { cls: 2 });
    const game = session.game;
    const monster = game.monsters[0];
    const worth = expValue(game, 0);
    const before = game.pc.exp;
    monster.hp = 0;
    // A monk is refused every drop, so the kill asks nothing and finishes on this one key.
    await press(session, 0x1b);
    expect(game.pc.exp).toBe(before + worth);
    expect(session.box).toContain('YOU KILLED IT!');
    expect([monster.x, monster.y]).toEqual([GARBAGE_CAN, GARBAGE_CAN]);
    expect(session.view().engaged).toBeNull();
    expect(session.view().monsters).toEqual([]);
  });

  it('offers what the monster dropped and takes what the player says to take', async () => {
    const session = await facingAMonster(lowest, { cls: 0 });
    const game = session.game;
    game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toContain(`YOU FIND A ${WEAPON_NAMES[1]}`);
    expect(session.box).toContain('1) TAKE THE WEAPON');
    await press(session, TAKE);
    expect(game.pc.weaponsOwned[1]).toBe(1);
    expect(session.box).toContain('1) TAKE THE ARMOR');
    await press(session, LEAVE);
    expect(game.pc.armorOwned[1]).toBe(0);
    expect(session.view().engaged).toBeNull();
  });

  it('sends a level 0 character who has earned a level to an inn', async () => {
    const session = await facingAMonster(lowest, { cls: 2, lev: 0, exp: 1000000 });
    session.game.monsters[0].hp = 0;
    await press(session, 0x1b);
    expect(session.box).toContain('GOOD NEWS!');
    expect(session.box).toContain('LEVEL! GO TO THE TOWN, FIND');
  });
});
