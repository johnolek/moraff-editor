import { describe, expect, it } from 'vitest';
import { RecordedRandom, RollerSession } from './session';

describe('RecordedRandom', () => {
  it('cuts an integer in 0..n-1 out of each fraction', () => {
    const rng = new RecordedRandom([]);
    for (let i = 0; i < 200; i++) {
      const value = rng.random(6);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(6);
    }
  });

  it('is zero for Random(0), the way the game is', () => {
    expect(new RecordedRandom([]).random(0)).toBe(0);
  });

  it('hands the same fractions back the second time round', () => {
    const drawn: number[] = [];
    const first = new RecordedRandom(drawn);
    const rolls = Array.from({ length: 50 }, (_, i) => first.random(i + 2));
    const again = new RecordedRandom(drawn);
    expect(Array.from({ length: 50 }, (_, i) => again.random(i + 2))).toEqual(rolls);
  });
});

describe('RollerSession', () => {
  it('stops on the difficulty menu with the first screen showing', () => {
    const session = new RollerSession(20);
    const view = session.view();
    expect(view.question).toBe('difficulty');
    expect(view.screen[0]).toBe('PLEASE SELECT ONE:');
    expect(view.screen).toHaveLength(13);
  });

  it('walks the questions in the order roll_char asks them', () => {
    const session = new RollerSession(20);
    expect(session.view().question).toBe('difficulty');
    session.answer(0);
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
    const session = new RollerSession(20);
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
    expect(kept.age).toBe(rolled.age);
    expect(kept.sex).toBe(rolled.sex);
  });

  it('shows only what has been printed since the last answer', () => {
    const session = new RollerSession(20);
    session.answer(0);
    const race = session.view();
    expect(race.screen[0]).toBe('CREATING A CHARACTER:');
    expect(race.screen).toContain('RACE SELECTION:');
    expect(race.screen).not.toContain('PLEASE SELECT ONE:');
  });

  it('counts the design points down from twenty-four', () => {
    const session = new RollerSession(20);
    session.answer(0);
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
    const session = new RollerSession(20);
    session.answer(0);
    session.answer(0);
    session.answer(2);
    session.answer(6);
    expect(session.view().question).toBe('keepRerollDesign');
    expect(session.view().screen).toContain('RACE: HUMANOID');
  });

  it('records the character against the number it was told to use', () => {
    const session = new RollerSession(27);
    session.answer(0);
    session.answer(0);
    session.answer(0);
    session.answer('HERO');
    session.answer(0);
    expect(session.view().question).toBe(null);
    expect(session.slot).toBe(27);
  });

  it('goes back to the first screen when it is restarted', () => {
    const session = new RollerSession(20);
    session.answer(0);
    session.answer(3);
    session.restart();
    expect(session.view().question).toBe('difficulty');
    expect(session.view().screen[0]).toBe('PLEASE SELECT ONE:');
  });
});
