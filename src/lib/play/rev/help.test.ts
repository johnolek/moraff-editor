import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { HIT_ANY_KEY, revHelpChoice, revHelpChunks, revShowHelp } from './help';
import type { RevPc } from './record';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

function reading(): RevGame {
  const pc: RevPc = {
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
    money: 0,
    bank: 0,
    spellPoints: 0,
    column: 10,
    row: 10,
    dungeonLevel: 1,
    generation: 1,
    facing: 1,
  };
  return newRevGame(pc, new SeededRng(1));
}

/** A player who presses the given keys in turn, and Escape once they run out. */
function pressing(keys: string[]): { desk: RevTownDesk; boxes: string[][]; game: RevGame } {
  const game = reading();
  const boxes: string[][] = [];
  let at = 0;
  const desk: RevTownDesk = {
    key: async () => {
      boxes.push(game.said.slice());
      return (keys[at++] ?? '').charCodeAt(0);
    },
    number: async () => null,
  };
  return { desk, boxes, game };
}

describe('the help pages', () => {
  it('opens on the menu, which lists the seven pages behind it', () => {
    const menu = revHelpChunks(0)[0];
    expect(menu[0]).toBe('OPTIONS:');
    expect(menu.join('\n')).toContain('1....Objectives');
    expect(menu.join('\n')).toContain('7....How to Fight');
  });

  it('strips the marker that says a line is highlighted', () => {
    expect(revHelpChunks(0)[0]).toContain('View Stats--------Displays vital statistics of your character.');
  });

  it('shows the menu whole and every other page twenty-five lines at a time', () => {
    expect(revHelpChunks(0)).toHaveLength(1);
    for (let page = 1; page <= 7; page++) {
      for (const chunk of revHelpChunks(page)) expect(chunk.length).toBeLessThanOrEqual(25);
    }
  });

  it('opens page 2 to 8 for the digits 1 to 7 and closes for anything else', () => {
    expect(revHelpChoice('1'.charCodeAt(0))).toBe(1);
    expect(revHelpChoice('7'.charCodeAt(0))).toBe(7);
    expect(revHelpChoice('8'.charCodeAt(0))).toBe(null);
    expect(revHelpChoice('0'.charCodeAt(0))).toBe(null);
    expect(revHelpChoice(0x1b)).toBe(null);
  });

  it('closes on a key the menu does not offer', async () => {
    const { desk, boxes, game } = pressing(['X']);
    await revShowHelp(game, desk);
    expect(boxes).toHaveLength(1);
    expect(boxes[0][0]).toBe('OPTIONS:');
  });

  it('waits for a key between the chunks of a page and once more at the end', async () => {
    const { desk, boxes, game } = pressing(['1']);
    await revShowHelp(game, desk);
    // The menu, then one wait per chunk of page 2, then the menu again to close on Escape.
    expect(boxes).toHaveLength(1 + revHelpChunks(1).length + 1);
    expect(boxes[1][0]).toBe('Objectives:');
    expect(boxes[boxes.length - 2]).toContain(HIT_ANY_KEY);
    expect(boxes[boxes.length - 1][0]).toBe('OPTIONS:');
  });

  it('comes back to the menu after a page rather than to the game', async () => {
    const { desk, boxes, game } = pressing(['3', ...Array<string>(9).fill(' '), '4']);
    await revShowHelp(game, desk);
    expect(boxes[1][0]).toBe(revHelpChunks(3)[0][0]);
    const menus = boxes.filter((box) => box[0] === 'OPTIONS:');
    expect(menus.length).toBeGreaterThanOrEqual(2);
  });
});
