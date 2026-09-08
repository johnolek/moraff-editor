import { describe, expect, it } from 'vitest';
import { newGame, type Game } from '../game/port/state';
import { debugMonsterLines } from './debug-screen';
import { engagedMonster } from './panel';
import { AHEAD_VIEW } from './view3d/geometry';

/** A game with one monster standing in slot 3 and the character facing it. */
function facing(): Game {
  const game = newGame({ pc: { level: 6, module: 0, x: 40, y: 50, lev: 20, str: 30, luck: 15 } });
  Object.assign(game.monsters[3], { x: 41, y: 50, hp: 90, type: 0, level: 12 });
  game.engaged = 3;
  game.engagedAhead = 3;
  return game;
}

describe("the monster's numbers over the forward view", () => {
  it('prints nothing when the character faces nothing', () => {
    expect(debugMonsterLines(newGame())).toEqual([]);
  });

  it('prints the level and the hit points the panel prints', () => {
    const game = facing();
    expect(debugMonsterLines(game)[0].text).toBe('LEVEL:12 HP:90');
    expect(engagedMonster(game)!.hp).toBe(90);
  });

  it('prints the chance a swing lands as the panel does, to a tenth of a per cent', () => {
    const game = facing();
    const chance = engagedMonster(game)!.hitChance;
    expect(debugMonsterLines(game)[1].text).toBe(`HIT:${(chance * 100).toFixed(1)}%`);
  });

  it('keeps both lines inside the forward view', () => {
    for (const line of debugMonsterLines(facing())) {
      expect(line.x).toBeGreaterThan(AHEAD_VIEW.left);
      expect(line.y).toBeGreaterThan(AHEAD_VIEW.top);
      expect(line.y).toBeLessThan(AHEAD_VIEW.bottom);
      // Twenty-five units a character in the game's smallest font, which is what font 0 is.
      expect(line.x + line.text.length * 25).toBeLessThan(AHEAD_VIEW.right);
    }
  });
});
