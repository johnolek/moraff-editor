import { describe, expect, it } from 'vitest';
import { MONSTERS } from '../../mw-bestiary/monsters';
import type { MwStockedMonster } from '../../game/mw-port/stocking';
import { mwSetOccupant } from '../../game/mw-port/state';
import type { Rng } from '../../game/port/rng';
import type { MwGameSession } from './engine';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_KEY } from './keys';

/** An Rng whose every roll comes out as high as it can, so a swing lands and does damage. */
const highest: Rng = { random: (n) => (n > 1 ? n - 1 : 0) };

/** A square of the town with open air to the north, and the square north of it. */
const facingNorth = () => findMwSquare(0, (square) => square.n === 3 && square.ladder === 0);

/** Put a monster on the square the character faces, which is the town's floor 0, so nothing
 *  else is standing on it. */
function standInFront(monster: Partial<MwStockedMonster> = {}): (session: MwGameSession) => void {
  return (session) => {
    const pc = session.game.pc;
    const placed: MwStockedMonster = { x: pc.x, y: pc.y - 1, hp: 40, type: 1, depth: 3, ...monster };
    Object.assign(session.game.monsters[0], placed);
    mwSetOccupant(session.game, placed.x, placed.y, 0);
  };
}

describe('the F key', () => {
  it('takes hit points off the monster in front of the character', async () => {
    const session = playingMw(
      mwCharacterFile({ floor: 0, dir: 0, weapon: 6, str: 80, luck: 80, lev: 40, ...facingNorth() }),
      highest,
      standInFront({ hp: 4000 }),
    );
    await pressMw(session, MW_KEY.fight);
    expect(session.game.monsters[0].hp).toBeLessThan(4000);
    expect(session.banner.join('\n')).toContain('YOU HIT! THE MONSTER IN THE');
  });

  it('kills the monster once its hit points have run out', async () => {
    const session = playingMw(
      mwCharacterFile({ floor: 0, dir: 0, weapon: 6, str: 80, luck: 80, lev: 40, ...facingNorth() }),
      highest,
      standInFront({ hp: 1 }),
    );
    const worth = MONSTERS[1].expMult;
    expect(worth).toBeGreaterThan(0);
    await pressMw(session, MW_KEY.fight);
    expect(session.game.monsters[0].hp).toBe(0);
    expect(session.game.engaged).toBe(-1);
    expect(session.game.pc.exp).toBeGreaterThan(0);
    expect(session.game.messages).toContain('YOU KILLED IT!');
  });

  it('says nothing at all with nothing to fight', async () => {
    const session = playingMw(mwCharacterFile({ floor: 0, dir: 0, ...facingNorth() }));
    await pressMw(session, MW_KEY.fight);
    expect(session.box).toEqual([]);
  });
});
