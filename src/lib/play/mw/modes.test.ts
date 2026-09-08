import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MW_SQUARE_EMPTY, mwSetOccupant } from '../../game/mw-port/state';
import { BorlandRng } from '../../game/port/rng';
import { monstersDrawn, panelVisible } from '../mode';
import type { MwGameSession } from './engine';
import { findMwSquare, mwCharacterFile, playingMw, pressMw } from './engine.test';
import { MW_KEY } from './keys';

/**
 * What each mode shows of Moraff's World, against a real view of a stocked floor. The tab has no
 * props to render it with — it plays whichever character is on the roster — so what is checked
 * here is what it asks of `mode.ts` and the view it asks with.
 */

const source = readFileSync('src/lib/play/mw/MwPlay.svelte', 'utf8');

/** Move the floor's first monster onto the square the character is facing. */
function standInFront(session: MwGameSession): void {
  const pc = session.game.pc;
  const planted = session.game.monsters[0];
  mwSetOccupant(session.game, planted.x, planted.y, MW_SQUARE_EMPTY);
  planted.x = pc.x;
  planted.y = pc.y - 1;
  mwSetOccupant(session.game, planted.x, planted.y, 0);
}

/** A character on a stocked floor fighting one of its monsters: attack_timing takes the monster
 *  up on the pass a key starts, and Escape runs no handler of its own. */
async function facingOneOfMany() {
  const start = findMwSquare(3, (square) => square.n === 3 && square.ladder === 0);
  const session = playingMw(
    mwCharacterFile({ floor: 3, dir: 0, ...start }),
    new BorlandRng(7),
    standInFront,
  );
  await pressMw(session, MW_KEY.escape);
  const view = session.view();
  expect(view.engaged).not.toBeNull();
  expect(view.monsters.length).toBeGreaterThan(1);
  return view;
}

describe('the monsters the map draws', () => {
  it('is the one being fought alone in faithful, and the whole floor otherwise', async () => {
    const view = await facingOneOfMany();
    expect(monstersDrawn('faithful', view)).toEqual([view.engaged]);
    expect(monstersDrawn('speedrun', view)).toEqual(view.monsters);
    expect(monstersDrawn('debug', view)).toEqual(view.monsters);
  });

  it('is what the tab hands the map', () => {
    expect(source).toContain('monsters={monstersDrawn(mode, view)}');
  });
});

describe('the panel of numbers the game never prints', () => {
  it('is absent in faithful and in speedrun, and present in debug', () => {
    expect(panelVisible('faithful')).toBe(false);
    expect(panelVisible('speedrun')).toBe(false);
    expect(panelVisible('debug')).toBe(true);
  });

  it('is what the tab puts the panel behind', () => {
    expect(source).toContain('{#if panelVisible(mode)}');
  });
});
