import { describe, expect, it } from 'vitest';
import { expToReach } from '../game/dotu-mech.js';
import { expNeededRows } from './exp-needed';

describe('the game’s EXP NEEDED screen', () => {
  it('lists the seven levels above the character’s own', () => {
    expect(expNeededRows(45, false).map((row) => row.level)).toEqual([46, 47, 48, 49, 50, 51, 52]);
  });

  it('gives each level the experience it takes to reach it', () => {
    for (const row of expNeededRows(6, false)) {
      expect(row.exp).toBeCloseTo(expToReach(row.level, false), 6);
    }
  });

  it('follows the harder curve for a character rolled under I can handle anything', () => {
    const rows = expNeededRows(19, true);
    expect(rows[0]).toEqual({ level: 20, exp: 65536000 });
    for (const row of rows) expect(row.exp).toBeCloseTo(expToReach(row.level, true), 6);
  });

  it('starts at level 1 for a character who has not levelled yet', () => {
    expect(expNeededRows(0, false)[0].level).toBe(1);
  });
});
