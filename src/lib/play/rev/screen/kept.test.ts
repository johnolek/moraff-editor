import { describe, expect, it } from 'vitest';
import { RevKeptScreen } from './kept';

describe('what the game has left on the screen', () => {
  it('keeps a line where it was printed', () => {
    const kept = new RevKeptScreen();
    kept.printAt(16, 24, 'YOU KILLED IT!!');
    expect(kept.runs()).toEqual([{ row: 16, column: 24, text: 'YOU KILLED IT!!' }]);
  });

  it('leaves the cursor at the start of the next row, which is where the swing prints', () => {
    const kept = new RevKeptScreen();
    kept.blank(11, 1, 25);
    kept.blank(10, 1, 25);
    kept.print('NICE SWING!');
    expect(kept.runs().find((run) => run.text.startsWith('NICE'))).toEqual({
      row: 11,
      column: 1,
      text: 'NICE SWING!              ',
    });
  });

  it('rubs a line out with spaces, as PRINT SPACE$ does', () => {
    const kept = new RevKeptScreen();
    kept.printAt(6, 22, 'MONSTER BLOCKS WAY');
    kept.blank(6, 22, 18);
    expect(kept.runs()).toEqual([{ row: 6, column: 22, text: ' '.repeat(18) }]);
  });

  it('keeps the spaces rather than forgetting them, since a space rubs out what it covers', () => {
    const kept = new RevKeptScreen();
    kept.printAt(7, 1, 'IT MISSED               ');
    expect(kept.runs()[0].text).toHaveLength(24);
  });

  it('splits a row into one run per stretch the game has printed on', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 1, 'AB');
    kept.printAt(5, 10, 'CD');
    expect(kept.runs()).toEqual([
      { row: 5, column: 1, text: 'AB' },
      { row: 5, column: 10, text: 'CD' },
    ]);
  });

  it('drops what would run past the last column rather than wrapping', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 39, 'ABCD');
    expect(kept.runs()).toEqual([{ row: 5, column: 39, text: 'AB' }]);
  });

  it('gives the whole screen up to a CLS, the picture with it', () => {
    const kept = new RevKeptScreen();
    kept.printAt(16, 24, 'YOU KILLED IT!!');
    kept.picture = { name: 3, level: 5 };
    kept.clear();
    expect(kept.runs()).toEqual([]);
    expect(kept.picture).toBeNull();
  });
});
