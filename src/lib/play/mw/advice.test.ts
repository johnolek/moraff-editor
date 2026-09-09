import { describe, expect, it } from 'vitest';
import type { MwCharacter } from '../../game/mw-port/state';
import type { Rng } from '../../game/port/rng';
import { adviseTheWalker } from './advice';
import { startMwGame } from './engine';
import { mwCharacterFile } from './engine.test';
import { MW_MESSAGE_BOX } from './screens';

/** Numbers handed out in the order the mouse asks for them, and 0 once the list runs out. */
class ScriptedRng implements Rng {
  private at = 0;

  constructor(private readonly numbers: number[]) {}

  random(): number {
    return this.numbers[this.at++] ?? 0;
  }
}

/** The mouse speaks on the first roll, skips the lessons, and picks the piece asked for. */
function heard(piece: number, state: Partial<MwCharacter> = {}) {
  const session = startMwGame(mwCharacterFile({ lev: 5 }), new ScriptedRng([0, piece]));
  // Starting a session works the carried weight out for itself, so the state the piece of advice
  // tests for is set on the character the session is holding rather than on the record.
  Object.assign(session.game.pc, state);
  session.box = ['SOMETHING THE LAST KEY SAID'];
  adviseTheWalker(session);
  return session;
}

describe("Moraff's World's little mouse", () => {
  it('prints on the last four rows of the box, in the colour of the piece', () => {
    const session = heard(0, { hp: 10, maxHp: 200 });
    expect(session.game.screen).toEqual([
      { text: 'YOU ARE BADLY DAMAGED. YOU', x: 0, y: 0xf0, font: 0, colour: 3 },
      { text: 'SHOULD CURE YOURSELF WITH', x: 0, y: 0x122, font: 0, colour: 3 },
      { text: 'THE CURE SPELL OR GO SEARCH', x: 0, y: 0x154, font: 0, colour: 3 },
      { text: 'THE TOWN FOR A TEMPLE.', x: 0, y: 0x186, font: 0, colour: 3 },
    ]);
  });

  it('gives each piece the colour the game gives it', () => {
    expect(heard(2, { weight: 1, loadedWeight: 100 }).game.screen[0].colour).toBe(5);
    expect(heard(5, { diseaseTimer: 20 }).game.screen[0].colour).toBe(8);
    expect(heard(7, { poisonTimer: 20 }).game.screen[0].colour).toBe(7);
  });

  it('wipes the box it is printed over, the way its fill_rect does', () => {
    expect(heard(7, { poisonTimer: 20 }).box).toEqual([]);
  });

  it('says nothing at all when the piece it picked does not apply', () => {
    const session = heard(7, { poisonTimer: 0 });
    expect(session.game.screen).toEqual([]);
    expect(session.box).toEqual(['SOMETHING THE LAST KEY SAID']);
  });

  it('draws a lesson on the same rows, in the one colour the lessons come in', () => {
    const session = startMwGame(mwCharacterFile({ lev: 1 }), new ScriptedRng([0, 1]));
    adviseTheWalker(session);
    expect(session.game.screen.map((line) => [line.y, line.colour])).toEqual([
      [0xf0, 3],
      [MW_MESSAGE_BOX.y + 5 * MW_MESSAGE_BOX.step, 3],
      [0x154, 3],
      [0x186, 3],
    ]);
    expect(session.game.screen[0].text).toBe('OBJECTIVE: USE ARROW KEYS TO');
  });
});
