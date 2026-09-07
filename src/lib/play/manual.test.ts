import { describe, expect, it } from 'vitest';
import data from '../game/dotu-data.json';
import type { Rng } from '../game/port/rng';
import { inTheTown, press } from './battle.test-support';
import { KEY } from './keys';

const lowest: Rng = { random: () => 0 };

const drawn = (session: ReturnType<typeof inTheTown>): string[] =>
  session.game.screen.map((line) => line.text);

describe('the S key', () => {
  it('opens on the section the character is standing in', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    expect(drawn(session)).toContain(data.sections[0].intro[0]);
    expect(drawn(session)).toContain('A     B     C     D     E');
  });

  it('reads a monster off the letter under its picture', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    // A is the section's Shadow boss, and E the first of the four ordinary monsters.
    await press(session, 0x61);
    expect(drawn(session)).toContain(data.sections[0].descriptions[0]);
    await press(session, 0x65);
    expect(drawn(session)).toContain(data.sections[0].descriptions[4]);
    await press(session, 0x62);
    expect(drawn(session)).toContain(data.sections[0].descriptions[8]);
  });

  it('leaves on any key that is not one of the five letters', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    await press(session, KEY.escape);
    expect(session.game.screen).toEqual([]);
  });
});
