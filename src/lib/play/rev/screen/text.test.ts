import { describe, expect, it } from 'vitest';
import { newFrame } from '../../view3d/frame';
import { TEXT } from './colours';
import { CELL, glyphRows } from './font';
import { basicNumber, drawExperience, drawHelp, drawMessages, drawSpells, SPELL_NAMES, type RevWords } from './text';

/** What a row of the screen reads as, so a test can name the row and column a line went to. */
function readRow(screen: { pixels: Uint8Array; width: number }, row: number, columns = 40): string {
  let out = '';
  for (let column = 1; column <= columns; column++) {
    let found = ' ';
    for (let code = 32; code < 127; code++) {
      const rows = glyphRows(code);
      let matches = true;
      for (let y = 0; y < CELL && matches; y++) {
        for (let x = 0; x < CELL && matches; x++) {
          const lit = screen.pixels[((row - 1) * CELL + y) * screen.width + (column - 1) * CELL + x] === TEXT;
          matches = lit === Boolean(rows[y] & (0x80 >> x));
        }
      }
      if (matches) {
        found = String.fromCharCode(code);
        break;
      }
    }
    out += found;
  }
  return out.trimEnd();
}

function words(named: Partial<RevWords> = {}): RevWords {
  return {
    messages: named.messages ?? [],
    inTown: named.inTown ?? false,
    prompt: named.prompt ?? null,
    fight: named.fight ?? null,
    spells: named.spells ?? [],
    characterLevel: named.characterLevel ?? 1,
  };
}

describe('a number as PRINT writes it', () => {
  it('leaves a space where the minus sign would be and one after', () => {
    expect(basicNumber(22)).toBe(' 22 ');
    expect(basicNumber(-3)).toBe('-3 ');
  });
});

describe('the message lines', () => {
  it('says where the character is on row 5 in the town', () => {
    const screen = newFrame(320, 200);
    drawMessages(screen, words({ inTown: true }));
    expect(readRow(screen, 5)).toBe("YOU'RE IN TOWN");
  });

  it('puts a fight on rows 1, 3 and 4 with the numbers at column 21', () => {
    const screen = newFrame(320, 200);
    drawMessages(
      screen,
      words({
        fight: { monsterName: 'FLESH EATER', monsterLevel: 2, yourHealth: 22, itsHealth: 12, experience: 155 },
      }),
    );
    expect(readRow(screen, 1)).toBe('A LEVEL 2 FLESH EATER IS ATTACKING!');
    expect(readRow(screen, 3)).toBe('YOUR HEALTH POINTS:  22');
    expect(readRow(screen, 4)).toBe('ITS HEALTH POINTS:   12');
  });

  it('fills the four message rows from the top when there is no fight', () => {
    const screen = newFrame(320, 200);
    drawMessages(screen, words({ messages: ['YOU FELL DOWN A CHUTE!', 'SECOND'] }));
    expect(readRow(screen, 1)).toBe('YOU FELL DOWN A CHUTE!');
    expect(readRow(screen, 2)).toBe('SECOND');
  });
});

describe('the spells panel', () => {
  it('heads the list on rows 5 and 6 and lists a running spell under it', () => {
    const screen = newFrame(320, 200);
    drawSpells(screen, [false, true, false, false, false]);
    expect(readRow(screen, 5).trimStart()).toBe('SPELLS');
    expect(readRow(screen, 6).trimStart()).toBe('CAST');
    expect(readRow(screen, 8).trimStart()).toBe(SPELL_NAMES[1]);
    expect(readRow(screen, 7).trim()).toBe('');
  });
});

describe('the rest of the words', () => {
  it('puts what a kill is worth on rows 24 and 25', () => {
    const screen = newFrame(320, 200);
    drawExperience(screen, 155);
    expect(readRow(screen, 24)).toBe('EXP. VALUE:');
    expect(readRow(screen, 25)).toBe('   155');
  });

  it('offers help only to a character who has not levelled up', () => {
    const beginner = newFrame(320, 200);
    drawHelp(beginner, 1);
    expect(readRow(beginner, 18).trimStart()).toBe('H=HELP');
    const veteran = newFrame(320, 200);
    drawHelp(veteran, 2);
    expect(readRow(veteran, 18).trim()).toBe('');
  });
});
