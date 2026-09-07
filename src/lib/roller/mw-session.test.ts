import { describe, expect, it } from 'vitest';
import { MwRollerSession } from './mw-session';

describe('MwRollerSession', () => {
  it('stops on the race menu with the instructions and the race table showing', () => {
    const session = new MwRollerSession(0);
    const view = session.view();
    expect(view.question).toBe('race');
    expect(view.screen[0]).toBe('CREATING A CHARACTER:');
    expect(view.screen).toContain('RACE SELECTION:');
    expect(view.screen).toHaveLength(24);
  });

  it('walks the questions in the order roll_char asks them', () => {
    const session = new MwRollerSession(0);
    expect(session.view().question).toBe('race');
    session.answer(5);
    expect(session.view().question).toBe('keepRerollDesign');
    session.answer(0);
    expect(session.view().question).toBe('name');
    session.answer('BOB');
    expect(session.view().question).toBe('class');
    session.answer(6);
    expect(session.view().question).toBe(null);
    expect(session.view().pc.name).toBe('BOB');
    expect(session.view().pc.cls).toBe(6);
    expect(session.view().pc.race).toBe(5);
  });

  it('keeps the character it showed when the next answer comes in', () => {
    const session = new MwRollerSession(0);
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

  it('shows only what has been printed since the last answer', () => {
    const session = new MwRollerSession(0);
    session.answer(0);
    const roll = session.view();
    expect(roll.screen[0]).toBe('RACE: HUMAN');
    expect(roll.screen).toContain('Y) KEEP THIS CHARACTER');
    expect(roll.screen).not.toContain('RACE SELECTION:');
  });

  it('counts the design points down from twenty-four', () => {
    const session = new MwRollerSession(0);
    session.answer(0);
    session.answer(2);
    expect(session.view().question).toBe('designStat');
    expect(session.view().pointsLeft).toBe(24);
    session.answer(0);
    expect(session.view().pointsLeft).toBe(23);
    for (let i = 0; i < 22; i++) session.answer(0);
    expect(session.view().pointsLeft).toBe(1);
    session.answer(0);
    expect(session.view().question).toBe('name');
  });

  it('rolls another character when the design screen is escaped', () => {
    const session = new MwRollerSession(0);
    session.answer(3);
    session.answer(2);
    session.answer(6);
    expect(session.view().question).toBe('keepRerollDesign');
    expect(session.view().screen).toContain('RACE: HOBBIT');
  });

  it('records the character against the slot it was told to use', () => {
    const session = new MwRollerSession(7);
    session.answer(0);
    session.answer(0);
    session.answer('HERO');
    session.answer(0);
    expect(session.view().question).toBe(null);
    expect(session.slot).toBe(7);
  });

  it('goes back to the first screen when it is restarted', () => {
    const session = new MwRollerSession(0);
    session.answer(3);
    session.restart();
    expect(session.view().question).toBe('race');
    expect(session.view().screen[0]).toBe('CREATING A CHARACTER:');
  });

  it('finishes with health and spell points on the last line', () => {
    const session = new MwRollerSession(0);
    session.answer(7);
    session.answer(0);
    session.answer('IMPY');
    session.answer(1);
    const view = session.view();
    expect(view.question).toBe(null);
    expect(view.screen[view.screen.length - 1]).toBe(
      `SPELL POINTS: ${view.pc.maxSp}    HEALTH POINTS: ${view.pc.maxHp}`,
    );
    expect(view.pc.maxHp).toBe(view.pc.con + view.pc.luck);
  });
});
