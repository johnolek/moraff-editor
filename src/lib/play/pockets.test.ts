import { describe, expect, it } from 'vitest';
import { spellIndex } from '../game/port/inventory';
import { savePlayer } from '../game/port/record';
import { BorlandRng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { newCharacterFile } from '../roller/save-file';
import { startPlaying } from './battle.test-support';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
import { KEY } from './keys';

/** A character standing in the town, carrying whatever the test gives them. */
function playing(overrides: Partial<PlayerCharacter> = {}): GameSession {
  const pc = { ...newGame().pc, name: 'MERLIN', hp: 90, maxHp: 90, level: 0, x: 40, y: 60, ...overrides };
  const file: CharacterFile = {
    bytes: savePlayer(pc, newCharacterFile(pc)),
    write(bytes) {
      this.bytes = bytes;
    },
    died() {},
  };
  const session = startPlaying(file, new BorlandRng(3));
  return session;
}

/**
 * Press a key and let the loop get back to waiting for the next one.
 *
 * The wait in front of the press is what a player has and a test otherwise does not: the loop
 * reaches the point it is waiting at and puts up whatever it holds the screen with there, and
 * the key then gives that up the way `GameSession.press` gives up any held frame.
 */
async function press(session: GameSession, ...keys: number[]): Promise<void> {
  for (const key of keys) {
    await new Promise((resolve) => setTimeout(resolve));
    session.press(key);
    await new Promise((resolve) => setTimeout(resolve));
  }
}

/** Everything the tab draws in the game's own font: the message box, and any screen the game has
 *  taken the whole display over with. */
const screenText = (session: GameSession): string[] =>
  [...session.view().box, ...session.view().screen].map((line) => line.text);

/** A spellbook holding one spell: SLEEP, the first of the wizard battle list. */
function spellbookWithSleep(): number[] {
  const spellbook = Array.from({ length: 180 }, () => 0);
  spellbook[spellIndex(2, 0, 0)] = 1;
  return spellbook;
}

describe('the pockets screen', () => {
  it('offers the five things the character carries', async () => {
    const session = playing();
    await press(session, KEY.pockets);
    expect(screenText(session)).toEqual([
      'WHICH DO YOU WISH TO SEE?',
      '1) SPELLBOOKS',
      '2) SCROLLS',
      '3) WANDS',
      '4) PAPERS',
      '5) MISC. MAGIC ITEMS',
      '',
      'ANY OTHER KEY TO RETURNS...',
    ]);
  });

  it('turns the two pages of a spell list, a key at a time', async () => {
    const session = playing({ spellbook: spellbookWithSleep() });
    await press(session, KEY.pockets, 0x31);
    expect(screenText(session)).toEqual(expect.arrayContaining(['PERMANENT SPELLS', 'PREPARATION SPELLS']));
    await press(session, KEY.enter);
    expect(screenText(session)).toEqual(expect.arrayContaining(['WIZARD BATTLE SPELLS', 'SLEEP']));
    await press(session, KEY.enter);
    expect(screenText(session)).toEqual([]);
  });

  it('shows the magic items with how many of each', async () => {
    const session = playing({ grenades: 2, healingPotions: 1, protRing: 3 });
    await press(session, KEY.pockets, 0x35);
    expect(screenText(session)).toEqual(
      expect.arrayContaining([
        'MISC. MAGIC ITEMS:',
        '1) NUCLEAR HAND GRENADES: 2',
        '5) POTION OF HEALING: 1',
        '13) RING OF PROTECTION, PLUS 3',
        'HIT ANY KEY...',
      ]),
    );
    await press(session, KEY.enter);
    expect(screenText(session)).toEqual([]);
  });

  it('goes on waiting past a key the menu has no line for, and closes on escape', async () => {
    const session = playing();
    await press(session, KEY.pockets, 0x39);
    expect(screenText(session)).toContain('WHICH DO YOU WISH TO SEE?');
    await press(session, KEY.escape);
    await press(session, KEY.viewPrepSpells);
    expect(screenText(session)).toContain('PREP SPELLS IN EFFECT');
  });
});
