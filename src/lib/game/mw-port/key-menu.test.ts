import { describe, expect, it } from 'vitest';
import { MW_KEY_MENU, mwKeyMenuLines } from './screens';

/**
 * The two passes of FUN_4000_3a72 (WORLD.EXE 4000:3a72) are only right if the key letters land in
 * the holes the words leave, so the test is to lay one over the other and read the result.
 */
function readMenu(soundOn: boolean): string[] {
  const lines = mwKeyMenuLines(soundOn);
  const rows: string[] = [];
  for (let at = 0; at < lines.length; at += 2) {
    const body = [...lines[at].text];
    for (const [index, letter] of [...lines[at + 1].text].entries()) {
      if (letter !== ' ') body[index] = letter;
    }
    rows.push(body.join('').trimEnd());
  }
  return rows;
}

describe('the key menu', () => {
  it('spells out the eleven lines of the menu', () => {
    expect(readMenu(true)).toEqual([
      'BRICKS   VIEW MONEY',
      'WEAPONS  VIEW STATS',
      'ZOOM     CAST SPELL',
      'USE ITEM EXPAND MAP',
      'ARMOR    LOSE ITEM',
      'FIGHT    POCKETS',
      'WAIT     EXP NEEDED',
      'TURN SOUND OFF',
      'SPELLS IN EFFECT 1',
      'SPELLS IN EFFECT 2',
      'QUIT-SAVE HELP (F1)',
    ]);
  });

  it('offers to turn the sound on once it is off', () => {
    expect(readMenu(false)[7]).toBe('TURN SOUND ON');
  });

  it('draws every line twice, spread over the same span', () => {
    const lines = mwKeyMenuLines(true);
    expect(lines).toHaveLength(22);
    for (const line of lines) {
      expect(line.x).toBe(MW_KEY_MENU.x);
      expect(line.spreadTo).toBe(MW_KEY_MENU.spreadTo);
      expect(line.font).toBe(0);
    }
    // The words go down first and the key letters over them.
    expect(lines[0].colour).toBe(8);
    expect(lines[1].colour).toBe(4);
    expect(lines[0].y).toBe(lines[1].y);
  });

  it('pairs each half with a half of its own length, so the letters fall in the holes', () => {
    const lines = mwKeyMenuLines(true);
    for (let at = 0; at < lines.length; at += 2) {
      expect(lines[at].text).toHaveLength(lines[at + 1].text.length);
    }
  });

  it('makes only the T of WAIT a key letter', () => {
    expect(mwKeyMenuLines(true)[13].text.trimEnd()).toBe('   T     E');
  });
});
