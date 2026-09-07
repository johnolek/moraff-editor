import { describe, expect, it } from 'vitest';
import { savePlayer } from '../game/port/record';
import { BorlandRng } from '../game/port/rng';
import { newGame, type PlayerCharacter } from '../game/port/state';
import { newCharacterFile } from '../roller/save-file';
import { GameSession, runMoveControl, startGame, type CharacterFile } from './engine';
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
  const session = startGame(file, new BorlandRng(3));
  void runMoveControl(session);
  return session;
}

/** Press a key and let the loop get back to waiting for the next one. */
async function press(session: GameSession, ...keys: number[]): Promise<void> {
  for (const key of keys) {
    session.press(key);
    await new Promise((resolve) => setTimeout(resolve));
  }
}

const screenText = (session: GameSession) => session.view().screen.map((line) => line.text);

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
    expect(screenText(session)).toEqual(
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
