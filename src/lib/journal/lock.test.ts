import { describe, expect, it } from 'vitest';
import { journalIsOpen, type RunSoFar } from './lock';

/** A character being played now: alive, and nowhere near the end of the game. */
function playing(over: Partial<RunSoFar> = {}): RunSoFar {
  return { leaderboard: 'speedrun', mode: 'speedrun', dead: false, won: false, ...over };
}

describe('when a run journal may be read', () => {
  it('holds back a character on a board that is still being played', () => {
    expect(journalIsOpen(playing())).toBe(false);
    expect(journalIsOpen(playing({ leaderboard: 'faithful', mode: 'faithful' }))).toBe(false);
  });

  it('opens once the character on a board is dead', () => {
    expect(journalIsOpen(playing({ dead: true }))).toBe(true);
  });

  it('opens once the character on a board has beaten the game', () => {
    expect(journalIsOpen(playing({ won: true }))).toBe(true);
  });

  it('is open at any time for a character rolled for no board', () => {
    expect(journalIsOpen(playing({ leaderboard: null }))).toBe(true);
  });

  it('is open at any time for a run played in debug', () => {
    expect(journalIsOpen(playing({ mode: 'debug' }))).toBe(true);
  });

  it('holds back a character on a board that has not been played yet', () => {
    expect(journalIsOpen(playing({ mode: null }))).toBe(false);
  });
});
