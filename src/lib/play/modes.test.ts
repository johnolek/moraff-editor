import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BorlandRng } from '../game/port/rng';
import { onAFloorFacingAMonster, press } from './battle.test-support';
import { KEY } from './keys';
import { monstersDrawn, panelVisible } from './mode';

/**
 * What each mode shows of Dungeons of the Unforgiven, against a real view of a stocked floor.
 * The tab has no props to render it with — it plays whichever character is on the roster — so
 * what is checked here is what it asks of `mode.ts` and the view it asks with.
 */

const source = readFileSync('src/lib/play/Play.svelte', 'utf8');

/** A character on a stocked floor with a monster in front of them, engaged: the loop meets it in
 *  attack_timing on the pass a key starts, and Escape runs no handler of its own. */
async function facingOneOfMany() {
  const session = onAFloorFacingAMonster(new BorlandRng(7), 3);
  await press(session, KEY.escape);
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
