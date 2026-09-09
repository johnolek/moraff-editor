import { describe, expect, it } from 'vitest';
import { MW_ROLLER_PORT, type MwRollerView } from './mw-session';
import { RollerSession } from './session';

/** The text of everything showing, one string a line. */
function showing(view: MwRollerView): string[] {
  return view.screen.map((line) => (line.value === undefined ? line.text : line.text + line.value));
}

describe('the Moraff’s World roller', () => {
  it('stops on the instructions, which the game holds up until a key is hit', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    const view = session.view();
    expect(view.question).toBe('continue');
    expect(showing(view)[0]).toBe('CREATING A CHARACTER:');
    expect(view.screen).toHaveLength(12);
  });

  it('walks the questions in the order roll_char asks them', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    expect(session.view().question).toBe('continue');
    session.answer(0);
    expect(session.view().question).toBe('race');
    session.answer(5);
    expect(session.view().question).toBe('keepRerollDesign');
    session.answer(0);
    expect(session.view().question).toBe('name');
    session.answer('BOB');
    expect(session.view().question).toBe('class');
    session.answer(6);
    expect(session.view().question).toBe('continue');
    session.answer(0);
    expect(session.view().question).toBe(null);
    expect(session.view().pc.name).toBe('BOB');
    expect(session.view().pc.cls).toBe(6);
    expect(session.view().pc.race).toBe(5);
  });

  it('keeps the character it showed when the next answer comes in', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    session.answer(2);
    const rolled = { ...session.view().pc };
    session.answer(0);
    session.answer('SAME');
    session.answer(0);
    const kept = session.view().pc;
    expect([kept.str, kept.iq, kept.wis, kept.con, kept.dex, kept.luck]).toEqual([
      rolled.str,
      rolled.iq,
      rolled.wis,
      rolled.con,
      rolled.dex,
      rolled.luck,
    ]);
    expect(kept.height).toBe(rolled.height);
    expect(kept.weight).toBe(rolled.weight);
    expect(kept.ageMinutes).toBe(rolled.ageMinutes);
    expect(kept.sex).toBe(rolled.sex);
  });

  it('shows one screen at a time, the way the game clears between them', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    const race = session.view();
    expect(showing(race)).toContain('RACE SELECTION:');
    expect(showing(race)).not.toContain('CREATING A CHARACTER:');
    session.answer(0);
    const roll = session.view();
    expect(showing(roll)[0]).toBe('RACE: HUMAN');
    expect(showing(roll)).toContain('Y) KEEP THIS CHARACTER');
    expect(showing(roll)).not.toContain('RACE SELECTION:');
  });

  it('counts the design points down from twenty-four on the screen itself', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    session.answer(0);
    session.answer(2);
    expect(session.view().question).toBe('designStat');
    expect(showing(session.view())).toContain('24');
    session.answer(0);
    expect(showing(session.view())).toContain('23');
    expect(showing(session.view())).toContain('CHARACTERISTIC POINTS LEFT: ');
    for (let i = 0; i < 22; i++) session.answer(0);
    expect(showing(session.view())).toContain('1');
    session.answer(0);
    expect(session.view().question).toBe('name');
  });

  it('rolls another character when the design screen is escaped', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    session.answer(3);
    session.answer(2);
    session.answer(6);
    expect(session.view().question).toBe('keepRerollDesign');
    expect(showing(session.view())).toContain('RACE: HOBBIT');
  });

  it('records the character against the slot it was told to use', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 7);
    session.answer(0);
    session.answer(0);
    session.answer(0);
    session.answer('HERO');
    session.answer(0);
    session.answer(0);
    expect(session.view().question).toBe(null);
    expect(session.slot).toBe(7);
  });

  it('goes back to the first screen when it is restarted', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    session.answer(3);
    session.restart();
    expect(session.view().question).toBe('continue');
    expect(showing(session.view())[0]).toBe('CREATING A CHARACTER:');
  });

  it('finishes with health and spell points, and the class list still showing', () => {
    const session = new RollerSession(MW_ROLLER_PORT, 0);
    session.answer(0);
    session.answer(7);
    session.answer(0);
    session.answer('IMPY');
    session.answer(1);
    session.answer(0);
    const view = session.view();
    expect(view.question).toBe(null);
    expect(showing(view)).toContain(`SPELL POINTS: ${view.pc.maxSp}    HEALTH POINTS: ${view.pc.maxHp}`);
    expect(showing(view)).toContain('CLASS: WORSHIPPER');
    expect(view.pc.maxHp).toBe(view.pc.con + view.pc.luck);
  });
});
