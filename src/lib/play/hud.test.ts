import { describe, expect, it } from 'vitest';
import { expBar, orbFill } from './hud';

/** A curve as easy to read as the games' are not: level L takes 100 L. */
const needed = (level: number) => level * 100;

describe('orbFill', () => {
  it('is the share of the maximum the value stands at', () => {
    expect(orbFill(30, 120)).toBe(0.25);
  });

  it('never draws past the rim, whatever a potion left behind', () => {
    expect(orbFill(140, 120)).toBe(1);
  });

  it('is empty for a class with no spell points at all', () => {
    expect(orbFill(0, 0)).toBe(0);
  });

  it('is empty for a character on their last legs', () => {
    expect(orbFill(-5, 120)).toBe(0);
  });
});

describe('expBar', () => {
  it('fills from the level the character is on towards the next', () => {
    const bar = expBar({ level: 3, exp: 250, needed });
    expect(bar.toLevel).toBe(4);
    expect(bar.from).toBe(200);
    expect(bar.to).toBe(300);
    expect(bar.ahead).toBe(false);
  });

  it('stands where the experience does along that stretch', () => {
    expect(expBar({ level: 3, exp: 250, needed }).fill).toBeCloseTo(0.5);
  });

  it('starts a fresh character from nothing rather than from a level below the first', () => {
    const bar = expBar({ level: 1, exp: 0, needed });
    expect(bar.from).toBe(0);
    expect(bar.to).toBe(100);
    expect(bar.fill).toBe(0);
  });

  it('is full and still on the same level at exactly what the next level takes', () => {
    const bar = expBar({ level: 3, exp: 300, needed });
    expect(bar.toLevel).toBe(4);
    expect(bar.fill).toBe(1);
    expect(bar.ahead).toBe(false);
  });

  it('moves on to the level after once the next one has been earned', () => {
    const bar = expBar({ level: 3, exp: 350.5, needed });
    expect(bar.toLevel).toBe(5);
    expect(bar.from).toBe(300);
    expect(bar.to).toBe(400);
    expect(bar.fill).toBeCloseTo(0.505);
    expect(bar.ahead).toBe(true);
  });

  it('keeps climbing for a character who has earned several levels', () => {
    const bar = expBar({ level: 3, exp: 1050, needed });
    expect(bar.toLevel).toBe(12);
    expect(bar.ahead).toBe(true);
  });

  it('is full where a curve gives two levels running the same experience', () => {
    const bar = expBar({ level: 3, exp: 10, needed: () => 40 });
    expect(bar.fill).toBe(1);
  });

  it('reads the real curve of Dungeons of the Unforgiven', () => {
    // exp_needed for an ordinary character: 250 * 1.4 ^ (level - 1) - 80.
    const dotu = (level: number) => 250 * 1.4 ** (level - 1) - 80;
    const bar = expBar({ level: 1, exp: 170, needed: dotu });
    expect(bar.toLevel).toBe(2);
    expect(bar.fill).toBe(1);
    expect(bar.ahead).toBe(false);
  });
});
