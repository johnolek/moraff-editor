import { describe, expect, it } from 'vitest';
import { REV_ARMOUR_VALUE, REV_VALUE, setRevValue } from './record';
import { REV_HIT_ANY_KEY } from './screens';
import { revCharacter, revRolls } from './spells.test-support';
import { REV_DISEASED, revPrintUsing, revShowStats, revStatsSheet } from './stats';
import { newRevGame, type RevGame } from './state';
import type { RevTownDesk } from './town';

/** A character with a name, since the sheet's heading is the one place the game shows it. */
function sheetFor(name = 'FIGHTY', fields = {}): RevGame {
  const pc = revCharacter({ hp: 22, maxHp: 40, level: 5, weight: 150, money: 243, spellPoints: 12, ...fields });
  return newRevGame(pc, revRolls([]), undefined, name);
}

describe('the character sheet the V key puts up', () => {
  it('prints the six characteristics in the format F1.COM gives them', () => {
    const game = sheetFor();
    game.pc.stats = [18, 12, 9, 15, 14, 7];
    const lines = revStatsSheet(game);
    expect(lines.slice(4, 10)).toEqual([
      'Strength:     18 ',
      'Intelligence: 12 ',
      'Wisdom:        9 ',
      'Health:       15 ',
      'Agility:      14 ',
      'Laziness:      7 ',
    ]);
  });

  it('heads the sheet with the character and says which class they are', () => {
    const game = sheetFor('FIGHTY');
    expect(revStatsSheet(game).slice(0, 3)).toEqual(['Player Statistics For FIGHTY', 'Class: ', ' FIGHTER']);
    game.pc.cls = 2;
    expect(revStatsSheet(game)[2]).toBe(' WIZARD');
  });

  it('cuts a name over forty characters down to thirty-seven and an ellipsis', () => {
    const game = sheetFor('A'.repeat(41));
    expect(revStatsSheet(game)[0]).toBe(`Player Statistics For ${'A'.repeat(37)}...`);
  });

  it('puts the armour, the weapons owned and the health on their own lines', () => {
    const game = sheetFor();
    setRevValue(game.pc, REV_ARMOUR_VALUE, 2);
    setRevValue(game.pc, REV_VALUE.knife, 1);
    setRevValue(game.pc, REV_VALUE.mace, 1);
    const lines = revStatsSheet(game);
    expect(lines).toContain('You are wearing chain armor. ');
    // 1000:1B08 prints every weapon with a semicolon after it, so they share the label's line.
    expect(lines).toContain('Weapons owned:KNIFE MACE');
    expect(lines).toContain('Health points:  22 of 40 ');
  });

  it('right-justifies the six numbers to the column the format ends at', () => {
    const game = sheetFor();
    game.pc.experience = 12500;
    game.pc.bank = 5000;
    const lines = revStatsSheet(game);
    expect(lines).toContain('Spell points            12 ');
    expect(lines).toContain('Player level             5 ');
    expect(lines).toContain('Experience           12500 ');
    expect(lines).toContain('Money in bank         5000 ');
    for (const line of lines.slice(-6)) expect(line).toHaveLength(27);
  });

  it('warns a diseased character and nobody else', () => {
    const game = sheetFor();
    expect(revStatsSheet(game)).not.toContain(REV_DISEASED[0]);
    setRevValue(game.pc, REV_VALUE.disease, 1);
    expect(revStatsSheet(game).slice(-2)).toEqual(REV_DISEASED);
  });

  it('takes the screen over, waits for a key and gives it back', async () => {
    const game = sheetFor();
    const seen: { cleared: string | null; rows: number } = { cleared: null, rows: 0 };
    const desk: RevTownDesk = {
      key: async () => {
        seen.cleared = game.cleared;
        seen.rows = game.kept.runs().length;
        return ' '.charCodeAt(0);
      },
      number: async () => null,
    };
    await revShowStats(game, desk);
    // 1000:19FD to 1C4A: a cleared screen with the sheet and the prompt on it...
    expect(seen.cleared).toBe('bare');
    expect(seen.rows).toBe(revStatsSheet(game).filter((line) => line !== '').length + 1);
    expect(game.ringsHeldBack).toBe(true);
    // ...and 1000:1C69 clears it and draws the dungeon again.
    expect(game.cleared).toBeNull();
    expect(game.kept.runs()).toEqual([]);
  });
});

describe('PRINT USING with one field of #s', () => {
  it('rounds the number and pads it out to the field', () => {
    expect(revPrintUsing('Player weight############# ', 149.6)).toBe('Player weight          150 ');
  });

  it('puts a % in front of a number too long for the field', () => {
    expect(revPrintUsing('Strength:    ### ', 1234)).toBe('Strength:    %1234 ');
  });
});
