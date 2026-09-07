import { describe, expect, it } from 'vitest';
import { spellBook } from './book';
import { cellForKey } from './grid';

const book = spellBook();

describe('spellBook', () => {
  it("lays the four lists out the way the game's type menu does", () => {
    expect(book.map((category) => category.label)).toEqual([
      '1) PERMANENT SPELLS',
      '2) PREPARATION SPELLS',
      '3) WIZARD BATTLE SPELLS',
      '4) PRIEST BATTLE SPELLS',
    ]);
  });

  it('keys the thirty spells of a list A to Z and then 1 to 4', () => {
    for (const category of book) {
      expect(category.cells.map((cell) => cell.key).join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234');
    }
  });

  it('gives every spell of the book an id of its own, so the grid can mark the one picked', () => {
    const ids = book.flatMap((category) => category.cells.map((cell) => cell.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prints a spell in the capitals the game prints it in', () => {
    expect(book[2].cells[0]).toMatchObject({ key: 'A', name: 'SLEEP', id: 'Wizard battle/Sleep' });
  });

  it('notes what holds for a whole list, where anything does', () => {
    expect(book.map((category) => category.notes.length)).toEqual([1, 1, 0, 0]);
  });
});

describe('cellForKey', () => {
  it('gives the spell the menu key names', () => {
    expect(cellForKey(book[2], 'D')?.name).toBe('SLOW ENEMIES');
    expect(cellForKey(book[2], '4')?.key).toBe('4');
  });

  it('gives nothing for a key the menu does not answer to', () => {
    expect(cellForKey(book[2], '5')).toBe(null);
    expect(cellForKey(book[2], 'ENTER')).toBe(null);
  });
});
