import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../../game/port/rng';
import { newRevGame, type RevGame } from '../state';
import { revMeetMonster, revSwingTarget } from '../fight';
import type { RevPc } from '../record';
import { drawRevDebug, revDebugLines, REV_DEBUG_ROW } from './debug';
import { newFrame } from '../../view3d/frame';
import { CELL } from './font';
import { TEXT } from './colours';

function character(fields: Partial<RevPc> = {}): RevPc {
  return {
    values: new Array<number>(340).fill(0),
    stats: [20, 10, 10, 15, 12, 14],
    fromStrength: 9,
    fromHealth: 6,
    fromAgility: 0,
    cls: 1,
    experience: 0,
    level: 0,
    maxHp: 22,
    hp: 22,
    rings: 0,
    weight: 150,
    treasure: 0,
    money: 16,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
    ...fields,
  };
}

function fighting(): RevGame {
  const game = newRevGame(character(), new SeededRng(3));
  game.monsters.stock(1, new SeededRng(1));
  game.fight = revMeetMonster(game, 3);
  return game;
}

describe('what debug mode adds to a fight', () => {
  it('prints nothing at all while nothing is being fought', () => {
    const game = newRevGame(character(), new SeededRng(3));
    expect(revDebugLines(game)).toEqual([]);
  });

  it('prints the number a swing has to beat', () => {
    const game = fighting();
    expect(revDebugLines(game)).toEqual([`TO HIT:${revSwingTarget(game)}`]);
  });

  it('prints it under the four rows the game says things on', () => {
    const screen = newFrame(320, 200);
    drawRevDebug(screen, ['TO HIT:23']);
    const top = (REV_DEBUG_ROW - 1) * CELL;
    const row = screen.pixels.slice(top * screen.width, (top + CELL) * screen.width);
    expect(row.includes(TEXT)).toBe(true);
    // The rows above it are the game's own, and nothing was drawn on them.
    expect(screen.pixels.slice(0, top * screen.width).includes(TEXT)).toBe(false);
  });
});
