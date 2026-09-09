import { describe, expect, it } from 'vitest';
import { revLeaveTheFight } from './fight';
import { revDrawTheDungeonAgain } from './screens';
import { revCharacter, revTestGame } from './spells.test-support';
import type { RevGame } from './state';

/** A game whose views have already been drawn from where the character is standing. */
function drawnAlready(fields: Parameters<typeof revCharacter>[0] = {}): RevGame {
  const { game } = revTestGame(revCharacter({ column: 7, row: 3, dungeonLevel: 10, facing: 1, ...fields }));
  revDrawTheDungeonAgain(game, 'afterAPass');
  return game;
}

describe('the number the dungeon redraw leaves in the scratch cell', () => {
  it('is zero when a screen is given back on the level already drawn (1000:5965)', () => {
    const game = drawnAlready();
    game.scratch = 99;
    revDrawTheDungeonAgain(game, 'afterAScreen');
    expect(game.scratch).toBe(0);
  });

  it('is how far the character has turned since the views were drawn (1000:581C)', () => {
    const game = drawnAlready({ facing: 1 });
    game.scratch = 99;
    game.pc.facing = 2;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.scratch).toBe(3);
  });

  it('counts the turn from the drawing rather than from the turn before it', () => {
    const game = drawnAlready({ facing: 1 });
    game.pc.facing = 2;
    revDrawTheDungeonAgain(game, 'afterAPass');
    game.pc.facing = 3;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.scratch).toBe(2);
  });

  it('is zero for a pass that neither moved nor turned', () => {
    const game = drawnAlready();
    game.scratch = 99;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.scratch).toBe(0);
  });

  it('is left alone when the character has moved, since the views are scanned again', () => {
    const game = drawnAlready();
    game.scratch = 99;
    game.pc.column = 8;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.scratch).toBe(99);
  });

  it('is left alone when a screen is given back on a level that has changed', () => {
    const game = drawnAlready();
    game.scratch = 99;
    game.pc.dungeonLevel = 11;
    revDrawTheDungeonAgain(game, 'afterAScreen');
    expect(game.scratch).toBe(99);
  });
});

describe('the place the redraw remembers drawing the views from', () => {
  it('is where the character was standing when it drew them', () => {
    const game = drawnAlready();
    game.pc.column = 8;
    game.pc.facing = 4;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.lastDrawn).toEqual({ level: 10, column: 8, row: 3, facing: 4 });
  });

  it('is not touched by a redraw that only moved the arrows', () => {
    const game = drawnAlready({ facing: 1 });
    game.pc.facing = 2;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.lastDrawn).toEqual({ level: 10, column: 7, row: 3, facing: 1 });
  });

  it('forgets the level when a fight is left, so the next redraw scans again (1000:8FD2)', () => {
    const game = drawnAlready();
    game.fight = {
      slot: 0,
      name: 1,
      monsterLevel: 3,
      hitPoints: 0,
      kind: 1,
      kindAdjust: 0,
      attackBonus: 0,
      experience: 10,
    };
    revLeaveTheFight(game);
    game.scratch = 99;
    revDrawTheDungeonAgain(game, 'afterAPass');
    expect(game.scratch).toBe(99);
    expect(game.lastDrawn.level).toBe(10);
  });
});
