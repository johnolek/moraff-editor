import { describe, expect, it } from 'vitest';
import { RevKeptScreen, revPrintedRows } from './kept';

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

  it('wraps what would run past the last column onto the row under it', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 39, 'ABCD');
    expect(kept.runs()).toEqual([
      { row: 5, column: 39, text: 'AB' },
      { row: 6, column: 1, text: 'CD' },
    ]);
  });

  it('takes one row for a line of exactly forty characters and its newline', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 1, 'X'.repeat(40));
    kept.print('NEXT');
    expect(kept.runs()).toEqual([
      { row: 5, column: 1, text: 'X'.repeat(40) },
      { row: 6, column: 1, text: 'NEXT' },
    ]);
  });

  it('takes two rows for a line of forty-one and leaves the newline on a third', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 1, `${'X'.repeat(40)}Y`);
    kept.print('NEXT');
    expect(kept.runs()).toEqual([
      { row: 5, column: 1, text: 'X'.repeat(40) },
      { row: 6, column: 1, text: 'Y' },
      { row: 7, column: 1, text: 'NEXT' },
    ]);
  });

  it('carries on from where a print that kept the cursor left it', () => {
    const kept = new RevKeptScreen();
    kept.locate(5, 1);
    kept.printKeepingTheCursor('Enter delay and hit return:');
    expect(kept.cursor()).toEqual({ row: 5, column: 28 });
    kept.print('12 ');
    expect(kept.runs()).toEqual([{ row: 5, column: 1, text: 'Enter delay and hit return:12 ' }]);
  });

  it('says where the cursor is after a line that ended its row', () => {
    const kept = new RevKeptScreen();
    kept.printAt(5, 1, 'A LINE');
    expect(kept.cursor()).toEqual({ row: 6, column: 1 });
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

describe('a line as the rows it is printed on', () => {
  it('keeps a line of forty characters on one row', () => {
    expect(revPrintedRows('X'.repeat(40))).toEqual(['X'.repeat(40)]);
  });

  it('gives the inn its second half', () => {
    expect(revPrintedRows('You are at the Flea Bag Inn.  A room       will cost 10 jewel pieces.')).toEqual([
      'You are at the Flea Bag Inn.  A room    ',
      '   will cost 10 jewel pieces.',
    ]);
  });

  it('gives an empty line a row of its own', () => {
    expect(revPrintedRows('')).toEqual(['']);
  });
});
