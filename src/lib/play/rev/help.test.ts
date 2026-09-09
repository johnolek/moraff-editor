import { describe, expect, it } from 'vitest';
import { SeededRng } from '../../game/port/rng';
import { HIT_ANY_KEY, revHelpChoice, revHelpChunks, revHelpTextScreens, revNewHelpColours, revShowHelp } from './help';
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

describe('leaving the help', () => {
  it('takes the pages down, since the game is drawn back over them', async () => {
    const { desk, game } = pressing(['X']);
    await revShowHelp(game, desk);
    expect(game.said).toEqual([]);
  });
});

describe('the eighty-column page', () => {
  const menu = revHelpTextScreens(0, revNewHelpColours())[0];

  /** The line printed on a row, out of the runs that made the page. */
  function rowOf(runs: typeof menu, row: number): { text: string; colour: number } {
    const run = runs.filter((each) => each.row === row && each.column === 1)[0];
    return { text: run?.text ?? '', colour: run?.colour ?? 0 };
  }

  it('puts every line of the file on its own row, blank rows and all', () => {
    expect(rowOf(menu, 1).text).toBe('OPTIONS:');
    expect(rowOf(menu, 2).text).toBe('');
    expect(rowOf(menu, 3).text).toBe('View Stats--------Displays vital statistics of your character.');
    expect(rowOf(menu, 25).text).toBe('Press any other key to return to the game.');
  });

  it('cycles the marked lines through the seven colours and leaves the rest alone', () => {
    // 1000:B9D6's order: light green, cyan, red, magenta, yellow, white, then light blue again.
    expect([3, 4, 5, 6, 8, 10, 11].map((row) => rowOf(menu, row).colour)).toEqual([10, 11, 12, 13, 14, 15, 9]);
    // The two lines that carry on from the one above have no marker, so they keep its colour.
    expect(rowOf(menu, 7).colour).toBe(rowOf(menu, 6).colour);
    // The menu opens in what `SCREEN 0` left the colour at, since its first line has no marker.
    expect(rowOf(menu, 1).colour).toBe(7);
  });

  it('gives the menu of pages and the line under it the colours the screenshot has', () => {
    expect(rowOf(menu, 19)).toEqual({ text: 'FOR  MORE  HELP  PRESS:', colour: 9 });
    expect(rowOf(menu, 21).colour).toBe(10);
    expect(rowOf(menu, 25).colour).toBe(11);
  });

  it('picks the key of every option out in white', () => {
    const white = menu.filter((run) => run.colour === 15 && run.column === 1 && run.text.length === 1);
    // Rows 1 to 16, so the blank row and the two that carry on from the line above give spaces.
    expect(white.map((run) => run.text).join('')).toBe('O VMQI C PAE@OTW');
    expect(menu.filter((run) => run.row === 13 && run.column === 3)).toEqual([
      { row: 13, column: 3, text: '#', colour: 15 },
    ]);
    expect(menu.filter((run) => run.row === 17 && run.colour === 15 && run.text === 'Esc')).toHaveLength(1);
  });

  it('ends every page but the menu with the prompt at the middle of the bottom row', () => {
    const screens = revHelpTextScreens(1, revNewHelpColours());
    const prompt = screens[screens.length - 1].filter((run) => run.text === HIT_ANY_KEY);
    expect(prompt).toHaveLength(1);
    expect(prompt[0].row).toBe(25);
    expect(prompt[0].column).toBe(35);
    expect(revHelpTextScreens(0, revNewHelpColours())[0].some((run) => run.text === HIT_ANY_KEY)).toBe(false);
  });
});

describe('the screen the help takes over', () => {
  it('is up while a page is showing and down again when the help closes', async () => {
    const { desk, game } = pressing(['1', ...Array<string>(9).fill(' '), 'X']);
    expect(game.textScreen).toBe(null);
    const reading = revShowHelp(game, desk);
    await reading;
    expect(game.textScreen).toBe(null);
  });
});
