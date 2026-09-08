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

  it('prints the letters with the pen and the box the game gives them', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    const letters = session.game.screen.find((line) => line.text === 'A     B     C     D     E');
    // The thin bright pass of exe 3000:c4b1: colour 15, the pen at DS:2f68, and the box the
    // call is handed rather than one psfont works out.
    expect(letters).toMatchObject({ colour: 15, pen: 5, x: 0x19, y: 0x41a, spreadTo: 0x564, strokeBottom: 0x460 });
  });

  it('hands the tab the section and the words the panels are drawn under', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    expect(session.sectionScreen).toEqual({ section: 1, lines: data.sections[0].intro, bossDead: false });
    await press(session, 0x62);
    expect(session.sectionScreen?.lines).toEqual(data.sections[0].descriptions.slice(8, 12));
    await press(session, KEY.escape);
    expect(session.sectionScreen).toBe(null);
  });

  it('stamps DEAD over the first panel once the section boss is dead', async () => {
    const alive = inTheTown(lowest);
    await press(alive, KEY.monsterManual);
    expect(drawn(alive)).not.toContain('DEAD');

    const beaten = inTheTown(lowest);
    // The module's byte at DS:c0c9, bit 1 for the first of its four sections.
    beaten.game.pc.objective[beaten.game.pc.module] |= 1;
    await press(beaten, KEY.monsterManual);
    expect(drawn(beaten)).toContain('DEAD');
    expect(beaten.sectionScreen?.bossDead).toBe(true);
  });

  it('leaves on any key that is not one of the five letters', async () => {
    const session = inTheTown(lowest);
    await press(session, KEY.monsterManual);
    await press(session, KEY.escape);
    expect(session.game.screen).toEqual([]);
  });
});
