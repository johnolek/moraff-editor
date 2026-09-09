import { describe, expect, it } from 'vitest';
import { battleSpellLines } from '../game/port/screens';
import { savePlayer } from '../game/port/record';
import { BorlandRng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { newCharacterFile } from '../roller/save-file';
import { startPlaying } from './battle.test-support';
import { GameSession, type CharacterFile } from './engine';
import { KEY } from './keys';

/** A character standing in the town, with whatever spells the test wants on them. */
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

describe('the spells in effect', () => {
  it('lists the preparation spells standing on the character', async () => {
    const session = playing({ feather: 1, superStrength: 10, tempWeaponPlus: 3 });
    await press(session, KEY.viewPrepSpells);
    expect(screenText(session)).toEqual(
      expect.arrayContaining([
        'PREP SPELLS IN EFFECT',
        'WEAPONS, PLUS 3',
        'FEATHER',
        'SUPER STRENGTH',
      ]),
    );
  });

  it('leaves the heading up on its own when none of the nine is in effect', async () => {
    const session = playing();
    await press(session, KEY.viewPrepSpells);
    expect(screenText(session)).toContain('PREP SPELLS IN EFFECT');
    expect(screenText(session)).not.toContain('FEATHER');
  });

  it('lists the battle spells with the moves left on each', async () => {
    const session = playing({ protection: 2, protectionTime: 40, speedTimer: 12 });
    await press(session, KEY.viewBattleSpells);
    // The panel is part of the screen, which paints it from the character every time the tab
    // draws; the key only says which twelve lines are showing.
    expect(battleSpellLines(session.game).map((line) => line.text)).toEqual(
      expect.arrayContaining(['CURRENT BATTLE SPELLS IN EFFECT', 'PROTECT, LEVEL 2', 'SPEED']),
    );
  });

  it('keeps the twelve lines it drew, so nothing is drawn twice over', async () => {
    const session = playing({ speedTimer: 12 });
    await press(session, KEY.viewBattleSpells);
    const drawn = session.view().screen.length;
    await press(session, KEY.viewBattleSpells);
    expect(session.view().screen.length).toBe(drawn);
    expect(session.battleSpellsShown[3]).toBe(true);
  });
});

describe('the character\'s own numbers', () => {
  it('shows the V screen and holds it until a key comes', async () => {
    const session = playing({ name: 'MERLIN', str: 14, poison: 300 });
    await press(session, KEY.viewStats);
    expect(screenText(session)).toEqual(
      expect.arrayContaining([
        'VIEW STATS FOR MERLIN',
        'STRENGTH: 14',
        '  STRENGTH DRAINED: 300',
        'HIT ANY KEY TO RETURN TO GAME...',
      ]),
    );
    await press(session, KEY.enter);
    expect(screenText(session)).not.toContain('VIEW STATS FOR MERLIN');
  });

  it('lists what the next seven levels cost', async () => {
    const session = playing({ lev: 1 });
    await press(session, KEY.expNeeded);
    expect(session.box[0]).toBe('EXPERIENCE NEEDED FOR LEVEL:');
    expect(session.box).toHaveLength(8);
    expect(session.box[1].startsWith('2) ')).toBe(true);
    // The box has a key owed to it, which is what clears it.
    await press(session, KEY.enter);
    expect(session.box).toEqual([]);
  });
});
