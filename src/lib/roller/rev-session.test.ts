import { describe, expect, it } from 'vitest';
import { REV_RACE_NAMES, REV_RACE_STATS } from '../game/rev-port/character';
import { RevRollerSession } from './rev-session';

/** Walk the roller to the end with the answers a player would give. */
function finish(session: RevRollerSession, race: number, cls: number, name: string): void {
  session.answer(0);
  session.answer(0);
  session.answer(race);
  session.answer(0);
  session.answer(cls);
  session.answer(name);
}

describe('the Moraff’s Revenge roller', () => {
  it('stops at each of the two instruction screens first', () => {
    const session = new RevRollerSession(1);
    expect(session.view().question).toBe('continue');
    expect(session.view().screen[0].text).toContain('These are the characteristics');
    session.answer(0);
    expect(session.view().question).toBe('continue');
    expect(session.view().screen[0].text).toContain('You may choose');
  });

  it('asks for the race once the instructions are done', () => {
    const session = new RevRollerSession(1);
    session.answer(0);
    session.answer(0);
    expect(session.view().question).toBe('revRace');
    expect(session.view().width).toBe(40);
    expect(session.view().screen.map((line) => line.text)).toEqual(
      expect.arrayContaining(['RACE:', ...REV_RACE_NAMES]),
    );
  });

  it('moves the race pointer round with the arrows the way the game does', () => {
    const session = new RevRollerSession(1);
    session.answer(0);
    session.answer(0);
    expect(session.view().race).toBe(1);
    session.moveRace(-1);
    expect(session.view().race).toBe(4);
    session.moveRace(1);
    expect(session.view().race).toBe(1);
    session.moveRace(1);
    session.moveRace(1);
    expect(session.view().race).toBe(3);
  });

  it('takes the race the pointer is on when Return is pressed', () => {
    const session = new RevRollerSession(1);
    session.answer(0);
    session.answer(0);
    session.moveRace(1);
    session.takeRace();
    expect(session.view().question).toBe('revKeep');
    expect(session.view().pc.race).toBe(2);
  });

  it('rolls the same character again after every answer', () => {
    const session = new RevRollerSession(1);
    session.answer(0);
    session.answer(0);
    session.answer(1);
    const rolled = session.view().pc.stats.slice();
    session.answer(0);
    expect(session.view().pc.stats).toEqual(rolled);
    session.answer(1);
    expect(session.view().pc.stats).toEqual(rolled);
  });

  it('rolls a new character when the player says no, keeping the race', () => {
    const session = new RevRollerSession(1);
    session.answer(0);
    session.answer(0);
    session.answer(2);
    const first = session.view().pc.stats.slice();
    session.answer(1);
    expect(session.view().pc.race).toBe(2);
    expect(session.view().question).toBe('revKeep');
    // Two rolls in a row coming out the same is possible but not worth allowing for here.
    expect(session.view().pc.stats).not.toEqual(first);
  });

  it('finishes with a character the game would take', () => {
    const session = new RevRollerSession(3);
    finish(session, 3, 2, 'gimli');
    const view = session.view();
    expect(view.question).toBeNull();
    expect(view.pc).toMatchObject({ name: 'GIMLI', race: 3, cls: 2, weight: 150 });
    view.pc.stats.forEach((stat, index) => expect(stat).toBeGreaterThanOrEqual(REV_RACE_STATS[2][index]));
    expect(session.slot).toBe(3);
  });

  it('starts over from the first screen', () => {
    const session = new RevRollerSession(1);
    finish(session, 4, 1, 'bilbo');
    session.restart();
    expect(session.view().question).toBe('continue');
    expect(session.view().race).toBe(1);
    expect(session.view().pc.name).toBe('');
  });
});
