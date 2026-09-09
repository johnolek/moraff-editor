import { describe, expect, it } from 'vitest';
import { revKillMonster, YOU_KILLED_IT } from './kill';
import { GRID_STRIDE } from './monsters';
import type { RevFight, RevGame } from './state';
import { revCharacter, revRolls, revTestGame } from './spells.test-support';

/** A game with a monster in front of the character, dead but for the kill (1000:A335). */
function aboutToDie(fields: Partial<RevFight> = {}): RevGame {
  const pc = revCharacter({ column: 7, row: 3, dungeonLevel: 10 });
  const { game } = revTestGame(pc, revRolls([]));
  game.monsters.grid[GRID_STRIDE * pc.row + pc.column] = 4;
  game.fight = {
    slot: 4,
    name: 6,
    monsterLevel: 10,
    hitPoints: 0,
    kind: 1,
    kindAdjust: 0,
    attackBonus: 0,
    experience: 100,
    ...fields,
  };
  return game;
}

describe('the screen a kill leaves up', () => {
  it('leaves the dead monster in the box between the views', () => {
    const game = aboutToDie();
    revKillMonster(game);
    expect(game.monsters.slotOn(7, 3)).toBe(0);
    expect(game.kept.picture).toEqual({ name: 6, level: 10 });
  });

  it('prints YOU KILLED IT!! across it, where the game prints it', () => {
    const game = aboutToDie();
    revKillMonster(game);
    expect(game.kept.runs()).toContainEqual({ row: 16, column: 24, text: YOU_KILLED_IT });
  });

  it("says nothing when `Go Away!' sent the monster off, and keeps the picture anyway", () => {
    const game = aboutToDie();
    game.monsterLeft = true;
    revKillMonster(game);
    expect(game.kept.runs()).toEqual([]);
    expect(game.kept.picture).toEqual({ name: 6, level: 10 });
  });
});
