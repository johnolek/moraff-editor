import { describe, expect, it } from 'vitest';
import { HINT, HINT_COUNT, HINT_LINES, hintLines, loadHBin } from './hints';
import { newMwGame } from './state';

describe('hintLines', () => {
  it('reads eight lines per record', () => {
    expect(hintLines(0)).toHaveLength(HINT_LINES);
  });

  it('gives the town greeting for record 27', () => {
    expect(hintLines(HINT.town)[0]).toBe('YOU ARE IN THE TOWN!');
  });

  it('gives the death lines the two branches show', () => {
    expect(hintLines(HINT.death)[0]).toBe('EVERYTHING GOES BLACK...');
    expect(hintLines(HINT.noContract)[0]).toBe("I THINK YOU'RE DEAD!");
    expect(hintLines(HINT.raised)[0]).toBe('NOW YOU ARE FALLING DOWN...');
  });

  it('gives the affliction lines monsters_move shows', () => {
    expect(hintLines(HINT.diseaseBites)[0]).toBe("OH NO! YOU'VE PERMANENTLY");
    expect(hintLines(HINT.poisonBites)[1]).toBe('  LOST A POINT OF STRENGTH');
  });

  it('starts the bird hints at 0 and the mouse hints at 8', () => {
    expect(hintLines(HINT.firstBoss)[0]).toBe('A LITTLE BIRD SAYS:');
    expect(hintLines(HINT.firstMouse)[0]).toBe('A LITTLE MOUSE SAYS:');
    expect(hintLines(HINT.firstMouse + HINT.mouseCount - 1)[0]).toBe('A LITTLE MOUSE SAYS:');
  });

  it('runs out at the end of the file', () => {
    expect(hintLines(HINT_COUNT)).toEqual(['?', '?', '', '', '', '', '', '']);
  });
});

describe('loadHBin', () => {
  it('prints the record and records that the box went up', () => {
    const game = newMwGame();
    loadHBin(game, HINT.town);
    expect(game.messages[0]).toBe('YOU ARE IN THE TOWN!');
    expect(game.events).toEqual([{ kind: 'hintShown', record: HINT.town }]);
  });
});
