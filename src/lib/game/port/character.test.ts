import { describe, expect, it } from 'vitest';
import { CLASS_NAMES, openUroll, RACES, readUrollLine, readUrollLines, showRolledCharacter } from './character';
import { newGame } from './state';

describe('reading UROLL.TXT', () => {
  it('hands back the first line of the file without its newline', () => {
    expect(readUrollLine(openUroll())).toBe('PLEASE SELECT ONE:');
  });

  it('walks the file one line at a time', () => {
    const file = openUroll();
    expect(readUrollLines(file, 3)).toEqual([
      'PLEASE SELECT ONE:',
      '1) NORMAL DIFFICULTY',
      'NORMAL CHARACTERS CAN VISIT MODULES I, II,',
    ]);
  });

  it('drops the bar characters the same function reads out of the tablets', () => {
    expect(readUrollLine(openUroll('A|B|C\nD\n'))).toBe('ABC');
  });

  it('drops the carriage returns of DOS line endings, as text mode does', () => {
    expect(readUrollLines(openUroll('ONE\r\nTWO\r\n'), 2)).toEqual(['ONE', 'TWO']);
  });

  it('reads the whole file roll_char reads, ending on the class descriptions', () => {
    const file = openUroll();
    // 13 lines of the difficulty screen and 3 more it throws away, 12 of the contest screen it
    // also throws away, 12 of the advice screen, 12 of the race screen and 16 of the classes.
    const lines = readUrollLines(file, 13 + 3 + 12 + 12 + 12 + 16);
    expect(lines[0]).toBe('PLEASE SELECT ONE:');
    expect(lines[40]).toBe('RACE SELECTION:');
    expect(lines[lines.length - 1]).toBe('POWERFUL LATER. NEEDS WELL-BALANCED CHARACTERISTICS.');
    // One line is left, the '-' the file ends on, and roll_char never reads it.
    expect(readUrollLine(file)).toBe('-');
  });
});

describe('the race table', () => {
  it('is the eight races the race menu offers', () => {
    expect(RACES.map((race) => race.name)).toEqual([
      'HUMANOID',
      'APE',
      'CHILDMAN',
      'RODENT',
      'HOBO',
      'GIANT',
      'MIDGET',
      'SHRIMP',
    ]);
  });

  it('is ten under the averages UROLL.TXT prints, except for two rows', () => {
    const file = openUroll();
    readUrollLines(file, 44);
    const printed = readUrollLines(file, 8).map((line) => line.slice(11).trim().split(/\s+/).map(Number));
    const rolled = RACES.map((race) => [race.str, race.iq, race.wis, race.con, race.dex, race.luck].map((n) => n + 10));
    // The exe rolls a HUMANOID 15 of everything and gives a MIDGET 25 intelligence; the file
    // says 14 and 18. Every other number in the file matches the table.
    expect(rolled[0]).toEqual([15, 15, 15, 15, 15, 15]);
    expect(printed[0]).toEqual([14, 14, 14, 14, 14, 14]);
    expect(rolled[6][1]).toBe(25);
    expect(printed[6][1]).toBe(18);
    for (const race of [1, 2, 3, 4, 5, 7]) expect(rolled[race]).toEqual(printed[race]);
  });
});

describe('the class names', () => {
  it('is the seven classes the class menu offers', () => {
    expect(CLASS_NAMES).toEqual(['FIGHTER', 'WORSHIPPER', 'MONK', 'WIZARD', 'PRIEST', 'SAGE', 'MAGE']);
  });
});

describe('showRolledCharacter', () => {
  it('prints every number beside its own label, with the height four times the field', () => {
    const game = newGame({
      pc: { str: 15, iq: 16, wis: 17, con: 18, dex: 19, luck: 20, height: 21, weight: 130, age: 15, sex: 0 },
    });
    showRolledCharacter(game, 1);
    expect(game.messages).toEqual([
      'STRENGTH: 15',
      'INTELLIGENCE: 16',
      'WISDOM: 17',
      'CONSTITUTION: 18',
      'AGILITY: 19',
      'LUCK: 20',
      'HEIGHT: 84 INCHES',
      'WEIGHT: 130 POUNDS',
      'AGE: 15 YEARS',
      'SEX: MALE',
    ]);
  });

  it('prints a female character her own line', () => {
    const game = newGame({ pc: { sex: 1 } });
    showRolledCharacter(game, 1);
    expect(game.messages[game.messages.length - 1]).toBe('SEX: FEMALE');
  });

  it('prints nothing on the pass that rubs the numbers out', () => {
    const game = newGame();
    showRolledCharacter(game, 0);
    expect(game.messages).toEqual([]);
  });
});
