import { describe, expect, it } from 'vitest';
import {
  CLASS_NAMES,
  designYourOwn,
  openUroll,
  RACES,
  readUrollLine,
  readUrollLines,
  rollCharacteristics,
  showRolledCharacter,
} from './character';
import { BorlandRng } from './rng';
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

describe('rollCharacteristics', () => {
  it('hands out sixty points on top of the race, whatever the seed', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (let race = 0; race < RACES.length; race++) {
        const game = newGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const pc = game.pc;
        const table = RACES[race];
        const rolled = pc.str + pc.iq + pc.wis + pc.con + pc.dex + pc.luck;
        const base = table.str + table.iq + table.wis + table.con + table.dex + table.luck;
        expect(rolled).toBe(base + 60);
        for (const stat of [pc.str, pc.iq, pc.wis, pc.con, pc.dex, pc.luck]) {
          expect(stat).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('never rolls a characteristic below its race or above its race plus sixty', () => {
    const game = newGame({ rng: new BorlandRng(7), pc: { race: 5 } });
    rollCharacteristics(game);
    expect(game.pc.str).toBeGreaterThanOrEqual(RACES[5].str);
    expect(game.pc.str).toBeLessThanOrEqual(RACES[5].str + 60);
  });

  it("keeps the age, the weight and the height inside the race table's spreads", () => {
    for (let seed = 1; seed <= 50; seed++) {
      for (let race = 0; race < RACES.length; race++) {
        const game = newGame({ rng: new BorlandRng(seed), pc: { race } });
        rollCharacteristics(game);
        const table = RACES[race];
        expect(game.pc.age).toBeGreaterThanOrEqual(table.age);
        expect(game.pc.age).toBeLessThanOrEqual(table.age + 9);
        expect(game.pc.weight).toBeGreaterThanOrEqual(table.weight - Math.trunc(table.weight / 10));
        expect(game.pc.weight).toBeLessThanOrEqual(
          table.weight + Math.trunc(table.weight / 5) - 1 - Math.trunc(table.weight / 10),
        );
        expect(game.pc.height).toBe(Math.trunc((table.height * 30) / 100));
        expect(game.pc.sex === 0 || game.pc.sex === 1).toBe(true);
      }
    }
  });

  it('stands a humanoid 84 inches tall and a giant 116', () => {
    const humanoid = newGame({ rng: new BorlandRng(1), pc: { race: 0 } });
    rollCharacteristics(humanoid);
    expect(humanoid.pc.height * 4).toBe(84);
    const giant = newGame({ rng: new BorlandRng(1), pc: { race: 5 } });
    rollCharacteristics(giant);
    expect(giant.pc.height * 4).toBe(116);
  });
});

describe('designYourOwn', () => {
  it('takes four off every characteristic and puts twenty-four back', () => {
    let asked = 0;
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => (asked++, 5) });
    rollCharacteristics(game);
    const before = { ...game.pc };
    expect(designYourOwn(game)).toBe(true);
    expect(asked).toBe(24);
    expect(game.pc.str).toBe(before.str - 4);
    expect(game.pc.luck).toBe(before.luck - 4 + 24);
    const total = game.pc.str + game.pc.iq + game.pc.wis + game.pc.con + game.pc.dex + game.pc.luck;
    const was = before.str + before.iq + before.wis + before.con + before.dex + before.luck;
    expect(total).toBe(was);
  });

  it('spreads the points over whichever characteristics are asked for', () => {
    const answers = [0, 1, 2, 3, 4, 5];
    let next = 0;
    const game = newGame({
      rng: new BorlandRng(3),
      pc: { race: 0 },
      askDesignStat: () => answers[next++ % answers.length],
    });
    rollCharacteristics(game);
    const before = { ...game.pc };
    designYourOwn(game);
    expect(game.pc.str).toBe(before.str);
    expect(game.pc.luck).toBe(before.luck);
  });

  it('gives up on Escape, having already taken the four points off', () => {
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => 6 });
    rollCharacteristics(game);
    const before = { ...game.pc };
    expect(designYourOwn(game)).toBe(false);
    expect(game.pc.str).toBe(before.str - 4);
  });

  it("prints the count down from twenty-four under the game's own prompt", () => {
    let left = 24;
    const game = newGame({ rng: new BorlandRng(3), pc: { race: 0 }, askDesignStat: () => (left--, 0) });
    rollCharacteristics(game);
    game.messages.length = 0;
    designYourOwn(game);
    expect(game.messages.slice(10, 13)).toEqual([
      'ESC-CANCEL THIS CHARACTER',
      'YOU MAY ASSIGN 24 ADDITIONAL POINTS',
      'TO THE ABOVE CHARACTERISTICS.',
    ]);
    expect(game.messages).toContain('CHARACTERISTIC POINTS LEFT: ');
    expect(game.messages).toContain('24');
    expect(game.messages).toContain('1');
  });
});
