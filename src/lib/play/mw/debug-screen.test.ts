import { describe, expect, it } from 'vitest';
import { MW_MONSTER_VIEW_CORNERS } from '../../game/mw-port/screens';
import { MW_VIEWS, MW_VIEW_NORTH } from './view3d/screen';
import { mwDebugMonsterLines } from './debug-screen';
import { mwEngagedMonster } from './panel';
import { BorlandRng } from '../../game/port/rng';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_SQUARE_EMPTY, mwSetOccupant } from '../../game/mw-port/state';
import type { MwGameSession } from './engine';
import { MW_KEY } from './keys';

/** Move the floor's first monster onto the square the character is facing. */
function standInFront(session: MwGameSession): void {
  const pc = session.game.pc;
  const planted = session.game.monsters[0];
  mwSetOccupant(session.game, planted.x, planted.y, MW_SQUARE_EMPTY);
  planted.x = pc.x;
  planted.y = pc.y - 1;
  mwSetOccupant(session.game, planted.x, planted.y, 0);
}

/** A character fighting one of the floor's monsters, which is what puts numbers over a view. */
async function fighting(): Promise<MwGameSession> {
  const start = findMwSquare(3, (square) => square.n === 3 && square.ladder === 0);
  const session = playingMw(mwCharacterFile({ floor: 3, dir: 0, ...start }), new BorlandRng(7), standInFront);
  await pressMw(session, MW_KEY.escape);
  expect(session.game.engaged).not.toBe(-1);
  return session;
}

describe('the chance debug mode adds over the monster', () => {
  it('prints nothing while nothing is being fought', async () => {
    const session = await fighting();
    session.game.engaged = -1;
    expect(mwDebugMonsterLines(session.game, MW_MONSTER_VIEW_CORNERS.north)).toEqual([]);
  });

  it("prints the panel's own chance, to a tenth of a per cent", async () => {
    const session = await fighting();
    const chance = mwEngagedMonster(session.game)!.hitChance;
    const [line] = mwDebugMonsterLines(session.game, MW_MONSTER_VIEW_CORNERS.north);
    expect(line.text).toBe(`HIT:${(chance * 100).toFixed(1)}%`);
  });

  it('puts it under the hit points, inside the view the monster stands in', async () => {
    const session = await fighting();
    const [line] = mwDebugMonsterLines(session.game, MW_MONSTER_VIEW_CORNERS.north);
    const view = MW_VIEWS[MW_VIEW_NORTH];
    expect(line.y).toBeGreaterThan(MW_MONSTER_VIEW_CORNERS.north.hpY);
    expect(line.x).toBeGreaterThan(view.left);
    expect(line.x).toBeLessThan(view.right);
    expect(line.y).toBeLessThan(view.bottom);
  });
});
