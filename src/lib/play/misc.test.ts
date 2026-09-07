import { describe, expect, it } from 'vitest';
import type { Rng } from '../game/port/rng';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

const lowest: Rng = { random: () => 0 };

describe('the M key', () => {
  it('counts everything the character owns and takes the statement down again', async () => {
    const session = inTheTown(lowest, {
      money: 1200,
      bank: 40,
      crystals: 7,
      dollars: 3,
      children: 2,
      cultureStock: 9,
    });
    await press(session, KEY.money);
    expect(session.box).toContain('LIST OF ASSETS:');
    expect(session.box).toContain('RUBLES IN POCKET:1200');
    expect(session.box).toContain('RUBLES IN BANK:  40');
    expect(session.game.screen.map((line) => line.text)).toContain('YOUR FINANCIAL STATEMENT:');
    await press(session, KEY.escape);
    expect(session.box).toEqual([]);
    expect(session.game.screen).toEqual([]);
  });
});
